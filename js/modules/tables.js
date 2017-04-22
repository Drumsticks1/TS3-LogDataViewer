// js/modules/tables.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to stored data and access to it.
 */
(function (parent) {
    var module = parent.tables = parent.tables || {};

    /**
     * True if the last build request failed, false otherwise.
     * @type {boolean}
     */
    var buildError = false;

    /**
     * Lookup object, used for calling elements of some arrays via the ID of the wanted entry.
     * Required when ID and index of entries differ in lists (ClientList, ChannelList, ServerGroupList).
     * The lookup object is updated when the data is fetched.
     * @type {{ClientList: {}, ChannelList: {}, ServerGroupList: {}}}
     */
    var lookup = {
        ClientList: {},
        ChannelList: {},
        ServerGroupList: {}
    };

    module.lookup = lookup;

    /**
     * Updates the lookup object for the given list
     * @param {string} list name of the list, e.g. ClientList
     * @param {string} idIdentifier name of the id property in the list
     */
    function updateLookupObject(list, idIdentifier) {
        lookup[list] = {};

        var bufferObj = ts3ldv.Json[list];
        for (var i = 0; i < bufferObj.length; i++) {
            lookup[list][bufferObj[i][idIdentifier]] = bufferObj[i];
        }
    }

    /**
     * Builds all tables using the data from the JSON.
     */
    module.build = function () {
        ts3ldv.nanobar.go(50);
        $.ajax({
            url: "local/output.json",
            cache: false,
            dataType: "json",
            error: function () {
                if (buildError)
                    ts3ldv.ui.addCallout("Building the JSON failed!", "error buildErrorCallout");
                else {
                    buildError = true;
                    ts3ldv.serverInteractions.requestJsonBuild(false);
                }
            },
            success: function (fetchedJSON) {
                buildError = false;
                ts3ldv.Json = fetchedJSON;
                var connectedClientsCount = 0;

                updateLookupObject("ClientList", "clientId");
                updateLookupObject("ChannelList", "channelId");
                lookup.ChannelList[0] = {
                    channelId: 0,
                    channelName: "Server",
                    deleted: false
                };
                updateLookupObject("ServerGroupList", "serverGroupId");

                // Remove/Destroy onclick event listeners from eventual old tables
                ts3ldv.event.removeOnClickEventListeners();

                // TODO: update nanobar progress
                buildTableWithAlertCheckAndLocalStorage(ts3ldv.tables.ban);
                buildTableWithAlertCheckAndLocalStorage(ts3ldv.tables.client);
                buildTableWithAlertCheckAndLocalStorage(ts3ldv.tables.complaint);
                buildTableWithAlertCheckAndLocalStorage(ts3ldv.tables.kick);
                buildTableWithAlertCheckAndLocalStorage(ts3ldv.tables.upload);

                var Attributes = ts3ldv.Json.Attributes,
                    creationTime = Attributes.creationTime;

                document.getElementById("creationTimestamp_localtime").innerHTML = creationTime.localTime;
                document.getElementById("creationTimestamp_utc").innerHTML = creationTime.UTC;
                document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTime.UTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();

                for (var j = 0; j < ts3ldv.Json.ClientList.length; j++) {
                    if (ts3ldv.Json.ClientList[j].ConnectedState)
                        connectedClientsCount++;
                }

                document.getElementById("connectedClientsCount").innerHTML = "Connected clients: " + connectedClientsCount;

                document.getElementById("buildJSONButton").disabled = document.getElementById("buildJSONWithoutBufferButton").disabled = false;
                ts3ldv.nanobar.go(100);
            }
        });
    };

    // Todo make tableControlSection parameter obsolete
    // Improve tableName parameter (e.g. enumeration) or make id dependent on "this", maybe inherit from a dummy table class?
    /**
     * Adds a pager section to the given control section.
     * @param tableControlSection the control section.
     * @param tableName the name of the table.
     */
    module.addPagerSection = function (tableControlSection, tableName) {
        var pager = document.createElement("div"),
            first = document.createElement("div"),
            prev = document.createElement("div"),
            pageState = document.createElement("div"),
            next = document.createElement("div"),
            last = document.createElement("div"),
            selectDiv = document.createElement("div"),
            select = document.createElement("select"),
            options = [document.createElement("option"), document.createElement("option"), document.createElement("option"), document.createElement("option"), document.createElement("option")];

        pager.className = tableName + "Pager";
        first.className = first.innerHTML = "first";
        prev.className = prev.innerHTML = "prev";
        pageState.className = "pagedisplay";
        next.className = next.innerHTML = "next";
        last.className = last.innerHTML = "last";
        select.className = "pagesize";

        pager.appendChild(first);
        pager.appendChild(prev);
        pager.appendChild(pageState);
        pager.appendChild(next);
        pager.appendChild(last);

        var optionSizes = ["10", "25", "50", "100", "all"];
        for (var i = 0; i < options.length; i++) {
            options[i].value = options[i].innerHTML = optionSizes[i];
            select.appendChild(options[i]);
        }

        selectDiv.appendChild(select);

        pager.appendChild(selectDiv);
        tableControlSection.appendChild(pager);
    };

    return module;
}(ts3ldv || {}));
