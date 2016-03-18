/////////////////////////
// initialize_web_page //
/////////////////////////
/**
 * Contains the model for intializing the document
 * @class initialize_web_page
 */

var graph;
var paper;
var paperScale;
var colGraph;
var rootModel;
var realDoc;
var loading;
var activeID;
var collaborativeChangeReceived;
var selected;
var movingViewPort;
var oldMousePos;
var curMousePos;


window.onload=onstartRun;

/**
 * Attach event listeners to all buttons, start Google's Realtime API.
 * @preconditions The window has loaded the proper html file. 
 * @postconditions The Google Realtime has ensured the user is logged into their Google account.
 * @memberOf initialize_web_page
 */
function onstartRun(){
	selected = {}
	authorize();
	freeze = setInterval(checkAndFreeze, 1000);
	initChangeBox();
	movingViewPort = false;
}
