
var lastLink;


/**
 * If there is an element under the mouse when this function is called the given link will have that slement set to be it's "source" element, the "target" side of the link will then follow the mouse and be set to the element or position under the mouse on the next mouse down event
 * @param  {newLink} is a valid link
 * @preconditions newLink is a valid link and has not been called in the setUpNewCell function, this will not work if called after setUpNewCell
 * @postconditions If the new link was created over an element, that element will become the source of the link and mouse listeners for on mouse down on will be added to the paper calling linkTargeter, and an on mouse move event listener will be added to the paper dic which will call mouseTracker
 * @memberOf linkJoining
 */
function targetFollowing(newLink){

	var objectAtPoint = graph.findModelsFromPoint(curMousePos);
	if(typeof objectAtPoint[0] !== 'undefined')
	{
		console.log(newLink);
		lastLink = newLink;
		console.log("test");
		console.log(objectAtPoint[0]);
		lastLink.set('source', {id: objectAtPoint[0].id});

		var paperDiv = document.getElementById("paperView");
		paperDiv.addEventListener("mousemove", mouseTracker);
		paper.$el.on('mousedown', linkTargeter);
		console.log(lastLink);
	}
	
}

/**
 * Sets the target of the global variable lastLink to be the current position of the mouse cursor with a small offset so the user can not click on the link
 * @param  {e} is the event that called mouseTracker 
 * @preconditions global variable lastLink is a valid link
 * @postconditions The new target of the global variable lastLink will be set to the current position of the mouse cursor with a small offset of -10 x 
 * @memberOf linkJoining
 */
function mouseTracker(e){
	updateMousePos(e);
	lastLink.set('target', { x:curMousePos.x -15 , y:curMousePos.y  });
}

/**
 * Sets the target of the global variable lastLink to be either the current location of the mouse cursor, or the element that is currently under the mouse cursor if there is an element there
 * @param  {e} is the event that called linkTargeter
 * @preconditions global variable lastLink is a valid link
 * @postconditions The new target of the global variable lastLink will be set to be either the current location of the mouse cursor, or the element that is currently under the mouse cursor if there is an element there. lastLink will then be set to null and the event listeners for linkTargeter and mouseTracker will be removed
 * @memberOf linkJoining
 */
function linkTargeter(e){
	updateMousePos(e);
	console.log(curMousePos);
	var objectAtPoint = graph.findModelsFromPoint(curMousePos);
	if(typeof objectAtPoint[0] !== 'undefined')
	{
		lastLink.set('target', {id: objectAtPoint[0].id});
	}
	else
	{
		lastLink.set('target', {x:curMousePos.x  , y:curMousePos.y  });
	}
	var paperDiv = document.getElementById("paperView");
	paperDiv.removeEventListener("mousemove", mouseTracker);
	lastLink = null; 

}