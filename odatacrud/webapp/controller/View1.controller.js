sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("odatacrud.controller.View1", {
        onInit() {
            this.onReadAll();
        },
        onReadAll: function(){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Products",{
                success : function(odata){
                    console.log(odata);
                    var jModel = new sap.ui.model.json.JSONModel(odata);
                    that.getView().byId("idProducts").setModel(jModel);
                }, 
                error : function(onError){
                    console.log(onError);
                }                
            });
        },
        onEdit : function(oEvent){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);

            if(oEvent.getSource().getText() === "Edit"){
                oEvent.getSource().setText("Submit");
                oEvent.getSource().getParent().getParent().getCells()[4].setEditable(true);
            } else {
                oEvent.getSource().setText("Submit");
                oEvent.getSource().getParent().getParent().getCells()[4].setEditable(false);
                var oInput = oEvent.getSource().getParent().getParent().getCells()[4].getValue();
                var oId = oEvent.getSource().getBindingContext().getProperty("ID");
                oModel.update("/Products("+oId+")",{Rating:oInput},{
                    success: function(odata){
                    that.onReadAll();
                },
                error : function(oError){
                    console.log(oError);
                }
            })
            }
        },
        onDuplicate : function(oEvent){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);
            var oDuplicateData = oEvent.getSource().getBindingContext().getObject();
            oDuplicateData.ID = oDuplicateData.ID + 100;
            oModel.create("/Products", oDuplicateData, {
                success: function (odata){
                    that.onReadAll();
                },
                error: function(oError){
                    console.log(oError);
                }
            })
        },
        onDelete : function(oEvent){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);
            var oId = oEvent.getSource().getBindingContext().getProperty("ID");
            oModel.remove("/Products("+oId+")", {
                success: function (odata){
                    that.onReadAll();
                },
                error: function(oError){
                    console.log(oError);
                }
            })
        }
    });
});