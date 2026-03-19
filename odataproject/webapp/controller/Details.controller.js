sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent"], function(Controller, UIComponent){
"use strict";
return Controller.extend("odataproject.controller.Details", {
onInit: function(){
var oRouter = UIComponent.getRouterFor(this);
oRouter.getRoute("RouteViewDetail").attachPatternMatched(this._onObjectMatched, this);
},
_onObjectMatched: function(oEvent){
var oArgs = oEvent.getParameter("arguments");
var sProductID = oArgs.productId; // numeric
var sPath = "/Products(" + sProductID + ")"; // matches your URL
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