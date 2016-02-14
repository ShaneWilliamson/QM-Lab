//Takes in mouse coordinates on the page and uses them to calculate the corresponding
//coordinates on the canvas
function getCoords(x, y){
	var xOffset = x - document.getElementById("myCanvas").offsetLeft;
	var yOffset = y - document.getElementById("myCanvas").offsetTop;
	return [xOffset, yOffset];
}
// completely clears the canvas
function clearScreen(){
	var c= document.getElementById("myCanvas");
	var width = c.offsetWidth;
	var height = c.offsetHeight;
	var ctx = c.getContext("2d");
	ctx.fillStyle="#FF0000";
	ctx.clearRect(0,0,width + 20,height + 20);	
}

//Draws all objects at the root list
function drawAll(){
	for(i=0; i<rootList.length; i++){
		rootList.get(i).draw();
	}
}

//Re draws the screen
function reDraw(){
	clearScreen();
	drawAll();
}