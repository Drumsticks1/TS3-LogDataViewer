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

document.addEventListener("DOMContentLoaded", function () {
    $(document).foundation();

    ts3ldv.controlSection.build();
    ts3ldv.navBar.build();

    ts3ldv.storage.importLocalStorage();

    ts3ldv.tables.addCustomTablesorterParsers();
    ts3ldv.nanobar.go(25);

    ts3ldv.tables.build();
});
