/** NOTE a webix object is referenced like this $$("objectID"), 
make sure that you are using the WEBIX OBJECT ID and not the html element id.
They are not the same thing **/

var genUI = new QM_LabUI();


/**
	Initializer for QM_LabUI class
*/
function QM_LabUI() {
	this.lastClickedValue = "EDIT";	
}


/**
	Creates the tabbar used to select a node/link to place
	Instantiates the tabbar with data from displayData.js
	@precond html doc exists
			webix.js has been imported
			displayData.js has been imported
			the html doc has been loaded
	@postcond creates an tabbar in the objectSelectTabbar div
*/
QM_LabUI.prototype.genTabbar = function() {
	webix.ui({
		container: "objectSelectTabbar",
		type:"space", padding:8,

		rows:[
			{
				type:"clean",
				rows:[

					{
						borderless:true, view:"tabbar", id:'tabbarSelect', value: 'nodeListView', multiview:true, 
						options: [
							{ value: 'Nodes', id: 'nodeListView'},
							{ value: 'Links', id: 'linkListView'},
						]
					},
					{
						cells:[
							{
								id:"nodeListView",
								view:"list",
								template:"#value#",
								type:{
									height:60
								},
								select:true,

								data:sample_nodes
							},
							{
								id:"linkListView",
								view:"list",
								template:"#value#",
								type:{
									height:60
								},
								select:true,

								data:sample_links
							}
						]
					}
				]
			}
		]
	});  

	// an event listener on nodes list view in the tabbar
	// when an item is clicked, it's name is saved into genUI.lastClickedValue
	$$("nodeListView").attachEvent("onItemClick", function(id, e){
		var index = $$("nodeListView").getIndexById(id);
		genUI.lastClickedValue = sample_nodes[index].value;
		console.log("Value changed in the node list view to " + genUI.lastClickedValue);
	});


	// an event listener on links list view in the tabbar
	// when an item is clicked, it's name is saved into genUI.lastClickedValue
	$$("linkListView").attachEvent("onItemClick", function(id, e){
		var index = $$("linkListView").getIndexById(id);
		genUI.lastClickedValue = sample_links[index].value;
		console.log("Value changed in the link list view to " + genUI.lastClickedValue);
	});
}



/**
	Creates the toolbar, tabbar and property box using webix.
**/
QM_LabUI.prototype.genUI = function() { 
	genUI.genToolbar();
	genUI.genTabbar();
	genUI.genPropertiesForm();
};


/**
	Creates the main toolbar at the top of the main page
	@precond webix.js has been imported
			the html doc has been loaded
			the graph has been initialized
	@postcond creates a toolbar in the mainToolbar div
**/
QM_LabUI.prototype.genToolbar = function() {
	webix.ui({
		container:"mainToolbar",
		view:"toolbar",
		elements: [
				{ view:"button", width: 100, value: "New", id:"new"},
				{ view:"button", width: 100, value: "Save", id:"save"},
				{ view:"button", width: 100, value: "Load", id:"load"},
				{ view:"button", width: 100, value: "Share", id:"share"},
				{ view:"button", width: 100, value: "Print", id:"print"}
			],
		elementsConfig:{
			width: 150,
			labelAlign:"right",
			value:"edit"}
	});   

	$$("new").attachEvent("onItemClick", function(id, e){		
        window.open(location.origin + location.pathname, '_blank');
	});

	$$("save").attachEvent("onItemClick", function(id, e){		
        function download(text, name, type) {
		  var file = new Blob([text], {type: type});
		  var href = URL.createObjectURL(file);
		  window.open(href, '__blank');
		}

		download("fasfasfdasdf", "test.txt", "application/octet-stream");
	});

	$$("share").attachEvent("onItemClick", function(id, e){		
        s.showSettingsDialog(); // open the sharing dialog
	});
	
	$$("print").attachEvent("onItemClick", function(id, e){
		//Make the printGraph up to date, enlarge printPaper and then shrink it after printing
		updatePrintGraph();
		resizePrintPaper();
		window.addEventListener("click", shrink = function(id, e){
			shrinkPrintPaper();
			window.removeEventListener("click", shrink);
		});
		window.print();
	});
}


/**
	Creates the property display box
	@precond webix.js has been imported
			the html doc has been loaded
			the graph has been instantiated
	@postcond creates a property box in the propertiesForm div
*/
QM_LabUI.prototype.genPropertiesForm = function() {
	QM_LabUI.prototype.propertiesForm = [
		{ view:"label", label:"Properties", css:"sidebarTitle" },
		{ view:"text", label:"Text", name:"text", id:"text" },
		{ view:"text", label:"Text Size", name:"textsize", id:"textsize" },
		{ view:"colorpicker", label:"Text Color", name:"textcolor", value:"", id:"textcolor" },
		{ view:"text", label:"Width", name:"width", id:"width" },
		{ view:"text", label:"Height", name:"height", id:"height" },
		{ view:"colorpicker", label:"Color", name:"color", value:"", id:"color" },
		{ view:"text", label:"Img URL", name:"imgURL", id:"url"}
	];

	webix.ui({
		id:"propertiesFormId",
		container:"propertiesForm",
		margin:30, cols:[
			{ margin:30, rows:[
				{ view:"form", scroll:false, width:250, elements: QM_LabUI.prototype.propertiesForm },
			]}
		]
	});
	
	webix.UIManager.addHotKey("Enter", function() { 
		if (selected[0]) {
			selected[0].setLabel(document.querySelector('div[view_id="text"] input').value);
			updateCollabGraph();
		}
	}, $$("text"));
	
	webix.UIManager.addHotKey("Enter", function() { 
		if (selected[0]) {
			selected[0].setTextSize(document.querySelector('div[view_id="textsize"] input').value);
			updateCollabGraph();
		}
	}, $$("textsize"));
	
	
	$$("textcolor").attachEvent("onChange", function(id){		
        if(selected[0]){
			selected[0].setTextColour(id);
			updateCollabGraph();
		}
	});
	
	webix.UIManager.addHotKey("Enter", function() { 
		if (selected[0]) {
			selected[0].setWidth(document.querySelector('div[view_id="width"] input').value);
			updateCollabGraph();
		}
	}, $$("width"));
	
	webix.UIManager.addHotKey("Enter", function() { 
		if (selected[0]) {
			selected[0].setHeight(document.querySelector('div[view_id="height"] input').value);
			updateCollabGraph();
		}
	}, $$("height"));
	
	
	$$("color").attachEvent("onChange", function(id){		
        if(selected[0]){
			selected[0].setColour(id);
			updateCollabGraph();
		}
	});
	
	webix.UIManager.addHotKey("Enter", function() { 
		if (selected[0]) {
			selected[0].setImage(document.querySelector('div[view_id="url"] input').value);
			updateCollabGraph();
		}
	}, $$("url"));
	
}


/**
	Deselects all of the elements from both views in the tabbar
	@precond webix.js has been loaded
			the tabbar has been initialized into objectSelectTabbar
			the html doc has been loaded
	@postcond the node tab and link tab for the item selection tabbar will not have an item selected
**/
QM_LabUI.prototype.deselectUIElements = function() {
	$$("nodeListView").unselectAll();
	$$("linkListView").unselectAll();
}
