/*
* These functions are meant to grab the details of and alter values of elements
* in the graph
*/

//the id of the currently selected element, starts off unselected
var selectId = null;
var selectElement = null;
var newPropText = null;
var newPropWidth = null;
var newPropHeight = null;
var newPropDepth = null;
var newPropColour = null;
var newPropImageUrl = null;
var newPropChange = null;


function initChangeBox()
{
	 var paperDiv = document.getElementById('paperView');
	paperDiv.addEventListener("mousedown",getSelectedElementFromGraph); 
 
	var selectId = null;
	var selectElement = null;
}
function getSelectedElementFromGraph(e){
	updateMousePos(e);
	var tempArray = graph.findModelsFromPoint(curMousePos);
	console.log(tempArray.length);
	if(tempArray.length >= 1)
	{
			console.log((tempArray[0]).attr("text/text"));
			console.log(tempArray[0]);
		selectElement = tempArray[0];
		selectId = selectElement.id;
		//console.log((document.getElementById("propertiesForm")).getElementsByTagName("*"));
		var Propform = (document.getElementById("propertiesForm")).getElementsByTagName("*");	
		Propform[9].value =selectElement.attr('text/text');
		Propform[13].value =selectElement.attr('rect/width');
		Propform[17].value =selectElement.attr('rect/height');
		Propform[21].value ="????"
		Propform[21].textContent =selectElement.attr('rect/fill')
		Propform[30].value ="n/a"
	}
}
function setUpdatedProperties()
{
	if (selectId != null && selectElement != null)
	{

	}
}