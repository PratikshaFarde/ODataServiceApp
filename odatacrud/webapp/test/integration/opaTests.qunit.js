/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["odatacrud/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
