var panelFrameMem=null;

var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'Meminfo'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'files', idProperty: 'value' }
	 }
});

var comboFilesMem = new Ext.form.ComboBox({
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
		if(panelFrameMem) panelMem.remove(panelFrameMem,false);
		panelFrameMem = Ext.create('Ext.Panel', {
			 height:700,
			 script:true,
			 frame:true,
			 scrollable:true,
			 html: '<iframe id="reportframe" width="80%" height="100%" src="./iframe-meminfo.html" onLoad="this.width=screen.width-230;this.height=screen.height;"></iframe>',
		});

		panelMem.add(panelFrameMem);
	
	}
});

var comboAndButton = new Ext.Panel({
	border:false,
	items:[comboFilesMem,button],
	layout:'column'
});

var panelMem = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboAndButton]
});

Ext.getCmp('tabs').add({id:'MemStat',items:[panelMem],title:'Mem Info', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('MemStat');