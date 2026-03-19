sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, UIComponent,Filter,FilterOperator) {
  "use strict";
  return Controller.extend("odataproject.controller.List", {
    onInit: function () {},

    handleSearch: function (oEvent) {
    var sQuery = oEvent.getParameter("query");
    if (!sQuery) {
        sQuery = oEvent.getSource().getValue(); // fallback
    }

    var aFilters = [];
    if (sQuery && sQuery.length > 0) {
        aFilters.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
    }

    var oList = this.getView().byId("list0");
    var oBinding = oList.getBinding("items");

    // If you want server-side filtering (OData $filter):
    oBinding.filter(aFilters);

    // If you want client-side filtering (only works when data is already loaded on client):
    // oBinding.filter(aFilters, sap.ui.model.FilterType.Application);
    },
    onItemPress: function (oEvent) {
      var oItem = oEvent.getSource();
      var sProductID = oItem.getBindingContext().getProperty("ProductID");
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo("RouteViewDetail", {
        productId: encodeURIComponent(sProductID) 
      });
    }
  });
});