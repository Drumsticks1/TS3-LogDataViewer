// js/modules/controlSection/tableSelection.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions and attributes that are related to the table selection section in the control section
 */
(function (parent) {
    var module = parent.tableSelection = parent.tableSelection || {};

    /**
     * The element containing the table selection section.
     * @type {Element}
     */
    module.div = document.createElement("div");

    /**
     * Adds a checkbox and a label div for the table module in the tableSelection section that can then be used for
     * selecting the tables that are shown and built
     * @param tableModule the table module
     */
    module.addTableCheckboxDiv = function (tableModule) {
        var div = document.createElement("div");

        tableModule.checkbox = document.createElement("input");
        tableModule.checkbox.id = tableModule.name + "Checkbox";
        tableModule.checkbox.type = "checkbox";

        var label = document.createElement("label");
        // Todo: proper innerText (e.g. 'Client table', currently is 'client')
        label.innerText = tableModule.name;
        label.htmlFor = tableModule.name + "Checkbox";

        // Styling of the divs
        switch (tableModule) {
            case ts3ldv.tables.ban:
                div.className = "small-12 medium-6 large-6 columns";
                break;
            case ts3ldv.tables.client:
                div.className = "small-12 medium-12 large-6 columns";
                break;

            default:
                div.className = "small-12 medium-6 large-4 columns";
        }

        div.appendChild(tableModule.checkbox);
        div.appendChild(label);
        this.div.appendChild(div);
    };

    /**
     * Adds a checkbox event listener for the table module that displays/hides the table and the navbar scroll
     * button for the table and builds the table if it wasn't built since the last output.json fetch.
     *
     * @param tableModule the table module
     */
    module.addTableCheckboxEventListener = function (tableModule) {
        tableModule.checkbox.onclick = function () {
            if (this.checked) {
                ts3ldv.storage.setTableActive(tableModule, true);

                // Build table if necessary (= not already built and only hidden)
                if (!ts3ldv.storage.getTableBuilt(tableModule))
                    ts3ldv.tables.buildTableEnhanced(tableModule);

                tableModule.div.style.display = "";
                ts3ldv.navBar.showScrollToButton(tableModule);
            } else {
                ts3ldv.storage.setTableActive(tableModule, false);
                tableModule.div.style.display = "none";
                ts3ldv.navBar.hideScrollToButton(tableModule);
            }

            ts3ldv.tables.setFilterPlaceholders(tableModule);
        }
    };

    return module;
}(ts3ldv.controlSection || {}));
