/*
* These functions are meant to grab the details of and alter values of elements
* in the graph
*/

//the id of the currently selected element, starts off unselected
var selectId = null;
//The object that we currently have selected
var selectElement = null;



function initChangeBox()
{
	//add a mouse listener to the paper so that on mouse down we can check the point
	//the mouse is at to see if an element exists there
	 var paperDiv = document.getElementById('paperView');
	paperDiv.addEventListener("mousedown",getSelectedElementFromGraph); 

}
/**
 * Finds the element in the paper that was clicked and populates the properties box with the 
 * values from that element
 * @preconditions The window has loaded the proper html file. 
 * @postconditions the properties form will contain the properties of the selected element assuming there was one
 */
function getSelectedElementFromGraph(e){
	//update mouse position so we know we are clicking the right spot
	updateMousePos(e);
	//make an array to hold the results of findModelsFromPoint 
	var tempArray = graph.findModelsFromPoint(curMousePos);
	//make sure there is atleast one element in the array before taking more action
	if(tempArray.length >= 1)
	{

		//take the first element of the array as the selected element
		selectElement = tempArray[0];
		
		//selectId = selectElement.id; //We don't really use the id for anything so it is commented out
		//console.log((document.getElementById("propertiesForm")).getElementsByTagName("*"));
		
		//Get the properties form
		var Propform = (document.getElementById("propertiesForm")).getElementsByTagName("*");	
		//Set the appropriate values for each field
		//this field is the text field 
		Propform[9].value =selectElement.attr('text/text');
		//this field is the width field
		Propform[13].value =selectElement.attr('rect/width');
		//this field is the height field
		Propform[17].value =selectElement.attr('rect/height');
		//this field is the depth field (I ma not sure what this is for so it is set to be 1 )
		Propform[21].value ="1"
		//this field is the colour field, not sure which value to use to fill it with
		//ask if it is text or background colour
		//Propform[21].textContent =selectElement.attr('rect/fill')
		
		//This is for the image url field
		//TODO check element type to ensure it is supposed to have an image
		Propform[30].value ="n/a"
	}
}

/**
 * Fills the selected elements with 
 * @preconditions An element has been selected. 
 * @postconditions the properties form will fill the selected element with the values from the form
 */
function setUpdatedProperties()
{
	if (selectId != null && selectElement != null)
	{
		//gets the properties form 
		var Propform = (document.getElementById("propertiesForm")).getElementsByTagName("*");
		//console.log(selectElement.attr('text/text'));
		//set the text, width, and height of the element
		selectElement.attr('text/text',Propform[9].value); 
		selectElement.attr('rect/width',Propform[13].value);
		selectElement.attr('rect/height',Propform[17].value);
	}
}