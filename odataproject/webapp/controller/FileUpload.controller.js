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
        },

        onNavigateNext: function () {
            // 1. Get the router instance for your app
            var oRouter = this.getOwnerComponent().getRouter();
            
            // 2. Navigates to the target route defined in your manifest.json
            oRouter.navTo("RouteOrderListPage"); 
        },

        onFileChange: function(oEvent) {
            var oFileUploader = oEvent.getSource();
            var file = oEvent.getParameter("files")[0];
            
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var vContent = e.target.result;
                    // Store base64 data (strip the data:application/pdf;base64, prefix)
                    this._fileContent = vContent.split(",")[1];
                    this._fileName = file.name;
                }.bind(this);
                reader.readAsDataURL(file);
            }
        },
        
        onUploadPress: function () {
          var oFileUploader = this.byId("pdfUploader");
            
            // 1. Get the DOM input element inside the UI5 control
            var oDomRef = oFileUploader.getFocusDomRef();
            var oFile = oDomRef.files[0];

            if (!oFile) {
                MessageToast.show("Please select a local PDF file first.");
                return;
            }
            // 2. Initialize the standard JavaScript FileReader
            var oReader = new FileReader();

            // 3. Define what happens once the file is fully read
            oReader.onload = function (e) {
                var sRawResult = e.target.result;
                
            // This splits the header metadata to leave you with the pure base64 string
                var sBase64Data = sRawResult.split(",")[1]; 

            // 4. Print results to your browser developer console (F12) to inspect
                console.log("=== POC PDF SUCCESS ===");
                console.log("File Name Target:", oFile.name);
                console.log("File Size Target:", oFile.size, "bytes");
                console.log("Raw Base64 Payload:", sBase64Data);
                console.log("=======================");

            // 5. Visual confirmation pop-up inside your Fiori Application
                MessageBox.success("Fiori successfully read '" + oFile.name + "'!\n\nOpen your Browser Developer Console (F12) to see the generated Base64 data string payload.");
            };

            // 4. Trigger the local read as a DataURL string
                oReader.readAsDataURL(oFile);
                MessageToast.show("Reading local file contents...");
        }
        
    });
});