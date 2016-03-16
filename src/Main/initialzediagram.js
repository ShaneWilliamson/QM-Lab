////////////////////////
// initialize_diagram //
////////////////////////
/**
 * Sets up the diagram's graph, paper, and controllers.
 * @class initialize_diagram
 */

/**
 * This initializes the local graph to empty, and stores it in the collaborative
 *   graph. Essentially, this should only be called when the document is first
 *   created. However, it can potentially be used to "reset" the diagram to
 *   empty.
 * @preconditions colGraph exists and has access to the collaborative graph.
 * @postconditions the local graph and collaborative graph are both empty
 * @memberOf initialize_diagram
 */
function initializeGraph() {
	graph = new joint.dia.Graph;
	colGraph.graph = JSON.stringify(graph);
}

/**
 * This initialzes the local "paper" object from joint.js to be able to display
 *   the diagram.
 * @preconditions The local graph must exist. The HTML container "paperView"
 *   must exist.
 * @postconditions The html container div "paperView" will hold a view of the
 *   diagram, representing the back-end model.
 * @memberOf initialize_diagram
 */
function initializePaper() {
	paper = new joint.dia.Paper({
		el: $('#paperView'),
		width: 1000,
		height: 1000,
		model: graph,
		perpendicularLinks: true,
		gridSize: 1
	});
	paperScale = 1;

	paper.$el.on('wheel', paperZoom);
	paper.$el.on('mouseup', paperOnMouseUp);

	paper.on('blank:pointerdown', paperEmptySelectionPressed);
}

/**
 * On mouse wheel over the "paper", zoom based on mouse wheel direction.
 * @preconditions The "wheel" event has triggered, and contains a non-zero
 *   number for direction of mouse wheel.
 * @postconditions Scales if paperScale > 0.1. Prevents scrolling on page when
 *   happens.
 * @invariant The zoom will override default zoom functionality
 * @param  {event} e the triggering wheel event
 * @memberOf initialize_diagram
 */
function paperZoom(e) {
	//For cross browser use, grab the direction the mouse wheel has turned
	var delta = Math.max(-1, Math.min(1, (-e.originalEvent.deltaY || e.originalEvent.wheelDelta || -e.originalEvent.detail)));
	//If the mouse wheel rolled "down", zoom out
	if (delta > 0) {
		paperScale += 0.1;

	}
	//If the mouse wheel rolled "up", zoom out
	else if (paperScale > 0.2){ //The value is 0.2 because the objects disappear if it is 0.1
		paperScale -= 0.1;
	}

	//Set the actual zoom
	paper.scale(paperScale, paperScale);

	//Prevent the mouse wheel event from scrolling
	e.originalEvent.preventDefault();
}

/**
 * Trigger when the user has clicked on an empty part of the paper. At the
 *   moment it then triggers the "panning" functionality, and updates where the
 *   mouse is.
 *
 * Later, our plans are to divide the functionality of this function into "pan
 *   when the user is also pressing a pan button" and "start multi selection"
 * @preconditions The user's mouse is over the paper in an empty part of the
 *   paper. The event actually happened. 
 * @postconditions The user's mouse position has been recorded, and the
 *   "panning" functionality is activated.
 * @param  {event} e the click event which triggered the function call
 * @memberOf initialize_diagram
 */
function paperEmptySelectionPressed(e) {
	updateMousePos(e)
	movingViewPort = true;
}

/**
 * When the user lets go of the mouse over the paper, call this function. Based
 *   on previous state logic, this function decides how to handle said mouse
 *   event
 *
 * Possible ways of handling it currently only include creating an object based
 *   on user button selections At the end of the function, it resets the UI
 *   selections and resets the global state to "EDIT" mode.
 * @preconditions The user's mouse is over the paper. The mouseup event actually
 *   triggered.
 * @postconditions The user's mouse position on the paper has been updated. The
 *   internal logic has handled any object creation. The internal state has been
 *   reset to "EDIT" mode.
 * @param  {event} e the event which triggered the function call
 * @memberOf initialize_diagram
 */
function paperOnMouseUp(e) {
	updateMousePos(e)
	selectSingleOnPoint(curMousePos);

	if (genUI.lastClickedValue == "Stock") {
		createStock(curMousePos);

	} else if (genUI.lastClickedValue == "Simple Straight") {
		createLink(curMousePos, "normal");
		
	} else if (genUI.lastClickedValue == "Simple Curved") {
		createLink(curMousePos, "smooth");
		
	} else if (genUI.lastClickedValue == "Image") {
		createImage(curMousePos);
		
	} else if (genUI.lastClickedValue == "Variable") {
		createVariable(curMousePos);
		
	} else if (genUI.lastClickedValue == "Parameter"){
		createParameter(curMousePos);
		
	} else if (genUI.lastClickedValue == "Flow"){
		createFlow(curMousePos);
	} else {
		console.log(genUI.lastClickedValue);
	}

	genUI.deselectUIElements();
	genUI.lastClickedValue = "EDIT"; // reset the cursor back to editing
	movingViewPort = false;
}

/**
 * Update the "selected" array to hold all cells that are under a single point
 *   on the paper. This point should generally be the user's mouse position.
 * @preconditions The mouse is on the paper. The graph is initialized.
 * @postconditions The selected array is filled with all of the objects on the
 *   position of the mouse.
 * @param  {position} pos a valid coordinate with a 'x' field and 'y' field.
 * @memberOf initialize_diagram
 */
function selectSingleOnPoint(pos) {
	selected = graph.findModelsFromPoint(pos);
}

/**
 * When the user hits a key, check which key was pressed. Handle state
 *   accordingly.
 *
 * Currently, the only key this function accounts for is the "delete key". Works
 *   on both Windows and Mac. However, further functionality planned includes
 *   adding a "when panning key has been pressed", among others
 * @preconditions "keyDown" event has fired with a valid, non empty keyCode.
 * @postconditions The "keyDown" key has been checked, and any behaviour
 *   associated with that key have been dispatched. Current behaviour dispatch
 *   includes: "Delete Key": Delete currently selected node.
 * @param  {event} e The user hitting the key event which triggered the function
 *   call.
 * @memberOf initialize_diagram
 */
function handleKeyInput(e) {
	if (e.keyCode == 46) {
		deleteSelectedCell(e);
	}
	else {
		console.log("A key was pushed");
	}
}

/**
 * Deletes the currently selected node, as well as ensures other collaborators
 *   have the node deleted as well.
 * @preconditions There should be some cell at index 0 of "selected" for
 *   something to happen. However, if there is not, nothing happens.
 * @postconditions Whatever cell was at index 0 of selected has been removed
 *   from the graph and view. The removed cell is also removed from the
 *   "selected" array, and everything in the selected array is shifted one down.
 * @param  {event} e Event that trigger the function call.
 * @memberOf initialize_diagram
 */
function deleteSelectedCell(e) {
	if (selected){
		if (selected[0]) {
			rootModel.getRoot().get(selected[0].id).action = 'remove';
			selected[0].remove();
			selected.shift();
			updateCollabGraph();
		}
	}
}

/**
 * When the mouse moves, handle the logic of figuring out what further methods
 *   need to be dispatched.
 *
 * Currently, this logic is limited to when the user is panning the view of the
 *   diagram. Planned changes include handling of "click-and-drag" to select
 *   multiple objects at once.
 * @preconditions A mouseMove event has fired off with the valid "x" and "y"
 *   position of the mouse.
 * @postconditions The appropriate behaviour has been dispatched based off what
 *   the global internal-state is. This behavious currently handles: panning of
 *   the diagram view.
 * @param  {event} e The mouse moving event that triggered the function call.
 * @memberOf initialize_diagram
 */
function handleMouseMove(e) {
	if (movingViewPort) {
		moveViewPort(e);
	}
}

/**
 * This function checks where the mouse currently is, and where it used to be in
 *   relation to a position on the paper. It then alters the view of the diagram
 *   by that measurement.
 * @preconditions A mouseMove event has fired off with the valid "x" and "y"
 *   position of the mouse.
 * @postconditions curMousePos holds the current mouse position in relation to
 *   the diagram's new display position. oldMousePos holds the previous mouse
 *   position in relation to the diagram's new display position
 * @param  {event} e The event that triggered the function.
 * @memberOf initialize_diagram
 */
function moveViewPort(e) {
	updateMousePos(e);
	var origin = paper.options.origin;
	paper.setOrigin((curMousePos.x - oldMousePos.x) + origin.x, (curMousePos.y - oldMousePos.y) + origin.y);
	updateMousePos(e);
}

/**
 * This function updates the current and previous mouse positions in relation to
 *   where it is in regards to the diagram. The previous mouse position will
 *   store what is the current mouse position prior to this function being
 *   called.
 * @preconditions A mouseMove event has fired off with the valid "x" and "y"
 *   position of the current mouse.
 * @postconditions curMousePos holds the current mouse position in relation to
 *   the diagram. oldMousePos holds the previous mouse position in relation to
 *   the diagram.
 * @param  {event} e The event that triggered the function call.
 * @memberOf initialize_diagram
 */
function updateMousePos(e) {
	oldMousePos = curMousePos;
	offset =  $('#paperView').offset();
	curMousePos = paper.clientToLocalPoint({ x: e.clientX, y: e.clientY });
}
