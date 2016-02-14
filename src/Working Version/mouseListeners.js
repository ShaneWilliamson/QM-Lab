var currentBox;
var difx;
var dify;
var activeID;

// Collaborative Event Actions
function doValueChange(event){
	reDraw();
}
function doValueAdded(event){
	reDraw();
}

function onMouseDown(event) {
	
	var x = event.pageX;
	var y = event.pageY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	var flag= 0;
	for(i = 0; i < rootList.length; i++){
		var temp = rootList.get(i);
		if((x <= temp.x + temp.width) && (x >= temp.x)){
			if(y <= temp.y + temp.height && y >= temp.y){
				if(currentBox != null){
					currentBox.selected = false;
				}
				currentBox = rootList.get(i);
				currentBox.selected = true;
				flag = 1;
				difx = x - temp.x; // ensures that the box doesn't snap to the mouse location
				dify = y - temp.y;
				break;
			}
		}
	}
	if(flag == 0) { // if there isn't a box on the clicked location
		createBox(event);

	} else { // if there is a box on the clicked location
		reDraw();
		document.getElementById("myCanvas").addEventListener("mouseup",onMouseUp);
		document.getElementById("myCanvas").addEventListener("mousemove",moving);
	}
}
function onMouseUp(event){
	var x = event.pageX;
	var y = event.pageY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	currentBox.move(x - difx, y - dify);
	document.getElementById("myCanvas").removeEventListener("mousemove",moving);
	document.getElementById("myCanvas").removeEventListener("mouseup",onMouseUp);
	//Might need for fluid drawing in local canvas
	reDraw();
}
function moving(event){
	var x = event.pageX;
	var y = event.pageY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	currentBox.move(x - difx, y - dify);
	//Might need for fluid drawing in local canvas
	reDraw();
}

function menuClick(event){
	if(activeID != null && activeID != ""){
		document.getElementById(activeID).className="";
	}
	activeID= event.target.id;
	document.getElementById(activeID).className="active";
}