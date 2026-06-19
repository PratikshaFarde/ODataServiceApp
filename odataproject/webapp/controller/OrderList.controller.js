sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("odataproject.controller.OrderList", {
        onInit: function () {
            // No manual API calling code needed here! 
            // The OData framework reads items="{/Orders}" from the view and calls the URL automatically.
        },

        /**
         * Triggered when a user clicks an item row or the "View Details" button
         */
        onOrderSelect: function (oEvent) {
            // Get the binding context of the clicked row
            var oBindingContext = oEvent.getSource().getBindingContext();
            var sOrderID = oBindingContext.getProperty("OrderID");

            MessageToast.show("Selected Order ID: " + sOrderID);

            // Get the router instance and trigger navigation
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteOrderDetail", {
            orderId: sOrderID
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                // The history contains a previous entry, go back natively
                window.history.go(-1);
            } else {
                // No history found, explicitly navigate back to your initial route
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteFileUpload", {}, true); 
            }
        }
    });
});
