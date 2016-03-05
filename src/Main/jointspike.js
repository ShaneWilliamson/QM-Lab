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

	// Type declaration for a node that will be the basis of an arbitrary image.
	joint.shapes.basic.DecoratedRect = joint.shapes.basic.Generic.extend({

		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'basic.DecoratedRect',
			size: { width: 200, height: 120 },
			attrs: {
				'rect': { 'fill-opacity': 0, 'stroke-opacity': 0, width: 200, height: 120 },
				'text': { 'font-size': 14, text: '', 'ref-x': 100, 'ref-y': 130, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: 'black' },
				'image': { width: 200, height: 120 }
			}

		}, joint.shapes.basic.Generic.prototype.defaults)
	});



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

	//Animates the loading bar
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

	//Once the API has sent back confirmation, hide the loading bar.
	function clearLoadingScreen() {
		document.getElementById("state").style.display = "none";
		clearInterval(loading);
		document.getElementById("bar").style.display = "none";
		document.getElementById("progress").style.display = "none";
		document.getElementById("auth_button").style.display = "none";
	}

	//Continuously checks that the user is online. If the user goes offline editing is disabled.
	function checkAndFreeze(){
		if(!navigator.onLine){
			//document.getElementById("cover").style.zIndex = "10";
			//document.getElementById("state").style.display = "block";
			alert("You have gone offline and your session has been frozen. Please Reconnect to continue editing.");
			//document.getElementById("state").innerHTML="Offline";
			restore = setInterval(checkAndRestore, 1000);
			clearInterval(freeze);
		}

	}
	//Once the user is offline continuously checks for the user going online again. Once the user is online
	//editing is re-enabled.
	function checkAndRestore(){
		if(navigator.onLine){
			//document.getElementById("cover").style.zIndex = "-20";
			//document.getElementById("state").innerHTML="Online";
			alert("You have	re-connected. Editing is re-enabled.");
			freeze = setInterval(checkAndFreeze, 1000);
			clearInterval(restore);
		}
	}

	//Authorization
	if (!/^([0-9])$/.test(clientId[0])) {
		alert('Invalid Client ID - did you forget to insert your application Client ID?');
	}
	// Create a new instance of the realtime utility with your client ID.
	var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

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
						start();
					}, true);
				});
			} else {
				start();
			}
		}, false);
	}

	//
	function start() {
		//Display loading screen
		document.getElementById("state").style.display = "block";
		document.getElementById("bar").style.display = "block";
		document.getElementById("progress").style.display = "block";
		moveProgressBar();



		//Register the CollaborativeGraph object
		gapi.drive.realtime.custom.registerType(CollaborativeGraph, 'CollaborativeGraph');
		CollaborativeGraph.prototype.graph=gapi.drive.realtime.custom.collaborativeField('graph');
		gapi.drive.realtime.custom.setInitializer(CollaborativeGraph, doGraphInitialize);
		gapi.drive.realtime.custom.setOnLoaded(CollaborativeGraph, doGraphOnLoaded);

		gapi.drive.realtime.custom.registerType(CollaborativeCell, 'CollaborativeCell');
		CollaborativeCell.prototype.JSON=gapi.drive.realtime.custom.collaborativeField('JSON');
		CollaborativeCell.prototype.action=gapi.drive.realtime.custom.collaborativeField('action');
		gapi.drive.realtime.custom.setInitializer(CollaborativeCell, doCellInitialize);
		gapi.drive.realtime.custom.setOnLoaded(CollaborativeCell, doCellOnLoaded);



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


		genUI.genUI(); // function loads the toolbars and menus required for the user interface
				// function is declared in genUI.js
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
		graph = new joint.dia.Graph;

		rootModel = doc.getModel();
		realDoc = doc;
		colGraph = rootModel.getRoot().get('graph');
		initializePaper();


		// Update the collaborative object whenever the user finishes making a change
		paper.on('cell:pointerup', updateCollabGraph);
		paper.on('blank:pointerup', updateCollabGraph);

		updateGraph();
		clearLoadingScreen();

		document.addEventListener('keydown', handleKeyInput);
		document.addEventListener('mousemove', handleMouseMove);


		var cells = graph.getCells();


		for (i = 0; i < cells.length; i++) {
			addCollabEventToCell(cells[i]);
		}


		collaborativeChangeReceived = false;


		var people = realDoc.getCollaborators();
		for (i = 0; i < people.length; i++) {
			if (people[i].isMe) {
				sessionId = people[i].sessionId;
				console.log(sessionId);
			}
		}



		console.log("We loaded the document.");
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
		//If the mouse wheel rolled "up", zoom out
		if (delta > 0) {
			paperScale += 0.1;

		}
		//If the mouse wheel rolled "down", zoom out
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

	// Based on state, possibly create. Then change state back to editing.
	function paperOnMouseUp(e) {
		updateMousePos(e)
		selectSingleOnPoint(curMousePos);

		if (genUI.lastClickedValue == "Stock") {
			createStock(curMousePos);

		} else if (genUI.lastClickedValue == "Flow") {
			createLink(curMousePos);

		} else if (genUI.lastClickedValue == "Image") {
			createImage(curMousePos);
		}

		genUI.deselectUIElements();
		genUI.lastClickedValue = "EDIT"; // reset the cursor back to editing
		movingViewPort = false;
	}

	function selectSingleOnPoint(pos) {
		selected = graph.findModelsFromPoint(pos);
	}


	function createCollabCell(cell) {
		var newCell = rootModel.create('CollaborativeCell', cell.toJSON());
		rootModel.getRoot().set(cell.id, newCell);
		addCollabEventToCell(cell);
		rootModel.getRoot().get(cell.id).action = 'add';
	}

	// Create a stock at the given position.
	function createStock(pos) {
		var newStock = new localNode(pos, "Stock");
		graph.addCell(newStock);
		createCollabCell(newStock);

		updateCollabGraph()
		console.log("Stock added")
		return newStock;
	}

	// Create a link at the given position, extending towards the right.
	function createLink(pos) {
		var newLink = new localLink(pos);

		graph.addCell(newLink);
		createCollabCell(newLink);
		updateCollabGraph();

		console.log('New cell added');
		return newLink;
	}

	// Create an image at the given position.
	function createImage(pos, pictureURL, label) {
		var pic = (pictureURL) ? pictureURL : 'http://img.moviepilot.com/assets/tarantulaV2/long_form_background_images/1386062573_darth-vader-16086-1680x1050.jpg';
		var text = (label) ? label : 'Vaer Is Back';

		var newImage = new joint.shapes.basic.DecoratedRect({
			position: { x: pos.x, y: pos.y },
			size: { width: 200, height: 120 },
			attrs: {
				text: { text: text , 'x-alignment': 'middle'},
				image: { 'xlink:href': pic }
			}
		});
		graph.addCell(newImage);
		createCollabCell(newImage);
		updateCollabGraph();

		console.log('New cell added');
		return newImage;
	}

	// Check if the user hit a significant key. Proceed based on answer.
	function handleKeyInput(e) {
		if (e.keyCode == 46) {
			deleteSelectedCell(e);
		}
		else {
			console.log("");
		}

	}

	//Delete the currently selected node.
	function deleteSelectedCell(e) {
		if (selected[0]) {
			rootModel.getRoot().get(selected[0].id).action = 'remove';
			selected[0].remove();
			selected.shift();
		}
		updateCollabGraph();
	}


	function handleMouseMove(e) {
		if (movingViewPort) {
			moveViewPort(e);
		}
	}

	function moveViewPort(e) {
		updateMousePos(e);
		var origin = paper.options.origin;
		paper.setOrigin((curMousePos.x - oldMousePos.x) + origin.x, (curMousePos.y - oldMousePos.y) + origin.y);
		updateMousePos(e);
	}

	function updateMousePos(e) {
		oldMousePos = curMousePos;
		offset =  $('#paperView').offset();
		curMousePos = paper.clientToLocalPoint({ x: e.clientX, y: e.clientY });
	}



	function CollaborativeCell() {

	}

	function doCellInitialize (JSONdata) {
		console.log(this);
		var model = gapi.drive.realtime.custom.getModel(this);
		this.JSON = JSONdata;
		this.action = "update";
		console.log('cell created');
	}

	function doCellOnLoaded () {
		var that = this;
		this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, (function() {
				return function(cell) {updateCellByJSON(cell, that);};
			}) ());
		console.log('cell was loaded');
	}

	function updateCellByJSON(event, that) {

		collaborativeChangeReceived = true;

		if(that.action === "update") {
			var localCell = graph.getCell(that.JSON.id);
			if (localCell) {
				localCell.set(that.JSON);
			}
		}
		else if (that.action === "remove") {
			graph.getCell(that.JSON.id).remove();
		}
		else if (that.action === "add") {
			graph.addCell(that.JSON);
			addCollabEventToCell(graph.getCell(that.JSON.id));
		}
	}

	function updateCellByEventID(cell) {
		if (!collaborativeChangeReceived) {
			rootModel.getRoot().get(cell.id).action = 'update';
			rootModel.getRoot().get(cell.toJSON().id).JSON = cell.toJSON();
		}
		collaborativeChangeReceived = false;
	}






	function localNode (pos, label) {
		var text = "Stock";
		if (label) {
			text = label;
		}
		return new joint.shapes.basic.Rect({
			position: { x: pos.x, y: pos.y },
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'grey' }, text: { text: text, fill: 'white' } }
		});
	}

	joint.shapes.basic.Rect.prototype.getXPos = function() {
		return this.attributes.position.x;
	}

	joint.shapes.basic.Rect.prototype.getYPos = function() {
		return this.attributes.position.y;
	}

	joint.shapes.basic.Rect.prototype.setPos = function(x, y) {
		this.attributes.position = {x: x, y: y};
	}


	joint.shapes.basic.Rect.prototype.getXSize = function() {
		return this.attributes.size.width;
	}

	joint.shapes.basic.Rect.prototype.getYSize = function() {
		return this.attributes.size.height;
	}

	joint.shapes.basic.Rect.prototype.setSize = function(x, y) {
		this.attributes.size = {width: x, height: y};
	}

	joint.shapes.basic.Rect.prototype.getZOrder = function() {
		return this.attributes.z;
	}

	joint.shapes.basic.Rect.prototype.setZOrder = function(z) {
		this.attributes.z = z;
	}

	joint.shapes.basic.Rect.prototype.getLabel = function() {
		return this.attributes.attrs.text.text;
	}

	joint.shapes.basic.Rect.prototype.setLabel = function(text) {
		this.attributes.attrs.text.text = text;
	}




	function localLink (pos, label) {
		var newLink = new joint.dia.Link();

		if (selected[0]) {
			newLink.set('source', { id: selected[0].id });
		}
		else {
			newLink.set('source', { x: pos.x, y: pos.y });
		}

		newLink.set('target', { x: pos.x + 200, y: pos.y });

		newLink.set('connector', { name: "smooth" });

		return newLink;
	}


	joint.dia.Link.prototype.getStartNode = function() {
		return this.attributes.source;
	}

	joint.dia.Link.prototype.setStartNodeFromCell = function(source) {
		this.set('source', source.id);
	}

	joint.dia.Link.prototype.setStartNodeFromPoint = function(source) {
		this.set('source', { x: source.x, y: source.y });
	}

	joint.dia.Link.prototype.getEndNode = function() {
		return this.attributes.target;
	}

	joint.dia.Link.prototype.setEndNodeFromCell = function(target) {
		this.set('target', target.id);
	}

	joint.dia.Link.prototype.setEndNodeFromPoint = function(source) {
		this.set('target', { x: target.x, y: target.y });
	}

	joint.dia.Link.prototype.setEndNodeFromCell = function(source) {
		this.set('target', { x: target.x, y: target.y });
	}


	joint.dia.Link.prototype.setLabel = function(text) {
		this.set('labels', [{ position: 0.5, attrs: { text: { text: text } } }]);
	}

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
