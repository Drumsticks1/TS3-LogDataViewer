// js/modules/tables/example.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Example module for documentation of the general structure of table modules and common attributes & methods
 * Doesn't have any usage in the project and isn't included in index.html
 */
(function (parent) {
    var module = parent.client = parent.client || {};

    /**
     * The name of the module
     * @type {string}
     */
    module.name = "example";

    /**
     * The element containing the table
     * @type {Element}
     */
    module.div = document.getElementById("ts3-exampleTable");

    /**
     * Returns the table div (calls document.getElementById("tableDivId"))
     * @returns {Element}
     */
    module.getTableDiv = function () {
        return document.getElementById("exampleTable");
    };

    /**
     * The input object of type checkbox in the tableSelection section that toggles the table of this module
     * @type {Element}
     */
    module.checkbox = module.checkbox || undefined;

    /**
     * Builds the example table
     */
    module.build = function () {
        // ...
    };

    return module;
}(ts3ldv.tables || {}));
