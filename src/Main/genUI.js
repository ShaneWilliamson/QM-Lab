/** NOTE a webix object is referenced like this $$("objectID"), 
make sure that you are using the WEBIX OBJECT ID and not the html element id.
They are not the same thing **/

var genUI = new QM_LabUI();


function QM_LabUI() {
	this.lastClickedValue = "EDIT";	
}

// initalize the emailAddressValue to an empty string
QM_LabUI.prototype.emailAddressValue = "";


/**
	This function is called when the share dialog is open
	It saves what is currently in the emailAddress text box into QM_LabUI.prototype.emailAddressValue
**/
QM_LabUI.prototype.saveEmailAddress = function() {
	QM_LabUI.prototype.emailAddressValue = document.getElementById("emailAddress").value;
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
		var boxHtml = "<input type='text' id='emailAddress' onkeypress='QM_LabUI.prototype.saveEmailAddress()'>";
		webix.message.keyboard = false; // prevent the blocking of keyboard events

		webix.modalbox({
			title:"Enter the Email Address to Share With",
			buttons:["Share", "Cancel"],
			width:"500px",
			text:boxHtml,
			callback:function(result){
				if (result == "0") { // the share button was clicked in the modal
					var fileId = realtimeUtils.getParam('id');
					var trimmedClientId = clientId.split(".")[0];


					var uri = "https://www.googleapis.com/drive/v3/files/" + fileId + "/permissions";
					uri += "?key=" + trimmedClientId;
					// uri += "&access_token=" + access_token;
					uri += "&alt=json";


					var data = {
						"role": "writer",
						"type": "user",
						"emailAddress": QM_LabUI.prototype.emailAddressValue
					};

					$.ajax({
						method: "POST",
						// setting headers
						beforeSend: function (request) {
							var token = "Bearer " + access_token;
			                request.setRequestHeader("authorization", token);
			                request.setRequestHeader("content-type", "application/json");
			            },
						url: uri,
						data: JSON.stringify(data),
						success: function(data) { 
							console.log("Request for permissions change was successful\n" + data);
						},
						error: function(data) { 
							console.log("Request for permissions change was unsuccessful\n" + data.responseText);
						}
					});

				} else if (result == "1") { // the cancel button was clicked
					QM_LabUI.prototype.emailAddressValue = "";
				} else { // trigger exception, because this should never happen

				}
				
			}
		});
	});
}


/**
	Deselects all of the elements from both views in the tabbar
**/
QM_LabUI.prototype.deselectUIElements = function() {
	$$("nodeListView").unselectAll();
	$$("linkListView").unselectAll();
}

