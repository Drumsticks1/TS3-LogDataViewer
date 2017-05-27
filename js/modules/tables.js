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

    // TODO: check if the lookup object is really necessary or how it could be improved
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

    // TODO: check code for improvements
    /**
     * Sets the placeholder text for the tablesorter filter cells of the given table according to their column name.
     * @param tableModule the module of the table (e.g ts3ldv.tables.client)
     */
    module.setFilterPlaceholders = function (tableModule) {
        var placeholders = tableModule.div.getElementsByClassName("tablesorter-filter-row")[0].getElementsByTagName("input");
        for (var i = 0; i < placeholders.length; i++) {
            placeholders[i].setAttribute("placeholder",
                placeholders[i].parentNode.parentNode.previousSibling.children[placeholders[i].getAttribute("data-column")].firstChild.innerHTML);
        }
    };

    /**
     * Combines multiple steps when building a table that are required for every table:
     *
     * - Deleting the table before building it new (if it existed before)
     * - Checking if the table should be build (see ts3ldv.storage.getTableActive) and abort if it shouldn't
     * - Add an alert box instead of the table if no data regarding the table was found in the output.json
     * - Building the table for the given module
     * - Setting the tablesorter filter placeholders
     * - Applying sticky headers to the table
     * - Updating the sessionStorage (see ts3ldv.storage.setTableBuilt)
     * - Handling the visibility of the navBar buttons
     *
     * @param tableModule the table module
     */
    module.buildTableEnhanced = function (tableModule) {
        // Check if a table for the same tableModule is already existing and delete it if it is
        if (tableModule.getTableDiv() !== null) {
            $(tableModule.getTableDiv()).trigger("destroy");
            $(tableModule.div).empty();
        }

        // Check if the table should be build
        if (ts3ldv.storage.getTableActive(tableModule)) {
            // Todo: only temporary to ensure compatibility with the server-side output
            var listIdentifier;
            switch (tableModule) {
                case ts3ldv.tables.ban:
                    listIdentifier = "BanList";
                    break;
                case ts3ldv.tables.client:
                    listIdentifier = "ClientList";
                    break;
                case ts3ldv.tables.complaint:
                    listIdentifier = "ComplaintList";
                    break;
                case ts3ldv.tables.kick:
                    listIdentifier = "KickList";
                    break;
                case ts3ldv.tables.upload:
                    listIdentifier = "UploadList";
            }

            // Check if the json contains data for the tableModule
            if (ts3ldv.Json[listIdentifier].length) {
                tableModule.build();
                this.setFilterPlaceholders(tableModule);
                $(tableModule.getTableDiv()).trigger("applyWidgetId", ["stickyHeaders"]);
            } else {
                var alertBox = document.createElement("div");
                alertBox.className = "alertBox";
                alertBox.innerHTML = "No " + tableModule.name + " data was found!";
                tableModule.div.appendChild(alertBox);
            }

            ts3ldv.storage.setTableBuilt(tableModule, true);
            ts3ldv.navBar.showScrollToButton(tableModule);
        } else {
            ts3ldv.storage.setTableBuilt(tableModule, false);
            ts3ldv.navBar.hideScrollToButton(tableModule);
        }
    };

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
                module.buildTableEnhanced(ts3ldv.tables.ban);
                module.buildTableEnhanced(ts3ldv.tables.client);
                module.buildTableEnhanced(ts3ldv.tables.complaint);
                module.buildTableEnhanced(ts3ldv.tables.kick);
                module.buildTableEnhanced(ts3ldv.tables.upload);

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
    /**
     * Adds a pager section to the given control section
     * @param tableControlSection the control section of the table
     * @param tableModule the table module
     */
    module.addPagerSection = function (tableControlSection, tableModule) {
        var pager = document.createElement("div"),
            first = document.createElement("div"),
            prev = document.createElement("div"),
            pageState = document.createElement("div"),
            next = document.createElement("div"),
            last = document.createElement("div"),
            selectDiv = document.createElement("div"),
            select = document.createElement("select"),
            options = [document.createElement("option"), document.createElement("option"), document.createElement("option"), document.createElement("option"), document.createElement("option")];

        pager.id = tableModule.name + "Pager";
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

    /**
     * Adds the following custom tablesorter parsers:
     * ignoreMoment:    Ignores the moment.js timestamps ("x ago")
     * connections:     Ignores the expand/collapse buttons in the Connections column
     * ips:             Ignores the expand/collapse buttons in the IPs column
     */
    module.addCustomTablesorterParsers = function () {
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
                if (ts3ldv.storage.getClientConnectionsSortType()) {
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
    };

    return module;
}(ts3ldv || {}));
