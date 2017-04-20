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
     * Builds the control section.
     */
    module.build = function () {
        var controlSection = document.createElement("div"),
            tableSelectionSection = document.createElement("div"),
            tableCheckboxSections = new Array(5),
            tableCheckboxes = new Array(5),
            tableCheckboxLabels = new Array(5);

        for (var i = 0; i < 5; i++) {
            tableCheckboxSections[i] = document.createElement("div");
            tableCheckboxes[i] = document.createElement("input");
            tableCheckboxes[i].type = "checkbox";
            tableCheckboxLabels[i] = document.createElement("label");
        }

        controlSection.id = "controlSection";
        tableSelectionSection.id = "tableSelectionSection";
        controlSection.className = "row";
        tableSelectionSection.className = "columns";
        tableCheckboxSections[0].className = "small-12 medium-12 large-6 columns";
        tableCheckboxSections[1].className = "small-12 medium-6 large-6 columns";
        for (i = 2; i < 5; i++) {
            tableCheckboxSections[i].className = "small-12 medium-6 large-4 columns";
        }

        for (i = 0; i < 5; i++) {
            tableCheckboxLabels[i].htmlFor = tableCheckboxes[i].id = tableNames[i].toLowerCase() + "TableCheckbox";
            tableCheckboxLabels[i].innerHTML = tableNames[i] + " table";
            tableCheckboxSections[i].appendChild(tableCheckboxes[i]);
            tableCheckboxSections[i].appendChild(tableCheckboxLabels[i]);
            tableSelectionSection.appendChild(tableCheckboxSections[i]);
        }

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
        creationTimestampSection.innerHTML = "Creation DateTime of the current JSON";
        creationTimestampTable.id = "creationTimestampTable";

        ctT_localtime.id = "creationTimestamp_localtime";
        ctT_utc.id = "creationTimestamp_utc";
        ctT_moment.id = "creationTimestamp_moment";
        connectedClientsCount.id = "connectedClientsCount";
        ctTHead_localtime.innerHTML = "Server localtime";
        ctTHead_utc.innerHTML = "UTC";
        ctTHead_moment.innerHTML = "moment.js";
        ctT_localtime.innerHTML = ctT_utc.innerHTML = ctT_moment.innerHTML = connectedClientsCount.innerHTML = "Analyzing...";

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
        buildJSONButton.innerHTML = "Update JSON";
        buildJSONWithoutBufferButton.innerHTML = "Build JSON without buffer";
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
        resetSortingButton.innerHTML = "Reset table sorting";
        resetSortingButton.onclick = function () {
            for (var i = 0; i < tables.length; i++) {
                $(document.getElementById(tables[i])).trigger("sortReset");
                localStorage.setItem(tables[i] + "SortOrder", "[]");
            }
        };

        miscControlSection.appendChild(resetSortingButton);

        var navbar = document.createElement("div"),
            scrollBackToTopButton = document.createElement("button");

        navbar.id = "navbar";
        scrollBackToTopButton.innerHTML = "Top";

        scrollBackToTopButton.onclick = function () {
            scrollTo(0, 0);
        };

        navbar.appendChild(scrollBackToTopButton);

        var scrollToTablesButtons = new Array(5);
        for (var j = 0; j < 5; j++) {
            scrollToTablesButtons[j] = document.createElement("button");
            scrollToTablesButtons[j].style.display = "none";
            scrollToTablesButtons[j].id = "scrollTo" + tableNames[j] + "Table";
            scrollToTablesButtons[j].innerHTML = tableNames[j] + "s";

            (function (j) {
                scrollToTablesButtons[j].onclick = function () {
                    document.getElementById("ts3-" + tables[j]).scrollIntoView();
                };
            })(j);

            navbar.appendChild(scrollToTablesButtons[j]);
        }

        controlSection.appendChild(tableSelectionSection);
        controlSection.appendChild(creationTimestampSection);
        controlSection.appendChild(buildSection);
        controlSection.appendChild(miscControlSection);
        controlSection.appendChild(navbar);
        document.getElementById("ts3-control").appendChild(controlSection);
    };

    return module;
}(ts3ldv || {}));
