	var graph;
	var paper;
	var paperScale;
	var colGraph;	
	var rootModel;
	var realDoc;
	var loading;
	var clientId = '1073945779594-bpprsdgic2haajdb3ghqfcsuodnrc6ss.apps.googleusercontent.com';
	var activeID;
	

	
	
	window.onload=onstartRun;

	function onstartRun(){
		authorize();
		freeze = setInterval(checkAndFreeze, 1000);
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
			// Create a new document, add it to the URL
			realtimeUtils.createRealtimeFile('New Draw File', function(createResponse) {
				window.history.pushState(null, null, '?id=' + createResponse.id);
				realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
			});
		}
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
		graph.on('batch:stop', function(eventName, cell) {
			colGraph.graph = JSON.stringify(graph);
		});
		updateGraph();
		clearLoadingScreen();
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

	//Create a default graph-state for the document
	function initializeGraph() {
		graph = new joint.dia.Graph;

		var rect = new joint.shapes.basic.Rect({
			position: { x: 100, y: 30 },
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'blue' }, text: { text: 'Pretend Stock', fill: 'white' } }
		});

		var rect2 = rect.clone();
		rect2.translate(300);

		var link = new joint.dia.Link({
			source: { id: rect.id },
			target: { id: rect2.id }
		});
		link.set('router', { name: 'manhattan' });

		graph.addCells([rect, rect2, link]);
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
		
		paper.$el.on('wheel', onMouseWheel);
	}
	
	
	function onMouseWheel(e) {
		var delta = Math.max(-1, Math.min(1, (-e.originalEvent.deltaY || e.originalEvent.wheelDelta || -e.originalEvent.detail)));
		if (delta > 0) {
			paperScale += 0.1;
			
		}
		else {
			paperScale -= 0.1;
		}
		paper.scale(paperScale, paperScale);
		
		console.log(colGraph.graph);
		console.log(graph);
	}