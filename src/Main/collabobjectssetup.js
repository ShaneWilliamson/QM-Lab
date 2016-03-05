		
	/*
	Before the Google Realtime API can interact with the javascript on this page, this
	function needs to be run. It registers all the object types, without which the 
	collaboration will thrown undefined errors or simply edit local fields only.
	
	This function should only be run before the Google Realtime API has finished 
	preparing itself. 

	pre: Google Realtime API has not completed its loading yet! 
	post: The Google Realtime API will be able to interact with the custom object types
	      defined for this page.
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
	
	/*
	This take in a joint.js "cell", which, from a general perspective,  is either
	a "node" or "link". It will add an event listener to it that ensures it updates
	the collaborative object which represents it for other users.

	pre: cell: must exist
	     The cell must have already been added to the collaborative graph.
	post: cell: on any change, will notify other users and cause them to update
	            accordingly
	*/
	function addCollabEventToCell(cell) {
		cell.on('change', (function() {
			return function(event) {updateCellByEventID(event);};
		}) ());
	}

	/*
	This is the local constructor of the collaborative graph. At the moment, there
	are no local fields or methods stored in the collaborative graph to ensure
	that there is no incorrect syncing. There is another constructor called for
	the collaborative part.
	*/
	function CollaborativeGraph(){

	}

	/*
	This is the collaborative constructor of the collaborative graph. It doesn't
	need to do anything at the moment other than ensure that it was made.
	*/
	function doGraphInitialize(){
		var model = gapi.drive.realtime.custom.getModel(this);
		console.log("The graph was initialized.")
	}

  /*
	This is the collaborative "loader". Whever the document loads a collaborative
	object,	including after the collaborative object is first initialzed.

	Primarily, these "load" functions are used to set up event listeners. At the
	moment, however, this does not need to happen for this object.

	pre: the collaborative graph object has been loaded and is available in local
	     memory
	post: the collaborative graph is ready for use by the application
	*/
	function doGraphOnLoaded(){
		//this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updateGraph);
		console.log("We've loaded the graph");
	}

  /*
	This ensures the back-up graph stored in the Realtime API is up to date. Generally,
	it doesn't have to be updated "on the fly", as it is only used to update the
	graph of users when the document is loaded, or when a severe error would cause
	the program to break down.

	pre: the collaborative graph exists in the Realtime API
    post: the collaborative graph is up to date according to the latest edit of the
	      user
	*/
	function updateCollabGraph() {
		//TODO: ASSERT colGraph.graph exists
		if (colGraph.graph) {
			colGraph.graph = JSON.stringify(graph);
			console.log('collab graph updated');
		}
		else {
			//This is where an error log should go
			console.log("The graph doesn't exist in the collaborative map.")
		}

	}




  /*
	This updates the local graph to represent the latest graph among all collaborators.
	It's generally only called on document load because it wipes all local changes out
	when it updates. However, it is still called in extreme cases where things have
	become broken beyond the ability of the application to compensate.

	pre: colGraph: exists and has access to the collaborative graph in the Realtime API
	     graph: also exists
	post: the local graph is up to date with the latest edits by collaborators.
	*/
	function updateGraph() {
		graph.fromJSON(JSON.parse(colGraph.graph))
		
		graph.on('remove', function(cell) { 
			rootModel.getRoot().get(cell.id).action = "remove";
		})
		console.log('Built new graph');
	}
	
	
	
	/*
	This is the local constructor of the collaborative cell class. As there is no information that needs to be stored
	locally without being passed on to the collaborator's peers, this constructor is empty.
	
	pre: 
	post: A local copy of the collaborative cell has been created
	*/
	function CollaborativeCell() {

	}

	/*
	This is the collaborative constructor of the collaborative cell. It creates a collaborative version of a local cell
	based off of the JSON data passed in.
	
	pre: JSONdata contains the JSON created from a joint.js cell 
	post: A collaborative cell has been created to keep the local copy of this cell up to date 
	      for all collaborators 
	
	*/
	function doCellInitialize (JSONdata) {
		var model = gapi.drive.realtime.custom.getModel(this);
		this.JSON = JSONdata;
		this.action = "update";
		console.log('cell created');
	}

	/*
	This function is run whenever a collaborative cell has been loaded by a document. This includes the first 
	time it is initialzed, and every time a user connects to it via Google's Realtime API
	
	It adds an event listener to the collaborative cell that, on change, updates the local cell
	
	pre: The collaborative cell must have loaded 
	post: The collaborative cell has had an event listener attached that will keep the local
	      copy of the cell up to date
	*/
	function doCellOnLoaded () {
		var that = this;
		this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, (function() {
				return function(cell) {updateCellByJSON(cell, that);};
			}) ());
		console.log('cell was loaded');
	}

	/*
	This function is called whenever a collaborative cell has been updated. It updates the local copy of the cell.
	In some cases, this includes adding the cell to the graph, or removing it from the graph.
	
	It also prevents the local client from deciding to update the collaborative cell to the state it already changed to.
	This prevents latency issues from making the collab object update to states prior to its most recent one.
	
	pre: The collaborative cell has a value in its JSON field that represents a joint.js cell.
	post: The local cell represented by the JSON field has been properly updated
	      The global state has been changed to understand that the next change it makes
		  was from a collaborator
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
	}

	
	/*
	This function occurs whenever a joint.js cell has been updated. It checks to see if that update
	was of local origin, and, if yes, updates the collaborative version of itself
	
	Also, if the change came from a collaborator, it then sets the global state to start recording changes again 
	
	pre: The local cell has had a collaborative cell already created to parallel it
	     rootModel points to the document collaborative graph from Google's Realtime API
	post: The local cell's state has been recorded in the collaborative cell if this state didn't already come from there
	      collaborativeChangeReceived has been set to false
	*/
	function updateCellByEventID(cell) {
		if (!isCollabRecordingAllowed()) {
			rootModel.getRoot().get(cell.id).action = 'update';
			rootModel.getRoot().get(cell.toJSON().id).JSON = cell.toJSON();
		}
		allowCollabRecording();
	}