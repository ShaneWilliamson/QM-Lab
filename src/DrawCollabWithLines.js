var boxes=[];
var currentBox;
var difx;
var dify;
var rootModel;
var rootList;
var clientId = '1073945779594-bpprsdgic2haajdb3ghqfcsuodnrc6ss.apps.googleusercontent.com';
var activeID;

//Authorization
if (!/^([0-9])$/.test(clientId[0])) {
	alert('Invalid Client ID - did you forget to insert your application Client ID?');
}
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
authorize();

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
	// With auth taken care of, load a file, or create one if there
	// is not an id in the URL.
	var id = realtimeUtils.getParam('id');
	//Register the Box object
	gapi.drive.realtime.custom.registerType(Box, 'Box');
	Box.prototype.x=gapi.drive.realtime.custom.collaborativeField('x');
	Box.prototype.y=gapi.drive.realtime.custom.collaborativeField('y');
	Box.prototype.selected = gapi.drive.realtime.custom.collaborativeField('selected');
	gapi.drive.realtime.custom.setInitializer(Box, doInitialize);
	Box.prototype.draw = function(){
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		ctx.fillStyle ="#FF0000";
		ctx.fillRect(this.x, this.y, 150,75);
		
		if (this.selected) { // is the current box selected
			ctx.strokeStyle = "#99ff99";
		} else {
			ctx.strokeStyle = "black";
		}

		ctx.strokeRect(this.x,this.y,150,75);
	};
	Box.prototype.move= function(x, y){
		var c= document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		//ctx.fillStyle="#FF0000";
		//ctx.clearRect(this.x-10,this.y-10,170,95);
		this.x=x;
		this.y=y;
		//this.draw();
	};
	gapi.drive.realtime.custom.setOnLoaded(Box, doOnLoaded);
	
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
	var colabBoxes = model.createList();
	model.getRoot().set('box_list', colabBoxes);
	
	
	
}

// After a file has been initialized and loaded, we can access the
// document. We will wire up the data model to the UI.
function onFileLoaded(doc) {
	var collaborativeList = doc.getModel().getRoot().get('box_list');
	collaborativeList.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, doValueAdded);
	rootModel = doc.getModel();
	rootList = rootModel.getRoot().get('box_list');
	reDraw();
	
}



//OBject Initialization and Load functions
function doInitialize(x, y){
	var model = gapi.drive.realtime.custom.getModel(this);
	this.x=x;
	this.y=y;
	this.selected = false;
}

function doOnLoaded(){
	this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, doValueChange);
}


// Collaborative Event Actions
function doValueChange(event){
	clearScreen();
	reDraw();
}
function doValueAdded(event){
	clearScreen();
	reDraw();
}

//Drawing
function clearScreen(){
	var c= document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.fillStyle="#FF0000";
	ctx.clearRect(0,0,1000,1000);	
}

function reDraw(){
	for(i=0; i<rootList.length; i++){
		rootList.get(i).draw();
	}
}



//Class definition of a Box
function Box(x, y){
}


//Mouse Events and Object Creation
function onMouseDown() {
	
	var x= event.clientX;
	var y= event.clientY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	var flag= 0;
	for(i=0; i<rootList.length; i++){
		var temp =rootList.get(i);
		if((x<=temp.x+150)&& (x>=temp.x)){
			if(y<=temp.y+75 && y>=temp.y){
				currentBox=rootList.get(i);
				flag=1;
				difx=x-temp.x; // ensures that the box doesn't snap to the mouse location
				dify=y-temp.y;
				break;
			}
		}
	}
	if(flag == 0) { // if there isn't a box on the clicked location
		drawRect();

	} else { // if there is a box on the clicked location
		
		for (var i = 0; i < rootList.length; i++) {
			rootList.get(i).selected = false;
		}
		currentBox.selected = true;
		clearScreen();
		reDraw();
		document.getElementById("myCanvas").addEventListener("mouseup",onMouseUp);
		document.getElementById("myCanvas").addEventListener("mousemove",moving);
	}
}
function onMouseUp(){
	var x= event.clientX;
	var y= event.clientY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	currentBox.move(x-difx,y-dify);
	document.getElementById("myCanvas").removeEventListener("mousemove",moving);
	document.getElementById("myCanvas").removeEventListener("mouseup",onMouseUp);
	for(i=0; i<rootList.length; i++){
		rootList.get(i).draw();
	}


}
function moving(){
	var x= event.clientX;
	var y= event.clientY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	currentBox.move(x-difx,y-dify);
	for(i=0; i<rootList.length; i++){
		rootList.get(i).draw();
	}
}
function drawRect(){;
	var x= event.clientX;
	var y= event.clientY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];

	var temp = rootModel.create(Box, x, y);
	rootList.push(temp);
	temp.draw();
}

function menuClick(){
	if(activeID != null && activeID != ""){
		document.getElementById(activeID).className="";
	}
	activeID= event.target.id;
	document.getElementById(activeID).className="active";
}

//Attach mouse listener on page load
function onstartRun(){
	document.getElementById("myCanvas").addEventListener("mousedown",onMouseDown);
	document.getElementById("box").addEventListener("mousedown",menuClick);
	document.getElementById("line").addEventListener("mousedown",menuClick);
	document.getElementById("circle").addEventListener("mousedown",menuClick);
}

function getCoords(x, y){
	var xOffset = x - document.getElementById("myCanvas").offsetLeft;
	var yOffset = y - document.getElementById("myCanvas").offsetTop;
	return [xOffset, yOffset];
}

window.onload=onstartRun;