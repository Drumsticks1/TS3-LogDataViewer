// js/modules/tables/ban.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Ban table.
 */
(function (parent) {
    var module = parent.ban = parent.ban || {};

    /**
     * The name of the module
     * @type {string}
     */
    module.name = "ban";

    /**
     * The element containing the table.
     * @type {Element}
     */
    module.div = document.getElementById("ts3-banTable");

    /**
     * Returns the table div.
     * @returns {Element}
     */
    module.getTableDiv = function () {
        return document.getElementById("banTable");
    };

    /**
     * The input object of type checkbox in the tableSelection section that toggles the table of this module.
     * @type {Element}
     */
    module.checkbox = module.checkbox || undefined;

    /**
     * Switches between the ID/UID columns in the Ban table.
     */
    function switchBetweenIDAndUID() {
        var rowId, banId, idOrUid, bannedByIDOrUID, Ban = ts3ldv.Json.BanList,
            banTableRows = document.getElementById("banTable").lastChild.childNodes,
            headRowCells = document.getElementById("banTable").firstChild.firstChild.childNodes,
            filterRowCells = document.getElementById("banTable").firstChild.childNodes[1].childNodes,
            uidState = Number(localStorage.getItem("uidState"));

        if (uidState) {
            idOrUid = "ID";
            localStorage.setItem("uidState", "0");
        } else {
            idOrUid = "UID";
            localStorage.setItem("uidState", "1");
        }

        headRowCells[1].innerHTML = "Banned " + idOrUid;
        filterRowCells[1].firstChild.setAttribute("Placeholder", "Banned " + idOrUid);
        headRowCells[4].innerHTML = "Banned by " + idOrUid;
        filterRowCells[4].firstChild.setAttribute("Placeholder", "Banned by " + idOrUid);

        for (var j = 0; j < banTableRows.length; j++) {
            rowId = banTableRows[j].getAttribute("id");
            banId = rowId.substring(4, rowId.length);

            var currentRowCells = document.getElementById(rowId).childNodes;

            if (uidState) {
                if (currentRowCells[3].innerHTML !== "Unknown")
                    bannedByIDOrUID = Ban[banId].bannedByID;
                else
                    bannedByIDOrUID = "Unknown";
            } else {
                if (Ban[banId].bannedByUID.length !== 0)
                    bannedByIDOrUID = Ban[banId].bannedByUID;
                else
                    bannedByIDOrUID = "No UID";
            }

            currentRowCells[1].setAttribute("data-title", "Banned " + idOrUid);
            currentRowCells[1].innerHTML = Ban[banId]["banned" + idOrUid];
            currentRowCells[4].setAttribute("data-title", "Banned by " + idOrUid);
            currentRowCells[4].innerHTML = bannedByIDOrUID;
        }
    }

    /**
     * Builds the ban table.
     */
    module.build = function () {
        var banTableControlSection = document.createElement("div");
        banTableControlSection.className = "row";

        var banTableHeading = document.createElement("div");
        banTableHeading.className = "tableheading large-12 columns";
        banTableHeading.innerHTML = "Ban table";
        banTableControlSection.appendChild(banTableHeading);

        var switchBetweenIDAndUIDButton = document.createElement("button");
        switchBetweenIDAndUIDButton.id = "switchBetweenIDAndUIDButton";
        switchBetweenIDAndUIDButton.innerHTML = "Switch between IDs and UIDs";

        ts3ldv.event.addOnClickEventListener(switchBetweenIDAndUIDButton, switchBetweenIDAndUID);
        banTableControlSection.appendChild(switchBetweenIDAndUIDButton);

        ts3ldv.tables.addPagerSection(banTableControlSection, this);

        this.div.appendChild(banTableControlSection);

        var Ban = ts3ldv.Json.BanList,
            banTable = document.createElement("table"),
            banHead = document.createElement("thead"),
            banHeadRow = document.createElement("tr"),
            headCell_BanDateTime = document.createElement("th"),
            headCell_BannedID = document.createElement("th"),
            headCell_BannedNickname = document.createElement("th"),
            headCell_BannedIP = document.createElement("th"),
            headCell_BannedByID = document.createElement("th"),
            headCell_BannedByNickname = document.createElement("th"),
            headCell_BanReason = document.createElement("th"),
            headCell_BanTime = document.createElement("th");

        headCell_BanDateTime.innerHTML = "Date and Time";
        headCell_BannedID.innerHTML = "Banned ID";
        headCell_BannedNickname.innerHTML = "Banned Nickname";
        headCell_BannedIP.innerHTML = "Banned IP";
        headCell_BannedByID.innerHTML = "Banned by ID";
        headCell_BannedByNickname.innerHTML = "Banned by Nickname";
        headCell_BanReason.innerHTML = "Reason";
        headCell_BanTime.innerHTML = "BanTime";

        banHeadRow.appendChild(headCell_BanDateTime);
        banHeadRow.appendChild(headCell_BannedID);
        banHeadRow.appendChild(headCell_BannedNickname);
        banHeadRow.appendChild(headCell_BannedIP);
        banHeadRow.appendChild(headCell_BannedByID);
        banHeadRow.appendChild(headCell_BannedByNickname);
        banHeadRow.appendChild(headCell_BanReason);
        banHeadRow.appendChild(headCell_BanTime);

        banHead.appendChild(banHeadRow);
        banTable.appendChild(banHead);

        var banBody = document.createElement("tbody");
        for (var i = 0; i < Ban.length; i++) {
            var BanDateTime = Ban[i].banDateTime,
                BannedID = Ban[i].bannedID,
                BannedNickname = Ban[i].bannedNickname,
                BannedIP = Ban[i].bannedIP,
                BannedByID,
                BannedByNickname = Ban[i].bannedByNickname,
                BanReason,
                BanTime = Ban[i].banTime;

            if (BannedIP !== "Unknown")
                BannedByID = Ban[i].bannedByID;
            else
                BannedByID = "Unknown";

            if (Ban[i].banReason.length !== 0)
                BanReason = Ban[i].banReason;
            else
                BanReason = "No Reason given";

            var banBodyRow = document.createElement("tr");
            banBodyRow.id = "ban_" + i;

            var cell_BanDateTime = document.createElement("td"),
                cell_BannedID = document.createElement("td"),
                cell_BannedNickname = document.createElement("td"),
                cell_BannedIP = document.createElement("td"),
                cell_BannedByID = document.createElement("td"),
                cell_BannedByNickname = document.createElement("td"),
                cell_BanReason = document.createElement("td"),
                cell_BanTime = document.createElement("td");

            cell_BanDateTime.setAttribute("data-title", "Date and Time");
            cell_BannedID.setAttribute("data-title", "Banned ID");
            cell_BannedNickname.setAttribute("data-title", "Banned Nickname");
            cell_BannedIP.setAttribute("data-title", "Banned IP");
            cell_BannedByID.setAttribute("data-title", "Banned by ID");
            cell_BannedByNickname.setAttribute("data-title", "Banned by Nickname");
            cell_BanReason.setAttribute("data-title", "Reason");
            cell_BanTime.setAttribute("data-title", "BanTime");

            var cell_BanDateTime_Div = document.createElement("div");
            cell_BanDateTime_Div.innerHTML = ts3ldv.time.dateTimeToMomentString(BanDateTime);
            cell_BanDateTime.appendChild(cell_BanDateTime_Div);
            banBodyRow.appendChild(cell_BanDateTime);

            cell_BannedID.innerHTML = BannedID;
            banBodyRow.appendChild(cell_BannedID);

            cell_BannedNickname.innerHTML = BannedNickname;
            banBodyRow.appendChild(cell_BannedNickname);

            cell_BannedIP.innerHTML = BannedIP;
            banBodyRow.appendChild(cell_BannedIP);

            cell_BannedByID.innerHTML = BannedByID;
            banBodyRow.appendChild(cell_BannedByID);

            cell_BannedByNickname.innerHTML = BannedByNickname;
            banBodyRow.appendChild(cell_BannedByNickname);

            cell_BanReason.innerHTML = BanReason;
            banBodyRow.appendChild(cell_BanReason);

            cell_BanTime.innerHTML = BanTime;
            banBodyRow.appendChild(cell_BanTime);

            banBody.appendChild(banBodyRow);
        }
        banTable.appendChild(banBody);

        banTable.id = "banTable";
        banTable.className += "ui-table-reflow";

        $(banTable).tablesorter({
            headers: {
                0: {sorter: "ignoreMoment"}
            },
            widgets: ["filter"],
            widgetOptions: {filter_searchDelay: 0},
            sortList: ts3ldv.storage.getTableSortOrder(this)
        }).bind("sortEnd", function () {
            ts3ldv.storage.setTableSortOrder(this, banTable.config.sortList)
        }).tablesorterPager({
            container: $(document.getElementById(module.name + "Pager")),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            savePages: false
        });

        this.div.appendChild(banTable);

        // Todo: Better place for this?
        // Ban table UID state action.
        var uidState = localStorage.getItem("uidState");
        if (document.getElementById("banTable") !== null && (uidState === null || uidState === "1")) {
            localStorage.setItem("uidState", "0");

            if (uidState === "1")
                switchBetweenIDAndUID();
        }
    };

    return module;
}(ts3ldv.tables || {}));
