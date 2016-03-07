window.onload = function() {
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
				{ view:"button", width: 100, value: "Share"
				}
			],
		elementsConfig:{
			width: 150,
			labelAlign:"right",
			value:"edit"}
	});

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


    $$("nodeListView").attachEvent("onItemClick", function(id, e){
        console.log("Value changed from: to: ");
    });
};

