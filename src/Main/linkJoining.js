
var lastLink;

function targetFollow(newLink){

	console.log(newLink);
	lastLink = newLink;
	var paperDiv = document.getElementById("paperView");
	paperDiv.addEventListener("mousemove", mouseTracker);
	paperDiv.addEventListener("onmouseup", linkTargeter);
	console.log(lastLink);
	
}

function mouseTracker(e){
	updateMousePos(e);
	lastLink.set('target', { x:curMousePos.x , y:curMousePos.y });
}

function linkTargeter(e){
	updateMousePos(e);
	console.log(curMousePos);
	var paperDiv = document.getElementById("paperView");
	paperDiv.removeEventListener("mousemove", mouseTracker);
	paperDiv.removeEventListener("onmouseup", linkTargeter);

}