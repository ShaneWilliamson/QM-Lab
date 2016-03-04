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

	// Attach event listeners to all buttons, start Google's Realtime API.
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
	// The first time a file is opened, it must be initialized with the
	// document structure. This function will add a collaborative string
	// to our model at the root.
	function onFileInitialize(model) {
		rootModel = model;
		
		var cGraph = model.create('CollaborativeGraph');
		model.getRoot().set("graph", cGraph);
		colGraph = model.getRoot().get('graph');
		initializeGraph();
		console.log("Initialize complete");
		
		updateGraph();
	}

	// After a file has been initialized and loaded, we can access the
	// document. We will wire up the data model to the UI.
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
	
	
	//Allows Google's API to handle the cell
	function addCollabEventToCell(cell) {
		cell.on('change', (function() {
			return function(event) {updateCellByEventID(event);};
		}) ());
	}
	
	//Class definition of a collaborative object to hold the graph
	function CollaborativeGraph(){

	}
	
	function updateCollabGraph() {
		colGraph.graph = JSON.stringify(graph);
		console.log('collab graph updated');
	}

	//OBject Initialization and Load functions
	function doGraphInitialize(){
		var model = gapi.drive.realtime.custom.getModel(this);
		console.log("The graph was initialized.")
	}

	function doGraphOnLoaded(){
		//this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updateGraph);
		console.log("We've loaded the graph");
	}

	function updateGraph() {
		graph.fromJSON(JSON.parse(colGraph.graph))
		console.log('Built new graph');
	}



	

	//Create a default graph-state for the document (will be empty, but for spike test showcases functionality with place holders)
	function initializeGraph() {
		graph = new joint.dia.Graph;
		colGraph.graph = JSON.stringify(graph);
	}
	
	//Initialize the view of the graph and set up it's event listeners
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
	
	// Zoom the viewport in or out based on user mouse wheel input.
	function paperZoom(e) {
		var delta = Math.max(-1, Math.min(1, (-e.originalEvent.deltaY || e.originalEvent.wheelDelta || -e.originalEvent.detail)));
		if (delta > 0) {
			paperScale += 0.1;
			
		}
		else if (paperScale > 0.1){
			paperScale -= 0.1;
		}
		paper.scale(paperScale, paperScale);
		
		e.originalEvent.preventDefault();
	}

	// When a user clicks where there no elements are present, start letting them pan the view.
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

