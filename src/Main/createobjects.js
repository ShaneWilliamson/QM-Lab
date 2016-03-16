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
		var newStock = new joint.shapes.QMLab.Stock({
			position: { x: pos.x, y: pos.y },
			size: { width: 100, height: 30 },
		});
		console.log(this);
		setUpNewCell(newStock);
		
		console.log("Stock added")
		return newStock;
	}
	
	/*
	Creates a State at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative state has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createState(pos) {
		var newState = new joint.shapes.QMLab.State({
			position: { x: pos.x, y: pos.y },
		});
		setUpNewCell(newState);
		
		console.log("State added")
		return newState;
	}
	
	/*
	Creates a terminal state at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative terminal state has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createTerminalState(pos) {
		var newTerminalState = new joint.shapes.QMLab.TerminalState({
			position: { x: pos.x, y: pos.y },
		});
		setUpNewCell(newTerminalState);
		
		console.log("Terminal State added")
		return newTerminalState;
	}

	/*
	Creates a branch at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative branch has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createBranch(pos) {
		var newBranch = new joint.shapes.QMLab.Branch({
			position: { x: pos.x, y: pos.y },
		});
		setUpNewCell(newBranch);
		
		console.log("Branch added")
		return newBranch;
	}
	
	/*
	Creates a text area at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative text area has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createText(pos) {
		var newText = new joint.shapes.QMLab.Text({
			position: { x: pos.x, y: pos.y },
		});
		newText.setLabel("HI");
		setUpNewCell(newText);
		console.log("Text added")
		return newText;
	}
	
	/*
	Creates an agent at the given location 
	
	pre: "pos" is a valid coordinate that contains "x" and "y" fields
	post: A collaborative agent has been created with its top-left corner positioned at point "pos"
	      The collaborative graph has been updated
	*/
	function createAgent(pos) {
		var newAgent = new joint.shapes.QMLab.Agent({
			position: { x: pos.x, y: pos.y },
		});
		setUpNewCell(newAgent);
		console.log("Text added")
		return newAgent;
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
			size: { width: 200, height: 120 },
			attrs: {
				'image': { 'xlink:href': 'http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg', width: 200, height: 120 }
			}
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
	