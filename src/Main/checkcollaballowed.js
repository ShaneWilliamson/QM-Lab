//////////////////////////
// check_collab_allowed //
//////////////////////////
/**
 * Manages if a collaborative object can be changed or not
 * @class check_collab_allowed
 * @invariant the object can either be changed or not
 * @preconditions the object exists, the object is collaborative
 */

/**
 * This function resets the global state logic to allow changes made to cells to
 *   update their respective collaborative object once more.
 * @preconditions the object exists, the object is collaborative
 * @postconditions the object will allow changes
 * @memberOf check_collab_allowed
 */
function allowCollabRecording() {
	collaborativeChangeReceived = false;
}

/**
 * This function changes the global state logic to not allow changes made to
 *   cells to update their respective collaborative object any more.
 * @preconditions the object exists, the object is collaborative
 * @postconditions the object will not allow changes
 * @memberOf check_collab_allowed
 */
function stopCollabRecording() {
	collaborativeChangeReceived = true;
}

/**
 * @preconditions the object exists, the object is collaborative
 * @return {Boolean} if the object can be changed
 * @memberOf check_collab_allowed
 */
function isCollabRecordingAllowed() {
	return !collaborativeChangeReceived;
}
