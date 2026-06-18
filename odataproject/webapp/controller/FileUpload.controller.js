/* global XLSX */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    // Use .extend() to create a standard UI5 controller object
    return Controller.extend("odataproject.controller.FileUpload", {
        
        onInit: function () {
            // 1. Initialize the local JSON model at runtime
            var oModel = new JSONModel({ items: [] });
            this.getView().setModel(oModel, "excelModel");

            // 1. Initialize the Table model (needed for Section 2 table)
            var oLocationModel = new JSONModel({ selectedData: [] });
            this.getView().setModel(oLocationModel, "locationModel");

            // 2. Define your dynamic list of items (e.g., from an API, Excel parser, or backend array)
            var aDynamicStates = [
                { key: "", text: "-- Select State --" },
                { key: "NY", text: "New York" },
                { key: "CA", text: "California" },
                { key: "TX", text: "Texas" },
                { key: "FL", text: "Florida" },
                { key: "WA", text: "Washington" }, // Added dynamically
                { key: "IL", text: "Illinois" }     // Added dynamically
            ];

            // 3. Create a model for the dropdown and set it to the view
            var oDropdownModel = new JSONModel({ states: aDynamicStates });
            this.getView().setModel(oDropdownModel, "dropdownModel");
    
        },

        onExcelUpload: function (oEvent) {
            // 2. Safely grab the first file array element from the browser event
            var oFile = oEvent.getParameter("files")[0];
            if (!oFile) {
                return;
            }

            // 3. Use native Browser FileReader API
            var oReader = new FileReader();
            
            oReader.onload = function (e) {
                try {
                    var data = new Uint8Array(e.target.result);
                    
                    // 4. Read the binary data using SheetJS library
                    var oWorkbook = XLSX.read(data, { type: 'array' });
                    
                    // 5. Grab the very first sheet string name safely via index 0
                    var sFirstSheetName = oWorkbook.SheetNames[0];
                    var oWorksheet = oWorkbook.Sheets[sFirstSheetName];
                    
                    // 6. Convert sheet rows into a JSON array
                    var aJsonData = XLSX.utils.sheet_to_json(oWorksheet);
                    
                    if (aJsonData.length === 0) {
                        MessageToast.show("The selected file is empty.");
                        return;
                    }

                    // 7. Update the model to refresh the table UI dynamically
                    this.getView().getModel("excelModel").setProperty("/items", aJsonData);
                    MessageToast.show("Successfully loaded " + aJsonData.length + " rows.");
                    
                } catch (oError) {
                    console.error("EXCEL PARSING DEBUG ERROR: ", oError); // <-- Add this line here
                    MessageToast.show("Error parsing Excel file. Ensure format is valid.");
                }
            }.bind(this); // Preserves controller instance scope context inside asynchronous callback

            // Start reading the file from the browser
            oReader.readAsArrayBuffer(oFile);
        },

        onStateChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sKey = oSelectedItem.getKey();
            var sText = oSelectedItem.getText();

            // Exit early if the placeholder "-- Select State --" is chosen
            if (!sKey) { return; }

            var sCountry = "United States"; 

            var oNewRow = {
                stateCode: sKey,
                stateName: sText,
                country: sCountry
            };

            var oModel = this.getView().getModel("locationModel");
            oModel.setProperty("/selectedData", [oNewRow]);

            // var oSelectedItem = oEvent.getParameter("selectedItem");
            // var sKey = oSelectedItem.getKey();
            // var sText = oSelectedItem.getText();

            // // Exit early if the placeholder "-- Select State --" is chosen
            // if (!sKey) { return; }

            // // 2. Define country mapping based on the state key
            // var sCountry = "United States"; 

            // // 3. Construct the new row data object
            // var oNewRow = {
            //     stateCode: sKey,
            //     stateName: sText,
            //     country: sCountry
            // };

            // // 4. Update the table model with the selected item
            // var oModel = this.getView().getModel("locationModel");
            
            // // To show only the CURRENT selection, overwrite the array:
            // oModel.setProperty("/selectedData", [oNewRow]);

            // OPTIONAL alternative: To APPEND every chosen state as a new history row:
            // var aCurrentData = oModel.getProperty("/selectedData");
            // aCurrentData.push(oNewRow);
            // oModel.setProperty("/selectedData", aCurrentData);
        }

    });
});