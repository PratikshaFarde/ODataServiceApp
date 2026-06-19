sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, History, MessageBox, MessageToast, JSONModel, Filter, FilterOperator, Fragment) {
    "use strict";

    return Controller.extend("odataproject.controller.OrderDetails", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteOrderDetail").attachPatternMatched(this._onObjectMatched, this);
            
            var aMockCompanyCodes = [
                { CompanyCode: "1010", CompanyName: "SAP Germany HQ" },
                { CompanyCode: "1710", CompanyName: "SAP USA Inc." },
                { CompanyCode: "2010", CompanyName: "SAP Canada Ltd" },
                { CompanyCode: "4010", CompanyName: "SAP Australia Pty" },
                { CompanyCode: "9000", CompanyName: "Local Test Subsidiary" }
            ];

            var oTestModel = new JSONModel({
                CompanyCodeSet: aMockCompanyCodes
            });

            this.getView().setModel(oTestModel, "testModel");

            // NEW: Create a completely isolated, local state model for your shared text string
            var oUiStateModel = new JSONModel({
                selectedCompanyText: "" // Starts empty when screen loads
            });
            this.getView().setModel(oUiStateModel, "localUiState");
        },

        _onObjectMatched: function (oEvent) {
            var sOrderId = oEvent.getParameter("arguments").orderId;
            var oView = this.getView();
            var sObjectPath = "/Orders(" + sOrderId + ")";

            // Reset the local shared column text back to blank for a fresh page look
            oView.getModel("localUiState").setProperty("/selectedCompanyText", "");

            oView.bindElement({
                path: sObjectPath,
                parameters: {
                    expand: "Order_Details"
                },
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain", {}, true);
            }
        },

        onSave: function () {
            var oModel = this.getView().getModel();
            var oView = this.getView();
           
            if (!oModel.hasPendingChanges()) {
                MessageToast.show("No changes made to data.");
                return;
            }
            var oPendingChanges = oModel.getPendingChanges();
            console.log("--- Raw Payload Object ---", oPendingChanges);

            var sJsonPayload = JSON.stringify(oPendingChanges, null, 4);
            console.log("--- Clean JSON Model Request ---");
            console.log(sJsonPayload);

            oView.setBusy(true);

            oModel.submitChanges({
                success: function (oData) {
                    oView.setBusy(false);
                    MessageBox.success("Order changes saved successfully!");
                },
                error: function (oError) {
                    oView.setBusy(false);
                    MessageBox.error("Save failed: " + oError.message);
                }
            });
        },

        onCompanyCodeValueHelp: function (oEvent) {
            var oView = this.getView();
            
            // FIX 1: Explicitly define the input control being clicked
            var oInput = oEvent.getSource(); 
            this._oValueHelpInput = oInput;

            // FIX 2: Safely extract the binding context from the defined oInput variable
            this._oActiveRowContext = oInput.getBindingContext(); 

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "odataproject.fragment.CompanyCodeDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        
        onValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                filters: [
                    new Filter("CompanyCode", FilterOperator.Contains, sValue),
                    new Filter("CompanyName", FilterOperator.Contains, sValue)
                ],
                and: false
            });

            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onValueHelpConfirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            
            if (oSelectedItem) {
                var oBindingContext = oSelectedItem.getBindingContext("testModel");
                var oSelectedData = oBindingContext.getObject();

                var sCode = oSelectedData.CompanyCode;
                var sName = oSelectedData.CompanyName;

                var oModel = this.getView().getModel();
                var oMainViewContext = this.getView().getBindingContext();

                 // Format the text string exactly how you want it to appear
                var sFormattedText = oSelectedData.CompanyCode + " (" + oSelectedData.CompanyName + ")";

                // Update the single shared local variable in memory
                this.getView().getModel("localUiState").setProperty("/selectedCompanyText", sFormattedText);
                
                // Update the single root Order Header context location
                if (oMainViewContext) {
                    var sCurrentHeaderPath = oMainViewContext.getPath();
                    oModel.setProperty(sCurrentHeaderPath + "/CompanyCode", sCode);
                    oModel.setProperty(sCurrentHeaderPath + "/CompanyName", sName);
                }
            }
            
            oEvent.getSource().getBinding("items").filter([]);
        },

        onValueHelpClose: function (oEvent) {
            oEvent.getSource().getBinding("items").filter([]);
        }
    });
});