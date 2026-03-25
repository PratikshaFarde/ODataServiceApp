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
        },
        //not working now
        onAdd: function (oEvent) {
            var that = this;
            var oView = this.getView();

            // read inputs (IDs used in the view toolbar)
            var sName = oView.byId("inpName").getValue();
            var sDescription = oView.byId("inpDescription").getValue();
            var sPrice = oView.byId("inpPrice").getValue();
            var sRating = oView.byId("inpRating").getValue();

            // basic validation
            if (!sName) {
                sap.m.MessageToast.show("Please enter Name");
                return;
            }

            // prepare payload - adjust property names to match your OData entity
            var oPayload = {
                Name: sName,
                Description: sDescription,
                Price: sPrice,
                Rating: sRating
            };

            // get OData model from component
            var oModel = this.getOwnerComponent().getModel();
            if (!oModel) {
                sap.m.MessageToast.show("OData model not available");
                return;
            }

            // disable batch if you want immediate create call (optional)
            oModel.setUseBatch(false);
            
            var oDuplicateData = oEvent.getSource().getBindingContext().getObject();
            oDuplicateData.ID = 200;
            oDuplicateData.Name = sName;
            oDuplicateData.Description = sDescription;
            oDuplicateData.Price = sPrice;
            oDuplicateData.Rating = sRating;

            oModel.create("/Products", oDuplicateData, {
                success: function (odata){
                    that.onReadAll();
                    sap.m.MessageToast.show("Product created");
                    // clear inputs
                oView.byId("inpName").setValue("");
                oView.byId("inpDescription").setValue("");
                oView.byId("inpPrice").setValue("");
                oView.byId("inpRating").setValue("");
                },
                error: function(oError){
                    console.log(oError);
                }
            })

            // create entry
            // oModel.create("/Products", oPayload, {
            //     success: function (oDataResponse) {
            //     sap.m.MessageToast.show("Product created");
            //     // refresh list - call your method to read all items
            //     if (that.onReadAll) {
            //         that.onReadAll();
            //     } else {
            //         // fallback: refresh the Products binding if table exists
            //         var oTable = that.byId("idProducts");
            //         if (oTable) {
            //         var oBinding = oTable.getBinding("items");
            //         if (oBinding) { oBinding.refresh(); }
            //         }
            //     }

            //     // clear inputs
            //     oView.byId("inpName").setValue("");
            //     oView.byId("inpDescription").setValue("");
            //     oView.byId("inpPrice").setValue("");
            //     oView.byId("inpRating").setValue("");
            //     },
            //     error: function (oError) {
            //     console.error("Create error:", oError);
            //     // try to extract message
            //     var sMsg = "Create failed";
            //     try {
            //         var oErr = JSON.parse(oError.responseText);
            //         sMsg = oErr.error.message.value || sMsg;
            //     } catch (e) {}
            //     sap.m.MessageToast.show(sMsg);
            //     }
            // });
        }
    });
});