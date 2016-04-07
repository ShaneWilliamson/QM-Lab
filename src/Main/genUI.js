////////////
// gen_ui //
////////////
/**
 * Manages generating the ui
 * @todo finish adding contracts (gods speed to whomever takes this on)
 * @class gen_ui
 */


var genUI = new QM_LabUI();

// NOTE a webix object is referenced like this $$("objectID"), make sure that
// you are using the WEBIX OBJECT ID and not the html element id. They are not
// the same thing

/**
 * Initializer for QM_LabUI class
 * @postconditions The UI is initialized
 * @memberOf gen_ui
 */

function QM_LabUI() {
	this.lastClickedValue = "EDIT";
}

/**
 * Creates the tabbar used to select a node/link to place. Instantiates the
 *   tabbar with data from displayData.js.
 * @preconditions html doc exists, displayData.js has been imported, the html
 *   doc has been loaded.
 * @postconditions creates an tabbar in the objectSelectTabbar div
 * @memberOf gen_ui
 */
QM_LabUI.prototype.genTabbar = function() {
	var height = window.innerHeight - 250;
	webix.ui({
		container: "objectSelectTabbar",
		type:"space",
		padding:8,
		height: height,
		width: 225,
		margin: 5,
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
 * Creates the toolbar, tabbar and property box using webix.
 * @preconditions genUI has been initialized
 * @postconditions genUI has the toolbar, tabbar and properties form setup
 * @memberOf gen_ui
 */
QM_LabUI.prototype.genUI = function() { 

	genUI.genToolbar();
	genUI.genTabbar();
	genUI.genPropertiesForm();
};

/**
 * Creates the main toolbar at the top of the main page
 * @preconditions webix.js has been imported, the html doc has been loaded, the
 *   graph has been initialized.
 * @postconditions creates a toolbar in the mainToolbar div
 * @memberOf gen_ui
 */
QM_LabUI.prototype.genToolbar = function() {
	webix.ui({
		container:"mainToolbar",
		view:"toolbar",
		elements: [
				{ view:"button", width: 100, value: "New", id:"new"},
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
 * Creates the property display box
 * @preconditions webix.js has been imported, the html doc has been loaded, the
 *   graph has been instantiated
 * @postconditions creates a property box in the propertiesForm div
 * @memberOf gen_ui
 */
QM_LabUI.prototype.genPropertiesForm = function() {

	// { margin:5, cols:[
 //            { view:"button", value:"Login" , type:"form" },
 //            { view:"button", value:"Cancel" }
 //    ]}
		document.getElementById("propertiesForm").innerHTML = "";
		if(selected[0]) {
			if (selected[0].attributes.type === "QMLab.Connection") {
				this.createConnectionPropertyForm();
			}
			else if (selected[0].attributes.type === "QMLab.Transition" ||
					 selected[0].attributes.type === "QMLab.Flow") {

				this.createLinkPropertyForm();
			}
			else if (selected[0].attributes.type === "QMLab.ImageNode" ||
					 selected[0].attributes.type === "QMLab.Agent") {

				this.createImagePropertyForm();
			}
			else {
				this.createDefaultPropertyForm();
			}
		}
		else {
			this.createEmptyPropertyForm();
		}
}

/**
 * Creates an empty property form in the webix ui
 * @preconditions webix.js has been imported, the html doc has been loaded, the
 *   graph has been instantiated
 * @postconditions the webix ui has a properties form instantiated
 * @memberOf gen_ui
 */
QM_LabUI.prototype.createEmptyPropertyForm = function() { 
	webix.ui({
		id:"propertiesFormId",
		container:"propertiesForm",
		view: "form",
		rows: [
			{ view:"label", label:"Properties", css:"sidebarTitle" },

		]
	});
}

/**
 * Creates an empty link property form in the webix ui
 * @preconditions webix.js has been imported, the html doc has been loaded, the
 *   graph has been instantiated
 * @postconditions the webix ui has a link property form instantiated
 * @memberOf gen_ui
 */
QM_LabUI.prototype.createLinkPropertyForm = function() {
	var width = $(window).height();
	var preventOverhangOffset = 75;
	width -= preventOverhangOffset;

	webix.ui({
		id:"propertiesFormId",
		container:"propertiesForm",
		view: "form",
		rows: [
			{ view:"label", label:"Properties", css:"sidebarTitle" },
			{margin: 5, cols:[
				{ view:"text", label:"Text", name:"text", id:"text" },
				{ view:"text", label:"Text Size", name:"textsize", id:"textsize" },
				{ view:"colorpicker", label:"Text Color", name:"textcolor", value:"", id:"textcolor" },
				{ view:"colorpicker", label:"Color", name:"color", value:"", id:"color" }
			]},
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

	$$("color").attachEvent("onChange", function(id){
        if(selected[0]){
			selected[0].setColour(id);
			updateCollabGraph();
		}
	});
}

/**
 * Creates an empty connection property form in the webix ui
 * @preconditions webix.js has been imported, the html doc has been loaded, the
 *   graph has been instantiated
 * @postconditions the webix ui has a connection property form instantiated
 * @memberOf gen_ui
 */
QM_LabUI.prototype.createConnectionPropertyForm = function() {
	var width = $(window).height();
	var preventOverhangOffset = 75;
	width -= preventOverhangOffset;

	webix.ui({
		id:"propertiesFormId",
		container:"propertiesForm",
		view: "form",
		rows: [
			{ view:"label", label:"Properties", css:"sidebarTitle" },
			{margin: 5, cols:[
				{ view:"button", label:"Positive", name:"positive", id:"positive" },
				{ view:"button", label:"Negative", name:"negative", id:"negative" },
				{ view:"button", label:"Ambiguous", name:"ambiguous", id:"ambiguous" },
				{ view:"button", label:"No Type", name:"none", id:"none" },
				{ view:"colorpicker", label:"Color", name:"color", value:"", id:"color" },
			]},
		]
	});


	$$("color").attachEvent("onChange", function(id){
        if(selected[0]){
			selected[0].setColour(id);
			updateCollabGraph();
		}
	});

	$$("positive").attachEvent("onItemClick", function(id){
        if(selected[0]){
			selected[0].setPositiveTransition();
			updateCollabGraph();
		}
	});

	$$("negative").attachEvent("onItemClick", function(id){
        if(selected[0]){
			selected[0].setNegativeTransition();
			updateCollabGraph();
		}
	});

	$$("ambiguous").attachEvent("onItemClick", function(id){
        if(selected[0]){
			selected[0].setAmbiguousTransition();
			updateCollabGraph();
		}
	});

	$$("none").attachEvent("onItemClick", function(id){
        if(selected[0]){
			selected[0].setNoTransition();
			updateCollabGraph();
		}
	});



}

/**
 * Creates an empty default property form in the webix ui
 * @preconditions webix.js has been imported, the html doc has been loaded, the
 *   graph has been instantiated
 * @postconditions the webix ui has a default property form instantiated
 * @memberOf gen_ui
 */
QM_LabUI.prototype.createDefaultPropertyForm = function() {
	var width = $(window).height();
	var preventOverhangOffset = 75;
	width -= preventOverhangOffset;

	webix.ui({
		id:"propertiesFormId",
		container:"propertiesForm",
		view: "form",
		rows: [
			{ view:"label", label:"Properties", css:"sidebarTitle" },
			{margin: 5, cols:[
				{ view:"text", label:"Text", name:"text", id:"text" },
				{ view:"text", label:"Text Size", name:"textsize", id:"textsize" },
				{ view:"colorpicker", label:"Text Color", name:"textcolor", value:"", id:"textcolor" },
				{ view:"colorpicker", label:"Color", name:"color", value:"", id:"color" }
			]},
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


	$$("color").attachEvent("onChange", function(id){
        if(selected[0]){
			selected[0].setColour(id);
			updateCollabGraph();
		}
	});



}

/**
 * Create and image property form on the UI
 * @todo  Add in preconditions/postconditions/history/invariants
 * @memberOf gen_ui
 */
QM_LabUI.prototype.createImagePropertyForm = function() {
	var width = $(window).height();
	var preventOverhangOffset = 75;
	width -= preventOverhangOffset;

	webix.ui({
		id:"propertiesFormId",
		container:"propertiesForm",
		view: "form",
		rows: [
			{ view:"label", label:"Properties", css:"sidebarTitle" },
			{margin: 5, cols:[
				{ view:"text", label:"Text", name:"text", id:"text" },
				{ view:"text", label:"Text Size", name:"textsize", id:"textsize" },
				{ view:"colorpicker", label:"Text Color", name:"textcolor", value:"", id:"textcolor" },
				{ view:"colorpicker", label:"Color", name:"color", value:"", id:"color" },
				{ view:"text", label:"Img URL", name:"imgURL", id:"url"}
			]},
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
 * Deselects all of the elements from both views in the tabbar
 * @preconditions webix.js has been loaded, the tabbar has been initialized into
 *   objectSelectTabbar, the html doc has been loaded
 * @postconditions the node tab and link tab for the item selection tabbar will
 *   not have an item selected
 * @memberOf gen_ui
 */
QM_LabUI.prototype.deselectUIElements = function() {
	$$("nodeListView").unselectAll();
	$$("linkListView").unselectAll();
}
