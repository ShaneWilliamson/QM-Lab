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

Qunit.test("Test Image Creation", function( assert ) {
  var pos = {x: 4, y: 5};
  var pictureURL = "http://i.imgur.com/48dEoHh.jpg";
  var label = "A nice meme";
  var sizeX = 300;
  var sizeY = 500;
  var newImage = new joint.shapes.QMLab.ImageNode({
    position: { x: pos.x, y: pos.y },
  });
  newImage.setSize(sizeX, sizeY);
  assert.deepEqual(createImage(pos, pictureURL, label, sizeX, sizeY), newImage);

});
