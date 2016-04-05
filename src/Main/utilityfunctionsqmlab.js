//////////////////////////////
// utility_functions_qm_lab //
//////////////////////////////
/**
 * Variety of helpful function
 * @todo finish adding contracts
 * @class utility_functions_qm_lab
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