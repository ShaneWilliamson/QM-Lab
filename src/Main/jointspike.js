	var graph;
	var paper;
	var paperScale;
	var colGraph;
	var rootModel;
	var realDoc;
	var loading;
	var clientId = '107414709467-qu9f2182pb7i3r7607cugihbiuua0e5v.apps.googleusercontent.com';
	var activeID;
	var collaborativeChangeReceived;

	var selected;

	var movingViewPort;

	var oldMousePos;
	var curMousePos;

	



	window.onload=onstartRun;

	/*
	Attach event listeners to all buttons, start Google's Realtime API.
	pre: The window has loaded the proper html file
	post: The Google Realtime has ensured the user is logged into their
	      Google account

	*/
	function onstartRun(){
		selected = {}
		authorize();
		freeze = setInterval(checkAndFreeze, 1000);

		movingViewPort = false;
	}

	/*
	This function animates the green bar across the loading bar in a loop.
	pre: The loading bar must be contained in an html element with id="bar"
	post: An interval will be created that animates the green bar of the loading screen
	      looping along the loading bar.

	*/
	function moveProgressBar(){
		var elem = document.getElementById("bar");
		var margin = 0;
		loading = setInterval(frame, 10);
		function frame() {
			if(margin == 100){
				margin = 0;
				elem.style.marginLeft = margin + '%';
			} else {
				margin++;
				elem.style.marginLeft = margin + '%';
			}
		}
	}
	
	/*
	This function shows the animated loading bar and starts it animating. 
	
	pre: An HTML element with id="state" must exist
	     An HTML element with id="bar" must exist
		 An HTML element with id="progress" must exist
		 An HTML element with id="auth_button" must exist
	post: The loading bar will be made visible, it's animation started, 

	*/
	function displayLoadingScreen() {
		document.getElementById("state").style.display = "block";
		document.getElementById("bar").style.display = "block";
		document.getElementById("progress").style.display = "block";
		moveProgressBar();
	}

	/*
	This function hides the animated loading bar and stops it from further animating. 
	
	In addition, since it is assumed that the loading bar being stopped means that the document has finished 
	loading, the Authenication Button for Google's Realtime API is hidden.
	
	pre: An HTML element with id="state" must exist
	     An HTML element with id="bar" must exist
		 An HTML element with id="progress" must exist
		 An HTML element with id="auth_button" must exist
	post: The loading bar will be hidden, it's animation stopped, 
	      and the authenication button will be hidden.

	*/
	function clearLoadingScreen() {
		document.getElementById("state").style.display = "none";
		document.getElementById("bar").style.display = "none";
		document.getElementById("progress").style.display = "none";
		document.getElementById("auth_button").style.display = "none";
		clearInterval(loading);
	}

	/*
	This function uses an interval to check and see if the user has lost their internet connection.
	If this is the case, this function hides the diagram to prevent the user from making any more edits,
	then displays an alert telling them they've been disconnected. 
	
	It then clears the interval it was using, and sets up a new one to check if the user has reconnected.
	
	pre: The html page should be loaded. 
	     The user should not already be known to be offline.
	      
	post: The user's online status has been checked. 
	      If they are offline, the interval checking their offline status stops, the paper is hidden,
		  and a new interval is set up to check whether the user has re-established the connection

	*/
	function checkAndFreeze(){
		if(!navigator.onLine){
			document.getElementById("paperView").style.display = "none";
			alert("You have gone offline and your session has been frozen. Please Reconnect to continue editing.");
			restore = setInterval(checkAndRestore, 1000);
			clearInterval(freeze);
		}

	}
	
	/*
	This function uses an interval to check and see if the user has regained their internet connection.
	If this is the case, this function updates the graph, shows the diagram and allows them to continue editting,
	then displays an alert telling them they've been reconnected. 
	
	It then clears the interval it was using, and sets up a new one to check if the user has disconnected again.
	
	This function generally should never be called if the user isn't detected to have lost internet connectivity.
	
	pre: The html page should be loaded. 
	     The user should have been known to be offline.
	      
	post: The user's online status has been checked. 
	      If they are online, the interval checking their offline status stops, the paper is shown,
		  the graph is updated, and a new interval is set up to check whether the user has re-established the connection

	*/
	function checkAndRestore(){
		if(navigator.onLine){
			updateGraph();
			document.getElementById("paperView").style.display = "block";
			alert("You have	re-connected. Editing is re-enabled.");
			freeze = setInterval(checkAndFreeze, 1000);
			clearInterval(restore);
		}
	}

	
	/*
	Google Realtime API check to ensure the application has been properly set up.
	Alerts the user if something has gone horribly wrong and no functionality 
	related to real-time collaboration will function.
	*/
	if (!/^([0-9])$/.test(clientId[0])) {
		alert('Invalid Client ID - did you forget to insert your application Client ID?');
	}
	
	/*
	Creates a new instance of Google's Realtime API utility with the client ID of QM-Lab
	This is used to shorten a great many function calls and document startup basics.
	*/
	var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

	/*
	The Google Realtime API is called to ensure that the user is logged into a Google Account. 
	If the user is logged into a Google Account, attempts to load the QM-Lab document.
	If not logged in, the "Authorize" button has functionality added to it that prompts
	the user to log in. 
	
	pre: The HTML document should have just loaded when running this function. 
	     It should run at no other time
    post: Either the QM-Lab document loading has begun, 
	      or the "Authorize" button has had functionality added to it that allows 
		  the user to log in and then start the QM-Lab document loading.
	*/
	function authorize() {
		// Attempt to authorize
		realtimeUtils.authorize(function(response){
			if(response.error){
				// Authorization failed because this is the first time the user has used your application,
				// show the authorize button to prompt them to authorize manually.
				var button = document.getElementById('auth_button');
				button.classList.add('visible');
				button.addEventListener('click', function () {
					realtimeUtils.authorize(function(response){
						startQM_DocumentLoad();
					}, true);
				});
			} else {
				startQM_DocumentLoad();
			}
		}, false);
	}

	/*
	This function gives the user feedback that Google's Realtime API is attempting to load a document,
	initiates the back-end set up for properly using Google's Realtime API, then actually calls said API
	to load a document. 
	
	pre: The user MUST be logged into a Google Account
	post: A QM-Lab document will be loaded, and the page will have full use of Google's Realtime API
	*/
	function startQM_DocumentLoad() {
		displayLoadingScreen();
		registerCollaborativeObjectTypes();
		loadQM_Document();
	}
	
	/*
	This function is in charge of loading or creating the QM-Lab document. 
	If it finds an "id" in the URL query, it will attempt to load that already made document.
	If it does not, it will create a new document and give it a unique "id". 
	
	pre: The HTML document has finished loading
	post: The GoogleRealtime document should be loaded and all collaborative functionality 
	      be properly engaged. 
	*/
	function loadQM_Document(){
		// With auth taken care of, load a file, or create one if there
		// is not an id in the URL.
		var id = realtimeUtils.getParam('id');
		if (id) {
		// Load the document id from the URL
			realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
		} else {
		//Check if it was loaded from google drive
			//The section in the path that contains the ID is enclosed with %5B"..."%5D
			var openDelim = "%5B%22";
			var closeDelim = "%22%5D";
			var url = window.location.href;
			var openIndex = url.indexOf(openDelim);
			var closeIndex = url.indexOf(closeDelim);
			if((openIndex != -1) && (closeIndex != -1)){
				//Slices out the id from the end of the open delimiter to the beginning of the end delimiter
				id = url.slice(openIndex + openDelim.length, closeIndex);
				//navigate to the existing page and re-run existing code for loading the page
				window.location.replace("?id=" + id);
				//existing code for loading the page
				id = realtimeUtils.getParam('id');
				realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
			}else {
				// Create a new document, add it to the URL
				realtimeUtils.createRealtimeFile('New QM-Lab File', function(createResponse) {
					window.history.pushState(null, null, '?id=' + createResponse.id);
					realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
				});
			}
		}
	}
	
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
	The first time the collaborative diagramming document is ever run, it will run this
	initialization function. It will create an empty collaborative graph, and add
	it to Google's Collaborative Map

	pre: Google Realtime API has never seen the current document ID.
	     No graph has been initialzed for this document. If one has,
			 this function will override it
	post: There will be an empty graph in Google's Realtime API, stored at key "graph"
	      colGraph: Local access to the collaborative graph
	*/
	function onFileInitialize(model) {
		rootModel = model;

		var cGraph = model.create('CollaborativeGraph');
		model.getRoot().set("graph", cGraph);
		colGraph = model.getRoot().get('graph');
		initializeGraph();
		console.log("Initialize complete");

		updateGraph();
	}

	/*
	This function is run every time the document is loaded by Google Realtime API.
	It generates the diagram graph from the collaborative map, and saves access
	to Google's Collaborative Objects map.

	It sets up the event listeners on all existing "cells" to update their
	respective collaborative objects whenever they change. Also, it adds event
	listeners to update the back-up graph whever the user finishes interaction
	with the diagram.

	pre: The document has been loaded. If Google Realtime API hasn't given access,
	     this function will crash the page. You have been warned.
	post: The diagram has been updated to the collaborative graph. Event listeners
	      have been added to the diagram to allow user interaction and realtime
				updating.
	      rootModel: local access to the Google Realtime API
				realDoc: local access that allows getting the collaborators currently
				          working on the document
			  colGraph: local access back-up graph

	*/
	function onFileLoaded(doc) {
		genUI.genUI(); // function loads the toolbars and menus required for the user interface
				// function is declared in genUI.js
		
		graph = new joint.dia.Graph;

		rootModel = doc.getModel();
		realDoc = doc;
		colGraph = rootModel.getRoot().get('graph');
		initializePaper();


		// Update the collaborative object whenever the user finishes making a change
		paper.on('cell:pointerup', updateCollabGraph);
		paper.on('blank:pointerup', updateCollabGraph);

		updateGraph();
	
		addGlobalEventListeners();

		addCollabEventToAllCells();
		allowCollabRecording();
		
		clearLoadingScreen();
		
		console.log("We loaded the document.");
	}
	
	
	/*
	This function adds neccesary event listeners to the html document itself, giving a generic 
	handler function to decide what to do with the event from there.
	These include:
	    When the mouse moves
		When a key on the keyboard is pressed
	
	pre: the html document has been loaded
	post: the html document has global event listeners waiting for user input
	*/
	function addGlobalEventListeners() {
		document.addEventListener('keydown', handleKeyInput);
		document.addEventListener('mousemove', handleMouseMove);
	}
	
	
	
	/*
	This function resets the global state logic to allow changes made to cells to
	update their respective collaborative object once more.
	
	pre: 
	post: the global state should once more allow updates to collab objects
	*/
	function allowCollabRecording() {
		collaborativeChangeReceived = false;
	}
	
	/*
	This function changes the global state logic to not allow changes made to cells to
	update their respective collaborative object any more.
	
	pre: 
	post: the global state should not allow updates to collab objects
	*/
	function stopCollabRecording() {
		collaborativeChangeReceived = true;
	}
	
	/*
	This function returns true if the global state is currently set to allow local objects
	to update their collab counterparts.
	
	pre: 
	post: 
	return: if updates to collab objects are currently allowed
	*/
	function isCollabRecordingAllowed() {
		return collaborativeChangeReceived;
	}
	

	
	/*
	This function grabs all local cells currently in a the graph, then adds event listeners 
	to them that will ensures they updates their collaborative counterparts

	pre: the local graph must exist
	post: any local cell contained by the local graph will have had an event listener attached 
	      to itself that will make it update its collaborative counterpart on change
	*/
	function addCollabEventToAllCells() {
		var cells = graph.getCells();
		for (i = 0; i < cells.length; i++) {
			addCollabEventToCell(cells[i]);
		}
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
	This initializes the local graph to empty, and stores it in the collaborative
	graph. Essentially, this should only be called when the document is first created.
	However, it can potentially be used to "reset" the diagram to empty

	pre: colGraph: exists and has access to the collaborative graph
	post: the local graph and collaborative graph are both empty
	*/
	function initializeGraph() {
		graph = new joint.dia.Graph;
		colGraph.graph = JSON.stringify(graph);
	}


	/*
	This initialzes the local "paper" object from joint.js to be able to display
	the diagram.

	pre: the local graph must exist
	     the html container div "paperView" must also exist
	post: the html container div "paperView" will hold a view of the diagram,
	      representing the back-end model
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

	/*
	On mouse wheel over the "paper", zoom based on mouse wheel direction.

	pre: The "wheel" event has triggered, and contains a non-zero number for
	     direction of mouse wheel.
    post: Scales if paperScale > 0.1. Prevents scrolling on page when happens.
	*/
	function paperZoom(e) {
		//For cross browser use, grab the direction the mouse wheel has turned
		var delta = Math.max(-1, Math.min(1, (-e.originalEvent.deltaY || e.originalEvent.wheelDelta || -e.originalEvent.detail)));
		//If the mouse wheel rolled "down", zoom out
		if (delta > 0) {
			paperScale += 0.1;

		}
		//If the mouse wheel rolled "up", zoom out
		else if (paperScale > 0.1){
			paperScale -= 0.1;
		}

		//Set the actual zoom
		paper.scale(paperScale, paperScale);

		//Prevent the mouse wheel event from scrolling
		e.originalEvent.preventDefault();
	}

	/*
	Trigger when the user has clicked on an empty part of the paper. At the moment
	it then triggers the "panning" functionality, and updates where the mouse is.

	Later, our plans are to divide the functionality of this function into
	"pan when the user is also pressing a pan button" and "start multi selection"

	pre: the user's mouse is over the paper in an empty part of the paper
    post: the user's mouse position has been recorded, and the "panning" functionality
	      is activated
	*/
	function paperEmptySelectionPressed(e) {
		updateMousePos(e)
		movingViewPort = true;
	}

	/*
	When the user lets go of the mouse over the paper, call this function. 
	Based on previous state logic, this function decides how to handle said mouse event
	
	Possible ways of handling it currently only include creating an object based on user button selections
	At the end of the function, it resets the UI selections and resets the global state to "EDIT" mode.
	
	pre: The user's mouse is over the paper.
	post: The user's mouse position on the paper has been updated
	      The internal logic has handled any object creation
		  The internal state has been reset to "EDIT" mode
		
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

	/*
	Update the "selected" array to hold all cells that are under a single point on the paper.
	This point should generally be the user's mouse position.
	
	pre: "pos" is a valid coordinate object that holds an "x" and a "y" field
	post: selected is an array that holds all cells with parts that appear at point "pos"
		
	*/
	function selectSingleOnPoint(pos) {
		selected = graph.findModelsFromPoint(pos);
	}


	/*
	This takes a local joint.js cell and uses it to create a collaborative cell. 
	It also adds a collaborative event listener to the local cell so that it stays in sync with
	the collaborative version of it.
	
	pre: "cell" is a valid joint.js cell
	     rootModel contains a valid reference to Google's Realtime API collaborative model
    post: a collaborative cell has been created that parallels the local cell passed in
          "cell" has had collaborative event listeners put on it so that it keeps itself up
          to date with the collab cell		  
	*/
	function createCollabCell(cell) {
		console.log(cell);
		var newCell = rootModel.create('CollaborativeCell', cell.toJSON());
		rootModel.getRoot().set(cell.id, newCell);
		addCollabEventToCell(cell);
		rootModel.getRoot().get(cell.id).action = 'add';
	}

	/*
	Creates a stock at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative stock has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createStock(pos) {
		var newStock = new localNode(pos, "Stock");
		setUpNewCell(newStock);
		
		console.log("Stock added")
		return newStock;
	}

	/*
	Creates a generic link at the given location. If the user clicked to have the link positioned over a node, it will
	position its "source" as coming from the selected node
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative link has been created with its source positioned at point "pos"
	      In the event that the user created this link by selecting a node at point "pos", the node shall be the source instead.
	      The collaborative graph has been updated
	*/
	function createLink(pos, connector) {
		var newLink = new localLink(pos, false, false, false, connector);
		setUpNewCell(newLink);

		console.log('New cell added');
		return newLink;
	}

	/*
	Creates a generic image at the given location. This image may have both an image and text label associated with it.
	However, if not set, this image node will set it's text and image to default settings.
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	     If "pictureURL" has been passed, it contains a URL link to a valid image
	post: A collaborative image has been created with its top-left corner positioned at point "pos"
	      The image to be displayed and text label have both been set to user defined values if nothing was passed in for them.
	      The collaborative graph has been updated
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
	
	
	
	
	
	/*
	Creates a variable at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative variable has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createVariable(pos) {
		var newVariable = new joint.shapes.QMLab.Variable({
			position: {x: pos.x, y: pos.y}
		});
		setUpNewCell(newVariable);
		
		console.log("A variable was created.");
		return newVariable;
	}
	
	/*
	Creates a parameter at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative parameter has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createParameter(pos) {
		var newParameter = new joint.shapes.QMLab.Parameter({
			position: {x: pos.x, y: pos.y}
		});
		setUpNewCell(newParameter);
		
		console.log("A parameter was created.");
		return newParameter;
	}
	
	/*
	Creates a flow at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative variable has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createFlow(pos) {
		var newFlow = new localFlow(pos, false, false, false, false);
		setUpNewCell(newFlow);
		
		console.log("A flow was created.");
		return newFlow;
	}
	
	/*
	Adds initialzed cell to the graph, then creates a collab cell to parallel it. Updates the collab graph at the same time.
	
	This function should be called no more than once per cell. And only by the collaborator who originally made the cell.
	
	pre: "cell" has never been put in the collab graph before
	     "cell" is a valid cell
	post: "cell" is registered for collaborative interactions and added to the local graph
	      the collaborative graph has been updated to the current state
	
	*/
	function setUpNewCell(cell){
		graph.addCell(cell);
		createCollabCell(cell);
		updateCollabGraph();
	}
	
	
	

	/*
	When the user hits a key, check which key was pressed. Handle state accordingly.
	
	Currently, the only key this function accounts for is the "delete key". Works on both Windows and Mac
	However, further functionality planned includes adding a "when panning key has been pressed", among others
	
	pre: "keyDown" event has fired with a valid, non empty keyCode
	post: The "keyDown" key has been checked, and any behaviour associated with that key have been dispatched
	      Current behaviour dispatch includes:
		         "Delete Key": Delete currently selected node
	*/
	function handleKeyInput(e) {
		if (e.keyCode == 46) {
			deleteSelectedCell(e);
		}
		else {
			console.log("A key was pushed");
		}

	}

	/*
	Deletes the currently selected node, as well as ensures other collaborators have the node deleted as well
	
	pre: There should be some cell at index 0 of "selected" for something to happen. 
	     However, if there is not, nothing happens
	post: Whatever cell was at index 0 of selected has been removed from the graph and view. 
	      The removed cell is also removed from the "selected" array, and everything in 
		  the selected array is shifted one down
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


	/*
	When the mouse moves, handle the logic of figuring out what further methods need to be
	dispatched. 
	
	Currently, this logic is limited to when the user is panning the view of the diagram. 
	Planned changes include handling of "click-and-drag" to select multiple objects at once
	
	pre: A mouseMove event has fired off with the valid "x" and "y" position of the mouse
	post: The appropriate behaviour has been dispatched based off what the global internal-state is
	      This behavious currently handles:
		        Panning of the diagram view
	*/
	function handleMouseMove(e) {
		if (movingViewPort) {
			moveViewPort(e);
		}
	}

	
	/*
	This function checks where the mouse currently is, and where it used to be in relation to a position
	on the paper. It then alters the view of the diagram by that measurement. 
	
	pre: A mouseMove event has fired off with the valid "x" and "y" position of the mouse
	post: curMousePos holds the current mouse position in relation to the diagram's new display position
	      oldMousePos holds the previous mouse position in relation to the diagram's new display position
	*/
	function moveViewPort(e) {
		updateMousePos(e);
		var origin = paper.options.origin;
		paper.setOrigin((curMousePos.x - oldMousePos.x) + origin.x, (curMousePos.y - oldMousePos.y) + origin.y);
		updateMousePos(e);
	}

	/*
	This function updates the current and previous mouse positions in relation to where it is in regards to the diagram
	The previous mouse position will store what is the current mouse position prior to this function being called
	
	pre: A mouseMove event has fired off with the valid "x" and "y" position of the current mouse
	post: curMousePos holds the current mouse position in relation to the diagram
	      oldMousePos holds the previous mouse position in relation to the diagram
	*/
	function updateMousePos(e) {
		oldMousePos = curMousePos;
		offset =  $('#paperView').offset();
		curMousePos = paper.clientToLocalPoint({ x: e.clientX, y: e.clientY });
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





	/*
	This is the constructor of the localNode class.
	
	From a technical standpoint, this function simply wraps a joint.js cell. However, it allows us
	to easily add and modify it without breaking anything else.
	
	pre: "pos" is a valid point with an "x" and "y" field
	post: Returns a local node at the position "pos"
	      If a label parameter has been passed in, text on the node will default to that
		  Otherwise, text on the node will default to "Node"
	*/
	function localNode (pos, label) {
		newNode = new joint.shapes.QMLab.Stock({
			position: { x: pos.x, y: pos.y },
		});
		
		if (label) {
			newNode.setLabel(label);
		}
		return newNode
	}

	
	/*
	Getter for localNode x position. Will return the x coordinate of the node.
	
	pre: The localNode exists
	post: No change
	return: The x position of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getXPos = function() {
		return this.attributes.position.x;
	}

	
	/*
	Getter for localNode y position. Will return the y coordinate of the node.
	
	pre: The localNode exists
	post: No change
	return: The y position of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getYPos = function() {
		return this.attributes.position.y;
	}

	/*
	Setter for localNode position. 
	
	pre: The localNode exists
	     x and y are valid ints
	post: The localCell's position has been updated to {x, y}
	*/
	joint.shapes.basic.Rect.prototype.setPos = function(x, y) {
		this.attributes.position = {x: x, y: y};
	}


	/*
	Getter for localNode width attribute. Will return the x size of the node.
	
	pre: The localNode exists
	post: No change
	return: The x size (width) of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getXSize = function() {
		return this.attributes.size.width;
	}


	/*
	Getter for localNode height attribute. Will return the y size of the node.
	
	pre: The localNode exists
	post: No change
	return: The y size (height) of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getYSize = function() {
		return this.attributes.size.height;
	}

	/*
	Setter for localNode size. 
	
	pre: The localNode exists
	     width and height are valid ints
	post: The localCell's size has been updated to {width, height}
	*/
	joint.shapes.basic.Rect.prototype.setSize = function(width, height) {
		this.attributes.size = {width: x, height: y};
	}

	/*
	Getter for localNode z-order attribute. Will return the 
	order in which it is drawn on the screen.
	
	pre: The localNode exists
	post: No change
	return: The z-order of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getZOrder = function() {
		return this.attributes.z;
	}

	/*
	Setter for localNode z-order. Changes what order it is drawn on the screen 
	
	pre: The localNode exists
	     z is a valid int
	post: The localCell's z-order has been updated to z
	*/
	joint.shapes.basic.Rect.prototype.setZOrder = function(z) {
		this.attributes.z = z;
	}

	/*
	Getter for localNode label attribute. Will return the text associated with this node.
	
	pre: The localNode exists
	post: No change
	return: The label text of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getLabel = function() {
		return this.attributes.attrs.text.text;
	}

	/*
	Getter for localNode z-order attribute. Will return order in which it is drawn on the screen.
	
	pre: The localNode exists
	post: No change
	return: The z-order of the localNode
	*/
	joint.shapes.basic.Rect.prototype.setLabel = function(text) {
		this.attributes.attrs.text.text = text;
	}

	
	
	
	

	/*
	This is the constructor of the localLink class.
	
	From a technical standpoint, this function simply wraps a joint.js link. However, it allows us
	to easily add and modify it without breaking anything else.
	
	pre: "pos" is a valid point with an "x" and "y" field
	     If any other parameters are passed, it will set the appropriate field in the link
		    label : if passed, must be a valid stringify
			source : if passed, must be a valid cell in the graph
			target : if passed, must be a valid cell in the graph
			connector : if passed, must be one of three valid connector types:
			            "normal" - this sets the link to only be made of straight lines
						"rouned" - like the above, this sets the lines to straight.
						           However, this causes the angles to "round" themselves
					    "smooth" - This causes the link to have no straight edges, and instead
						           gradually curve its way between vertices
								   
	post: Returns a local link with source at the position "pos"
	      If any other parameters are not undefined or false, it will set the appropriate field
		    label : sets the text to display halfway along the link
            source: sets the node that this link comes out from. 		
            target: sets the node that this link goes to. 
            connector: sets the connector of the style of the link
                       			
	*/
	function localLink (pos, label, source, target, connector) {
		var newLink = new joint.shapes.QMLab.localLink();

		//If a source was passed, set the link's source that
		if (source) {
			if (graph.getCell(source.id)) {
				newLink.setStartNodeFromCell(source)
			}	
		}
		//Otherwise, use the passed in point
		else {
			newLink.set('source', { x: pos.x, y: pos.y });
		}
		
		//If a target was passed, set the link's target to that
		if (target) {
			if (graph.getCell(target.id)) {
				newLink.setEndNodeFromCell(target)
			}	
		}
		//Otherwise, use the passed in point
		else {
			//For the moment, simply set the target to be a point to the right
			pos.x += 400;
			newLink.setEndNodeFromPoint(pos);
		}
		
		//If a label was passed in, set the link's text to that
		if (label) {
			newLink.setLabel(label);
		}
		
		//If a valid connector was passed in, set this link's connector to that
		if (connector == "normal" || connector == "rounded" || connector == "smooth") {
			newLink.set('connector', { name: connector });
		}

		return newLink;
	}
	
	
	
	
	
	
	/*
	This is the constructor of the localFlow class.
	
	From a technical standpoint, this function simply wraps a joint.js link. However, it allows us
	to easily add and modify it without breaking anything else.
	
	pre: "pos" is a valid point with an "x" and "y" field
	     If any other parameters are passed, it will set the appropriate field in the link
		    label : if passed, must be a valid stringify
			source : if passed, must be a valid cell in the graph
			target : if passed, must be a valid cell in the graph
			connector : if passed, must be one of three valid connector types:
			            "normal" - this sets the link to only be made of straight lines
						"rouned" - like the above, this sets the lines to straight.
						           However, this causes the angles to "round" themselves
					    "smooth" - This causes the link to have no straight edges, and instead
						           gradually curve its way between vertices
								   
	post: Returns a local link with source at the position "pos"
	      If any other parameters are not undefined or false, it will set the appropriate field
		    label : sets the text to display halfway along the link
            source: sets the node that this link comes out from. 		
            target: sets the node that this link goes to. 
            connector: sets the connector of the style of the link
                       			
	*/
	function localFlow (pos, label, source, target, connector) {
		var newFlow = new joint.shapes.QMLab.localLink();

		//If a source was passed, set the link's source that
		if (source) {
			if (graph.getCell(source.id)) {
				newFlow.setStartNodeFromCell(source)
			}	
		}
		//Otherwise, use the passed in point
		else {
			newFlow.set('source', { x: pos.x, y: pos.y });
		}
		
		//If a target was passed, set the link's target to that
		if (target) {
			if (graph.getCell(target.id)) {
				newFlow.setEndNodeFromCell(target)
			}	
		}
		//Otherwise, use the passed in point
		else {
			//For the moment, simply set the target to be a point to the right
			pos.x += 400;
			newFlow.setEndNodeFromPoint(pos);
		}
		
		//If a label was passed in, set the link's text to that
		if (label) {
			newFlow.setLabel(label);
		}
		
		//If a valid connector was passed in, set this link's connector to that
		if (connector == "normal" || connector == "rounded" || connector == "smooth") {
			newFlow.set('connector', { name: connector });
		}
		
		newFlow.set('router', { name: 'orthogonal' });
		

		return newFlow;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	


	/*
	Getter for localLink start node. Will return what the link is currently
	attached to at the "source" end of the link.
	
	If the link is attached to a cell, the returned value will be that cell's "id".
	Otherwise, it will return a point that has fields "x" and "y"
	
	If, for some reason this link has been created without a source attribute, 
	will return undefined
	
	pre: The localLink exists
	post: No change
	return: The source of the localLink
	*/
	joint.dia.Link.prototype.getStartNode = function() {
		return this.attributes.source;
	}

	/*
	Setter for localLink start node. Since this sets by using the cell's "id",
	the passed cell needs to be a valid cell.
	
	
	pre: The localLink exists
	     souce : the cell exists and is in the graph
	post: The source of the node has been set to the passed in source
	*/
	joint.dia.Link.prototype.setStartNodeFromCell = function(source) {
		if (source){
			if (graph.getCell(source.id)) {
				this.set('source', source.id);
			}
			else {
				console.log("There was an error when setting the source of a link by cell. The given cell was:");
				console.log(source);
			}
		}
		else {
			console.log("There was an error when setting the source of a link by cell. The given cell was:");
			console.log(source);
		}
	}

	/*
	Setter for localLink source node. Since this sets by using a point in the graph,
	source be a point with valid "x" and "y" fields.
	
	
	pre: The localLink exists
	     souce : a valid point with "x" and "y" fields
	post: The source of the node has been set to the passed in source
	*/
	joint.dia.Link.prototype.setStartNodeFromPoint = function(source) {
		if (source){
			this.set('source', { x: source.x, y: source.y });
		}
		else {
			console.log("There was an error when setting the source of a link by point. The given point was:");
			console.log(source);
		}
		
	}

	/*
	Getter for localLink end node. Will return what the link is currently
	attached to at the "target" end of the link.
	
	If the link is attached to a cell, the returned value will be that cell's "id".
	Otherwise, it will return a point that has fields "x" and "y"
	
	If, for some reason this link has been created without a target attribute, 
	will return undefined
	
	pre: The localLink exists
	post: No change
	return: The target of the localLink
	*/
	joint.dia.Link.prototype.getEndNode = function() {
		return this.attributes.target;
	}

	/*
	Setter for localLink end node. Since this sets by using the cell's "id",
	the passed cell needs to be a valid cell.
	
	
	pre: The localLink exists
	     target : the cell exists and is in the graph
	post: The target of the node has been set to the passed in target
	*/
	joint.dia.Link.prototype.setEndNodeFromCell = function(target) {
		this.set('target', target.id);
	}

	/*
	Setter for localLink target node. Since this sets by using a point in the graph,
	source be a point with valid "x" and "y" fields.
	
	
	pre: The localLink exists
	     souce : a valid point with "x" and "y" fields
	post: The source of the node has been set to the passed in source
	*/
	joint.dia.Link.prototype.setEndNodeFromPoint = function(target) {
		this.set('target', { x: target.x, y: target.y });
	}


	/*
	Setter for localLink label text.
	
	pre: The localLink exists
	     text : a valid string of some kind
	post: The label text of the node has been set to the passed in text
	*/
	joint.dia.Link.prototype.setLabel = function(text) {
		this.set('labels', [{ position: 0.5, attrs: { text: { text: text } } }]);
	}

	/*
	Getter for localLink label text. Will return what the link currently
	has written and displayed partway along itself. If nothing is currently 
	set, returns an empty string. ""
	
	By design, there should never be more than one label attached to a cell.
	Therefore, it is perfectly safe to hardcode the index of the label we are
	searching.
	
	pre: The localLink exists
	post: No change
	return: The label text of the localLink
	*/
	joint.dia.Link.prototype.getLabel = function(text) {
		if (this.attributes.labels) {
			if (this.attributes.labels[0]) {
				return this.attributes.labels[0].attrs.text.text;
			}
		}
		else {
			return "";
		}
	}
	
	
	
	/*
	Initialzes the namespace for our custom shapes for use in the diagram.
	*/
	joint.shapes.QMLab = {};
	
	
	
	/*
	This is the shape definition of the "localLink" type. It extends joint.js' Link,
	allowing us to easily customize it.	By default, sets the Link to behave exactly 
	link a default joint.js basic Link. 

	*/
	joint.shapes.QMLab.localLink = joint.dia.Link.extend({
		defaults: joint.util.deepSupplement({
			
			type: 'QMLab.localLink'
			
		}, joint.dia.Link.prototype.defaults),
	});
	
	
	/*
	This is the shape definition of the "localFlow" type. It extends joint.js' Link,
	allowing us to easily customize it.	By default, sets the Link to behave exactly 
	link a default joint.js basic Link. 

	*/
	joint.shapes.QMLab.localLink = joint.dia.Link.extend({
		defaults: joint.util.deepSupplement({
			
			type: 'QMLab.localLink',
			
		}, joint.dia.Link.prototype.defaults),
	});
	
	

	
	/*
	This is the shape definition of the "localNode" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.
	
	By default, sets the Node to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Node = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Node',
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'grey' }, text: { text: "Node", fill: 'white' } }

		}, joint.shapes.basic.Rect.prototype.defaults)
	});
	
	
	
	/*
	This is the shape definition of the "Stock" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.
	
	By default, sets the Stock to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Stock = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Stock',
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'grey' }, text: { text: "Node", fill: 'white' } }

		}, joint.shapes.basic.Rect.prototype.defaults)
	});
	
	
	
	
	
	
	/*
	This is the shape definition of the "ImageNode" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.
	
	By default, sets the ImageNode is set to hold a placeholder image, with text that states "Your Image Here".
	Override the visuals through either the constructor or the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.ImageNode = joint.shapes.basic.Rect.extend({

		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.ImageNode',
			size: { width: 200, height: 120 },
			attrs: {
				'rect': { 'fill-opacity': 0, 'stroke-opacity': 0, width: 0, height: 0 },
				'text': { 'font-size': 14, text: 'Your Image Here', 'ref-x': 100, 'ref-y': 130, ref: 'rect', fill: 'black' },
				'image': { 'xlink:href': 'http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg', width: 200, height: 120 },
			}

		}, joint.shapes.basic.Rect.prototype.defaults)
	});
	
	
	
	/*
	This is the shape definition of the "Variable" type. It extends joint.js' Circle shape,
	allowing us to easily customize it.
	*/
	joint.shapes.QMLab.Variable = joint.shapes.basic.Circle.extend({

		markup: '<g class="rotatable"><g class="scalable"><circle/><path/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Variable',
			size: { width: 20, height: 20 },
			attrs: { text: { text: 'Variable', 'ref-y': 30, ref: 'circle' }, circle: { fill: 'gray' } },
			
		}, joint.shapes.basic.Circle.prototype.defaults)
	});
	
	
	/*
	This is the shape definition of the "Parameter" type. It extends joint.js' Circle shape,
	allowing us to easily customize it.
	*/
	joint.shapes.QMLab.Parameter = joint.shapes.basic.Circle.extend({

		markup: '<g class="rotatable"><g class="scalable"><circle/><path/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Parameter',
			size: { width: 20, height: 20 },
			
			attrs: { 
				text: { text: 'Parameter', 'ref-y': 30, ref: 'circle' }, 
				circle: { fill: 'gray' },
				//path: { fill: 'green', stroke: "black", d: "M40,50  L50,35  A30,30 1 0,1 30,10 z"}
				//Currently, leaving this out of the build. But throw another shape of a pie chart or something
				//to show that this is different from a variable. Especially considering the default 'name' in the 
				//text field won't be used very often in the final release. 
				},
				
			
		}, joint.shapes.basic.Circle.prototype.defaults)
	});
	
	
	
	
