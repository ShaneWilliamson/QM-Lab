	/*
	This is the constructor of the localNode class.

	From a technical standpoint, this function simply wraps a joint.js cell. However, it allows us
	to easily add and modify it without breaking anything else.

	pre: "pos" is a valid point with an "x" and "y" field
	post: Returns a local node at the position "pos"
	      If a label parameter has been passed in, text on the node will default to that
		  Otherwise, text on the node will default to "Node"
	*/
	function localNode (pos, label) {
		newNode = new joint.shapes.QMLab.Stock({
			position: { x: pos.x, y: pos.y },
		});
		if (label) {
			newNode.setLabel(label);
		}
		return newNode
	}


	/*
	Getter for localNode x position. Will return the x coordinate of the node.

	pre: The localNode exists
	post: No change
	return: The x position of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getXPos = function() {
		return this.attributes.position.x;
	}


	/*
	Getter for localNode y position. Will return the y coordinate of the node.

	pre: The localNode exists
	post: No change
	return: The y position of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getYPos = function() {
		return this.attributes.position.y;
	}

	/*
	Setter for localNode position.

	pre: The localNode exists
	     x and y are valid ints
	post: The localCell's position has been updated to {x, y}
	*/
	joint.shapes.basic.Rect.prototype.setPos = function(x, y) {
		this.attributes.position = {x: x, y: y};
	}


	/*
	Getter for localNode width attribute. Will return the x size of the node.

	pre: The localNode exists
	post: No change
	return: The x size (width) of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getXSize = function() {
		return this.attributes.size.width;
	}


	/*
	Getter for localNode height attribute. Will return the y size of the node.

	pre: The localNode exists
	post: No change
	return: The y size (height) of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getYSize = function() {
		return this.attributes.size.height;
	}


	/*
	Setter for localNode size.

	pre: The localNode exists
	     width and height are valid ints
	post: The localCell's size has been updated to {width, height}
	*/
	joint.shapes.basic.Rect.prototype.setSize = function(width, height) {
		this.prop('rect/width', width);
		this.prop('rect/height', height);
		this.attr('rect/width', width);
		this.attr('rect/height', height);
		this.prop('image/width', width);
		this.prop('image/height', height);
		this.attr('image/width', width);
		this.attr('image/height', height);
		this.resize(width, height);

		this.attr('text/ref-x', (width / 2));
		if (this.attributes.type === "QMLab.Agent" || this.attributes.type === "QMLab.ImageNode")
		{
			this.attr('text/ref-y', height);
		}
		else {
			this.attr('text/ref-y', ((height / 2) - 10));
		}


	}


	/*
	Setter for localNode height.

	pre: The localNode exists
	     height is a valid int
	post: The localCell's size has been updated to {curWidth, height}
	*/
	joint.shapes.basic.Rect.prototype.setHeight = function(height) {
		if (height > 0) {
			this.setSize(this.getXSize(), height);
		}
	}

	/*
	Setter for localNode width.

	pre: The localNode exists
	     width is a valid int
	post: The localCell's size has been updated to {width, curHeight}
	*/
	joint.shapes.basic.Rect.prototype.setWidth = function(width) {
		if (width > 0) {
			this.setSize(width, this.getYSize());
		}
	}

	/*
	Getter for localNode z-order attribute. Will return the
	order in which it is drawn on the screen.

	pre: The localNode exists
	post: No change
	return: The z-order of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getZOrder = function() {
		return this.attributes.z;
	}

	/*
	Setter for localNode z-order. Changes what order it is drawn on the screen

	pre: The localNode exists
	     z is a valid int
	post: The localCell's z-order has been updated to z
	*/
	joint.shapes.basic.Rect.prototype.setZOrder = function(z) {
		if (!isNaN(z)) {
			this.set('z', z);
		}
	}

	/*
	Getter for localNode label attribute. Will return the text associated with this node.

	pre: The localNode exists
	post: No change
	return: The label text of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getLabel = function() {
		var retval = this.attributes.text.text;
		if (!retval) {
			return "";

		}
		else {
			return retval;
		}
	}

	/*
	Getter for localNode z-order attribute. Will return order in which it is drawn on the screen.

	pre: The localNode exists
	post: No change
	return: The z-order of the localNode
	*/
	joint.shapes.basic.Rect.prototype.setLabel = function(text) {
		this.prop('text/text', text);
		this.attr('text/text', text);
	}


	/*
	Setter for whether or not a node appears to be selected
	When this value is set to true the node has a blue outline around it
	When this value is set to false, the blue outline is removed

	pre: The localNode exists
		isSelected isn't null
		isSelected is a boolean
	post: the colour of the localNode is set to blue or transparent blue
	*/
	joint.shapes.basic.Rect.prototype.setSelected = function(isSelected) {
		if (isSelected) {
			// set colour to blue
			colour = "#0000FF";
		} else {
			// set colour to transparent blue
			colour = "#000000";
		}

		this.prop('rect/stroke', colour);
		this.attr('rect/stroke', colour);
		this.prop('path/stroke', colour);
		this.attr('path/stroke', colour);
		this.prop('circle/stroke', colour);
		this.attr('circle/stroke', colour);
	}	


	joint.shapes.basic.Rect.prototype.setColour = function(colour) {
		this.prop('rect/fill', colour);
		this.attr('rect/fill', colour);
		this.prop('path/fill', colour);
		this.attr('path/fill', colour);
		this.prop('circle/fill', colour);
		this.attr('circle/fill', colour);
	}

	joint.shapes.basic.Rect.prototype.getColour = function(colour) {
		return this.attributes.rect.fill;
	}


	joint.shapes.basic.Rect.prototype.setTextColour = function(colour) {
		this.prop('text/fill', colour);
		this.attr('text/fill', colour);
	}

	joint.shapes.basic.Rect.prototype.getTextColour = function(colour) {
		return this.attributes.text.fill;
	}

	joint.shapes.basic.Rect.prototype.setTextSize = function(size) {
		if(!isNaN(size)) {
			this.prop('text/fontsize', size);
			this.attr('text/font-size', size);
		}
	}

	joint.shapes.basic.Rect.prototype.getTextSize = function() {
		return this.attributes.text.fontsize;
	}

	joint.shapes.basic.Rect.prototype.setImage = function() {

	}

	joint.shapes.basic.Rect.prototype.getImage = function() {
		return "";
	}




	joint.shapes.basic.Circle.prototype.setLabel = joint.shapes.basic.Rect.prototype.setLabel;
	joint.shapes.basic.Circle.prototype.setTextSize = joint.shapes.basic.Rect.prototype.setTextSize;
	joint.shapes.basic.Circle.prototype.setTextColour = joint.shapes.basic.Rect.prototype.setTextColour;
	joint.shapes.basic.Circle.prototype.setColour = joint.shapes.basic.Rect.prototype.setColour;
	joint.shapes.basic.Circle.prototype.setSelected = joint.shapes.basic.Rect.prototype.setSelected;
	joint.shapes.basic.Circle.prototype.setWidth = joint.shapes.basic.Rect.prototype.setWidth;
	joint.shapes.basic.Circle.prototype.setHeight = joint.shapes.basic.Rect.prototype.setHeight;
	joint.shapes.basic.Circle.prototype.setSize = joint.shapes.basic.Rect.prototype.setSize;
	joint.shapes.basic.Circle.prototype.setImage = joint.shapes.basic.Rect.prototype.setImage;

	joint.shapes.basic.Circle.prototype.getLabel = joint.shapes.basic.Rect.prototype.getLabel;
	joint.shapes.basic.Circle.prototype.getTextSize = joint.shapes.basic.Rect.prototype.getTextSize;
	joint.shapes.basic.Circle.prototype.getTextColour = joint.shapes.basic.Rect.prototype.getTextColour;
	joint.shapes.basic.Circle.prototype.getColour = joint.shapes.basic.Rect.prototype.getColour;
	joint.shapes.basic.Circle.prototype.getXSize = joint.shapes.basic.Rect.prototype.getXSize;
	joint.shapes.basic.Circle.prototype.getYSize = joint.shapes.basic.Rect.prototype.getYSize;
	joint.shapes.basic.Circle.prototype.getImage = joint.shapes.basic.Rect.prototype.getImage;
	joint.shapes.basic.Circle.prototype.getXPos = joint.shapes.basic.Rect.prototype.getXPos;
	joint.shapes.basic.Circle.prototype.getYPos = joint.shapes.basic.Rect.prototype.getYPos;
	


	/*
	This is the constructor of the localLink class.

	From a technical standpoint, this function simply wraps a joint.js link. However, it allows us
	to easily add and modify it without breaking anything else.

	pre: "pos" is a valid point with an "x" and "y" field
	     If any other parameters are passed, it will set the appropriate field in the link
		    label : if passed, must be a valid stringify
			source : if passed, must be a valid cell in the graph
			target : if passed, must be a valid cell in the graph
			connector : if passed, must be one of three valid connector types:
			            "normal" - this sets the link to only be made of straight lines
						"rouned" - like the above, this sets the lines to straight.
						           However, this causes the angles to "round" themselves
					    "smooth" - This causes the link to have no straight edges, and instead
						           gradually curve its way between vertices

	post: Returns a local link with source at the position "pos"
	      If any other parameters are not undefined or false, it will set the appropriate field
		    label : sets the text to display halfway along the link
            source: sets the node that this link comes out from.
            target: sets the node that this link goes to.
            connector: sets the connector of the style of the link

	*/
	function localLink (pos, label, source, target, connector) {
		var newLink = new joint.shapes.QMLab.localLink();
		var localPos = $.extend(true, {}, pos);
		//If a source was passed, set the link's source that
		if (source) {
			if (graph.getCell(source.id)) {
				newLink.setStartNodeFromCell(source)
			}
		}
		//Otherwise, use the passed in point
		else {
			newLink.set('source', { x: localPos.x, y: localPos.y });
		}

		//If a target was passed, set the link's target to that
		if (target) {
			if (graph.getCell(target.id)) {
				newLink.setEndNodeFromCell(target)
			}
		}
		//Otherwise, use the passed in point
		else {
			//For the moment, simply set the target to be a point to the right
			localPos.x += 400;
			newLink.setEndNodeFromPoint(localPos);
		}

		//If a label was passed in, set the link's text to that
		if (label) {
			newLink.setLabel(label);
		}

		//If a valid connector was passed in, set this link's connector to that
		if (connector == "normal" || connector == "rounded" || connector == "smooth") {
			newLink.set('connector', { name: connector });
		}

		return newLink;
	}






	/*
	This is the constructor of the localFlow class.

	From a technical standpoint, this function simply wraps a joint.js link. However, it allows us
	to easily add and modify it without breaking anything else.

	pre: "pos" is a valid point with an "x" and "y" field
	     If any other parameters are passed, it will set the appropriate field in the link
		    label : if passed, must be a valid stringify
			source : if passed, must be a valid cell in the graph
			target : if passed, must be a valid cell in the graph
			connector : if passed, must be one of three valid connector types:
			            "normal" - this sets the link to only be made of straight lines
						"rouned" - like the above, this sets the lines to straight.
						           However, this causes the angles to "round" themselves
					    "smooth" - This causes the link to have no straight edges, and instead
						           gradually curve its way between vertices

	post: Returns a local link with source at the position "pos"
	      If any other parameters are not undefined or false, it will set the appropriate field
		    label : sets the text to display halfway along the link
            source: sets the node that this link comes out from.
            target: sets the node that this link goes to.
            connector: sets the connector of the style of the link

	*/
	function localFlow (pos, label, source, target, connector) {
		var newFlow = new joint.shapes.QMLab.localLink();
		var localPos = $.extend(true, {}, pos);

		//If a source was passed, set the link's source that
		if (source) {
			if (graph.getCell(source.id)) {
				newFlow.setStartNodeFromCell(source)
			}
		}
		//Otherwise, use the passed in point
		else {
			newFlow.set('source', { x: localPos.x, y: localPos.y });
		}

		//If a target was passed, set the link's target to that
		if (target) {
			if (graph.getCell(target.id)) {
				newFlow.setEndNodeFromCell(target)
			}
		}
		//Otherwise, use the passed in point
		else {
			//For the moment, simply set the target to be a point to the right
			localPos.x += 400;
			newFlow.setEndNodeFromPoint(localPos);
		}

		//If a label was passed in, set the link's text to that
		if (label) {
			newFlow.setLabel(label);
		}

		//If a valid connector was passed in, set this link's connector to that
		if (connector == "normal" || connector == "rounded" || connector == "smooth") {
			newFlow.set('connector', { name: connector });
		}

		newFlow.set('router', { name: 'orthogonal' });


		return newFlow;
	}






	/*
	Getter for localLink start node. Will return what the link is currently
	attached to at the "source" end of the link.

	If the link is attached to a cell, the returned value will be that cell's "id".
	Otherwise, it will return a point that has fields "x" and "y"

	If, for some reason this link has been created without a source attribute,
	will return undefined

	pre: The localLink exists
	post: No change
	return: The source of the localLink
	*/
	joint.dia.Link.prototype.getStartNode = function() {
		return this.attributes.source;
	}

	/*
	Setter for localLink start node. Since this sets by using the cell's "id",
	the passed cell needs to be a valid cell.


	pre: The localLink exists
	     souce : the cell exists and is in the graph
	post: The source of the node has been set to the passed in source
	*/
	joint.dia.Link.prototype.setStartNodeFromCell = function(source) {
		if (source){
			if (graph.getCell(source.id)) {
				this.set('source', source.id);
			}
			else {
				console.log("There was an error when setting the source of a link by cell. The given cell was:");
				console.log(source);
			}
		}
		else {
			console.log("There was an error when setting the source of a link by cell. The given cell was:");
			console.log(source);
		}
	}

	/*
	Setter for localLink source node. Since this sets by using a point in the graph,
	source be a point with valid "x" and "y" fields.


	pre: The localLink exists
	     souce : a valid point with "x" and "y" fields
	post: The source of the node has been set to the passed in source
	*/
	joint.dia.Link.prototype.setStartNodeFromPoint = function(source) {
		if (source){
			this.set('source', { x: source.x, y: source.y });
		}
		else {
			console.log("There was an error when setting the source of a link by point. The given point was:");
			console.log(source);
		}

	}

	/*
	Getter for localLink end node. Will return what the link is currently
	attached to at the "target" end of the link.

	If the link is attached to a cell, the returned value will be that cell's "id".
	Otherwise, it will return a point that has fields "x" and "y"

	If, for some reason this link has been created without a target attribute,
	will return undefined

	pre: The localLink exists
	post: No change
	return: The target of the localLink
	*/
	joint.dia.Link.prototype.getEndNode = function() {
		return this.attributes.target;
	}

	/*
	Setter for localLink end node. Since this sets by using the cell's "id",
	the passed cell needs to be a valid cell.


	pre: The localLink exists
	     target : the cell exists and is in the graph
	post: The target of the node has been set to the passed in target
	*/
	joint.dia.Link.prototype.setEndNodeFromCell = function(target) {
		this.set('target', target.id);
	}

	/*
	Setter for localLink target node. Since this sets by using a point in the graph,
	source be a point with valid "x" and "y" fields.


	pre: The localLink exists
	     souce : a valid point with "x" and "y" fields
	post: The source of the node has been set to the passed in source
	*/
	joint.dia.Link.prototype.setEndNodeFromPoint = function(target) {
		this.set('target', { x: target.x, y: target.y });
	}


	/*
	Setter for localLink label text.

	pre: The localLink exists
	     text : a valid string of some kind
	post: The label text of the node has been set to the passed in text
	*/
	joint.dia.Link.prototype.setLabel = function(text) {
		this.set('labels', [{ position: 0.5, attrs: { text: { text: text } } }]);
	}

	/*
	Setter for localLink label text.

	pre: The localLink exists
	     text : a valid string of some kind
	post: The label text of the node has been set to the passed in text
	*/
	joint.dia.Link.prototype.setTextSize = function(textsize) {
		var text = this.getLabel();
		var colour = this.getTextColour();
		this.set('labels', [{ position: 0.5, attrs: { text: { text: text, 'font-size': textsize, fill: colour } } }]);
		this.prop('text/textsize', textsize);
	}

	/*
	Setter for localLink label text.

	pre: The localLink exists
	     text : a valid string of some kind
	post: The label text of the node has been set to the passed in text
	*/
	joint.dia.Link.prototype.getTextSize = function(textsize) {
		return this.attributes.text.textsize;
	}


	/*
	Getter for localLink label text. Will return what the link currently
	has written and displayed partway along itself. If nothing is currently
	set, returns an empty string. ""

	By design, there should never be more than one label attached to a cell.
	Therefore, it is perfectly safe to hardcode the index of the label we are
	searching.

	pre: The localLink exists
	post: No change
	return: The label text of the localLink
	*/
	joint.dia.Link.prototype.getLabel = function(text) {
		if (this.attributes.labels) {
			if (this.attributes.labels[0]) {
				return this.attributes.labels[0].attrs.text.text;
			}
		}
		else {
			return "";
		}
	}

	joint.dia.Link.prototype.setColour = function(colour) {
		this.prop('colour', colour);
		this.attr( {
			'.connection': { stroke: colour, fill: colour },
			'.marker-target': {stroke: colour, fill: colour },
			'.marker-source': {stroke: colour, fill: colour },
		});
	}



	joint.dia.Link.prototype.getColour = function(colour) {
		return this.attributes.colour;
	}

	//This is a placeholder
	joint.dia.Link.prototype.setTextColour = function(colour) {
		var text = this.getLabel();
		var textsize = this.getTextSize();
		this.set('labels', [{ position: 0.5, attrs: { text: { text: text, 'font-size': textsize, fill: colour } } }]);
		this.prop('text/textcolour', colour);
	}

	//This is a placeholder
	joint.dia.Link.prototype.getTextColour = function() {
		if (this.attributes.text) {
			return this.attributes.text.textcolour;
		}
		else {
			return "#000000";
		}

	}

	//This is a placeholder
	joint.dia.Link.prototype.getXSize = function() {
		return "";
	}

	//This is a placeholder
	joint.dia.Link.prototype.getYSize = function() {
		return "";
	}

	//This is a placeholder
	joint.dia.Link.prototype.setWidth = function() {
	}

	//This is a placeholder
	joint.dia.Link.prototype.setHeight = function() {
	}

	//This is a placeholder
	joint.dia.Link.prototype.attemptToParent = function() {
		if (this.getSourceElement() != null &&
			    this.getTargetElement() != null) {
					if (this.getSourceElement().get('parent') != this.getTargetElement().get('parent')) {
						graph.getCell(this.get('parent')).unembed(this);
					}
				}
	}


	/*
	Initialzes the namespace for our custom shapes for use in the diagram.
	*/
	joint.shapes.QMLab = {};



	/*
	This is the shape definition of the "localLink" type. It extends joint.js' Link,
	allowing us to easily customize it.	By default, sets the Link to behave exactly
	link a default joint.js basic Link.

	*/
	joint.shapes.QMLab.localLink = joint.dia.Link.extend({
		defaults: joint.util.deepSupplement({

			type: 'QMLab.localLink'

		}, joint.dia.Link.prototype.defaults),
	});


	/*
	This is the shape definition of the "localFlow" type. It extends joint.js' Link,
	allowing us to easily customize it.	By default, sets the Link to behave exactly
	link a default joint.js basic Link.

	*/
	joint.shapes.QMLab.localLink = joint.dia.Link.extend({
		defaults: joint.util.deepSupplement({

			type: 'QMLab.localLink',
			/*Creates the arrow head at one end of the link*/
			attrs: {'.marker-target': {stroke: '#000000', fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z'}}
		}, joint.dia.Link.prototype.defaults),
	});




	/*
	This is the shape definition of the "localNode" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the Node to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Node = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Node',
			size: { width: 100, height: 30 },
			attrs: {
				rect: { fill: 'grey' },
				text: { text: "Node", fill: 'white' }
			}

		}, joint.shapes.basic.Rect.prototype.defaults)
	});



	/*
	This is the shape definition of the "Stock" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the Stock to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Stock = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Stock',
			attrs: {
				rect: { fill: 'grey' },
				text: { text: "Stock", fill: 'white' }
			}
		}, joint.shapes.basic.Rect.prototype.defaults)
	});



	/*
	This is the shape definition of the "State" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the State to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.State = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.State',
			size: { width: 100, height: 30 },
			attrs: {
				rect: { fill: 'yellow', rx: 10, ry: 10 },
				text: { text: "State", fill: 'black' }
			}

		}, joint.shapes.basic.Rect.prototype.defaults)
	});


	/*
	This is the shape definition of the "Terminal State" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the Terminal State to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.TerminalState = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.TerminalState',
			size: { width: 100, height: 30 },
			attrs: {
				rect: { fill: "red", rx: 10, ry: 10 },
				text: { text: "Terminal State", fill: 'black' }
			}

		}, joint.shapes.basic.Rect.prototype.defaults)
	});


	/*
	This is the shape definition of the "Branch" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the Branch to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Branch = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Branch',
			size: { width: 25, height: 25 },
			attrs: {
				rect: { fill: 'white', height: 25, width: 25, transform: 'rotate(45)' },
				text: { text: "", fill: 'black' }
			}

		}, joint.shapes.basic.Rect.prototype.defaults)
	});










	/*
	This is the shape definition of the "ImageNode" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the ImageNode is set to hold a placeholder image, with text that states "Your Image Here".
	Override the visuals through either the constructor or the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.ImageNode = joint.shapes.basic.Rect.extend({

		markup: '<g class="rotatable"><g class="scalable"><rect/><image/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.ImageNode',


		}, joint.shapes.basic.Rect.prototype.defaults)
	});



	/*
	This is the shape definition of the "Variable" type. It extends joint.js' Circle shape,
	allowing us to easily customize it.
	*/
	joint.shapes.QMLab.Variable = joint.shapes.basic.Circle.extend({

		markup: '<g class="rotatable"><g class="scalable"><circle/><path/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Variable',
			size: { width: 20, height: 20 },
			attrs: { text: { text: 'Variable', 'ref-y': 30, ref: 'circle' }, circle: { fill: 'gray' } },

		}, joint.shapes.basic.Circle.prototype.defaults)
	});


	/*
	This is the shape definition of the "Parameter" type. It extends joint.js' Circle shape,
	allowing us to easily customize it.
	*/
	joint.shapes.QMLab.Parameter = joint.shapes.basic.Circle.extend({

		markup: '<g class="rotatable"><g class="scalable"><circle/><path/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Parameter',
			size: { width: 20, height: 20 },

			attrs: {
				text: { text: 'Parameter', 'ref-y': 30, ref: 'circle' },
				circle: { fill: 'gray' },
				//path: { fill: 'green', stroke: "black", d: "M40,50  L50,35  A30,30 1 0,1 30,10 z"}
				//Currently, leaving this out of the build. But throw another shape of a pie chart or something
				//to show that this is different from a variable. Especially considering the default 'name' in the
				//text field won't be used very often in the final release.
				},

		}, joint.shapes.basic.Circle.prototype.defaults)
	});



	/*
	This is the shape definition of the "Agent" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, sets the Agent is set to hold a placeholder image, with text that states "Agent".
	Override the visuals through either the constructor or the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Agent = joint.shapes.basic.Rect.extend({

		markup: '<g class="rotatable"><g class="scalable"><rect/><image/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Agent',

		}, joint.shapes.basic.Rect.prototype.defaults)
	});


	/*
	This is the shape definition of the "Text Area" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.

	By default, text area to look like a speach bubble.
	Override the visuals through either the constructor or the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Text = joint.shapes.basic.Rect.extend({

		markup: '<g class="rotatable"><g class="scalable"><rect/><path/></g><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Text',
			size: { width: 100, height: 100 },

			attrs: {
				text: { text: '', ref: 'rect' },
				rect: { 'fill-opacity': 0, 'stroke-opacity': 0 },
				path: { fill: '#cccccc', d: 'M 0 20 C 0 0 0 0 20 0 L 80 0 C 100 0 100 0 100 10 L 100 80 C 100 100 100 100 80 100 L 20 100 -15 115 0 80 z' },
				},

		}, joint.shapes.basic.Rect.prototype.defaults)
	});


	joint.shapes.QMLab.ImageNode.prototype.setImage = function(url) {
		this.prop('url', url);
		this.attr('image/xlink:href', url);
	}

	joint.shapes.QMLab.ImageNode.prototype.getImage = function(url) {
		return this.attributes.url;
	}

	joint.shapes.QMLab.Agent.prototype.setImage = function(url) {
		this.prop('url', url);
		this.attr('image/xlink:href', url);
	}

	joint.shapes.QMLab.Agent.prototype.getImage = function() {
		return this.attributes.url;
	}

	joint.shapes.QMLab.ImageNode.prototype.getImageURL = function() {
		return this.attr("image/xlink:href");
	}
	
	/**
	 * Resets the selectedEdge variable once an edge is let go of.
	 */
	function dropEdge(cellView, evt, x, y){
		if(selected[0]){
			selectedEdge = "";
		}
	}
	
	function startResizingTop(evt){
		//makes sure selected is actually set
		if(undefined!=selected[0]){
			startResizing(evt); 
			selectedEdge="top";
			console.log("Got top edge");
		}
	}
	function startResizingBottom(evt){
		//makes sure selected is actually set
		if(undefined!=selected[0]){
			startResizing(evt); 
			selectedEdge="bottom";
			console.log("Got bottom edge");
		}
	}
	function startResizingLeft(evt){
		//makes sure selected is actually set
		if(undefined!=selected[0]){
			startResizing(evt); 
			selectedEdge="left";
			console.log("Got left edge");
		}
	}
	function startResizingRight(evt){
		//makes sure selected is actually set
		if(undefined!=selected[0]){
			startResizing(evt); 
			selectedEdge="right";
			console.log("Got right edge");
		}
	}
	function startResizing(event){
		document.getElementById("paperView").addEventListener("mousemove", dragResize);
		document.getElementById("paperView").addEventListener("mouseup", stopResizing);
		console.log("resizing started");
	}
	function stopResizing(event){
		console.log("resizing stopped");
		document.getElementById("paperView").removeEventListener("mousemove", dragResize);
		document.getElementById("paperView").removeEventListener("mouseup", stopResizing);
		dropEdge();
	}
	function dragResize(event){
		if(selected[0]){
			var point = paper.clientToLocalPoint({x: event.clientX, y: event.clientY});
			if(selectedEdge == "left"){
				console.log("resize left");
				var newWidth = selected[0].getXSize() + selected[0].getXPos() - point.x;
				var newHeight = selected[0].getYSize();
				var newXPos = point.x;
				var newYPos = selected[0].getYPos();
				if(newWidth > 1 && newHeight >1){
					selected[0].setSize(newWidth, newHeight);
					selected[0].position(newXPos, newYPos);
				}
			}else if(selectedEdge == "right"){
				console.log("resize right");
				var newWidth = point.x - selected[0].getXPos();
				var newHeight = selected[0].getYSize();
				var newXPos = selected[0].getXPos();
				var newYPos = selected[0].getYPos();
				if(newWidth > 1 && newHeight >1){
					selected[0].setSize(newWidth, newHeight);
					selected[0].position(newXPos, newYPos);
				}
			}else if(selectedEdge == "top"){
				console.log("resize top");
				var newWidth = selected[0].getXSize();
				var newHeight = selected[0].getYSize() + selected[0].getYPos() - point.y;
				var newXPos = selected[0].getXPos();
				var newYPos = point.y;
				if(newWidth > 1 && newHeight >1){
					selected[0].setSize(newWidth, newHeight);
					selected[0].position(newXPos, newYPos);
				}
			}else if(selectedEdge == "bottom"){
				console.log("resize bottom");
				var newWidth = selected[0].getXSize();
				var newHeight = point.y - selected[0].getYPos();
				var newXPos = selected[0].getXPos();
				var newYPos = selected[0].getYPos();
				if(newWidth > 1 && newHeight >1){
					selected[0].setSize(newWidth, newHeight);
					selected[0].position(newXPos, newYPos);
				}
			}else{
				console.log("No valid edge grabbed");
			}
		}
	}
	
	/**
	 * Sets the initial HTML style, location and size of drag resizing handles in the views.
	 * 
	 */
	function setInitialHTML(view){
		var bbox = view.model.getBBox();
		var newX = bbox.x*paperScale + paper.options.origin.x;
		var newY = bbox.y*paperScale + paper.options.origin.y;
				
		view.$box.css({ 
			width: bbox.width*paperScale, 
			height: bbox.height*paperScale,
			transform: 'matrix(' + paperScale + ', ' + 0 + ', ' + 0 + ', ' + paperScale + ', ' + newX+ ', ' + newY+')',
		});
		view.$box.find('.bottom').css({
			width: bbox.width,
			height: '2px',
			top: bbox.height - 2
		});
		view.$box.find('.top').css({
			width: bbox.width,
			height: '2px'
		});
		view.$box.find('.left').css({
			width: '2px',
			height: bbox.height
		});
		view.$box.find('.right').css({
			width: '2px',
			height: bbox.height,
			left: bbox.width
		});
		//If the element is off of the paper change display to none so it does not create scroll bars in the window
		if(newX > paper.options.width || newY > paper.options.height){
			view.$box.css({
				display: 'none'
			});
		}else{
			view.$box.css({
				display: 'block'
			});
		}
	}
	
	/**
	 * Specialized version of setInitialHTML for Branches which offsets the bounding box by half the total width
	 * because the default x position is in the centre of the branch.
	 */
	function setInitialHTMLBranch(view){
		var bbox = view.model.getBBox();
		var newX = bbox.x*paperScale + paper.options.origin.x - bbox.width*paperScale/2;
		var newY = bbox.y*paperScale + paper.options.origin.y;
				
		view.$box.css({ 
			width: bbox.width*paperScale, 
			height: bbox.height*paperScale,
			transform: 'matrix(' + paperScale + ', ' + 0 + ', ' + 0 + ', ' + paperScale + ', ' + newX+ ', ' + newY+')',
		});
		view.$box.find('.bottom').css({
			width: bbox.width,
			height: '2px',
			top: bbox.height - 2
		});
		view.$box.find('.top').css({
			width: bbox.width,
			height: '2px'
		});
		view.$box.find('.left').css({
			width: '2px',
			height: bbox.height
		});
		view.$box.find('.right').css({
			width: '2px',
			height: bbox.height,
			left: bbox.width
		});
		if(newX > paper.options.width || newY > paper.options.height){
			view.$box.css({
				display: 'none'
			});
		}else{
			view.$box.css({
				display: 'block'
			});
		}
	}
	/**
	 * Specialized version of setInitialHTML for TextBoxes which offsets the bounding box based on the 
	 * distance between the point on the text box and the main box.
	 */
	function setInitialHTMLText(view){
		//Offset to compensate for the point of the text box
		//The distance between the main box and the point is approx 12% of the total width
		var pointOffset = 0.12;
		var bbox = view.model.getBBox();
		var newX = bbox.x*paperScale + paper.options.origin.x - bbox.width*paperScale*pointOffset;
		var newY = bbox.y*paperScale + paper.options.origin.y;
				
		view.$box.css({ 
			width: bbox.width*paperScale, 
			height: bbox.height*paperScale,
			transform: 'matrix(' + paperScale + ', ' + 0 + ', ' + 0 + ', ' + paperScale + ', ' + newX+ ', ' + newY+')',
		});
		view.$box.find('.bottom').css({
			width: bbox.width,
			height: '2px',
			top: bbox.height - 2
		});
		view.$box.find('.top').css({
			width: bbox.width,
			height: '2px'
		});
		view.$box.find('.left').css({
			width: '2px',
			height: bbox.height
		});
		view.$box.find('.right').css({
			width: '2px',
			height: bbox.height,
			left: bbox.width
		});
		if(newX > paper.options.width || newY > paper.options.height){
			view.$box.css({
				display: 'none'
			});
		}else{
			view.$box.css({
				display: 'block'
			});
		}
	}
	
	/**
	 * Modifies the style of the HTML and sets listeners for the drag resizing handles in the views for each element
	 * based on whether the element is the selected element or not.
	 * If it is the selected element then it gives the HTML a background, a border and adds the drag listeners to
	 * the appropriate HTML elements. If it is not the selected element it removes the background, border and all listeners attached to
	 * the HTML. This function is called when the view is updated, which happens as the mouse is moved so the HTML is guaranteed to 
	 * appear when selected and disappear when deselected.
	 * @preconditions the view exists.
	 * @postconditions The HTML style and listeners are updated
	 * @param {view} view The view that is associated with a QMLab object that contains the HTML used for outlining and resizing
	 * @memberOf qmlabjointclasses
	 */
	function setSelectedHTML(view){
		if(view.model == selected[0]){
			view.$box.find('.bottom').css({
				cursor: 'ns-resize',
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.top').css({
				cursor: 'ns-resize',
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.left').css({
				cursor: 'ew-resize',
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.right').css({
				cursor: 'ew-resize',
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.top').on('mousedown', startResizingTop);
			view.$box.find('.left').on('mousedown', startResizingLeft);
			view.$box.find('.right').on('mousedown', startResizingRight);
			view.$box.find('.bottom').on('mousedown', startResizingBottom);
		}else{
			view.$box.find('.bottom').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.top').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.left').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.right').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.top').off('mousedown');
			view.$box.find('.bottom').off('mousedown');
			view.$box.find('.left').off('mousedown');
			view.$box.find('.right').off('mousedown');
		}
	}
	
	function setSelectedHTMLNoResize(view){
		if(view.model == selected[0]){
			view.$box.find('.bottom').css({
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.top').css({
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.left').css({
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
			view.$box.find('.right').css({
				border: '2px solid #2980B9',
				background: '#2980B9'
			});
		}else{
			view.$box.find('.bottom').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.top').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.left').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
			view.$box.find('.right').css({
				cursor: 'default',
				border: 'none',
				background: 'none'
			});
		}
	}
	
	function initializeStockView(){
		joint.shapes.QMLab.StockView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTML(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}
	


	function initializeImageNodeView(){
		joint.shapes.QMLab.ImageNodeView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTML(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}
	
	function initializeTextView(){
		joint.shapes.QMLab.TextView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTMLText(this);
				setSelectedHTML(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}
	
	function initializeAgentView(){
		joint.shapes.QMLab.AgentView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTML(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}

	function initializeStateView(){
		joint.shapes.QMLab.StateView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTML(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}

	function initializeTerminalStateView(){
		joint.shapes.QMLab.TerminalStateView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTML(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}

	function initializeBranchView(){
		joint.shapes.QMLab.BranchView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTMLBranch(this);
				setSelectedHTMLNoResize(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}
	
	
	
	function initializeVariableView(){
		joint.shapes.QMLab.VariableView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTMLNoResize(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}
	
	function initializeParameterView(){
		joint.shapes.QMLab.ParameterView = joint.dia.ElementView.extend({
			template: [
				'<div class="html-element">',
				'<div class="top"></div>',
				'<div class="bottom"></div>',
				'<div class="left"></div>',
				'<div class="right"></div>',
				'</div>'
			].join(''),
		
			initialize: function() {
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);
				this.$box = $(_.template(this.template)());
				//When zooming or moving mouse on page, make sure html is updated
				paper.$el.on('wheel', this.updateBox);
				paper.$el.on('mousemove', this.updateBox);
				//Update box position whenever underlying joint is updated
				this.model.on('change', this.updateBox, this);
				//Remove box when model is removed
				this.model.on('remove', this.removeBox, this);
				this.updateBox();
			},
			render: function(){
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
			updateBox: function(){
				setInitialHTML(this);
				setSelectedHTMLNoResize(this);
			},
			removeBox: function(evt){
				this.$box.remove();
			}
		});
	}
	
