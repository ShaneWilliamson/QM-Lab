//////////////////////////////
// utility_functions_qm_lab //
//////////////////////////////
/**
 * Variety of helpful function
 * @class utility_functions_qm_lab
 */

/**
 * Takes an object and adds an event to it
 * @param {object}   object   an object we'd like to attach an event to
 * @param {string}   type     the type of the object
 * @param {event} callback the event we are attaching to the object
 * @preconditions object can have an event listener attached to it
 * @postconditions object has an event callback attached to it (if the object
 *   exists), otherwise, nothing
 * @memberOf utility_functions_qm_lab
 */
var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

/**
 * Compares two arrays and if they are the same, return true
 * @param  {array} a1 an array of values
 * @param  {array} a2 an array of values
 * @return {bool}    true if same array, false otherwise
 * @preconditions a1 and a2 are valid arrays with objects in them
 * @memberOf utility_functions_qm_lab
 */
function compareArray(a1, a2) {
	if (a1.length === a2.length) {
		var retVal = true;
		for (var i = 0; i < a1.length; i++){
			if (a1[i] != a2[i]) {
				retVal = false;
			}
		}
		return retVal;
	} else {
		return false;
	}
}

function smartRect(startX, startY, endX, endY) {
	var rect = {};

	if (endX >= startX) {
		rect["x"] = startX;	
	} else {
		rect["x"] = endX;
	}
	rect["width"] = Math.abs(endX - startX);
	
	
	if (endY >= startY) {
		rect["y"] = startY;
	} else {
		rect["y"] = endY;
	}
	rect["height"] = Math.abs(endY - startY);
	
	return rect;
}


function getHighlightedItems() {
	var svg = $("svg")[0];
	var children = svg.getElementsByTagName("*");
	var highlightedItems = [];

	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		var isHighlighted = child.classList.contains("highlighted");

		if (isHighlighted) {
			highlightedItems.push(child);
		}
	}

	return highlightedItems;
}
