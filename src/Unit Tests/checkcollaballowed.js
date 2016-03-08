/*
	This function resets the global state logic to allow changes made to cells to
	update their respective collaborative object once more.
	
	pre: 
	post: the global state should once more allow updates to collab objects
	*/
	function allowCollabRecording() {
		collaborativeChangeReceived = false;
	}
	
	/*
	This function changes the global state logic to not allow changes made to cells to
	update their respective collaborative object any more.
	
	pre: 
	post: the global state should not allow updates to collab objects
	*/
	function stopCollabRecording() {
		collaborativeChangeReceived = true;
	}
	
	/*
	This function returns true if the global state is currently set to allow local objects
	to update their collab counterparts.
	
	pre: 
	post: 
	return: if updates to collab objects are currently allowed
	*/
	function isCollabRecordingAllowed() {
		return collaborativeChangeReceived;
	}