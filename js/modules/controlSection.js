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

    // Todo: doc
    module.navbar = {

        /**
         * The element containing the navbar.
         * @type {Element}
         */
        div: document.createElement("div"),

        scrollToButtons: {},

        /**
         * Adds a scrollTo button to the navbar and adds the button element to the scrollToButtons object.
         * The button has an onclick event that scrolls the table into view.
         * Note: the button is hidden by default. (see showScrollToButton and hideScrollToButton)
         * @param tableModule TODO
         */
        addScrollToButton: function (tableModule) {
            var button = document.createElement("button");
            this.scrollToButtons[tableModule.name] = button;
            button.style.display = "none";

            // Todo: uppercase scrollTo innerHTML
            button.innerHTML = tableModule.name + "s";

            button.onclick = function () {
                tableModule.div.scrollIntoView();
            };

            this.div.appendChild(button);
        },

        showScrollToButton: function (tableModule) {
            this.scrollToButtons[tableModule.name].style.display = "";
        },

        hideScrollToButton: function (tableModule) {
            this.scrollToButtons[tableModule.name].style.display = "none";
        }
    };

    // Todo: doc
    module.tableSelection = {

        /**
         * The element containing the table selection section.
         * @type {Element}
         */
        div: document.createElement("div"),

        addTableCheckboxDiv: function (tableModule) {
            var div = document.createElement("div");

            var checkbox = document.createElement("input");
            checkbox.id = tableModule.name + "Checkbox";
            checkbox.type = "checkbox";
            tableModule.checkbox = checkbox;

            var label = document.createElement("label");
            // Todo: proper innerHTML (e.g. 'Client table', currently is 'client')
            label.innerHTML = tableModule.name;
            label.htmlFor = tableModule.name + "Checkbox";

            // Styling of the divs
            switch (tableModule) {
                case ts3ldv.tables.ban:
                    div.className = "small-12 medium-6 large-6 columns";
                    break;
                case ts3ldv.tables.client:
                    div.className = "small-12 medium-12 large-6 columns";
                    break;

                default:
                    div.className = "small-12 medium-6 large-4 columns";
            }

            div.appendChild(checkbox);
            div.appendChild(label);
            this.div.appendChild(div);
        },

        /**
         * TODO: doc
         * Adds a checkbox listener for the table and displays/hides the navbar scroll buttons for the table.
         *
         * @param {string} table - name of the table (e.g. "clientTable"). TODO
         */
        addTableCheckboxEventListener: function (tableModule) {
            tableModule.checkbox.onclick = function () {
                if (this.checked) {
                    ts3ldv.storage.setTableActive(tableModule, true);

                    // Build table if necessary (= not already built and only hidden)
                    if (!ts3ldv.storage.getTableBuilt(tableModule))
                        ts3ldv.tables.buildTableEnhanced(tableModule);

                    tableModule.div.style.display = "";
                    module.navbar.showScrollToButton(tableModule);
                } else {
                    ts3ldv.storage.setTableActive(tableModule, false);
                    tableModule.div.style.display = "none";
                    module.navbar.hideScrollToButton(tableModule);
                }

                ts3ldv.tables.setFilterPlaceholders(tableModule);
            }
        }
    };

    // Todo: split into multiple (private?) functions (e.g. one for the navbar)
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

        var scrollBackToTopButton = document.createElement("button");

        this.navbar.div.id = "navbar";
        scrollBackToTopButton.innerHTML = "Top";

        scrollBackToTopButton.onclick = function () {
            scrollTo(0, 0);
        };

        this.navbar.div.appendChild(scrollBackToTopButton);
        this.navbar.addScrollToButton(ts3ldv.tables.client);
        this.navbar.addScrollToButton(ts3ldv.tables.ban);
        this.navbar.addScrollToButton(ts3ldv.tables.kick);
        this.navbar.addScrollToButton(ts3ldv.tables.complaint);
        this.navbar.addScrollToButton(ts3ldv.tables.upload);

        controlSection.appendChild(this.tableSelection.div);
        controlSection.appendChild(creationTimestampSection);
        controlSection.appendChild(buildSection);
        controlSection.appendChild(miscControlSection);
        controlSection.appendChild(this.navbar.div);
        this.div.appendChild(controlSection);
    };

    return module;
}(ts3ldv || {}));
