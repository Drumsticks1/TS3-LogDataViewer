// js/ts3ldv.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Main module.
 */
var ts3ldv = (function (module) {

    /**
     * The nanobar object.
     */
    module.nanobar = new Nanobar({
        id: "nanobar"
    });

    /**
     * Json object containing the data from the latest received output.json.
     * @type {{}}
     */
    module.Json = {};

    return module;
}(ts3ldv || {}));

/**
 * Adds the custom tablesorter parsers.
 * ignoreMoment:    Ignores the moment.js timestamps ("x ago").
 * connections:     Ignores the expand/collapse buttons in the Connections column.
 * ips:             Ignores the expand/collapse buttons in the IPs column.
 */
function addCustomParsers() {
    $.tablesorter.addParser({
        id: "ignoreMoment",
        format: function (s) {
            return s;
        },
        type: "text"
    });

    $.tablesorter.addParser({
        id: "connections",
        format: function (s, table, cell) {
            if (localStorage.getItem("connectionsSortType") === "1") {
                if (cell.firstChild.localName === "button")
                    return cell.childNodes[1].innerHTML;
                else
                    return cell.firstChild.innerHTML;
            } else
                return cell.lastChild.innerHTML;
        },
        type: "text"
    });

    $.tablesorter.addParser({
        id: "ips",
        format: function (s, table, cell) {
            if (cell.firstChild.localName === "button")
                return cell.childNodes[1].innerHTML;
            else
                return cell.firstChild.innerHTML;
        },
        type: "text"
    });
}

/**
 * Adds a checkbox listener for the table and displays/hides the navbar scroll buttons for the table.
 *
 * @param {string} table - name of the table (e.g. "clientTable"). TODO
 */
function addTableCheckboxListener(tableModule) {
    tableModule.checkbox.onclick = function () {
        var displayString = "";

        if (this.checked) {
            ts3ldv.storage.setTableActive(tableModule, true);

            // Build table if necessary
            if (!ts3ldv.storage.getTableBuilt(tableModule))
                buildTableWithAlertCheckAndLocalStorage(tableModule);

        } else {
            ts3ldv.storage.setTableActive(tableModule, false);
            displayString = "none";
        }

        tableModule.div.style.display = ts3ldv.controlSection.navbar.scrollToButtons[tableModule.name].style.display = displayString;

        setFilterPlaceholders(tableModule);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    $(document).foundation();

    ts3ldv.controlSection.build();
    addCustomParsers();
    ts3ldv.nanobar.go(25);

    ts3ldv.storage.importLocalStorage();

    addTableCheckboxListener(ts3ldv.tables.ban);
    addTableCheckboxListener(ts3ldv.tables.client);
    addTableCheckboxListener(ts3ldv.tables.complaint);
    addTableCheckboxListener(ts3ldv.tables.kick);
    addTableCheckboxListener(ts3ldv.tables.upload);

    ts3ldv.tables.build();
});
