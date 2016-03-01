	// Create a stock at the given position.
	function createNode(pos) {
		var newStock = new joint.shapes.basic.Rect({
			position: { x: pos.x, y: pos.y },
			size: { width: 100, height: 30 },
			attrs: { rect: { fill: 'grey' }, text: { text: 'Stock', fill: 'white' } }
		});	
		graph.addCell(newStock);	
		createCollabCell(newStock);
		updateCollabGraph();	
		
		console.log("Node added");
		return newStock;
	}
	

	joint.shapes.basic.Rect.prototype.getXPos = function() {
		return this.attributes.position.x;
	}
	
	joint.shapes.basic.Rect.prototype.getYPos = function() {
		return this.attributes.position.y;
	}
	
	joint.shapes.basic.Rect.prototype.setPos = function(x, y) {
		this.attributes.position = {x: x, y: y};
	}
	
	
	joint.shapes.basic.Rect.prototype.getXSize = function() {
		return this.attributes.size.width;
	}
	
	joint.shapes.basic.Rect.prototype.getYSize = function() {
		return this.attributes.size.height;
	}
	
	joint.shapes.basic.Rect.prototype.setSize = function(x, y) {
		this.attributes.size = {width: x, height: y};
	}
	
	joint.shapes.basic.Rect.prototype.getZOrder = function() {
		return this.attributes.z;
	}
	
	joint.shapes.basic.Rect.prototype.setZOrder = function(z) {
		this.attributes.z = z;
	}
	
	joint.shapes.basic.Rect.prototype.getLabel = function() {
		return this.attributes.attrs.text.text;
	}
	
	joint.shapes.basic.Rect.prototype.setLabel = function(text) {
		this.attributes.attrs.text.text = text;
	}