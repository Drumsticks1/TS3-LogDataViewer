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

document.addEventListener("DOMContentLoaded", function () {
    $(document).foundation();

    ts3ldv.controlSection.build();
    ts3ldv.navBar.build();

    addCustomParsers();
    ts3ldv.nanobar.go(25);

    ts3ldv.storage.importLocalStorage();

    ts3ldv.tables.build();
});
