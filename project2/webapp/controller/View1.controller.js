sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "xlsx/XLSX",
    "xlsx/xlsx.full.min"
], (Controller,XLSX) => {
    "use strict";

    return Controller.extend("project2.controller.View1", {
        onInit() {
        },
        onDownload : function(){
            var rows = [];
            var selection = this.getView().byId('idProductTable').getSelectedItems();
            selection.forEach( val =>{
                var data = val.getBindingContext().getObject();
                delete data['_metadata']; // to delete particular column
                rows.push(data);
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook,worksheet,"Product Sheet");
            XLSX.writeFile(workbook,"Product Data.xlsx",{compression:true});
        }
    });
});