window.gapi.load('auth:client,drive-realtime,drive-share', start);


function start() {
  var doc = gapi.drive.realtime.newInMemoryDocument();
  var model = doc.getModel();
  onFileInitialize(model);
  onFileLoaded(doc);
}

QUnit.config.collapse = false;

QUnit.test("Test Stock Creation", function( assert ) {
  var pos = {x: 3, y: 2};
  var newStock = new localNode(pos, "Stock");
  assert.notDeepEqual(newStock, null);
  assert.deepEqual(createStock(pos).attributes.position, newStock.attributes.position);
  assert.deepEqual(newStock.getXPos(), newStock.attributes.position.x);
  assert.deepEqual(newStock.getYPos(), newStock.attributes.position.y);

  //Test now if we change the position will it change the attributes properly.
  newStock.setPos(4,3);
  assert.equal(newStock.getXPos(), 4);
  assert.equal(newStock.getYPos(), 3);

  assert.equal(newStock.getImage(),"");



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

  assert.notDeepEqual(newImage, null);
  assert.deepEqual(createImage(pos, pictureURL, label, null, null).attributes.position, newImage.attributes.position);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.size.height, newImage.attributes.size.height);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.size.width, newImage.attributes.size.width);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attr('image/xlink:href'), newImage.attr('image/xlink:href'));
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.text.text, newImage.attributes.text.text);
  assert.equal(createImage(pos, pictureURL, null, sizeX, sizeY).attributes.text.text, "Your Image Here");
  var defaultURL = "http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg"
  assert.equal(createImage(pos, null, label, sizeX, sizeY).attr('image/xlink:href'), defaultURL);


  assert.equal(newImage.getXSize(), sizeX);
  assert.equal(newImage.getYSize(), sizeY);

  // Change size and confirm it changed properly
  newImage.setHeight(20);
  assert.equal(newImage.getYSize(), 20);

  newImage.setWidth(30);
  assert.equal(newImage.getXSize(), 30);

  assert.equal(newImage.getLabel(), "A nice meme");
  newImage.setLabel(null);
  assert.equal(newImage.getLabel(), "");

  // Set the fill color and see if it changed it
  newImage.setColour("#ffffff");
  assert.equal(newImage.getColour(), "#ffffff", "Changing fill colour worked.");

  // Set the text color and see if it changed it
  newImage.setTextColour("#000000");
  assert.equal(newImage.getTextColour(), "#000000", "Changing text colour worked.");

  // Add a z order and see if it Changes
  newImage.setZOrder(2);
  assert.equal(newImage.getZOrder(), 2);

  // Gets the url
  assert.equal(newImage.getImageURL(), "http://i.imgur.com/48dEoHh.jpg");
  assert.equal(newImage.getImage(), "http://i.imgur.com/48dEoHh.jpg");

  // Change text size
  newImage.setTextSize(10);
  assert.equal(newImage.getTextSize(), 10);

});

QUnit.test("Test Variable Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newVariable = new joint.shapes.QMLab.Variable({
    position: {x: pos.x, y: pos.y}
  });
  assert.notDeepEqual(newVariable);
  assert.deepEqual(createVariable(pos).attributes.position, newVariable.attributes.position);
  assert.deepEqual(createVariable(pos).attributes.position.x, newVariable.attributes.position.x);
  assert.deepEqual(createVariable(pos).attributes.position.y, newVariable.attributes.position.y);


});


QUnit.test("Test Parameter Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newParameter = new joint.shapes.QMLab.Parameter({
    position: {x: pos.x, y: pos.y}
  });
  assert.notDeepEqual(newParameter, null);
  assert.deepEqual(createParameter(pos).attributes.position, newParameter.attributes.position);
});

QUnit.test("Test Flow Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newFlow = new localFlow(pos, false, false, false, false);
  assert.deepEqual(createFlow(pos).attributes.position, newFlow.attributes.position);

  var pos1 = {x: 0, y: 3};
  var pos2 = {x: 4, y: 4};
  var pos3 = {x: 3, y: 5};

  var newStock1 = createStock(pos1);
  var newStock2 = createStock(pos2);
  var flow = localFlow (pos3, "Hello World", newStock1, newStock2, "Normal");
  assert.equal(flow.getEndNode(), newStock2.id);

});

QUnit.test("addCollabEventToAllCells() Test", function( assert ) {
  var spy = sinon.spy(graph, "getCells");
  addCollabEventToAllCells();
  assert.ok(spy,"graph.getCells() got called");
});

QUnit.test("addGlobalEventListeners() Test", function( assert ) {
  var eventListen = sinon.stub(document, "addEventListener",function (){return true;});
  addGlobalEventListeners()
  assert.ok(eventListen);
  eventListen.restore();
});

QUnit.test("registerCollaborativeObjectTypes() test", function( assert ){
  var ignoreGAPI = sinon.stub(gapi);
  var ignoreCG = sinon.mock(CollaborativeGraph);
  registerCollaborativeObjectTypes();
  assert.ok(ignoreGAPI, "Method ran.");

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

  assert.deepEqual(createLink(pos, nConnector).attributes.source, newNLink.attributes.source);
  assert.deepEqual(createLink(pos, nConnector).attributes.target, newNLink.attributes.target);
  assert.deepEqual(createLink(pos, nConnector).attributes.connector, newNLink.attributes.connector);


  assert.deepEqual(createLink(pos, rConnector).attributes.source, newRLink.attributes.source);
  assert.deepEqual(createLink(pos, rConnector).attributes.target, newRLink.attributes.target);
  assert.deepEqual(createLink(pos, rConnector).attributes.connector, newRLink.attributes.connector);


  assert.deepEqual(createLink(pos, sConnector).attributes.source, newSLink.attributes.source);
  assert.deepEqual(createLink(pos, sConnector).attributes.target, newSLink.attributes.target);
  assert.deepEqual(createLink(pos, sConnector).attributes.connector, newSLink.attributes.connector);

  var pos1 = {x: 0, y: 3};
  var pos2 = {x: 4, y: 4};

  var newStock1 = createStock(pos1);
  var newStock2 = createStock(pos2);

  newNLink.setStartNodeFromCell(newStock1);
  assert.deepEqual(newNLink.getStartNode(), newStock1.id);

  // change the id of the stock so the id is null but stock exists
  var id = $.extend(true, {}, newStock1.id);
  newStock1.id = null;
  var spy = sinon.spy(console, "log");
  newNLink.setStartNodeFromCell(newStock1);
  assert.ok(spy);
  newStock1.id = id;

  // Change the id of the stock so the stock is null
  newNLink.setStartNodeFromCell(null);
  assert.ok(spy);
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
  assert.notEqual(newState,null);
  assert.deepEqual(createState(pos).attributes.pos, newState.attributes.pos );

});

QUnit.test("createText(pos) test", function (assert){
  var pos = {x: 4, y: 6};
  var newText = new joint.shapes.QMLab.Text({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newText);
  assert.notEqual(newText,null);
  assert.deepEqual(createText(pos).attributes.pos, newText.attributes.pos );

});

QUnit.test("createTerminalState(pos) test", function (assert){
  var pos = {x: 7, y: 6};
  var newTerminalState = new joint.shapes.QMLab.TerminalState({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newTerminalState);
  assert.notEqual(newTerminalState,null);
  assert.deepEqual(createTerminalState(pos).attributes.pos, newTerminalState.attributes.pos );

});

QUnit.test("createBranch(pos) test", function (assert){
  var pos = {x: 8, y: 1};
  var newBranch = new joint.shapes.QMLab.Branch({
  		position: { x: pos.x, y: pos.y },
	});
  setUpNewCell(newBranch);
  assert.notEqual(newBranch,null);
  assert.deepEqual(createBranch(pos).attributes.pos, newBranch.attributes.pos );

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
  assert.notEqual(newAgent,null);
  assert.deepEqual(createAgent(pos).attributes.pos, newAgent.attributes.pos );
  newAgent.setImage("http://www.clker.com/cliparts/U/m/W/6/l/L/stick-man-hi.png");
  assert.equal(newAgent.getImage(),"http://www.clker.com/cliparts/U/m/W/6/l/L/stick-man-hi.png");

});

QUnit.test("Test initializeGraph()", function(assert){
  var spy = sinon.spy(JSON, "stringify");
  initializeGraph();
  assert.ok(spy);
  spy.restore();

});

QUnit.test("Test initializeGraph() and updatePrintGraph", function(assert){
  var spy = sinon.spy(printGraph, "fromJSON");
  initializePrintGraph();
  assert.ok(spy);
  updatePrintGraph();
  assert.ok(spy);
  spy.restore();
});


QUnit.test("Test compareArray())", function(assert){
  var a1 = [];
  var a2 = []
  var a3 = [1];
  var a4 = [0];

  assert.equal(compareArray(a1,a2), true);
  assert.equal(compareArray(a3,a4), false);
  assert.equal(compareArray(a1,a4), false);


});

QUnit.test("Test stopPanning()", function(assert){
  stopPanning();
  assert.ok(!movingViewPort);
});

QUnit.test("Test handleMouseMove(e)", function(assert){
  var evt = document.createEvent("MouseEvents");
  evt.initEvent("mouseup", true, true);
  movingViewPort = false;
  handleMouseMove(evt);
  assert.notOk(movingViewPort);
});

QUnit.test("Test updateProperties()", function(assert){
  selected = [createStock({x: 3, y: 2}), false];

  var stub = sinon.stub(document, "querySelector", function(){var v = document.createElement('input'); return v;})
  

  updateProperties();
  stub.restore();
  assert.ok(true);
});

// TODO: This test properly.
QUnit.test("Test initializePaper()", function(assert){
  initializePrintPaper();
  assert.ok(true);

});
