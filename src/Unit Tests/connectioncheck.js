/*
	This function uses an interval to check and see if the user has lost their internet connection.
	If this is the case, this function hides the diagram to prevent the user from making any more edits,
	then displays an alert telling them they've been disconnected. 
	
	It then clears the interval it was using, and sets up a new one to check if the user has reconnected.
	
	pre: The html page should be loaded. 
	     The user should not already be known to be offline.
	      
	post: The user's online status has been checked. 
	      If they are offline, the interval checking their offline status stops, the paper is hidden,
		  and a new interval is set up to check whether the user has re-established the connection

	*/
	function checkAndFreeze(){
		if(!navigator.onLine){
			document.getElementById("paperView").style.display = "none";
			alert("You have gone offline and your session has been frozen. Please Reconnect to continue editing.");
			restore = setInterval(checkAndRestore, 1000);
			clearInterval(freeze);
		}

	}
	
	/*
	This function uses an interval to check and see if the user has regained their internet connection.
	If this is the case, this function updates the graph, shows the diagram and allows them to continue editting,
	then displays an alert telling them they've been reconnected. 
	
	It then clears the interval it was using, and sets up a new one to check if the user has disconnected again.
	
	This function generally should never be called if the user isn't detected to have lost internet connectivity.
	
	pre: The html page should be loaded. 
	     The user should have been known to be offline.
	      
	post: The user's online status has been checked. 
	      If they are online, the interval checking their offline status stops, the paper is shown,
		  the graph is updated, and a new interval is set up to check whether the user has re-established the connection

	*/
	function checkAndRestore(){
		if(navigator.onLine){
			updateGraph();
			document.getElementById("paperView").style.display = "block";
			alert("You have	re-connected. Editing is re-enabled.");
			freeze = setInterval(checkAndFreeze, 1000);
			clearInterval(restore);
		}
	}