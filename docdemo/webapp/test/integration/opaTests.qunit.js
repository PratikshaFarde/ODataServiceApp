/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["docdemo/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
