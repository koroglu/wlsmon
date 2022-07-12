var panelFrameVM=null;

var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'Vmstat'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'files', idProperty: 'value' }
	 }
});

var comboFilesVM = new Ext.form.ComboBox({
    store: storeFiles,
    width:600,
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
		if(panelFrameVM) panelVM.remove(panelFrameVM,false);
		panelFrameVM = Ext.create('Ext.Panel', {
			 height:700,
			 script:true,
			 frame:true,
			 scrollable:true,
			 html: '<iframe id="reportframe" width="50%" height="100%" src="./iframe-vmstat.html" onLoad="this.width=screen.width-230;this.height=screen.height;"></iframe>',
		});

		panelVM.add(panelFrameVM);
	
	}
});

var comboAndButton = new Ext.Panel({
	border:false,
	items:[comboFilesVM,button],
	layout:'column'
});

var panelVM = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboAndButton]
});

Ext.getCmp('tabs').add({id:'VmStat',items:[panelVM],title:'Vm Stat', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('VmStat');