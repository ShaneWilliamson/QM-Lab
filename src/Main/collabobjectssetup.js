/////////////////////////
// collab_object_setup //
/////////////////////////
/**
 * Setup functions for a collaboritive object used with Google API and Google
 *   Drive.
 * @class collab_object_setup
 */

/**
 * Registers all the custom object types.
 *
 * Without this, custom collaborative objects will throw undefined errors or
 *   edit local fields only.
 * @preconditions Google Realtime API has not interacted with JavaScript on page
 * @preconditions Has not been called yet, the Google Realtime API can interact
 *   with the custom collaborative objects
 * @invariant All or none of the custom objects are registered
 * @memberOf collab_object_setup
 */
function registerCollaborativeObjectTypes() {
	//Register the CollaborativeGraph object
	gapi.drive.realtime.custom.registerType(CollaborativeGraph, 'CollaborativeGraph');
	CollaborativeGraph.prototype.graph=gapi.drive.realtime.custom.collaborativeField('graph');
	gapi.drive.realtime.custom.setInitializer(CollaborativeGraph, doGraphInitialize);
	gapi.drive.realtime.custom.setOnLoaded(CollaborativeGraph, doGraphOnLoaded);

	//Register the CollaborativeCell object
	gapi.drive.realtime.custom.registerType(CollaborativeCell, 'CollaborativeCell');
	CollaborativeCell.prototype.JSON=gapi.drive.realtime.custom.collaborativeField('JSON');
	CollaborativeCell.prototype.action=gapi.drive.realtime.custom.collaborativeField('action');
	gapi.drive.realtime.custom.setInitializer(CollaborativeCell, doCellInitialize);
	gapi.drive.realtime.custom.setOnLoaded(CollaborativeCell, doCellOnLoaded);
}

/**
 * Takes a local cell and adds an event listener. The event listener will update
 *   the collaborative objects that represent this local cell when the local
 *   cell is changed.
 * @param {node|link} cell A local cell
 * @preconditions Cell must exist, cell has be on the collaborative graph, cell
 *   cannot already be collaborative
 * @postconditions On cell change, will update the collaborative object (ie.
 *   updating other users)
 * @history The collaborative cell is up to date with the local cell, or an
 *   update is being sent to it
 * @memberOf collab_object_setup
 */
function addCollabEventToCell(cell) {
	cell.on('change', (function() {
		return function(event) {updateCellByEventID(event);};
	}) ());
}

/**
 * Local constructor of the collaborative graph.
 * @memberOf collab_object_setup
 * @deprecated Currently, there are no local fields or methods for the
 *   collaborative graph which ensure correct syncing.
 */
function CollaborativeGraph(){

}

/**
 * Initializes the collaborative constructor.
 *
 * @preconditions The Google Realtime API model has been created
 * @postconditions The graph is initialized into the variable model
 * @memberOf collab_object_setup
 */
function doGraphInitialize(){
	var model = gapi.drive.realtime.custom.getModel(this);
	console.log("The graph was initialized.");
}

/**
 * Loads the collaborative object event listeners.
 *
 * Called whenever the document loads a collaborative object, as well as when the first collaborative object is initialized.
 * @deprecated Currently does not need to happen for objects
 * @preconditions the collaborative graph object has been loaded and is available
 * @postconditions the collaborative graph is ready to be used
 * @memberOf collab_object_setup
 */
function doGraphOnLoaded(){
	//this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updateGraph);
	console.log("We've loaded the graph");
}

/**
 * Ensures the back-up graph stored with the Realtime API is up to date.
 *
 * Generally, it doesn't have to be updated "on the fly", as it is only used to
 *   update the graph of users when the document is loaded, or when a severe
 *   error would cause the program to break down.
 * @preconditions the collaboratibe graph exists in the Realtime API
 * @postconditions the collaborative graph is up to date
 * @history May or may not have been called on the last local update.
 * @todo Add asserts to ensure colGraph.graph exists
 * @memberOf collab_object_setup
 */
function updateCollabGraph() {
	if (colGraph.graph) {
		colGraph.graph = JSON.stringify(graph);
		console.log('collab graph updated');
	}
	else {
		//This is where an error log should go
		console.log("The graph doesn't exist in the collaborative map.");
	}

}

/**
 * Updates the local graph to the match the most up to date collaborative graph.
 *   Called on document loading or in cases where the graph is broken and cannot
 *   function.
 * @preconditions The collaborative graph exists in the Google Realtime API, the
 *   local graph exists and has a listener.
 * @postconditions The local graph is updated to the most recent graph.
 * @invariant The local graph only represents the most recent update.
 * @memberOf collab_object_setup
 */
function updateGraph() {
	graph.fromJSON(JSON.parse(colGraph.graph));

	graph.on('remove', function(cell) {
		rootModel.getRoot().get(cell.id).action = "remove";
	})

	addCollabEventToAllCells();
	console.log('Built new graph');
}

/**
 * Local constructor of the collaborative cell.
 * @postconditions A local copy of the collaborative cell has been created.
 * @memberOf collab_object_setup
 */
function CollaborativeCell() {
	// Empty be there is no information that needs to be stored locally
	// without being passed on to the collaborator's peers.
}

/**
 * Constructor for the collaborative cell. Creates a collaborative version of
 *   the local cell based off of JSONdata.
 * @param  {JSON} JSONdata JSON created from a Joint.js cell
 * @preconditions JSONdata exists with JSON from Joint.js
 * @postconditions A collaborative cell has been created which updates based on
 *   the local cell.
 *   @memberOf collab_object_setup
 */
function doCellInitialize (JSONdata) {
	var model = gapi.drive.realtime.custom.getModel(this);
	this.JSON = JSONdata;
	this.action = "update";
	console.log('cell created');
}

/**
 * Called whenever a collaborative cell is loaded by a document (including on
 *   intialized and every time a new user connects).
 *
 * Adds an event listener to the collaborative cell which updates the local
 *   cell.
 * @preconditions The collaborative cell exists and is loaded, the local cell
 *   has been created
 * @postconditions The collaborative cell has an event listener listeneing for
 *   changes
 * @history The local cell will either be up to date with the collaborative cell
 *   or being updated
 *   @memberOf collab_object_setup
 */
function doCellOnLoaded () {
	var that = this;
	this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, (function() {
			return function(cell) {updateCellByJSON(cell, that);};
		}) ());
	console.log('cell was loaded');
}

/**
 * Called whenever a collaborative cell has been updated. It updates the local
 *   copy of the cell (including adding or removing the cell from the graph).
 *
 * Prevents latency issues with making collab objects update to old states.
 * @preconditions The collaborative cell exists and has a JSON field with a
 *   Joint.js cell.
 * @postconditions The local cell JSON field is updated, the global state has
 *   been changed to understand that the next change it makes is from a
 *   collaborator.
 * @todo Either use even or remove it
 * @param  {event} event undefined
 * @param  {action} that  the action (update, remove, or add)
 * @memberOf collab_object_setup
 */
function updateCellByJSON(event, that) {

	//This global state prevents "undo" updates
	stopCollabRecording();

	//Handles the appropriate action to ensure the cell is up to date
	if(that.action === "update") {
		var localCell = graph.getCell(that.JSON.id);
		if (localCell) {
			localCell.set(that.JSON);
		}
	}
	else if (that.action === "remove") {
		if (graph.getCell(that.JSON.id)) {
			graph.getCell(that.JSON.id).remove();
		}
	}
	else if (that.action === "add") {
		graph.addCell(that.JSON);
		addCollabEventToCell(graph.getCell(that.JSON.id));
	}
	allowCollabRecording();
}

/**
 * Called whenever a Joint.js cell is updated. If it was a local change, it will
 *   update the collaborative version. Otherwise, if the change was from a
 *   collaborator, it will set the global state to record changes.
 * @preconditions The local cell has had a collaborative cell already created to
 *   parallel it rootModel points to the document collaborative graph from
 *   Google's Realtime API
 * @postconditions The local cell's state has been recorded in the collaborative
 *   cell if this state didn't already come from there,
 *   collaborativeChangeReceived has been set to false
 * @param  {cell} cell the cell updated
 * @memberOf collab_object_setup
 */
function updateCellByEventID(cell) {
	if (isCollabRecordingAllowed()) {
		rootModel.getRoot().get(cell.id).action = 'update';
		rootModel.getRoot().get(cell.toJSON().id).JSON = cell.toJSON();
	}
}
