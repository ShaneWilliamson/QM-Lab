////////////////////////
// element_prop_alter //
////////////////////////
/**
 * These functions are meant to grab the details of and alter values of elements
 *   in the graph.
 * @class element_prop_alter
 */

//the id of the currently selected element, starts off unselected
var selectId = null;
//The object that we currently have selected
var selectElement = null;


/**
 * Fills the text boxes in the property pane with the given values based on
 *   whether an object is selected or not
 * @preconditions If an object is selected, all proper fields have values and
 *   functions are declared
 * @postconditions The properties will be displayed to reflect whether an object
 *   is selected
 * @memberOf element_prop_alter
 */
function updateProperties() {
	genUI.genPropertiesForm();
	
	var selectedObj = selected[0];
	var formName = "propertiesFormId";
	
	var text = "";
	var textsize = "";
	var textcolour = "";
	var width = "";
	var height = "";
	var colour = "";
	var url = "";
	
	
	if (selectedObj) {
		text = selectedObj.getLabel();
		textsize = selectedObj.getTextSize();
		textcolour = selectedObj.getTextColour();
		width = selectedObj.getXSize();
		height = selectedObj.getYSize();
		colour = selectedObj.getColour();
		if (selectedObj.attributes.type === "QMLab.ImageNode" || selectedObj.attributes.type === "QMLab.Agent") {
			url = selectedObj.getImage();
		}
	}
	
	setPropertyDisplayValues(text, textsize, textcolour, width, height, colour, url)
}

/**
 * Fills the text boxes in the property pane with the given values
 * @param {string} text       the text it is being set to
 * @param {int} textsize   the size of the text
 * @param {color} textcolour the colour of the text
 * @param {int} width      the size of the element (horizontally)
 * @param {int} height     the size of the element (vertically)
 * @param {color} colour     the colour of the lement
 * @param {string} url        the url which it links to (a image)
 * @preconditions All textboxes and divs called exist in the DOM
 * @postconditions The properties will be displayed to reflect the values passed
 *   in.
 * @memberOf element_prop_alter
 */
function setPropertyDisplayValues(text, textsize, textcolour, width, height, colour, url) {
	
	setPropertyInputBoxValueIfExists('text', text);
	setPropertyInputBoxValueIfExists('textsize', textsize);
	setPropertyInputBoxValueIfExists('width', width);
	setPropertyInputBoxValueIfExists('height', height);
	setPropertyInputBoxValueIfExists('url', url);
	setPropertyColourPickerValueIfExists('textcolor', textcolour);
	setPropertyColourPickerValueIfExists('color', textcolour);
}

/**
 * Sets the input values of the property, if the object exists
 * @param {string} name  the name of the element
 * @param {string} value the value the input box is being set to
 * @preconditions the document exists
 * @invariant Nothing is changed if the input box does not exist
 * @history The input box only knows its most recent value
 * @memberOf element_prop_alter
 */
function setPropertyInputBoxValueIfExists(name, value) {
	var inputBox = document.querySelector('div[view_id="' + name + '"] input');
	if (inputBox){
		inputBox.value = value;
	}
}

/**
 * Sets the color values of the property, if the object exists
 * @param {string} name  the name of the element
 * @param {color} value the color the object is being set to
 * @preconditions the document exists
 * @invariant Nothing is changed if the input box does not exist
 * @history The input box only knows its most recent value
 * @memberOf element_prop_alter
 */
function setPropertyColourPickerValueIfExists(name, value) {
	var div = document.querySelector('div[view_id="' + name + '"] div.webix_input_icon');
	if (div){
		document.querySelector('div[view_id="' + name + '"] div.webix_input_icon').style.background = value;
		document.querySelector('div[view_id="' + name + '"] div.webix_inp_static').innerHTML = value;
	}

}