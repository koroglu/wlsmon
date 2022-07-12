var panelFrameMP = null;
var operation = new Ext.data.Operation({
    gname: 'CacheUsage'
});

var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'listCaches'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'list', idProperty: 'value' }
	 }
});

var comboFilesCache = new Ext.form.ComboBox({
    store: storeFiles,
    width:900,
    displayField:'value',
    triggerAction: 'all',
    typeAhead: true,
    multiSelect:false,
    mode: 'local',
    dscField:'dsc',valueField:'value',
    emptyText:'Select file from list...'
});

var button = new Ext.Button({
	text:'Download File',
	handler:function() {
		document.location='./download?filename='+comboFilesCache.getValue();
	
	}
});

var comboAndButton = new Ext.Panel({
	border:false,
	items:[comboFilesCache,button],
	layout:'column'
});

var panel = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboAndButton]
});

Ext.getCmp('tabs').add({id:'CacheUsage',items:[panel],title:'CacheUsage', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('CacheUsage');


