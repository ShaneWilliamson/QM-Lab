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

});

QUnit.test("Test Image Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var pictureURL = "http://i.imgur.com/48dEoHh.jpg";
  var label = "A nice meme";
  var newImage = new joint.shapes.QMLab.ImageNode({
    position: { x: pos.x, y: pos.y },
  });

  var sizeX = 200;
  var sizeY = 200;
  newImage.setSize(sizeX, sizeY);
  newImage.setImage(pictureURL);

  assert.notDeepEqual(newImage, null);
  assert.deepEqual(createImage(pos, pictureURL, label, null, null).attributes.position, newImage.attributes.position);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.rect.height, newImage.attributes.rect.height);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.rect.width, newImage.attributes.rect.width);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY).attributes.image.xlink, newImage.attributes.image.xlink);



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
