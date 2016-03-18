/*
* These functions are meant to grab the details of and alter values of elements
* in the graph
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
	var selectedObj = selected[0];
	console.log(selectedObj);
	console.log(selectedObj.getXSize());
	console.log(selectedObj.getLabel());
	var formName = "propertiesFormId";
	
	var text = "";
	var textsize = "";
	var textcolour = "";
	var width = "";
	var height = "";
	var colour = "";
	var url = "";
	
	
	if (selectedObj) {
		console.log(selectedObj);
		console.log(selectedObj.getLabel());
		console.log(selectedObj.getLabel());
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
	
		document.querySelector('div[view_id="text"] input').value = text;
		document.querySelector('div[view_id="textsize"] input').value = textsize;
		document.querySelector('div[view_id="textcolor"] div.webix_input_icon').style.background = textcolour;
		document.querySelector('div[view_id="textcolor"] div.webix_inp_static').innerHTML = textcolour;
		document.querySelector('div[view_id="width"] input').value = width;
		document.querySelector('div[view_id="height"] input').value = height;
		document.querySelector('div[view_id="color"] div.webix_input_icon').style.background = colour;
		document.querySelector('div[view_id="color"] div.webix_inp_static').innerHTML = colour;
		document.querySelector('div[view_id="url"] input').value = url;

}