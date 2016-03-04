	var graph;
	var paper;
	var paperScale;
	var colGraph;	
	var rootModel;
	var realDoc;
	var loading;
	var clientId = '107414709467-qu9f2182pb7i3r7607cugihbiuua0e5v.apps.googleusercontent.com';
	var activeID;

	var globalState;
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
		authorize();
		freeze = setInterval(checkAndFreeze, 1000);

		globalState = "EDIT";
		movingViewPort = false;
		
		// var stockButton = document.getElementById("stockButton");
		// stockButton.addEventListener('mousedown', function () {
		// 	globalState = "ADDSTOCK";
		// });

		// document.getElementById("linkButton").addEventListener('mousedown', function () {
		// 	globalState = "ADDLINK";
		// });
		
		// document.getElementById("imageButton").addEventListener('mousedown', function () {
		// 	globalState = "ADDIMAGE";
		// });
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
		gapi.drive.realtime.custom.setInitializer(CollaborativeGraph, doInitialize);
		gapi.drive.realtime.custom.setOnLoaded(CollaborativeGraph, doOnLoaded);
			
		
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
				id = path.slice(openIndex + openDelim.length, closeIndex);
				//navigate to the existing page and re-run existing code for loading the page
				window.location.assign(window.location.hostname + window.location.pathname + "/?id=" + id);
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


		genUI(); // function loads the toolbars and menus required for the user interface
				// function is declared in genUI.js
	}
	// The first time a file is opened, it must be initialized with the
	// document structure. This function will add a collaborative string
	// to our model at the root.
	function onFileInitialize(model) {
		
		var cGraph = model.create('CollaborativeGraph');
		model.getRoot().set("graph", cGraph);
		colGraph = model.getRoot().get('graph');
		initializeGraph();
		console.log("Initialize complete");
	}

	// After a file has been initialized and loaded, we can access the
	// document. We will wire up the data model to the UI.
	function onFileLoaded(doc) {
		graph = new joint.dia.Graph;
		rootModel = doc.getModel();
		realDoc = doc;
		colGraph = rootModel.getRoot().get('graph');
		initializePaper();
		console.log("We loaded the document.");
		
		// Update the collaborative object whenever the user finishes making a change
		paper.on('cell:pointerup', updateCollabGraph);
		paper.on('blank:pointerup', updateCollabGraph);
		
		updateGraph();
		clearLoadingScreen();
		
		document.addEventListener('keydown', handleKeyInput);
		document.addEventListener('mousemove', handleMouseMove);
	}
	
	function updateCollabGraph() {
		colGraph.graph = JSON.stringify(graph);
	}



	//OBject Initialization and Load functions
	function doInitialize(){
		var model = gapi.drive.realtime.custom.getModel(this);
		console.log("The graph was initialized.")
	}

	function doOnLoaded(){
		this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updateGraph);
		console.log("We've loaded the graph");
	}

	function updateGraph() {
		graph.fromJSON(JSON.parse(colGraph.graph))
	}



	//Class definition of a collaborative object to hold the graph
	function CollaborativeGraph(){

	}

	//Create a default graph-state for the document (will be empty, but for spike test showcases functionality with place holders)
	function initializeGraph() {
		graph = new joint.dia.Graph;
		
		
		var decoratedRect = createImage({x: 150, y: 150})
		
		var rect = createStock( {x: 100, y: 30} );
		var rect2 = createStock( {x: 300, y: 30} );
		var rect3 = createStock( {x: 100, y: 300} );
		var rect4 = createStock( {x: 300, y: 300} );

		var link = new joint.dia.Link({
			source: { id: rect.id },
			target: { id: rect2.id }
		});
		link.set('router', { name: 'manhattan' });

		var link2 = new joint.dia.Link({
			source: { id: rect3.id },
			target: { id: rect4.id },
		});
		link2.set('connector', { name: 'smooth' });


		graph.addCells([link, link2]);
		
		
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
		else {
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
		
		if (lastClickedValue == "Stock") {
			createStock(curMousePos);
			
		} else if (lastClickedValue == "Flow") {
			createLink(curMousePos);
			
		} else if (lastClickedValue == "Image") {
			createImage(curMousePos);	
		}
		
		deselectUIElements();
		lastClickedValue = "EDIT"; // reset the cursor back to editing
		movingViewPort = false;
	}
	
	function selectSingleOnPoint(pos) {
		selected = graph.findModelsFromPoint(pos);
	}
	
	// Create a stock at the given position.
	function createStock(pos) {
		var newStock = new joint.shapes.basic.Rect({
			position: { x: pos.x, y: pos.y },
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'blue' }, text: { text: 'Pretend Stock', fill: 'white' } }
		});	
		graph.addCell(newStock);
		
		return newStock;
	}
	
	// Create a link at the given position, extending towards the right.
	function createLink(pos) {
		var newLink = new joint.dia.Link();
			if (selected[0]) {
				newLink.set('source', { id: selected[0].id });
			} 
			else {
				newLink.set('source', { x: pos.x, y: pos.y });
			}
			
			pos.x += 300;
			
			var targetOfLink = graph.findModelsFromPoint(pos);
			if (targetOfLink[0]) {
				newLink.set('target', { id: selected[0].id });
			} 
			else {
				newLink.set('target', { x: pos.x, y: pos.y });
			}

			newLink.set('connector', { name: 'smooth' });
			
			graph.addCell(newLink);
			
			return newLink;
	}
	
	// Create an image at the given position.
	function createImage(pos) {
		var newImage = new joint.shapes.basic.DecoratedRect({
			position: { x: pos.x, y: pos.y },
			size: { width: 200, height: 120 },
			attrs: { 
				text: { text: 'Vader Is Back' , 'x-alignment': 'middle'},
				image: { 'xlink:href': 'http://img.moviepilot.com/assets/tarantulaV2/long_form_background_images/1386062573_darth-vader-16086-1680x1050.jpg' }
			}
		});
		graph.addCell(newImage);
		
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

	
	
	
	
	
	


