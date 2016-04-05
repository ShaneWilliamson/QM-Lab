///////////////////////
// cell_parent_logic //
///////////////////////
/**
 * Handles the parent cell's logic.
 * @invariant cells are only brought forward, not backward
 * @class cell_parent_logic
 */

/**
 * Decouples a parent cell.
 * @param {view} cellView the view that the current cell is on
 * @param {undefined} evt placeholder variable needed for JointJS
 * @param {int} x x coordinate of the cell view
 * @param {int} y y coordinate of the cell view
 * @preconditions the Realtime model has been initiated, the x and y coordinates
 *   represent the cell
 * @postconditions the cell in the x and y coordinates is decoupled from its
 *   parent
 * @memberOf cell_parent_logic
 */
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

/**
 * When the dragged cell is dropped over another cell, make it the child of the element below it.
 * @param  {view} cellView the view which the cell is dropped in
 * @param  {undefined} evt      placeholder variable needed for JointJS
 * @param  {int} x        the x coordinate of the cell being dragged over
 * @param  {int} y        the y coordinate of the cell being dragged over
 * @preconditions the Realtime model is initialized, the cell is being dragged and dropped, the cells exist
 * @postconditions couples a cell dropped over another cell as the parent
 */
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

/**
 * Check if the cells are calling on themselves (ie. recurvise)
 * @param  {cell}  cell          the cell being check if its recurseive
 * @param  {view}  cellViewBelow the view below the cell being checked
 * @return {Boolean}               true if they are recursive to itself, false otherwise
 * @preconditions the cell is initialized and has a position, the 
 */
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

/**
 * Brings a cell with no parent to the front of the screen
 * @param  {view} cellView a view of the cell being targetted
 * @param  {undefined} evt      placeholder for JointJS
 * @param  {undefined} x        placeholder for JointJS
 * @param  {undefined} y        placeholder for JointJS
 * @preconditions the Realtime model is initialized
 * @postconditions a parentless cell is brought to the front of the view
 * @history cells are only brought forward, not backward
 * @invariant the cell cannot have a parent
 */
function bringParentlessCellToFront(cellView, evt, x, y) {
	var cell = cellView.model;

	if (!cell.get('embeds') || cell.get('embeds').length === 0) {
		// Show the dragged element above all the other cells (except when the
		// element is a parent).
		cell.toFront();
	}
}

/**
 * Brings the children of the cell to the front of the view
 * @param  {cell} cell the cell being checked
 * @preconditions the cell exists and has chidren
 * @postconditions the children of cell are in the front
 */
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
