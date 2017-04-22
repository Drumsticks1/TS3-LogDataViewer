// js/modules/storage.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Layout of the objects used in the browser storage:
 *
 * localStorage:
 *  ts3ldv -> {
 *      tableActive : {ban: true, ...}
 *      tableSortOrder : {ban: sortOrder, ...}}
 *
 * sessionStorage:
 *  ts3ldv -> {
 *      tableBuilt : {ban: true, ...}}
 */


/**
 * Module containing functions that are related to interactions with the localStorage and the sessionStorage.
 */
(function (parent) {
    var module = parent.storage = parent.storage || {};

    /**
     * The key used for storing data in the localStorage and sessionStorage.
     * @type {string}
     */
    module.storageKey = "ts3ldv";


    // Todo: doc
    // local storage

    /**
     * TODO: better doc
     * Returns localStorage.ts3ldv.tableActive[tableModule.name]
     * @param tableModule
     * @returns {boolean}
     */
    module.getTableActive = function (tableModule) {
        return Boolean(JSON.parse(localStorage.getItem(this.storageKey)).tableActive[tableModule.name]);
    };

    module.setTableActive = function (tableModule, state) {
        var data = JSON.parse(localStorage.getItem(this.storageKey));
        data.tableActive[tableModule.name] = state;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    };

    module.getTableSortOrder = function (tableModule) {
        return JSON.parse(localStorage.getItem(this.storageKey)).tableSortOrder[tableModule.name];
    };

    module.setTableSortOrder = function (tableModule, sortOrder) {
        var data = JSON.parse(localStorage.getItem(this.storageKey));
        data.tableSortOrder[tableModule.name] = sortOrder;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    };

    /**
     * Todo: better doc
     * Imports and uses the local storage data.
     */
    module.importLocalStorage = function () {
        // Case: no existing local storage
        if (localStorage.getItem(this.storageKey) === null) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                tableActive: {
                    ban: true,
                    client: true,
                    complaint: true,
                    kick: true,
                    upload: true
                },
                tableSortOrder: {
                    ban: [],
                    client: [],
                    complaint: [],
                    kick: [],
                    upload: []
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
            var settings = JSON.parse(localStorage.getItem(this.storageKey));

            // Update checkboxes in the control section
            ts3ldv.tables.ban.checkbox.checked = settings.tableActive.ban;
            ts3ldv.tables.client.checkbox.checked = settings.tableActive.client;
            ts3ldv.tables.complaint.checkbox.checked = settings.tableActive.complaint;
            ts3ldv.tables.kick.checkbox.checked = settings.tableActive.kick;
            ts3ldv.tables.upload.checkbox.checked = settings.tableActive.upload;

            // Update table visibility
            ts3ldv.tables.ban.div.style.display = settings.tableActive.ban ? "" : "none";
            ts3ldv.tables.client.div.style.display = settings.tableActive.client ? "" : "none";
            ts3ldv.tables.complaint.div.style.display = settings.tableActive.complaint ? "" : "none";
            ts3ldv.tables.kick.div.style.display = settings.tableActive.kick ? "" : "none";
            ts3ldv.tables.upload.div.style.display = settings.tableActive.upload ? "" : "none";
        }
    };

    module.resetTableSortOrder = function () {
        var data = JSON.parse(localStorage.getItem(this.storageKey));

        data.tableSortOrder = {
            ban: [],
            client: [],
            complaint: [],
            kick: [],
            upload: []
        };

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    };

    // session storage
    module.getTableBuilt = function (tableModule) {
        if (sessionStorage.getItem(this.storageKey) === null)
            return false;

        return JSON.parse(sessionStorage.getItem(this.storageKey)).tableBuilt[tableModule.name];
    };

    module.setTableBuilt = function (tableModule, state) {
        var data = sessionStorage.getItem(this.storageKey) === null ? {
            tableBuilt: {
                ban: false,
                client: false,
                complaint: false,
                kick: false,
                upload: false
            }
        } : JSON.parse(sessionStorage.getItem(this.storageKey));

        data.tableBuilt[tableModule.name] = state;
        sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    };

    return module;
}(ts3ldv || {}));
