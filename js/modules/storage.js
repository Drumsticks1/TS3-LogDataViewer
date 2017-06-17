// js/modules/storage.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Layout of the objects used in the browser storage:
 *
 * localStorage.getItem("ts3ldv") -->
 *  {
 *    ban: {
 *      active: bool,
 *      sortOrder: array,
 *      showUID: bool},
 *    client: {
 *      active: bool,
 *      sortOrder: array,
 *      connectionsSortType: bool},
 *    complaint: {
 *      active: bool,
 *      sortOrder: array},
 *    kick: {
 *      active: bool,
 *      sortOrder: array},
 *    upload: {
 *      active: bool,
 *      sortOrder: array}
 *  }
 *
 *
 *
 * sessionStorage.getItem("ts3ldv") -->
 *  {
 *    tableBuilt : {ban: true, ...}}
 *  }
 */


/**
 * Module containing functions that are related to interactions with the localStorage and the sessionStorage.
 */
(function (parent) {
  const module = parent.storage = parent.storage || {};

  /**
   * The key used for storing data in the localStorage and sessionStorage.
   * @type {string}
   */
  module.key = "ts3ldv";

  ////
  // LOCAL STORAGE
  ////

  /**
   * Returns localStorage.ts3ldv[tableModule.name].active
   * @param tableModule
   * @returns {boolean}
   */
  module.getTableActive = function (tableModule) {
    return Boolean(JSON.parse(localStorage.getItem(module.key))[tableModule.name].active);
  };

  /**
   * Sets localStorage.ts3ldv[tableModule.name].active to newState
   * @param tableModule
   * @param {boolean} newState
   */
  module.setTableActive = function (tableModule, newState) {
    const data = JSON.parse(localStorage.getItem(module.key));
    data[tableModule.name].active = newState;
    localStorage.setItem(module.key, JSON.stringify(data));
  };

  /**
   * Returns localStorage.ts3ldv[tableModule.name].sortOrder
   * @param tableModule
   * @returns {[]}
   */
  module.getTableSortOrder = function (tableModule) {
    return JSON.parse(localStorage.getItem(module.key))[tableModule.name].sortOrder;
  };

  /**
   * Sets localStorage.ts3ldv[tableModule.name].sortOrder to newSortOrder
   * @param tableModule
   * @param {[]} newSortOrder
   */
  module.setTableSortOrder = function (tableModule, newSortOrder) {
    const data = JSON.parse(localStorage.getItem(module.key));
    data[tableModule.name].sortOrder = newSortOrder;
    localStorage.setItem(module.key, JSON.stringify(data));
  };

  /**
   * Switches localStorage.ts3ldv.ban.showUID from true to false or the other way round
   */
  module.switchBanShowUID = function () {
    const data = JSON.parse(localStorage.getItem(module.key));
    data.ban.showUID = !data.ban.showUID;
    localStorage.setItem(module.key, JSON.stringify(data));
  };

  /**
   * Returns localStorage.ts3ldv.ban.showUID
   * @returns {boolean}
   */
  module.getBanShowUID = function () {
    return JSON.parse(localStorage.getItem(module.key)).ban.showUID;
  };

  /**
   * Switches localStorage.ts3ldv.client.connectionsSortType from true to false or the other way round.
   * Returns the resulting connectionsSortType.
   *
   * @returns {boolean} the resulting connectionsSortType
   */
  module.switchClientConnectionsSortType = function () {
    const data = JSON.parse(localStorage.getItem(module.key));
    data.client.connectionsSortType = !data.client.connectionsSortType;
    localStorage.setItem(module.key, JSON.stringify(data));
    return data.client.connectionsSortType;
  };

  /**
   * Returns localStorage.ts3ldv.client.connectionsSortType
   * @returns {boolean} false = sort by first connect, true = sort by last connect
   */
  module.getClientConnectionsSortType = function () {
    return JSON.parse(localStorage.getItem(module.key)).client.connectionsSortType;
  };

  /**
   * If the local storage object exists: imports the data,
   * else: creates local storage object with default values
   */
  module.importLocalStorage = function () {
    // Case: no existing local storage
    if (localStorage.getItem(module.key) === null) {
      localStorage.setItem(module.key, JSON.stringify({
        ban: {
          active: true,
          sortOrder: [],
          showUID: false
        },
        client: {
          active: true,
          sortOrder: [],
          connectionsSortType: true
        },
        complaint: {
          active: true,
          sortOrder: []
        },
        kick: {
          active: true,
          sortOrder: []
        },
        upload: {
          active: true,
          sortOrder: []
        }
      }));

      ts3ldv.tables.ban.checkbox.checked = true;
      ts3ldv.tables.client.checkbox.checked = true;
      ts3ldv.tables.complaint.checkbox.checked = true;
      ts3ldv.tables.kick.checkbox.checked = true;
      ts3ldv.tables.upload.checkbox.checked = true;
    }

    // Case: existing local storage
    else {
      const settings = JSON.parse(localStorage.getItem(module.key));

      // Update checkboxes in the control section
      ts3ldv.tables.ban.checkbox.checked = settings.ban.active;
      ts3ldv.tables.client.checkbox.checked = settings.client.active;
      ts3ldv.tables.complaint.checkbox.checked = settings.complaint.active;
      ts3ldv.tables.kick.checkbox.checked = settings.kick.active;
      ts3ldv.tables.upload.checkbox.checked = settings.upload.active;

      // Update table visibility
      ts3ldv.tables.ban.div.style.display = settings.ban.active ? "" : "none";
      ts3ldv.tables.client.div.style.display = settings.client.active ? "" : "none";
      ts3ldv.tables.complaint.div.style.display = settings.complaint.active ? "" : "none";
      ts3ldv.tables.kick.div.style.display = settings.kick.active ? "" : "none";
      ts3ldv.tables.upload.div.style.display = settings.upload.active ? "" : "none";
    }
  };

  /**
   * Resets the sortOrder attributes of all tables in the local storage
   */
  module.resetTableSortOrder = function () {
    const data = JSON.parse(localStorage.getItem(module.key));

    data.ban.sortOrder = [];
    data.client.sortOrder = [];
    data.complaint.sortOrder = [];
    data.kick.sortOrder = [];
    data.upload.sortOrder = [];

    localStorage.setItem(module.key, JSON.stringify(data));
  };

  ////
  // SESSION STORAGE
  ////

  /**
   * Returns sessionStorage.ts3ldv.tableBuilt[tableModule.name]
   * @param tableModule
   * @returns {boolean}
   */
  module.getTableBuilt = function (tableModule) {
    if (sessionStorage.getItem(module.key) === null)
      return false;

    return JSON.parse(sessionStorage.getItem(module.key)).tableBuilt[tableModule.name];
  };

  /**
   * Sets sessionStorage.ts3ldv.tableBuilt[tableModule.name] to newState
   * @param tableModule
   * @param {boolean} newState
   */
  module.setTableBuilt = function (tableModule, newState) {
    const data = sessionStorage.getItem(module.key) === null ? {
      tableBuilt: {
        ban: false,
        client: false,
        complaint: false,
        kick: false,
        upload: false
      }
    } : JSON.parse(sessionStorage.getItem(module.key));

    data.tableBuilt[tableModule.name] = newState;
    sessionStorage.setItem(module.key, JSON.stringify(data));
  };

  return module;
}(ts3ldv || {}));
