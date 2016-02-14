/**
 * Sets up all the collaborative elements of the box 
 */
function registerBox() {
	//Register the Box object
	gapi.drive.realtime.custom.registerType(Box, 'Box');
	//Specifiy Collaborative Fields
	Box.prototype.x=gapi.drive.realtime.custom.collaborativeField('x');
	Box.prototype.y=gapi.drive.realtime.custom.collaborativeField('y');
	Box.prototype.width=gapi.drive.realtime.custom.collaborativeField('width');
	Box.prototype.height=gapi.drive.realtime.custom.collaborativeField('height');
	
	//Specify methods
	//Note draw can probably be moved to the javascript constructor
	/**
	 * Draw function for the Box 
	 */
	Box.prototype.draw  = function(){
		var c= document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		ctx.fillStyle="#FF0000";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		if (this.selected) { // is the current box selected
			ctx.strokeStyle = "#99ff99";
		} else {
			ctx.strokeStyle = "black";
		}
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	};
	
	/**
	 * Function for updating the coordinates of the box 
	 */
	Box.prototype.move= function(x, y){
		this.x=x;
		this.y=y;
	};
	//Set what happens when the object is first made
	gapi.drive.realtime.custom.setInitializer(Box, doInitialize);
	//set what happens when the object is loaded into the page
	gapi.drive.realtime.custom.setOnLoaded(Box, doOnLoaded);
}

//Object Initialization and Load functions
function doInitialize(x, y){
	var model = gapi.drive.realtime.custom.getModel(this);
	this.x = x;
	this.y = y;
	this.width = 150;
	this.height = 75;
	this.selected = false;
}

function doOnLoaded(){
	this.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, doValueChange);
}

//Javascript Constructor
function Box(x, y){
	this.selected = false;
}

function createBox(event){;
	var x = event.pageX;
	var y = event.pageY;
	var results = getCoords(x, y);
	x = results[0];
	y = results[1];
	var temp = rootModel.create(Box, x, y);
	rootList.push(temp);
}