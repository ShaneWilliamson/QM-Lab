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

/*
Initializes the graph used for printing to whatever is in the current editable graph.
The print graph is not directly linked to the collaborative graph and is only updated at the
time of printing so that the graph can not be changed as you are printing it.
pre: graph exists.
post: printGraph contains the contents of graph.
*/
function initializePrintGraph(){
	printGraph = new joint.dia.Graph;
	console.log("Print graph created.");
	printGraph.fromJSON(JSON.parse(JSON.stringify(graph)));
}

/*
Updates the print graph with the contents of graph.
pre: printGraph and graph exist.
post: printGraph has the same contents of graph.
*/
function updatePrintGraph(){
	printGraph.fromJSON(JSON.parse(JSON.stringify(graph)));
}
	
function removeAllSelectionBoxes() {
	var svg = $.find("svg")[0];
	
	// remove all of the current selection boxes from the screen
	var selectionBoxes = $(".selectionBox");
	for (var i = 0; i < selectionBoxes.length; i++) {
		selectionBox = selectionBoxes[i];
		svg.removeChild(selectionBox);
	}
}

function drawSelectionBox(startX, startY, endX, endY) {
	// delete all previous selection boxes
	$(".selectionBox").remove();

	// get the main canvas
	var svg = $.find("svg")[0];
	
	var box = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
	box.setAttribute("class", "selectionBox");

	// smart rect deals with negative widths/heights automagically
	var rect = smartRect(startX, startY, endX, endY);

	box.setAttribute("x", rect.x);
	box.setAttribute("y", rect.y);
	box.setAttribute("width", rect.width);
	box.setAttribute("height", rect.height);

	box.style.fill = "#55cecc";
	box.setAttribute("fill-opacity", "0.4");
	svg.appendChild(box);
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

	paper.on('blank:pointerdown', paperEmptySelectionPressed);
	paper.$el.on('wheel', paperZoom);
	paper.$el.on('mouseup', paperOnMouseUp);
	addEvent(window, 'mouseup', stopDraggingAction);
	addEvent(window, 'resize', resizePaper);
	resizePaper();
	
	// First, unembed the cell that has just been grabbed by the user.
	paper.on('cell:pointerdown', bringParentlessCellToFront);
	paper.on('cell:pointerdown', deParentCell);
	
	paper.on('cell:pointerup', parentCell);	
	paper.on('cell:pointerclick', selectClickedCell);
	paper.on('blank:pointerclick', deselectCell);
	
	graph.on('change', function(cell) { 
		if (isCollabRecordingAllowed()) {
			selected[0] = cell;
			updateProperties();
		}
		
	});

	// initialize the variables used to hold the starting drag location
	boxSelectionX = null;
	boxSelectionY = null;
}

/**
 * This initialzes the local "paper" object that is used for printing purposes from joint.js to be able to display
 *   the diagram.
 * @preconditions The printPraph must exist. The HTML container "printView"
 *   must exist.
 * @postconditions The html container div "printView" will hold a hidden view of the
 *   diagram, representing the back-end model.
 * @memberOf initialize_diagram
 */
function initializePrintPaper() {
	//Paper is initialized with 0 height and width so it does not take up space
	//until it is needed for printing
	printPaper = new joint.dia.Paper({
		el: $('#printView'),
		width: 1,
		height: 1,
		model: graph,
		perpendicularLinks: true,
		gridSize: 1
	});
	printPaper.scale(1,1);	
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
	
	var oldPaperScale = paperScale;
	
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
	
	//Reposition the origin to keep the upper left corner where it is
	var xOffset = paper.options.origin.x;
	var yOffset = paper.options.origin.y;
	paper.setOrigin(xOffset * (paperScale / oldPaperScale), yOffset * (paperScale / oldPaperScale));
	

	//Prevent the mouse wheel event from scrolling
	e.originalEvent.preventDefault();
}	
		

/*
pre: the paper must exist
post: the user will no longer be able to interact with the paper
*/
function removePaperInteraction() {
	selected = {};
	paper.$el.addClass("nonInteractive");
}

/*
This restores the user's ability to interact with the paper.

pre: the paper must exist
post: the user will once more be able to interact with the paper
*/
function restorePaperInteraction() {
	paper.$el.removeClass("nonInteractive");
}

function resizePaper(e) {
	var paperDiv = document.getElementById('paperView');
	var heightOfPaper = window.innerHeight - 250;
	if (heightOfPaper < 550) {
		heightOfPaper = 550;
	}
	paper.setDimensions(paperDiv.clientWidth - 20, heightOfPaper);
}

/* 
Resizes the printing paper so that it fits a sheet of paper and scales the content
so that it all fits inside the paper.
pre: The printPaper must exist.
post: The printPaper will be the size of a sheet of paper.
*/
function resizePrintPaper(e){
	//The values 1000 and 1250 make the paper fit the print page nicely
	var width = 1000;
	var height = 1250;
	printPaper.setDimensions(width, height);
	printPaper.scaleContentToFit();
}

/*
Shrinks the paper so that it no longer takes up space.
This is done after printing is complete.
This is required because the paper has a visibility of hidden,
not a display of none. The paper can not have a display of none because
there is an issue where the size of objects is changes when the paper goes from
no display to block display.
pre: The printPaper must exist.
post: the printPaper will be the smallest possible size.
*/
function shrinkPrintPaper(e){
	//Values are 1 and 1 because using 0 and 0 does not work
	var width = 1;
	var height = 1;
	printPaper.setDimensions(width, height);
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
	console.log("The mouse was clicked in an empty paper location");
	updateMousePos(e)
	
	// if the alt key is down, then initiate panning
	if (e.altKey) {
		movingViewPort = true;
		console.log("Panning of the paper has been initiated");
	
	// otherwise start rectangle selection
	} else {
		console.log("Box selection has been initiated");
		boxSelectionX = curMousePos.x;
		boxSelectionY = curMousePos.y;
	}
	
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

	// TODO refactor into a switch???
	if (genUI.lastClickedValue == "Stock") {
		createStock(curMousePos);

	} else if (genUI.lastClickedValue == "State") {
		createState(curMousePos);
		
	} else if (genUI.lastClickedValue == "Terminal State") {
		createTerminalState(curMousePos);
		
	} else if (genUI.lastClickedValue == "Branch") {
		createBranch(curMousePos);
		
	} else if (genUI.lastClickedValue == "Agent") {
		createAgent(curMousePos);
		
	} else if (genUI.lastClickedValue == "Text Area") {
		createText(curMousePos);
		
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
	deselectAllCells();
}


function selectClickedCell(cellView, evt) {
	bringChildrenOfParentToFront(cellView.model);
	selected[0] = cellView.model;
	updateProperties();

	var cell = selected[0];
	var view = cell.findView(paper);
	view.highlight();
}


function deselectCell() {
	if (selected.length > 0) {
		selected[0].setSelected(false);	
	}
	
	selected = {};
	updateProperties();
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
		}
	}
}


function stopDraggingAction() {
	console.log("A drag has stopped");
	// if we were panning, stop the panning
	if (movingViewPort) {
		movingViewPort = false;
		("Panning has stopped");

	// otherwise we need to end a box selection
	} else if (boxSelectionX != null) {
		//deselect all of the previously selected cells
		deselectAllCells();

		var curX = curMousePos.x;
		var curY  = curMousePos.y

		var rect = smartRect(boxSelectionX, boxSelectionY, curX, curY);

		var enclosed = paper.findViewsInArea(rect);
		for (var i = 0; i < enclosed.length; i++) {
			enclosed[i].highlight();
		}

		// clear the property box
		$$("propertiesFormId").reconstruct();

		// remove all drawn selection boxes
		$(".selectionBox").remove();

		// reset the box selection start values
		boxSelectionX = null;
		boxSelectionY = null;
		console.log("Box selection has stopped");
	}
}

function deselectAllCells() {
	var cells = graph.getCells();
	for (var i = 0; i < cells.length; i++) {
		// currently cells refers to the data object of each cell
		// we need to find the view associated with the data
		var cellView = cells[i].findView(paper);
		cellView.unhighlight();
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
	updateMousePos(e);

	if (movingViewPort) {
		moveViewPort(e);

	// if we are currently dragging a selection box, we need to update it
	} else if (boxSelectionX != null) {
		console.log("A box select is currently being dragged");
		drawSelectionBox(boxSelectionX, boxSelectionY, curMousePos.x, curMousePos.y);
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
	paper.setOrigin(((curMousePos.x - oldMousePos.x) * paperScale) + origin.x, ((curMousePos.y - oldMousePos.y) * paperScale) + origin.y);
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
