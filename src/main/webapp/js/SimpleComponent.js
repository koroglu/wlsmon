/**
 * 
 */

Staj.PersonnelGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
        var config = {
           store:[{adi:'umit'}]
          ,columns:['adi']
          ,viewConfig:{forceFit:true}
        }; // eo config object
 
        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
 
        Staj.PersonnelGrid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent
 
    ,onRender:function() {
        Staj.PersonnelGrid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});


Ext.reg('SimpleComponent', Staj.PersonnelGrid);
