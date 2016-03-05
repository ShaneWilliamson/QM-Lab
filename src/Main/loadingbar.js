/*
	This function animates the green bar across the loading bar in a loop.
	pre: The loading bar must be contained in an html element with id="bar"
	post: An interval will be created that animates the green bar of the loading screen
	      looping along the loading bar.

	*/
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
	
	/*
	This function shows the animated loading bar and starts it animating. 
	
	pre: An HTML element with id="state" must exist
	     An HTML element with id="bar" must exist
		 An HTML element with id="progress" must exist
		 An HTML element with id="auth_button" must exist
	post: The loading bar will be made visible, it's animation started, 

	*/
	function displayLoadingScreen() {
		document.getElementById("state").style.display = "block";
		document.getElementById("bar").style.display = "block";
		document.getElementById("progress").style.display = "block";
		moveProgressBar();
	}

	/*
	This function hides the animated loading bar and stops it from further animating. 
	
	In addition, since it is assumed that the loading bar being stopped means that the document has finished 
	loading, the Authenication Button for Google's Realtime API is hidden.
	
	pre: An HTML element with id="state" must exist
	     An HTML element with id="bar" must exist
		 An HTML element with id="progress" must exist
		 An HTML element with id="auth_button" must exist
	post: The loading bar will be hidden, it's animation stopped, 
	      and the authenication button will be hidden.

	*/
	function clearLoadingScreen() {
		document.getElementById("state").style.display = "none";
		document.getElementById("bar").style.display = "none";
		document.getElementById("progress").style.display = "none";
		document.getElementById("auth_button").style.display = "none";
		clearInterval(loading);
	}
