/*global QUnit*/

sap.ui.define([
	"firstproject/controller/ViewRegister.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ViewRegister Controller");

	QUnit.test("I should test the ViewRegister controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
