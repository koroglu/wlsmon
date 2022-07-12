var panelframeIO=null;
var operation = new Ext.data.Operation({
    gname: 'IoStat'
});


var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={gname:'Iostat'}
		}
	},
	fields:['dsc','value'],
	proxy: {
        type: 'ajax',
    	url:'./data/listFiles',
        reader: {type: 'json', root: 'files', idProperty: 'value' }
	 }
});

var comboFilesIO = new Ext.form.ComboBox({
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


var storeDevices= new Ext.data.JsonStore({
	listeners:{
		beforeLoad:function(store,operation,eOpts) {
			operation.params={
				filename:comboFilesIO.getValue()
			}
		}
	},
	proxy: {
        type: 'ajax',
    	url:'./data/deviceList.json',
        reader: {type: 'json', root: 'devices', idProperty: 'value' }
	},
	fields: [ {type: 'string', name: 'dsc'}, {type: 'string', name: 'value'}]
});

var comboDevices = new Ext.form.ComboBox({
    store: storeDevices,
    width:200,
    displayField:'value',
    triggerAction: 'all',
    mode: 'local',
    lazyRender: true,
    valueField: 'value',
    displayField: 'dsc',
    emptyText:'Select device from list...'
 });


var button = new Ext.Button({
	text:'Create Report',
	handler:function() {
		if(panelframeIO) panelIO.remove(panelframeIO,false);
		panelframeIO = Ext.create('Ext.Panel', {
			 height:700,
			 script:true,
			 frame:true,
			 scrollable:true,
			 html: '<iframe id="reportframe" width="80%"  src="./iframe-iostat.html" onLoad="this.width=screen.width-230;this.height=screen.height;"></iframe>',
		});

		panelIO.add(panelframeIO);
	
	}
});

comboFilesIO.on('select',function(combo,record,index){
	storeDevices.load();
});


var panelInner = new Ext.Panel({
	border:false,
	layout:'column',
	items:[comboFilesIO,comboDevices,button]
});

var panelIO = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[panelInner]
});

Ext.getCmp('tabs').add({id:'IOStat',items:[panelIO],title:'IO Stat', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('IOStat');