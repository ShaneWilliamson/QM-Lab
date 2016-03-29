
var lastLink;
var isFlow;
var isCurved;
var isStraight;
var hasMoved;

const LINK_OFFSET_X = 15;
const LINK_OFFSET_Y = 15;

/**
 * If there is an element under the mouse when this function is called the given link will have that slement set to be it's "source" element, the "target" side of the link will then follow the mouse and be set to the element or position under the mouse on the next mouse down event
 * @param  {newLink} is a valid link
 * @preconditions newLink is a valid link and has not been called in the setUpNewCell function, this will not work if called after setUpNewCell
 * @preconditions linkType is a string that describes the string that is passed in, either straight, curved, or flow
 * @postconditions If the new link was created over an element, that element will become the source of the link and mouse listeners for on mouse down on will be added to the paper calling linkTargeter, and an on mouse move event listener will be added to the paper dic which will call mouseTracker
 * @memberOf linkJoining
 */
function targetFollow(newLink, linkType, pos){
	if(pos = curMousePos)
	{
		var objectAtPoint = graph.findModelsFromPoint(curMousePos);

		//find the type of links we are using and set the variables 
		if (linkType.localeCompare("flow") == 0)
		{
			isFlow = true;
			isCurved = false;
			isStraight = false;
		}
		else if (linkType.localeCompare("curved") == 0)
		{
			isFlow = false;
			isCurved = true;
			isStraight = false;
		}

		else if (linkType.localeCompare("straight") == 0)
		{
			isFlow = false;
			isCurved = false;
			isStraight = true;
		}

		else 
		{
			console.log("the wrong linke was passed in")
		}


		lastLink = newLink;
		if(typeof objectAtPoint[0] !== 'undefined')
		{
			//console.log(newLink);
			//console.log("test");
			//console.log(objectAtPoint[0]);
			lastLink.set('source', {id: objectAtPoint[0].id});
			//console.log(lastLink);
		}
		else
		{
			if(isFlow)
			{
				var cloud = flowCloudPrep();
				lastLink.set('source', {id: cloud.id});

			}
			else
			{
			lastLink.set('target', {x:curMousePos.x  , y:curMousePos.y  });
			}
		}

		var paperDiv = document.getElementById("paperView");
		paper.$el.on("mousemove", mouseTracker);
		paper.$el.on('mouseup', addVertex);
		paper.$el.on('dblclick', linkTargeter);
	}
}

/**
 * Adds a vertex to the current link
 * @param  {e} is the event that called addVertex
 * @preconditions global variable lastLink is a valid link
 * @postconditions adds a new vertex to lastLink at the current location of the mouse cursor
 * @memberOf linkJoining
 */
function addVertex(e){
	if(hasMoved)
	{
		console.log("everything");
		updateMousePos(e);
		var vertArray = lastLink.get('vertices');
		var newArray;
		if(typeof vertArray === 'undefined')
		{
			newArray = [{x:curMousePos.x  , y:curMousePos.y  }];
		}
		else
		{
			newArray =vertArray.concat([{x:curMousePos.x  , y:curMousePos.y  }]);
		}
		console.log(newArray);
		lastLink.set('vertices', newArray );
		lastLink.set('target', { x:curMousePos.x -LINK_OFFSET_X , y:curMousePos.y -LINK_OFFSET_Y });
		console.log("log a click on addVertex");
		hasMoved = false;
	}
}

/**
 * Sets the target of the global variable lastLink to be the current position of the mouse cursor with a small offset so the user can not click on the link
 * @param  {e} is the event that called mouseTracker 
 * @preconditions global variable lastLink is a valid link
 * @postconditions The new target of the global variable lastLink will be set to the current position of the mouse cursor with a small offset so the user can not click on it
 * @memberOf linkJoining
 */
function mouseTracker(e){
	updateMousePos(e);
	lastLink.set('target', { x:curMousePos.x -LINK_OFFSET_X , y:curMousePos.y -LINK_OFFSET_Y });
	hasMoved=true;
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
		if(isFlow)
		{
			var cloud = flowCloudPrep();
			lastLink.set('target', {id: cloud.id});
		}
		else
		{
			lastLink.set('target', {x:curMousePos.x  , y:curMousePos.y  });
		}
	}
	
	var vertArray = lastLink.get('vertices');
	var newArray;
	if(typeof vertArray === 'undefined' || vertArray[0] === 'undefined')
	{
		newArray = [];
	}
	else
	{
		//console.log(vertArray);
		newArray =vertArray.slice(0, vertArray.length-1);
	}
	//console.log(newArray);
	lastLink.set('vertices', newArray );

	paper.$el.off("mousemove", mouseTracker);
	paper.$el.off('dblclick', linkTargeter);
	paper.$el.off('mouseup', addVertex);
	lastLink = null; 

	isFlow = false;
	isCurved = false;
	isStraight = false;

}

/**
 * Will create a cloud at the current mouse position, This should be called during the time a flow link is being created
 * @preconditions the mouse position is a valid spot on the paper
 * @postconditions a cloud is made at the current location of the mouse, this should be made only at the ends or starts of flows. Also sets the global variable isFlow to true
 * @return returns the new cloud image
 * @memberOf linkJoining
 */
 function flowCloudPrep(){
 	// http://i.imgur.com/1TRqx2p.png this is a crappy cloud I drew

 	pos = ({x:curMousePos.x -25 , y:curMousePos.y -25  })
 	var cloud = createImage(pos, "http://i.imgur.com/1TRqx2p.png", " ", 50,50);

 	return cloud;
 }