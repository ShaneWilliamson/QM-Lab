/** NOTE a webix object is referenced like this $$("objectID"), 
make sure that you are using the WEBIX OBJECT ID and not the html element id.
They are not the same thing **/

var genUI = new QM_LabUI();


function QM_LabUI() {
	this.lastClickedValue = "EDIT";	
}


/**
	Creates the tabbar used to select a node/link to place
	Instantiates the tabbar with data from displayData.js
**/
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
	Function creates the toolbar and tabbar using webix.
**/
QM_LabUI.prototype.genUI = function() { 
	genUI.genToolbar();
	genUI.genTabbar();
};


/**
	Creates the main toolbar at the top of the main page
**/
QM_LabUI.prototype.genToolbar = function() {
		webix.ui({
		container:"mainToolbar",
		view:"toolbar",
		elements: [
				{ view:"segmented", width:200, 
					options:[
						{id:"save", value:"Save"},
						{id:"load", value:"Load"}
					]
				},
				{ view:"button", width: 100, value: "Share", id:"share"
				}
			],
		elementsConfig:{
			width: 150,
			labelAlign:"right",
			value:"edit"}
	});   

	$$("share").attachEvent("onItemClick", function(id, e){		
        s.showSettingsDialog(); // open the sharing dialog
	});
}


/**
	Deselects all of the elements from both views in the tabbar
**/
QM_LabUI.prototype.deselectUIElements = function() {
	$$("nodeListView").unselectAll();
	$$("linkListView").unselectAll();
}

