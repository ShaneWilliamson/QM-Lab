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

	/*
	Attach event listeners to all buttons, start Google's Realtime API.
	pre: The window has loaded the proper html file
	post: The Google Realtime has ensured the user is logged into their
	      Google account

	*/
	function onstartRun(){
		selected = {}
		authorize();
		freeze = setInterval(checkAndFreeze, 1000);

		movingViewPort = false;
	}