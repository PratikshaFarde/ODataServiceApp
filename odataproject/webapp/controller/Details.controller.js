sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",], function(Controller, UIComponent, JSONModel) {
"use strict";
return Controller.extend("odataproject.controller.Details", {

onInit: function(){

    var oRouter = UIComponent.getRouterFor(this);
    oRouter.getRoute("RouteViewDetail").attachPatternMatched(this._onObjectMatched, this);

    // Create dummy data
        var oData = {
            SelectedCountry: "IN",
            CountriesCollection: [
                {key: "IN", text: "India"},
                {key: "US", text: "United States"},
                {key: "DE", text: "Germany"}
            ]
        };
        
        // Set the model to the view
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "local");

},
onSelectionChange: function(oEvent) {
    var oComboBox = oEvent.getSource();
    var sSelectedKey = oComboBox.getSelectedKey();
    var sSelectedText = oComboBox.getValue();
    
    // Do something with sSelectedKey
    console.log("Selected Key: " + sSelectedKey);
    console.log("Selected Text: " + sSelectedText);
},

onNext: function(){
    var router = sap.ui.core.UIComponent.getRouterFor(this);
    router.navTo("RouteViewFileUpload");
},

_onObjectMatched: function(oEvent){
    var oArgs = oEvent.getParameter("arguments");
    var sProductID = oArgs.productId; // numeric
    var sPath = "/Products(" + sProductID + ")"; // matches your URL
   
    this.getView().bindElement({
    path: sPath,
        events: {
            change: function () {
                console.log("Binding Context",
                    this.getView().getBindingContext());
            }.bind(this)
        }
    });
   
    this.getView().bindElement({
    path: sPath,
    events: {
    dataRequested: function(){ this.getView().setBusy(true); }.bind(this),
    dataReceived: function(){ this.getView().setBusy(false); }.bind(this)
}
});
}
});
})
// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ], (Controller) => {
//     "use strict";

//     return Controller.extend("odataproject.controller.Details", {
//         onInit: function() {
//             var oRouter = sap.ui.core.UIComponent.getRouter(this);
//             oRouter.getRoute("RouteViewDetail").attachMatched(this._onload,this);
//         },
//         onload: function(oEvent){
//             var oArgs,oView;
//             oArgs = oEvent.getParameter("arguments");
//             oView = this.getView();
//             oView.bindElement({
//                 path:"/Product("+oArgs.productID+")",
//                 event:{
//                     dataRequester:function(){oView.setBusy(true)},
//                     dataReceived:function(){oView.setBusy(false)}
//                 }
//             })
//         }
//     });
// });