var storeDB= new Ext.data.JsonStore({
	autoLoad:true,
	fields:['db','url'],
	proxy: {
        type: 'ajax',
    	url:'./oramon/listDB.ajax',
        reader: {type: 'json', root: 'data', idProperty: 'db' }
	 }
});

var comboDB = new Ext.form.ComboBox({
    store: storeDB,
    fieldLabel:'Select DB ',
    width:500,
    displayField:'db',
    triggerAction: 'all',
    typeAhead: true,
    mode: 'local',
    dscField:'db',
    valueField:'url',
    emptyText:'Select DB from list...'
});


var txtUserName = new Ext.form.TextField({
	value:'',
	fieldLabel:'Username',
	allowBlanks:false 
});


var txtPassword = new Ext.form.TextField({
	value:'',
	fieldLabel:'Password',
	allowBlanks:false,
	inputType: 'password'
});


var txtBaseFolder = new Ext.form.TextField({
	value:'',
	fieldLabel:'Base Folder',
	allowBlanks:false
});

var btn = new Ext.Button({
	text:'OK'
});

btn.on('click',function() {
	Ext.Ajax.request({
		url:'./selectFolder.ajax',
		method:'POST',
		params:{
			folderName:txtBaseFolder.value,
			username:txtUserName.getValue(),
			password:txtPassword.getValue(),
			db:comboDB.getValue()
		},
		success:function(r,o) {
			Ext.Msg.show({
				title:'Root Folder Located',
				msg:'OK',
				buttons: Ext.Msg.OK
			});
			console.log(r.responseText)
		}
	});
});

Ext.Ajax.request({
	url:'./currentRootFolder.ajax',
	success:function(r,o) {
		var sonuc = Ext.decode(r.responseText);
		txtBaseFolder.setValue(sonuc.folder);
	}
});

var panelDB = new Ext.Panel({
	border:false,
	script:true,
	margins:'50 15 10 15 ',
	frame:true,
	items:[comboDB,txtUserName,txtPassword]
});

var panel = new Ext.Panel({
	border:false,
	script:true,
	autoRender:true,
	margins:'20 15 10 15 ',
	items:[txtBaseFolder,panelDB,btn]
});



Ext.getCmp('tabs').add({id:'Management',items:[panel],title:'Management', border:false,frame:false, autoHeight:true, closable:true});
Ext.getCmp('tabs').setActiveTab('Management');