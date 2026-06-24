sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "odataproject/formatter/formatter"
], function (Controller, formatter) {
  "use strict";
  return Controller.extend("odataproject.controller.SmartTable", {
    formatter: formatter,
    onInit: function () {
      // ...
    }
  });
});