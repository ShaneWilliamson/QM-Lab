///////////////////
//create_objects //
///////////////////
/**
 * Contains functions for creating objects
 * @todo finish adding contracts
 * @class create_objects
 */

/**
 * Takes a Joint.js cell and uses it to create a collaborative cell. Adds a
 *   collaborative event listener to the local cell so the two objects stay in
 *   sync.
 * @preconditions cell is a valid Joint.js cell, the collaborative model has
 *   been created, rootModel contains a valid reference to the Google Realtime
 *   API collaborative model.
 * @postconditions A collaborative cell has been created that parallels the
 *   local cell passed in "cell" has had collaborative event listeners put on it
 *   so that it keeps itself up to date with the collab cell.
 * @history cells only become collaborative
 * @param  {JSON} cell a Joint.js JSON object with valid id to be made
 *   collaborative
 * @memberOf create_objects
 */
function createCollabCell(cell) {
	var newCell = rootModel.create('CollaborativeCell', cell.toJSON());
	rootModel.getRoot().set(cell.id, newCell);
	addCollabEventToCell(cell);
	rootModel.getRoot().get(cell.id).action = 'add';
}

/**
 * Creates a stock at the given location
 * @preconditions pos contains valid 'x' and 'y' coordinates
 * @param  {position} pos coordinates with 'x' and 'y' fields
 * @return {node}     the new stock at its location
 * @memberOf create_objects
 */
function createStock(pos) {
	var newStock = new joint.shapes.QMLab.Stock({
		position: { x: pos.x, y: pos.y },
		size: { width: 100, height: 30 },
		attrs: {
			rect: { fill: 'grey' },
			text: { text: "Stock", fill: 'white' }
		}
	});
	setUpNewCell(newStock, "Stock", "#aaaaaa", "#ffffff");

	console.log("Stock added")
	return newStock;
}

/**
 * Creates a generic link at the given location. If the user clicked to have the
 *   link positioned over a node it will position its 'source' from the selected
 *   node.
 * @param  {position} pos     coordinates with 'x' and 'y' fields
 * @param  {link} connector an object is able to hold nodes it is connecting
 * @preconditions pos is a valid coordinate with 'x' and 'y' fields, connector
 *   is a valid object that contain a connection
 * @postconditions A collaborative link has been created with its source
 *   positioned at point "pos". In the event that the user created this link by
 *   selecting a node at point "pos", the node shall be the source instead. The
 *   collaborative graph has been updated.
 * @return {newLink} the link created with the position and connector
 * @memberOf create_objects
 */
function createLink(pos, connector) {
	var newLink = new localLink(pos, false, false, false, connector);
	newLink.attributes.type = "QMLab." + connector;
	//calls the function in linkJoining that will attach the new link to an element if is was created on one
	targetFollow(newLink, connector, pos );
	setUpNewCell(newLink, "", "#000000", "#000000");
	console.log('New cell added');
	return newLink;
}

/**
 * Creates a generic image at the give location. It can have both an image and
 *   text label. If not set, the image and text will go to a default image and
 *   text.
 * @preconditions pos is a valid coordinate with 'x' and 'y' fields. The
 *   pictureURL is a valid URL or left blank. The label is a valid string. The
 *   sizeX and sizeY are the correct size of the image.
 * @postconditions A collaborative image has been created with its top-left
 *   corner positioned at point "pos". The image to be displayed and text label
 *   have both been set to user defined values if nothing was passed in for
 *   them. The collaborative graph has been updated
 * @param  {position} pos      valid coordinate that contains 'x' and 'y' fields
 * @param  {string} pictureURL valid url of an image
 * @param  {string} label      valid text label for an object
 * @param  {integer} sizeX     width of the image
 * @param  {integer} sizeY     height of the image
 * @return {imageNode}         a node of the new image object
 * @memberOf create_objects
 */
function createImage(pos, pictureURL, label, sizeX, sizeY) {
	var newImage = new joint.shapes.QMLab.ImageNode({
		position: { x: pos.x, y: pos.y },
		size: { width: 200, height: 120 },
		attrs: {
			'rect': { 'fill-opacity': 0, 'stroke-opacity': 0},
			'image': { 'xlink:href': 'http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg', width: 200, height: 120 },
			'text': { 'font-size': 14, text: 'Your Image Here', 'ref-x': 100, 'ref-y': 130, ref: 'rect', fill: 'black' },
		}
	});
	if (sizeX && sizeY) {
		newImage.setSize(sizeX, sizeY);
	}
	if (pictureURL) {
		newImage.setImage(pictureURL);
	}
	else {
		newImage.setImage('http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg');
	}
	if (label) {
		newImage.setLabel(label);
		setUpNewCell(newImage, newImage.getLabel(), "#ffffff", "#000000");
	} else {
		setUpNewCell(newImage, "Your Image Here", "#ffffff", "#000000");
	}

	console.log("A image node was created.");
	return newImage;
}

/**
 * Creates a variable at the given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @preconditions A collaborative variable has been created with its top-left
 *   corner positioned at point "pos". The collaborative graph has been updated
 * @param  {position} pos valid coordinate with 'x' and 'y' fields
 * @return {Variable}     the object of the new variable created at position pos
 * @memberOf create_objects
 */
function createVariable(pos) {
	var newVariable = new joint.shapes.QMLab.Variable({
		position: {x: pos.x, y: pos.y},
		size: { width: 10000, height: 10000 },
		attrs: { 
			text: { text: 'Variable', 'ref-y': 30, ref: 'circle' }, 
			circle: { fill: 'gray', stroke: 'black', r: 5000 },
			path: { 'd': 'M -4000 -4000 L -1000 -4000 -1150 -3750 -2500 -3750 250 2750 2000 -3750 1150 -3750 1000 -4000 4000 -4000 3750 -3750 3000 -3750 250 5000 -3500 -3750 -3750 -3750 z' },
		},
	});
	newVariable.setSize(20, 20);
	newVariable.setSelected(false);
	setUpNewCell(newVariable, "Variable", "#ffa500", "#000000");
	
	console.log("A variable was created.");
	return newVariable;
}

/**
 * Creates a parameter at the given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @preconditions A collaborative parameter has been created with its top-left
 *   corner positioned at point "pos". The collaborative graph has been updated
 * @param  {position} pos valid coordinate with 'x' and 'y' fields
 * @return {Parameter}     the object of the new parameter created at position
 *   pos
 * @memberOf create_objects
 */
function createParameter(pos) {
	var newParameter = new joint.shapes.QMLab.Parameter({
		position: {x: pos.x, y: pos.y},
		size: { width: 10000, height: 10000 },
		attrs: { 
			text: { text: 'Parameter', 'ref-y': 30, ref: 'circle' }, 
			circle: { fill: 'gray', stroke: 'black', r: 5000 },
			path: { 'd': 'M -3000 -4000 C  6000 -4000 3200 -50 -800 500 L -800 -100 C 2500 250 5000 -3700 -2000 -3250 L -2000 3800 -1500 3800 -1500 4000 -3000 4000 -3000 3800 -2800 3800 -2800 -3000   z' },
		},
	});
	newParameter.setSize(20, 20);
	newParameter.setSelected(false);
	setUpNewCell(newParameter, "Parameter", "#9efffe", "#000000");
	
	console.log("A parameter was created.");
	return newParameter;
}



/**
 * Creates an intervention at the given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @preconditions A collaborative intervention has been created with its top-left
 *   corner positioned at point "pos". The collaborative graph has been updated
 * @param  {position} pos valid coordinate with 'x' and 'y' fields
 * @return {Parameter}     the object of the new parameter created at position
 *   pos
 * @memberOf create_objects
 */
function createIntervention(pos) {
	var newParameter = new joint.shapes.QMLab.Intervention({
		position: {x: pos.x, y: pos.y},
		size: { width: 10000, height: 10000 },
		attrs: { 
			text: { text: 'Intervention', 'ref-y': 30, ref: 'circle' }, 
			circle: { fill: 'red', stroke: 'black', r: 5000 },
			path: { 'd': 'M 4000 -5500 L -4000 200 -1000 200 -4000 5500 4000 -100 1500 -100 z' },
		},
	});
	newParameter.setSize(20, 20);
	newParameter.setSelected(false);
	setUpNewCell(newParameter, "Intervention", "#ff0000", "#000000");
	
	console.log("A parameter was created.");
	return newParameter;
}

/**
 * Create a state at the given location
 * @param  {coordinate} pos the point its being created at with x and y fields
 * @return {State}     the new State object created by JointJS
 * @preconditions pos has x and y fields
 * @memberOf create_objects
 */
function createState(pos) {
	var newState = new joint.shapes.QMLab.State({
		position: { x: pos.x, y: pos.y },
		size: { width: 100, height: 30 },
		attrs: {
			rect: { fill: 'yellow', rx: 10, ry: 10 },
			text: { text: "State", fill: 'black' }
		}
	});
	setUpNewCell(newState, "State", "#ffff00", "#000000");

	console.log("State added");
	return newState;
}

/**
 * Creates a terminal state at the given location
 * @param  {coordinate} pos a coordinate with 'x' and 'y' fields
 * @preconditions pos has 'x' and 'y' fields
 * @postconditions A collaborative terminal state has been created with its
 *   top-left corner positioned at point "pos"
 * @return {TerminalState}     the new terminal state at pos created by JointJS
 * @memberOf create_objects
 */
function createTerminalState(pos) {
	var newTerminalState = new joint.shapes.QMLab.TerminalState({
		position: { x: pos.x, y: pos.y },
		size: { width: 100, height: 30 },
		attrs: {
			rect: { fill: "red", rx: 10, ry: 10 },
			text: { text: "Terminal State", fill: 'black' }
		}
	});
	setUpNewCell(newTerminalState, "Terminal State", "#ff0000", "#000000");

	console.log("Terminal State added");
	return newTerminalState;
}

/*
Creates a terminal state at the given location

pre: "pos" is a valid coordinate that contains "x" and "y" fields
post: A collaborative terminal state has been created with its top-left corner positioned at point "pos"
	  The collaborative graph has been updated
*/
function createFinalState(pos) {
	var newFinalState = new joint.shapes.QMLab.FinalState({
		position: { x: pos.x, y: pos.y },
		size: { width: 10000, height: 10000 },
		attrs: {
			circle: { fill: "red", r: 5000 },
			text: { text: 'Final State', 'ref-y': 20, ref: 'circle'},
			path: { 'd': 'M -2000 0 C -2000 -2000 -2000 -2000 0 -2000 C 2000 -2000 2000 -2000 2000 0 C 2000 2000 2000 2000 0 2000 C -2000 2000 -2000 2000 -2000 0 z' },
		}
	});
	newFinalState.setSize(20, 20);
	setUpNewCell(newFinalState, "Final State", "#ff0000", "#000000");

	console.log("Final State added");
	return newFinalState;
}

/**
 * Creates a branch at the given location.
 * @param  {coordinate} pos coordinate with a 'x' and 'y' field
 * @preconditions pos has 'x' and 'y' fields
 * @postconditions A collaborative branch has been created with its top-left
 *   corner positioned at point "pos"
 * @return {Branch}     a new Branch created by JointJS
 * @memberOf create_objects
 */
function createBranch(pos) {
	var newBranch = new joint.shapes.QMLab.Branch({
		position: { x: pos.x, y: pos.y },
		size: { width: 25, height: 25 },
		attrs: {
			rect: { fill: 'white', height: 25, width: 25, transform: 'rotate(45)' },
			text: { text: "", fill: 'black' }
		}
	});
	setUpNewCell(newBranch, "", "#ffffff", "#000000");

	console.log("Branch added");
	return newBranch;
}

/**
 * Creates an agent at a given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @postconditions A collaborative agent has been created with its top-left
 *   corner positioned at point "pos". The collaborative graph has been updated.
 * @param  {coordinate} pos the coordinate with an 'x' and 'y' field
 * @return {Agent}     a new Agent shape made by JointJS
 * @memberOf create_objects
 */
function createAgent(pos) {
	var newAgent = new joint.shapes.QMLab.Agent({
		position: { x: pos.x, y: pos.y },
		size: { width: 10000, height: 10000 },
		attrs: {
			'rect': { 'fill': '#ffffff', 'stroke': '#000000', width: 10000, height: 10000 },
			'text': { 'font-size': 14, text: 'Agent', 'ref-x': 100, 'ref-y': 230, ref: 'rect', fill: 'black' },
			'image': { 'xlink:href': 'http://i.imgur.com/iujIYpD.png', width: 10000, height: 10000 },
		}
	});
	newAgent.setSize(200, 200);
	newAgent.setImage('http://i.imgur.com/iujIYpD.png');
	setUpNewCell(newAgent, "", "#ffffff", "#000000");
	console.log("Agent added");
	return newAgent;
}

/**
 * Creates a text area at the given location
 * @param  {coordinate} pos a coordinate with 'x' and 'y' fields
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @postconditions A collaborative text area has been created with its top-left
 *   corner positioned at point "pos". The collaborative graph has been updated.
 * @todo Fix the magic number situation going on here.
 * @return {Text}     a text shape created by Joint.js
 * @memberOf create_objects
 */
function createText(pos) {
	var newText = new joint.shapes.QMLab.Text({
		position: { x: pos.x, y: pos.y },
		size: { width: 10000, height: 10000 },
		attrs: {
			text: { text: '', ref: 'rect' },
			rect: { 'fill-opacity': 0, 'stroke-opacity': 0 },
			path: { fill: '#cccccc', d: 'M 0 2000 C 0 0 0 0 2000 0 L 8000 0 C 10000 0 10000 0 10000 2000 L 10000 8000 C 10000 10000 10000 10000 8000 10000 L 2000 10000 -1500 11500 0 8000 z' },
		},
	});
	newText.setLabel("HI");
	newText.setSize(100, 100);
	setUpNewCell(newText, "Hi!", "#aaaaaa", "#000000");
	console.log("Text added");
	return newText;
}

/**
 * Creates a flow at the given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @preconditions A collaborative flow has been created with its top-left corner
 *   positioned at point "pos". The collaborative graph has been updated
 * @param  {position} pos valid coordinate with 'x' and 'y' fields
 * @return {localFlow}     the object of the new flow created at position pos
 * @memberOf create_objects
 */
function createFlow(pos) {
	var newFlow = new joint.shapes.QMLab.Flow();
	var localPos = $.extend(true, {}, pos);
	newFlow.initialzeSourceAndTarget(localPos, false, false);
	newFlow.set('router', { name: 'orthogonal' });	
	newFlow.attr({
        '.connection': { 'stroke-width': 4 },
		'.connection2': { 'stroke-width': 3, stroke: 'white' },
		'.marker-target': { stroke: '#000000', fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z' },
    });
	//calls the function in linkJoining that will attach the new link to an element if is was created on one
	targetFollow(newFlow, "flow", pos);
	setUpNewCell(newFlow, "", "#000000", "#000000");
	console.log("A flow was created.");
	return newFlow;
}

/**
 * Creates a transition at the given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @preconditions A collaborative transition has been created with its top-left corner
 *   positioned at point "pos". The collaborative graph has been updated
 * @param  {position} pos valid coordinate with 'x' and 'y' fields
 * @return {localFlow}     the object of the new transition created at position pos
 * @memberOf create_objects
 */
function createTransition(pos) {
	var newTransition = new joint.shapes.QMLab.Transition();
	var localPos = $.extend(true, {}, pos);
	newTransition.initialzeSourceAndTarget(localPos, false, false);
	newTransition.set('connector', { name: 'normal' });	
	newTransition.attr({
		'.connection2': { 'stroke-width': 0 },
		'.marker-target': { stroke: '#000000', fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z' },
    });
	//calls the function in linkJoining that will attach the new link to an element if is was created on one
	targetFollow(newTransition, "transition", pos);
	setUpNewCell(newTransition, "", "#000000", "#000000");
	console.log("A transition was created.");
	return newTransition;
}

/**
 * Creates a connection at the given location
 * @preconditions "pos" is a valid coordinate that contains "x" and "y" fields
 * @preconditions A collaborative connection has been created with its top-left corner
 *   positioned at point "pos". The collaborative graph has been updated
 * @param  {position} pos valid coordinate with 'x' and 'y' fields
 * @return {localFlow}     the object of the new connection created at position pos
 * @memberOf create_objects
 */
function createConnection(pos) {
	var newConnection = new joint.shapes.QMLab.Connection();
	var localPos = $.extend(true, {}, pos);
	newConnection.initialzeSourceAndTarget(localPos, false, false);
	newConnection.set('connector', { name: 'smooth' });	
	newConnection.attr({
		'.connection2': { 'stroke-width': 0 },
		'.marker-target': { stroke: '#000000', fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z' },
    });
	//calls the function in linkJoining that will attach the new link to an element if is was created on one
	targetFollow(newConnection, "connection", pos);
	setUpNewCell(newConnection, "", "#000000", "#000000");
	console.log("A connection was created.");
	return newConnection;
}

/**
 * Adds initialzed cell to the graph, then creates a collab cell to parallel it.
 *   Updates the collab graph at the same time. This function should be called
 *   no more than once per cell. And only by the collaborator who originally
 *   made the cell.
 * @preconditions "cell" has never been put in the collab graph before. "cell"
 *   is a valid cell.
 * @postconditions "cell" is registered for collaborative interactions and added
 *   to the local graph. The collaborative graph has been updated to the current
 *   state.
 * @invariant Cells are only added onto the graph if they are not on it
 * @param {position} cell a valid coordinate with an 'x' and 'y' field
 * @memberOf create_objects
 */
function setUpNewCell(cell, text, colour, textColour){
	cell.setLabel(text);
	cell.setTextSize(12);
	cell.setColour(colour);
	cell.setTextColour(textColour);

	graph.addCell(cell);
	createCollabCell(cell);
	updateCollabGraph();
}
