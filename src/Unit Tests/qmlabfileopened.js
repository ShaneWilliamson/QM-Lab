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
		dispatchUnitTests();
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
