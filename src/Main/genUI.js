/** NOTE a webix object is referenced like this $$("objectID"), 
make sure that you are using the WEBIX OBJECT ID and not the html element id.
They are not the same thing **/

var lastClickedValue;

/**
    Creates the main toolbar at the top of the main page
**/
function genToolbar() {
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
}

/**
    Creates the tabbar used to select a node/link to place
    Instantiates the tabbar with data from displayData.js
**/
function genTabbar() {
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
        console.log("Value changed in the node list view");
        var index = $$("nodeListView").getIndexById(id);
        lastClickedValue = sample_nodes[index].value;
    });

    $$("linkListView").attachEvent("onItemClick", function(id, e){
        console.log("Value changed in the link list view");
        var index = $$("linkListView").getIndexById(id);
        lastClickedValue = sample_links[index].value;
    });
}


/**
    Function creates the toolbar and tabbar using webix.
**/
function genUI() { 
    genToolbar();
    genTabbar();
};

/**
    Deselects all of the elements from both views in the tabbar
**/
function deselectUIElements() {
    $$("nodeListView").unselectAll();
    $$("linkListView").unselectAll();
}
