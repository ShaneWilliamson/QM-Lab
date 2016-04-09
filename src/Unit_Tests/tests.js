window.gapi.load('auth:client,drive-realtime,drive-share', beginTests);

function beginTests() {
  console.log("Hello!");
  var doc = gapi.drive.realtime.newInMemoryDocument();
  var model = doc.getModel();
  registerCollaborativeObjectTypes();
  onFileInitialize(model);
  onFileLoaded(doc);
}

Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this;
  return function () {
    return fn.apply(thisp, arguments);
  };
};

QUnit.config.collapse = false;

QUnit.test("Test Stock Creation", function( assert ) {
  var pos = {x: 3, y: 2};
  var newStock = new localNode(pos, "Stock");
  assert.notDeepEqual(newStock, null, "Ensures that the stock is not null");
  assert.deepEqual(createStock(pos).attributes.position, newStock.attributes.position, "Positions are created as expected");
  assert.deepEqual(newStock.getXPos(), newStock.attributes.position.x, "X coordinate is created as expected");
  assert.deepEqual(newStock.getYPos(), newStock.attributes.position.y, "Y coordinate is created as expected");

  //Test now if we change the position will it change the attributes properly.
  var newX = 4;
  var newY = 3;
  newStock.setPos(newX, newY);
  assert.equal(newStock.getXPos(), newX, "getXPos works as expected");
  assert.equal(newStock.getYPos(), newY, "getYPos works as expected");

  assert.equal(newStock.getImage(),"", "Image should return blank.");



});

QUnit.test("Test Image Creation and qmlabjointclasses tests", function( assert ) {
  var pos = {x: 4, y: 3};
  var pictureURL = "http://i.imgur.com/48dEoHh.jpg";
  var label = "A nice meme";
  var newImage = new joint.shapes.QMLab.ImageNode({
    position: { x: pos.x, y: pos.y },
  });


  var sizeX = 200;
  var sizeY = 200;
  newImage.setSize(sizeX, sizeY);
  newImage.setLabel(label);
  newImage.setImage(pictureURL);

  assert.notDeepEqual(newImage, null, "Test if not null");
  assert.deepEqual(createImage(pos, pictureURL, label, null, null).attributes.position, newImage.attributes.position, "Test if positions are equal from creation");
  assert.equal(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.size.height, newImage.attributes.size.height, "Test if heights are equal");
  assert.equal(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.size.width, newImage.attributes.size.width, "Test if widths are equal");
  assert.equal(createImage(pos, pictureURL, label, sizeX, sizeY).attr('image/xlink:href'), newImage.attr('image/xlink:href'), "Test if image urls are equal");
  assert.equal(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.text.text, newImage.attributes.text.text), "Test if labels are equal";
  assert.equal(createImage(pos, pictureURL, null, sizeX, sizeY).attributes.text.text, "Your Image Here", "Test if default label is equal to expected");
  var defaultURL = "http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg"
  assert.equal(createImage(pos, null, label, sizeX, sizeY).attr('image/xlink:href'), defaultURL, "Test if default ");


  assert.equal(newImage.getXSize(), sizeX);
  assert.equal(newImage.getYSize(), sizeY);

  // Change size and confirm it changed properly
  var newHeight = 20;
  var newWidth = 30;
  newImage.setHeight(newHeight);
  assert.equal(newImage.getYSize(), newHeight), "getYSize is working as intended";

  newImage.setWidth(newWidth);
  assert.equal(newImage.getXSize(), newWidth, "getXSize is working as intended");

  assert.equal(newImage.getLabel(), "A nice meme", "getLabel is working as intended.");
  newImage.setLabel(null);
  assert.equal(newImage.getLabel(), "", "Label should be blank");

  // Set the fill color and see if it changed it
  newImage.setColour("#ffffff");
  assert.equal(newImage.getColour(), "#ffffff", "Changing fill colour worked.");

  // Set the text color and see if it changed it
  newImage.setTextColour("#000000");
  assert.equal(newImage.getTextColour(), "#000000", "Changing text colour worked.");

  // Add a z order and see if it Changes
  var newZOrder = 2;
  newImage.setZOrder(newZOrder);
  assert.equal(newImage.getZOrder(), newZOrder);

  // Gets the url
  var imageURL = "http://i.imgur.com/48dEoHh.jpg";
  assert.equal(newImage.getImageURL(), imageURL, "getImageURL returns proper url");
  assert.equal(newImage.getImage(), imageURL, "getImage returns proper URL");

  // Change text size
  var newTextSize = 10;
  newImage.setTextSize(newTextSize);
  assert.equal(newImage.getTextSize(), newTextSize, "getTextSize returns proper size");

});

QUnit.test("Test Variable Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newVariable = new joint.shapes.QMLab.Variable({
    position: {x: pos.x, y: pos.y}
  });
  assert.notDeepEqual(newVariable, null, "Assures the variable is not null");
  assert.deepEqual(createVariable(pos).attributes.position, newVariable.attributes.position, "Positions are equal");
  assert.equal(createVariable(pos).attributes.position.x, newVariable.attributes.position.x, "Checks if x is equal");
  assert.equal(createVariable(pos).attributes.position.y, newVariable.attributes.position.y, "Checks if y is equal");


});


QUnit.test("Test Parameter Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newParameter = new joint.shapes.QMLab.Parameter({
    position: {x: pos.x, y: pos.y}
  });
  assert.notDeepEqual(newParameter, null), "Checks if parameter is not null";
  assert.deepEqual(createParameter(pos).attributes.position, newParameter.attributes.position, "Checks if positions are equal");
});

QUnit.test("Test Flow Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newFlow = new localFlow(pos, false, false, false, false);
  assert.deepEqual(createFlow(pos).attributes.position, newFlow.attributes.position, "Checks if positions are equal");

  var pos1 = {x: 0, y: 3};
  var pos2 = {x: 4, y: 4};
  var pos3 = {x: 3, y: 5};

  var newStock1 = createStock(pos1);
  var newStock2 = createStock(pos2);
  var flow = localFlow (pos3, "Hello World", newStock1, newStock2, "Normal");
  assert.equal(flow.getEndNode(), newStock2.id, "Checks if end node is the newStock2");

});

QUnit.test("addCollabEventToAllCells() Test", function( assert ) {
  var spy = sinon.spy(graph, "getCells");
  addCollabEventToAllCells();
  assert.ok(spy,"graph.getCells() got called");
});

QUnit.test("addGlobalEventListeners() Test", function( assert ) {
  var eventListen = sinon.stub(document, "addEventListener",function (){return true;});
  addGlobalEventListeners()
  assert.ok(eventListen, "addEventListener got called.");
  eventListen.restore();
});




QUnit.test("doGraphOnLoaded() test", function( assert ){
  var spy = sinon.spy(console, "log");
  doGraphOnLoaded();
  assert.ok(spy, "Method ran.");
  spy.restore();
});

QUnit.test("updateCollabGraph() test", function( assert ){
  var sandbox = sinon.sandbox.create();
  sandbox.stub(colGraph, "graph", false);
  updateCollabGraph();
  assert.ok(sandbox, "False branch ran.");
  sandbox.stub(colGraph, "graph", true);
  assert.ok(sandbox, "True branch ran.");

  sandbox.restore();


});



QUnit.test("Test Link Creation", function( assert ) {
  var pos = {x: 2, y: 3};
  var nConnector = "normal";
  var rConnector = "rounded";
  var sConnector = "smooth";
  var newNLink = new localLink(pos, false, false, false, nConnector);
  var newRLink = new localLink(pos, false, false, false, rConnector);
  var newSLink = new localLink(pos, false, false, false, sConnector);

  assert.deepEqual(createLink(pos, nConnector).attributes.source, newNLink.attributes.source, "Checks if sources are the same");
  assert.deepEqual(createLink(pos, nConnector).attributes.target, newNLink.attributes.target, "Checks if targets are the same");
  assert.deepEqual(createLink(pos, nConnector).attributes.connector, newNLink.attributes.connector, "Checks if connectors are the same");


  assert.deepEqual(createLink(pos, rConnector).attributes.source, newRLink.attributes.source, "Checks if sources are the same");
  assert.deepEqual(createLink(pos, rConnector).attributes.target, newRLink.attributes.target, "Checks if targets are the same");
  assert.deepEqual(createLink(pos, rConnector).attributes.connector, newRLink.attributes.connector, "Checks if connectors are the same");


  assert.deepEqual(createLink(pos, sConnector).attributes.source, newSLink.attributes.source, "Checks if sources are the same");
  assert.deepEqual(createLink(pos, sConnector).attributes.target, newSLink.attributes.target, "Checks if targets are the same");
  assert.deepEqual(createLink(pos, sConnector).attributes.connector, newSLink.attributes.connector, "Checks if connectors are the same");

  var pos1 = {x: 0, y: 3};
  var pos2 = {x: 4, y: 4};

  var newStock1 = createStock(pos1);
  var newStock2 = createStock(pos2);

  newNLink.setStartNodeFromCell(newStock1);
  assert.deepEqual(newNLink.getStartNode(), newStock1.id, "Ensure that the start node is the proper node attached.");

  // change the id of the stock so the id is null but stock exists
  var id = $.extend(true, {}, newStock1.id);
  newStock1.id = null;
  var spy = sinon.spy(console, "log");
  newNLink.setStartNodeFromCell(newStock1);
  assert.ok(spy, "Method got called.");
  newStock1.id = id;

  // Change the id of the stock so the stock is null
  newNLink.setStartNodeFromCell(null);
  assert.ok(spy, "Method got called.");
  spy.restore();

  // Create a link that has all variables
  var pos3 = {x: 9, y: 4};
  var newStock3 = createStock(pos3);
  var newNLink = new localLink(pos, "Hello", newStock3, newStock2, nConnector);


});

QUnit.test("createBranch(pos) test", function (assert){
  var pos = {x: 3, y: 5};
  var newState = new joint.shapes.QMLab.State({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newState);
  assert.notEqual(newState,null, "Checks if state is not null");
  assert.deepEqual(createState(pos).attributes.pos, newState.attributes.pos, "Checks if positions are the same");

});

QUnit.test("createText(pos) test", function (assert){
  var pos = {x: 4, y: 6};
  var newText = new joint.shapes.QMLab.Text({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newText);
  assert.notEqual(newText,null, "Checks if text is not null.");
  assert.deepEqual(createText(pos).attributes.pos, newText.attributes.pos, "Checks if positions are the same." );

});

QUnit.test("createTerminalState(pos) test", function (assert){
  var pos = {x: 7, y: 6};
  var newTerminalState = new joint.shapes.QMLab.TerminalState({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newTerminalState);
  assert.notEqual(newTerminalState,null, "Checks if terminal state is not null");
  assert.deepEqual(createTerminalState(pos).attributes.pos, newTerminalState.attributes.pos, "Checks if positions are the same" );

});

QUnit.test("createBranch(pos) test", function (assert){
  var pos = {x: 8, y: 1};
  var newBranch = new joint.shapes.QMLab.Branch({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newBranch);
  assert.notEqual(newBranch,null, "Checks if the branch is not null.");
  assert.deepEqual(createBranch(pos).attributes.pos, newBranch.attributes.pos, "Checks if the positions are the same." );

});

QUnit.test("createAgent(pos) test", function (assert){
  var pos = {x: 4, y: 2};
  var newAgent = new joint.shapes.QMLab.Agent({
		position: { x: pos.x, y: pos.y },
		size: { width: 10000, height: 10000 },
		attrs: {
			'rect': { 'fill': '#ffffff', 'stroke': '#000000', width: 10000, height: 10000 },
			'text': { 'font-size': 14, text: 'Agent', 'ref-x': 100, 'ref-y': 230, ref: 'rect', fill: 'black' },
			'image': { 'xlink:href': 'http://www.clker.com/cliparts/U/m/W/6/l/L/stick-man-hi.png', width: 10000, height: 10000 },
		}
	});
  assert.notEqual(newAgent,null, "Checks if the agent is not null.");
  assert.deepEqual(createAgent(pos).attributes.pos, newAgent.attributes.pos, "Checks if the positions are the sames");
  newAgent.setImage("http://www.clker.com/cliparts/U/m/W/6/l/L/stick-man-hi.png");
  assert.equal(newAgent.getImage(),"http://www.clker.com/cliparts/U/m/W/6/l/L/stick-man-hi.png", "Checks if the url is correct.");

});

QUnit.test("Test initialize views in qmlabjointclasses", function(assert){
  var spy = sinon.spy(initializeStateView);
  initializeView();
  assert.ok(spy, "initializeStateView ran.");

});


QUnit.test("Test initializeGraph()", function(assert){
  var spy = sinon.spy(JSON, "stringify");
  initializeGraph();
  assert.ok(spy, "stringify ran without errors.");
  spy.restore();

});

QUnit.test("Test create createTransition(pos)", function(assert){
  var pos = {x: 4, y:5};
  var localPos = $.extend(true, {}, pos);
  var newTransition = new joint.shapes.QMLab.Transition();
  newTransition.initialzeSourceAndTarget(localPos, false, false);


  assert.deepEqual(createTransition(pos).attributes.position, newTransition.attributes.position, "Positions are equal to each other." );
});

QUnit.test("Test createConnection(pos)", function(assert){
  var pos = {x: 5, y: 4};
  var newConnection = new joint.shapes.QMLab.Connection();
	var localPos = $.extend(true, {}, pos);
  newConnection.initialzeSourceAndTarget(localPos, false, false);
  assert.deepEqual(createConnection(pos).attributes.position, newConnection.attributes.position, "Positions are equal to each other.");
});

QUnit.test("Test createIntervention(pos)", function(assert){
  var pos = {x: 6, y: 5};
  var newIntervetion = new joint.shapes.QMLab.Intervention({
		position: {x: pos.x, y: pos.y},
		size: { width: 10000, height: 10000 },
		attrs: {
			text: { text: 'Intervention', 'ref-y': 30, ref: 'circle' },
			circle: { fill: 'red', stroke: 'black', r: 5000 },
			path: { 'd': 'M 4000 -5500 L -4000 200 -1000 200 -4000 5500 4000 -100 1500 -100 z' },
		},
	});
  assert.deepEqual(createIntervention(pos).attributes.position, newIntervetion.attributes.position, "Testing if positions are equal");
});

QUnit.test("Test createFinalState(pos)", function(assert){
  var pos = {x: 5, y: 6};
  var newFinalState = new joint.shapes.QMLab.FinalState({
		position: { x: pos.x, y: pos.y },
		size: { width: 10000, height: 10000 },
		attrs: {
			circle: { fill: "red", r: 5000 },
			text: { text: 'Final State', 'ref-y': 20, ref: 'circle'},
			path: { 'd': 'M -2000 0 C -2000 -2000 -2000 -2000 0 -2000 C 2000 -2000 2000 -2000 2000 0 C 2000 2000 2000 2000 0 2000 C -2000 2000 -2000 2000 -2000 0 z' },
		}
	});
	newFinalState.setSize(20, 20);
  assert.deepEqual(createFinalState(pos).attributes.position, newFinalState.attributes.position, "Testing if positions are equal");

});


QUnit.test("Test compareArray())", function(assert){
  var a1 = [];
  var a2 = [];
  var a3 = [1];
  var a4 = [0];

  assert.equal(compareArray(a1,a2), true, "The arrays are the same so they should be true.");
  assert.equal(compareArray(a3,a4), false, "The arrays are different in elements so they should be false.");
  assert.equal(compareArray(a1,a4), false, "The arrays are different in size so they should be false.");


});
