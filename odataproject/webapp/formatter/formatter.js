sap.ui.define([
  "sap/ui/core/format/DateFormat"
], function (DateFormat) {
  "use strict";

  function toDate(v) {
    if (!v && v !== 0) {
      return null;
    }
    // Already a Date
    if (v instanceof Date) {
      return v;
    }
    // timestamp (number)
    if (typeof v === "number") {
      return new Date(v);
    }
    // array -> try first element
    if (Array.isArray(v) && v.length > 0) {
      return toDate(v[0]);
    }
    // string -> try to parse
    if (typeof v === "string") {
      // Many browsers parse the example string fine:
      // "Wed Dec 08 1948 05:30:00 GMT+0530 (India Standard Time)"
      var o = new Date(v);
      if (!isNaN(o.getTime())) {
        return o;
      }
      // fallback: try ISO-ish extraction (YYYY-MM-DD)
      var isoMatch = v.match(/(\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2})/);
      if (isoMatch) {
        o = new Date(isoMatch[0]);
        if (!isNaN(o.getTime())) {
          return o;
        }
      }
      return null;
    }
    // object or other: not supported here
    return null;
  }

  return {
    formatShortDate: function (vValue) {
      var oDate = toDate(vValue);
      if (!oDate) {
        return "";
      }
      // ensure we pass a Date to DateFormat (resolves linter complaint)
      var oDateFormat = DateFormat.getDateInstance({ pattern: "dd MMM yyyy" });
      return oDateFormat.format(oDate);
    }
  };
});