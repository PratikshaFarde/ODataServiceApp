/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["odataproject/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
