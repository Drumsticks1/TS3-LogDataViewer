// js/ts3ldv.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Main module.
 */
const ts3ldv = {
  /**
   * Json object containing the data from the latest received output.json.
   * @type {{}}
   */
  Json: {}
};

document.addEventListener("DOMContentLoaded", function () {
  $(document).foundation();

  ts3ldv.controlSection.build();
  ts3ldv.navBar.build();

  ts3ldv.storage.importLocalStorage();

  ts3ldv.tables.addCustomTablesorterParsers();

  ts3ldv.tables.build();
});
