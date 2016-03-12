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
		this.attributes.size = {width: x, height: y};
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
		this.attributes.z = z;
	}

	/*
	Getter for localNode label attribute. Will return the text associated with this node.
	
	pre: The localNode exists
	post: No change
	return: The label text of the localNode
	*/
	joint.shapes.basic.Rect.prototype.getLabel = function() {
		return this.attributes.attrs.text.text;
	}

	/*
	Getter for localNode z-order attribute. Will return order in which it is drawn on the screen.
	
	pre: The localNode exists
	post: No change
	return: The z-order of the localNode
	*/
	joint.shapes.basic.Rect.prototype.setLabel = function(text) {
		this.attributes.attrs.text.text = text;
	}

	
	
	
	

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

		//If a source was passed, set the link's source that
		if (source) {
			if (graph.getCell(source.id)) {
				newLink.setStartNodeFromCell(source)
			}	
		}
		//Otherwise, use the passed in point
		else {
			newLink.set('source', { x: pos.x, y: pos.y });
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
			pos.x += 400;
			newLink.setEndNodeFromPoint(pos);
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

		//If a source was passed, set the link's source that
		if (source) {
			if (graph.getCell(source.id)) {
				newFlow.setStartNodeFromCell(source)
			}	
		}
		//Otherwise, use the passed in point
		else {
			newFlow.set('source', { x: pos.x, y: pos.y });
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
			pos.x += 400;
			newFlow.setEndNodeFromPoint(pos);
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
			attrs: { rect: { fill: 'grey' }, text: { text: "Node", fill: 'white' } }

		}, joint.shapes.basic.Rect.prototype.defaults)
	});
	
	
	
	/*
	This is the shape definition of the "Stock" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.
	
	By default, sets the Stock to look a certain way. Override the visual in the constructor,
	or call the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.Stock = joint.shapes.basic.Rect.extend( {
		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.Stock',
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'grey' }, text: { text: "Node", fill: 'white' } }

		}, joint.shapes.basic.Rect.prototype.defaults)
	});
	
	
	
	
	
	
	/*
	This is the shape definition of the "ImageNode" type. It extends joint.js' Rect shape,
	allowing us to easily customize it.
	
	By default, sets the ImageNode is set to hold a placeholder image, with text that states "Your Image Here".
	Override the visuals through either the constructor or the setter methods if another visual is desired.
	*/
	joint.shapes.QMLab.ImageNode = joint.shapes.basic.Rect.extend({

		markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

		defaults: joint.util.deepSupplement({

			type: 'QMLab.ImageNode',
			size: { width: 200, height: 120 },
			attrs: {
				'rect': { 'fill-opacity': 0, 'stroke-opacity': 0, width: 0, height: 0 },
				'text': { 'font-size': 14, text: 'Your Image Here', 'ref-x': 100, 'ref-y': 130, ref: 'rect', fill: 'black' },
				'image': { 'xlink:href': 'http://www.reliefjournal.com/wp-content/uploads/2012/03/600x400-Image-Placeholder.jpg', width: 200, height: 120 },
			}

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
	