var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'jstat'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'files', idProperty: 'value' }
	 }
});

var comboFiles = new Ext.form.ComboBox({
    store: storeFiles,
    width:500,
    displayField:'value',
    triggerAction: 'all',
    typeAhead: true,
    mode: 'local',
    dscField:'dsc',valueField:'value',
    emptyText:'Select file from list...'
});


comboFiles.on('select',function(combo,record,index){
	var panelFrame = Ext.create('Ext.Panel', {
		 height:700,
		 script:true,
		 frame:true,
		 scrollable:true,
		 html: '<iframe id="reportframe" width="80%" height="100%" src="./iframe-jvmjstat.html" onLoad="this.width=screen.width-230;this.height=screen.height;"></iframe>',
	});

	panel.add(panelFrame);
});


var panel = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboFiles]
});

Ext.getCmp('tabs').add({id:'jvmjstat',items:[panel],title:'JVM Jstat', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('jvmjstat');