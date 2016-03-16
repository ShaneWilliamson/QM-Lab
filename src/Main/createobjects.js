///////////////////
//create_objects //
///////////////////
/**
 * Contains functions for creating objects
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
	var newStock = new localNode(pos, "Stock");
	setUpNewCell(newStock);
	
	console.log("Stock added")
	return newStock;
}

/**
 * Creates a generic link at the given location. If the user clicked to have the link positioned over a node it will position its 'source' from the selected node.
 * @param  {position} pos     coordinates with 'x' and 'y' fields
 * @param  {link} connector an object is able to hold nodes it is connecting
 * @preconditions pos is a valid coordinate with 'x' and 'y' fields, connector is a valid object that contain a connection
 * @postconditions A collaborative link has been created with its source positioned at point "pos". In the event that the user created this link by selecting a node at point "pos", the node shall be the source instead. The collaborative graph has been updated.
 * @return {newLink} the link created with the position and connector
 * @memberOf create_objects
 */
function createLink(pos, connector) {
	var newLink = new localLink(pos, false, false, false, connector);
	setUpNewCell(newLink);

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
	});
	if (sizeX && sizeY) {
		newImage.setSize(sizeX, sizeY);
	}
	if (pictureURL) {
		
	}
	if (label) {
		
	}
	setUpNewCell(newImage);

	console.log('New cell added');
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
		position: {x: pos.x, y: pos.y}
	});
	setUpNewCell(newVariable);
	
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
		position: {x: pos.x, y: pos.y}
	});
	setUpNewCell(newParameter);
	
	console.log("A parameter was created.");
	return newParameter;
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
	var newFlow = new localFlow(pos, false, false, false, false);
	setUpNewCell(newFlow);
	
	console.log("A flow was created.");
	return newFlow;
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
function setUpNewCell(cell){
	graph.addCell(cell);
	createCollabCell(cell);
	updateCollabGraph();
}
