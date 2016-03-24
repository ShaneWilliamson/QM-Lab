function deParentCell(cellView, evt, x, y) {
	var cell = cellView.model;
	
	if (cell.get('parent')) {
		if (cell.isLink()) {
			cell.attemptToParent()
		}
		else {
			graph.getCell(cell.get('parent')).unembed(cell);
		}
	}
	
}
	
		
// When the dragged cell is dropped over another cell, let it become a child of the
// element below.
function parentCell(cellView, evt, x, y) {
	var cell = cellView.model;
	if (!cell.attributes.source) {
		var cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());

		if (cellViewsBelow.length) {
			// Note that the findViewsFromPoint() returns the view for the `cell` itself.
			var cellViewBelow = _.find(cellViewsBelow, function(c) { return c.model.id !== cell.id });
		
			// Prevent recursive embedding.
			if (cellViewBelow && isNotRecursiveEmbed(cell, cellViewBelow)) {
				if (cellViewBelow.model.attributes.type === "QMLab.Agent") {
					cell.toFront();
					cellViewBelow.model.embed(cell);
					
					//Embed links if both link targets are in the same parent
					var links = graph.getConnectedLinks(cell);
					for (var i = 0; i < links.length; i++) {
						if (links[i].getSourceElement() != null && links[i].getTargetElement() != null) {
							if (compareArray(links[i].getSourceElement().getAncestors(), links[i].getTargetElement().getAncestors())) {
								cellViewBelow.model.embed(links[i]);
							}
						}
					}
					
					bringChildrenOfParentToFront(cell);
				}
			}
		}
	}
	
}

function isNotRecursiveEmbed(cell, cellViewBelow) {
	var parents = cellViewBelow.model.getAncestors();
	var retVal = true;
	for (var i = 0; i < parents.length; i++) {
		if (parents[i].id === cell.id) {
			retVal = false;
		}
	}
	if (cell.id === cellViewBelow.model.id) {
		retVal = false;
	}
	return retVal;
}



function bringParentlessCellToFront(cellView, evt, x, y) {
	var cell = cellView.model;

	if (!cell.get('embeds') || cell.get('embeds').length === 0) {
		// Show the dragged element above all the other cells (except when the
		// element is a parent).
		cell.toFront();
	}
}

function bringChildrenOfParentToFront(cell) {
	var children = cell.getEmbeddedCells()
	if (children) {
		for (var i = 0; i < children.length; i++) {
			children[i].toFront();
		}
		for (var i = 0; i < children.length; i++) {
			bringChildrenOfParentToFront(children[i]);
		}
	}
}


