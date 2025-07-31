/*global QUnit*/

sap.ui.define([
	"com/sap/lh/mr/zlhlegcorrespodence/controller/correspondence.controller"
], function (Controller) {
	"use strict";

	QUnit.module("correspondence Controller");

	QUnit.test("I should test the correspondence controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
