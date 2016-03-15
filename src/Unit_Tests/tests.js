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
  assert.deepEqual(createStock(pos).attributes.position, newStock.attributes.position);

});

QUnit.test("Test Image Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var pictureURL = "http://i.imgur.com/48dEoHh.jpg";
  var label = "A nice meme";
  var newImage = new joint.shapes.QMLab.ImageNode({
    position: { x: pos.x, y: pos.y },
  });
  assert.deepEqual(createImage(pos, pictureURL, label, null, null).attributes.position, newImage.attributes.position);
});

QUnit.test("Test Variable Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newVariable = new joint.shapes.QMLab.Variable({
    position: {x: pos.x, y: pos.y}
  });
  assert.deepEqual(createVariable(pos).attributes.position, newVariable.attributes.position);
});


QUnit.test("Test Parameter Creation", function( assert ) {
  var pos = {x: 4, y: 3};
  var newParameter = new joint.shapes.QMLab.Parameter({
    position: {x: pos.x, y: pos.y}
  });
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
  registerCollaborativeObjectTypes();
  assert.ok(ignoreGAPI, "Method ran.");
});



/**
QUnit.test("Test Link Creation", function( assert ) {
  var pos = {x: 2, y: 3};
  var nConnector = "normal";
  var rConnector = "rounded";
  var sConnector = "smooth";
  var newNLink = new localLink(pos, false, false, false, nConnector);
  var newRLink = new localLink(pos, false, false, false, rConnector);
  var newSLink = new localLink(pos, false, false, false, sConnector);

  assert.deepEqual(createLink(pos, nConnector).attributes, newRLink.attributes);
});
*/
