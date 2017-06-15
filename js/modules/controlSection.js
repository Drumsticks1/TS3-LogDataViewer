// js/modules/controlSection.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the control section.
 */
(function (parent) {
    var module = parent.controlSection = parent.controlSection || {};

    /**
     * The element containing the control section.
     * @type {Element}
     */
    module.div = document.getElementById("ts3-control");

    // Todo: split into multiple modules/functions
    /**
     * Builds the control section.
     */
    module.build = function () {
        var controlSection = document.createElement("div");
        controlSection.id = "controlSection";
        controlSection.className = "row";

        this.tableSelection.addTableCheckboxDiv(ts3ldv.tables.ban);
        this.tableSelection.addTableCheckboxDiv(ts3ldv.tables.client);
        this.tableSelection.addTableCheckboxDiv(ts3ldv.tables.complaint);
        this.tableSelection.addTableCheckboxDiv(ts3ldv.tables.kick);
        this.tableSelection.addTableCheckboxDiv(ts3ldv.tables.upload);

        this.tableSelection.addTableCheckboxEventListener(ts3ldv.tables.ban);
        this.tableSelection.addTableCheckboxEventListener(ts3ldv.tables.client);
        this.tableSelection.addTableCheckboxEventListener(ts3ldv.tables.complaint);
        this.tableSelection.addTableCheckboxEventListener(ts3ldv.tables.kick);
        this.tableSelection.addTableCheckboxEventListener(ts3ldv.tables.upload);

        this.tableSelection.div.id = "tableSelectionSection";
        this.tableSelection.div.className = "columns";

        var creationTimestampSection = document.createElement("div"),
            creationTimestampTable = document.createElement("table"),
            ctTHead = document.createElement("thead"),
            ctTHeadRow = document.createElement("tr"),
            ctTHead_localtime = document.createElement("th"),
            ctTHead_utc = document.createElement("th"),
            ctTHead_moment = document.createElement("th"),
            ctTBody = document.createElement("tbody"),
            ctTBodyRow = document.createElement("tr"),
            ctT_localtime = document.createElement("td"),
            ctT_utc = document.createElement("td"),
            ctT_moment = document.createElement("td"),
            connectedClientsCount = document.createElement("div");

        creationTimestampSection.id = "creationTimestampSection";
        creationTimestampSection.className = "small-12 medium-8 large-8 columns";
        creationTimestampSection.innerText = "Creation Timestamp of the current JSON";
        creationTimestampTable.id = "creationTimestampTable";

        ctT_localtime.id = "creationTimestamp_localtime";
        ctT_utc.id = "creationTimestamp_utc";
        ctT_moment.id = "creationTimestamp_moment";
        connectedClientsCount.id = "connectedClientsCount";
        ctTHead_localtime.innerText = "Server Local Time";
        ctTHead_utc.innerText = "Coordinated Universal Time (UTC)";
        ctTHead_moment.innerText = "Relative Time (moment.js)";
        ctT_localtime.innerText = ctT_utc.innerText = ctT_moment.innerText = connectedClientsCount.innerText = "Analyzing...";

        ctTHeadRow.appendChild(ctTHead_localtime);
        ctTHeadRow.appendChild(ctTHead_utc);
        ctTHeadRow.appendChild(ctTHead_moment);
        ctTHead.appendChild(ctTHeadRow);
        creationTimestampTable.appendChild(ctTHead);

        ctTBodyRow.appendChild(ctT_localtime);
        ctTBodyRow.appendChild(ctT_utc);
        ctTBodyRow.appendChild(ctT_moment);
        ctTBody.appendChild(ctTBodyRow);
        creationTimestampTable.appendChild(ctTBody);
        creationTimestampSection.appendChild(creationTimestampTable);
        creationTimestampSection.appendChild(connectedClientsCount);

        var buildSection = document.createElement("div"),
            buildJSONButton = document.createElement("button"),
            buildJSONWithoutBufferButton = document.createElement("button");

        buildSection.id = "buildSection";
        buildSection.className = "small-12 medium-4 large-4 columns";
        buildJSONButton.id = "buildJSONButton";
        buildJSONWithoutBufferButton.id = "buildJSONWithoutBufferButton";
        buildJSONButton.innerText = "Update JSON";
        buildJSONWithoutBufferButton.innerText = "Build JSON without buffer";
        buildJSONButton.disabled = buildJSONWithoutBufferButton.disabled = true;

        buildJSONButton.onclick = function () {
            ts3ldv.serverInteractions.requestJsonBuild(false);
        };
        buildJSONWithoutBufferButton.onclick = function () {
            ts3ldv.serverInteractions.requestJsonBuild(true);
        };

        buildSection.appendChild(buildJSONButton);
        buildSection.appendChild(buildJSONWithoutBufferButton);

        var miscControlSection = document.createElement("div"),
            resetSortingButton = document.createElement("button");

        miscControlSection.className = "columns";
        resetSortingButton.className = "small-12";
        resetSortingButton.innerText = "Reset Table Sorting";
        // Todo: check if code duplication can be eliminated, check it for all the onclick events
        resetSortingButton.onclick = function () {
            $(ts3ldv.tables.ban.getTableDiv()).trigger("sortReset");
            $(ts3ldv.tables.client.getTableDiv()).trigger("sortReset");
            $(ts3ldv.tables.complaint.getTableDiv()).trigger("sortReset");
            $(ts3ldv.tables.kick.getTableDiv()).trigger("sortReset");
            $(ts3ldv.tables.upload.getTableDiv()).trigger("sortReset");

            ts3ldv.storage.resetTableSortOrder();
        };

        miscControlSection.appendChild(resetSortingButton);

        controlSection.appendChild(this.tableSelection.div);
        controlSection.appendChild(creationTimestampSection);
        controlSection.appendChild(buildSection);
        controlSection.appendChild(miscControlSection);
        this.div.appendChild(controlSection);
    };

    return module;
}(ts3ldv || {}));
