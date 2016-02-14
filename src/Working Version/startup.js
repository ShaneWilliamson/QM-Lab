var rootModel;
var rootList;
var realDoc;
var clientId = '1073945779594-bpprsdgic2haajdb3ghqfcsuodnrc6ss.apps.googleusercontent.com';
var canvas;
var ctx;
var freeze;
var restore;
var loading;

window.onload=onstartRun;

function onstartRun(){
	document.getElementById("state").innerHTML="Loading";
	moveProgressBar();
	freeze = setInterval(checkAndFreeze, 1000);
	
}
//Continuously checks that the user is online. If the user goes offline editing is disabled.
function checkAndFreeze(){
	if(!navigator.onLine){
		document.getElementById("cover").style.zIndex = "10";
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
		document.getElementById("cover").style.zIndex = "-20";
		//document.getElementById("state").innerHTML="Online";
		alert("You have	re-connected. Editing is re-enabled.");
		freeze = setInterval(checkAndFreeze, 1000);
		clearInterval(restore);
	}
}

//Adds all the mouse listeners to the canvas
function addCanvasListeners() {
	document.getElementById("myCanvas").style.display = "block";
	document.getElementById("state").style.display = "none";
	clearInterval(loading);
	document.getElementById("bar").style.display = "none";
	document.getElementById("progress").style.display = "none";
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	document.getElementById("myCanvas").addEventListener("mousedown",onMouseDown);
	document.getElementById("box").addEventListener("mousedown",menuClick);
	document.getElementById("line").addEventListener("mousedown",menuClick);
	document.getElementById("circle").addEventListener("mousedown",menuClick);
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

//Authorization
if (!/^([0-9])$/.test(clientId[0])) {
	alert('Invalid Client ID - did you forget to insert your application Client ID?');
}
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
authorize();

function authorize() {
	// Attempt to authorize
	//Can't do before it loads
	//document.getElementById("loadState").innerHTML = "Attempting to Authorize";
	realtimeUtils.authorize(function(response){
		if(response.error){
			// Authorization failed because this is the first time the user has used your application,
			// show the authorize button to prompt them to authorize manually.
			var button = document.getElementById('auth_button');
			//button.classList.add('visible');
			button.style.visibility = "visible";
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
	document.getElementById('auth_button').style.display = "none";
	var id = realtimeUtils.getParam('id');
	//Call Realtime constructors for custom objects
	registerBox();
	
	
	
	if (id) {
		document.getElementById("state").innerHTML="Loading Document From URL";
	// Load the document id from the URL
		realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
	//Add code to check for the ID if loaded from drive
	} else {
		document.getElementById("state").innerHTML="Creating New Document";
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
	realDoc = doc;
	reDraw();
	addCanvasListeners();
}