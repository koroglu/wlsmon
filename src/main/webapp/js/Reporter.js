var panelFrameMP = null;
var operation = new Ext.data.Operation({
    gname: 'MBeanReporter'
});

var storeFiles= new Ext.data.JsonStore({
	autoLoad:true,
	fields:['id','reporterType'],
	proxy: {
        type: 'ajax',
    	url:'./listReporter.ajax',
        reader: {type: 'json', root: 'list', idProperty: 'id' }
	 }
});

var comboReporter = new Ext.form.ComboBox({
    store: storeFiles,
    width:900,
    displayField:'reporterType',
    triggerAction: 'all',
    typeAhead: true,
    multiSelect:false,
    mode: 'local',
    dscField:'reporterType',valueField:'id',
    emptyText:'Select Reporter from list...'
});


var button = new Ext.Button({
	text:'Create Report',
	handler:function() {
		Ext.TaskManager.start({
			  run: function(){

					Ext.Ajax.request( {
						url:'./MBeanReporter?reporterType='+comboReporter.getDisplayValue(),
						success:function(response) {
							 var text = response.responseText;
							 textReports.setValue(textReports.getValue()+text);
						}
					});
			  },
			  interval: 5000
			});
	}
});


var buttonStopAll = new Ext.Button({
	text:'Stop Auto Filling...',
	handler:function() {
		Ext.TaskManager.stopAll();
	}
});


var textReports = new Ext.form.TextArea({
	name:'textReports',
	overflow:'auto',
	autoScroll:true,
	value:"", 
	width:"90%",
	minHeight:500,
	scrollable:true
});

	

var panel = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	items:[comboReporter,
		button,
		textReports,buttonStopAll]
});


Ext.getCmp('tabs').add({id:'MBeanReporter',items:[panel],title:'MBeanReporter Statistics', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('MBeanReporter');


