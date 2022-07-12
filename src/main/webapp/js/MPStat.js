var panelFrameMP = null;
var operation = new Ext.data.Operation({
    gname: 'MPstat'
});

var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'MPstat'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'files', idProperty: 'value' }
	 }
});

var comboFilesMP = new Ext.form.ComboBox({
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
		if(panelFrameMP) panelMP.remove(panelFrameMP,false);
		panelFrameMP = Ext.create('Ext.Panel', {
			 height:700,
			 script:true,
			 frame:true,
			 scrollable:true,
			 html: '<iframe id="reportframe" width="80%" height="100%" src="./iframe-mpstat.html" onLoad="this.width=screen.width-230;this.height=screen.height;"></iframe>',
		});

		panelMP.add(panelFrameMP);
	
	}
});

var comboAndButton = new Ext.Panel({
	border:false,
	items:[comboFilesMP,button],
	layout:'column'
});

var panelMP = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboAndButton]
});

Ext.getCmp('tabs').add({id:'MPStat',items:[panelMP],title:'Mp Stat', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('MPStat');


