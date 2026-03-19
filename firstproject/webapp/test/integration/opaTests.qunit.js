/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["firstproject/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
