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
 * Fills the text boxes in the property pane with the given values based on whether an object is selected or not
 * @preconditions If an object is selected, all proper fields have values and functions are declared
 * @postconditions The properties will be displayed to reflect whether an object is selected
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
 * @preconditions All textboxes and divs called exist in the DOM 
 * @postconditions The properties will be displayed to reflect the values passed in.
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


function setPropertyInputBoxValueIfExists(name, value) {
	var inputBox = document.querySelector('div[view_id="' + name + '"] input');
	if (inputBox){
		inputBox.value = value;
	}
}

function setPropertyColourPickerValueIfExists(name, value) {
	var div = document.querySelector('div[view_id="' + name + '"] div.webix_input_icon');
	if (div){
		document.querySelector('div[view_id="' + name + '"] div.webix_input_icon').style.background = value;
		document.querySelector('div[view_id="' + name + '"] div.webix_inp_static').innerHTML = value;
	}

}