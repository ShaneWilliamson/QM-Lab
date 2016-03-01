	// Create a link at the given position, extending towards the right.
	function createLink(pos) {
		var newLink = new joint.dia.Link();

		if (selected[0]) {
			newLink.set('source', { id: selected[0].id });
		} 
		else {
			newLink.set('source', { x: pos.x, y: pos.y });
		}

		newLink.set('target', { x: pos.x + 200, y: pos.y });
		
		newLink.set('connector', { name: "smooth" });
		
		graph.addCell(newLink);
		createCollabCell(newLink);
		updateCollabGraph();	
		
		console.log('New cell added');
		
		return newLink;
	}
	
	joint.dia.Link.prototype.getStartNode = function () {
		
	}