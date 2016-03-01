	//Allows a given cell to use Google's API to become collaborative
	function createCollabCell(cell) {
		var newCell = rootModel.create('CollaborativeCell', cell.toJSON());
		rootModel.getRoot().set(cell.id, newCell);
		addCollabEventToCell(cell);
		rootModel.getRoot().get(cell.id).action = 'add';
	}