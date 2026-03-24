sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";
  return Controller.extend("docdemo.controller.View1", {
    onInit: function() {},

    handleUpload: function(oEvent) {
      if (!oEvent) { return; }
      var files = oEvent.getParameter("files");
      if (!files || files.length === 0) { return; }

      var file = files[0];
      var reader = new FileReader();

      reader.onload = (e) => {
        if (typeof XLSX === "undefined") {
          MessageToast.show("XLSX library not loaded");
          return;
        }
        try {
          var data = e.target.result;
          var workbook = XLSX.read(data, { type: "array" });
          var tableData = [];
          workbook.SheetNames.forEach(function(sheetName) {
            var worksheet = workbook.Sheets[sheetName];
            var sheetJson = XLSX.utils.sheet_to_json(worksheet, { defval: null });
            tableData = tableData.concat(sheetJson);
          });
          this.getView().setModel(new sap.ui.model.json.JSONModel({results: tableData}), "tableXLData");
        } catch (err) {
          console.error("Error parsing workbook:", err);
          MessageToast.show("Error parsing Excel file");
        }
      };

      reader.onerror = function(ex) {
        console.error("FileReader error:", ex);
        MessageToast.show("File read error");
      };

      reader.readAsArrayBuffer(file);
    }
  });
});