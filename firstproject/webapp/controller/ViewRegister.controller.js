sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";
    return Controller.extend("firstproject.controller.ViewRegister", {
        onInit() {
        },
        onLoginPress : function(){
            var username = this.getView().byId('idViewRegisterInputUsername');
            var password = this.getView().byId('idViewRegisterInputPassword');
            var uName = "John"
            var uPassword = "1234"
            if(username.getValue()===''){
                MessageBox.error("Please enter usename");
                return;
            } else 
            if(password.getValue()===''){
                MessageBox.error("Please enter password");
                return;
            } else{
                if(username.getValue() === uName && password.getValue() === uPassword){
                    // MessageBox.success("User Logged In Successfully").theSn(function () {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteViewMain");
                    // }.bind(this));
                } else{
                     MessageBox.error("Something wrong...!");
                      return;
                }
            }
        }
    });
});