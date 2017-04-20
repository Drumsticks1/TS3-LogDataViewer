// js/modules/tables.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to multiple tables.
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

                for (var i = 0; i < tables.length; i++) {
                    buildTableWithAlertCheckAndLocalStorage(tables[i]);
                }

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

    return module;
}(ts3ldv || {}));
