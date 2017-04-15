// js/modules/tables.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

/**
 * Module containing functions that are related to multiple tables.
 */
ts3ldv.tables = (function (module) {

    /**
     * True if the last build request failed, false otherwise.
     * @type {boolean}
     */
    var buildError = false;

    /**
     * Builds all tables using the data from the JSON.
     */
    module.build = function () {
        nanobar.go(50);
        $.ajax({
            url: "local/output.json",
            cache: false,
            dataType: "json",
            error: function () {
                if (buildError)
                    addCallout("Building the JSON failed!", "error buildErrorCallout");
                else {
                    buildError = true;
                    ts3ldv.serverInteractions.requestJsonBuild(false);
                }
            },
            success: function (fetchedJSON) {
                buildError = false;
                ts3ldv.Json = fetchedJSON;
                connectedClientsCount = 0;

                updateLookupObject("ClientList", "clientId");
                updateLookupObject("ChannelList", "channelId");
                lookup.ChannelList[0] = {
                    channelId: 0,
                    channelName: "Server",
                    deleted: false
                };
                updateLookupObject("ServerGroupList", "serverGroupId");

                removeEventListeners();
                for (var i = 0; i < tables.length; i++) {
                    buildTableWithAlertCheckAndLocalStorage(tables[i]);
                }

                // Ban table UID state action.
                var uidState = localStorage.getItem("uidState");
                if (document.getElementById("banTable") !== null && (uidState === null || uidState === "1")) {
                    localStorage.setItem("uidState", "0");

                    if (uidState === "1")
                        switchBetweenIDAndUID();
                }

                var Attributes = ts3ldv.Json.Attributes,
                    creationTime = Attributes.creationTime;

                document.getElementById("creationTimestamp_localtime").innerHTML = creationTime.localTime;
                document.getElementById("creationTimestamp_utc").innerHTML = creationTime.UTC;
                document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTime.UTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();

                clearInterval(momentInterval);
                momentInterval = setInterval(function () {
                    document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTime.UTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();
                }, 1000);

                if (!document.getElementById("clientTable") || document.getElementById("ts3-clientTable").style.display === "none") {
                    var Client = ts3ldv.Json.ClientList;
                    for (var j = 0; j < Client.length; j++) {
                        if (Client[j].ConnectedState)
                            connectedClientsCount++;
                    }
                }
                document.getElementById("connectedClientsCount").innerHTML = "Connected clients: " + connectedClientsCount;

                document.getElementById("buildJSONButton").disabled = document.getElementById("buildJSONWithoutBufferButton").disabled = false;
                nanobar.go(100);
            }
        });
    };

    return module;
}(ts3ldv.tables || {}));
