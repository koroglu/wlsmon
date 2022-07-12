var panelframeTop=null;

var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'Top'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'files', idProperty: 'value' }
	 }
});

var comboFilesTop = new Ext.form.ComboBox({
    store: storeFiles,
    width:900,
    displayField:'value',
    triggerAction: 'all',
    typeAhead: true,
    multiSelect:true,
    mode: 'local',
    dscField:'dsc',valueField:'value',
    emptyText:'Select file from list...'
});


var button = new Ext.Button({
	text:'Create Report',
	handler:function() {
		if(panelframeTop) panelTop.remove(panelframeTop,false);
		panelframeTop = Ext.create('Ext.Panel', {
			 height:700,
			 script:true,
			 frame:true,
			 scrollable:true,
			 html: '<iframe id="reportframe" width="80%" height="100%" src="./iframe-topstat.html" onLoad="this.width=screen.width-230;this.height=screen.height;"></iframe>',
		});
		//document.getElementById("reportframe").innerHTML = "Paragraph changed!";
		panelTop.add(panelframeTop);
	
	}
});

var comboAndButton = new Ext.Panel({
	border:false,
	items:[comboFilesTop,button],
	layout:'column'
});

var panelTop = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboAndButton]
});
//title: ONLY title
//id: ID for the tab

//alert("I AM TOPSTAT JS");

Ext.getCmp('tabs').add({id:'TopStat',items:[panelTop],title:'Top Stat', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('TopStat');