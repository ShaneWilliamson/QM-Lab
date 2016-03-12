
var clientId = '107414709467-qu9f2182pb7i3r7607cugihbiuua0e5v.apps.googleusercontent.com';

/*
	Google Realtime API check to ensure the application has been properly set up.
	Alerts the user if something has gone horribly wrong and no functionality 
	related to real-time collaboration will function.
	*/
	if (!/^([0-9])$/.test(clientId[0])) {
		alert('Invalid Client ID - did you forget to insert your application Client ID?');
	}
	
	/*
	Creates a new instance of Google's Realtime API utility with the client ID of QM-Lab
	This is used to shorten a great many function calls and document startup basics.
	*/
	var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

	// save the access token that uniquely identifies a user for a particular user of Google's api 
	var access_token = "";

	/*
	The Google Realtime API is called to ensure that the user is logged into a Google Account. 
	If the user is logged into a Google Account, attempts to load the QM-Lab document.
	If not logged in, the "Authorize" button has functionality added to it that prompts
	the user to log in. 
	
	pre: The HTML document should have just loaded when running this function. 
	     It should run at no other time
    post: Either the QM-Lab document loading has begun, 
	      or the "Authorize" button has had functionality added to it that allows 
		  the user to log in and then start the QM-Lab document loading.
	*/
	function authorize() {
		// Attempt to authorize
		realtimeUtils.authorize(function(response){
			access_token = response["access_token"];
			if(response.error){
				// Authorization failed because this is the first time the user has used your application,
				// show the authorize button to prompt them to authorize manually.
				var button = document.getElementById('auth_button');
				button.classList.add('visible');
				button.addEventListener('click', function () {
					realtimeUtils.authorize(function(response){
						startQM_DocumentLoad();
						access_token = response["access_token"];
					}, true);
				});
			} else {
				startQM_DocumentLoad();
			}
		}, false);
	}

	/*
	This function gives the user feedback that Google's Realtime API is attempting to load a document,
	initiates the back-end set up for properly using Google's Realtime API, then actually calls said API
	to load a document. 
	
	pre: The user MUST be logged into a Google Account
	post: A QM-Lab document will be loaded, and the page will have full use of Google's Realtime API
	*/
	function startQM_DocumentLoad() {
		displayLoadingScreen();
		registerCollaborativeObjectTypes();
		loadQM_Document();
		loadShareDialog();
	}
	
	function loadShareDialog() {
		var fileId = realtimeUtils.getParam('id');

		init = function() {
	        s = new gapi.drive.share.ShareClient();
	        s.setOAuthToken(access_token);
        	s.setItemIds([fileId]);
	    }	

		gapi.load('drive-share', init);
	}


	/*
	This function is in charge of loading or creating the QM-Lab document. 
	If it finds an "id" in the URL query, it will attempt to load that already made document.
	If it does not, it will create a new document and give it a unique "id". 
	
	pre: The HTML document has finished loading
	post: The GoogleRealtime document should be loaded and all collaborative functionality 
	      be properly engaged. 
	*/
	function loadQM_Document(){
		// With auth taken care of, load a file, or create one if there
		// is not an id in the URL.
		var id = realtimeUtils.getParam('id');
		if (id) {
		// Load the document id from the URL
			realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
		} else {
		//Check if it was loaded from google drive
			//The section in the path that contains the ID is enclosed with %5B"..."%5D
			var openDelim = "%5B%22";
			var closeDelim = "%22%5D";
			var url = window.location.href;
			var openIndex = url.indexOf(openDelim);
			var closeIndex = url.indexOf(closeDelim);
			if((openIndex != -1) && (closeIndex != -1)){
				//Slices out the id from the end of the open delimiter to the beginning of the end delimiter
				id = url.slice(openIndex + openDelim.length, closeIndex);
				//navigate to the existing page and re-run existing code for loading the page
				window.location.replace("?id=" + id);
				//existing code for loading the page
				id = realtimeUtils.getParam('id');
				realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
			}else {
				// Create a new document, add it to the URL
				realtimeUtils.createRealtimeFile('New QM-Lab File', function(createResponse) {
					window.history.pushState(null, null, '?id=' + createResponse.id);
					realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
				});
			}
		}
	}