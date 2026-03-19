sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "odataproject/formatter/formatter"
], function (Controller, formatter) {
  "use strict";
  return Controller.extend("odataproject.controller.Table", {
    formatter: formatter,
    onInit: function () {
      // ...
    }
  });
});