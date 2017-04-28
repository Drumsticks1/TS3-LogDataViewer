// js/modules/tables/kick.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Kick table.
 */
(function (parent) {
    var module = parent.kick = parent.kick || {};

    /**
     * The name of the module
     * @type {string}
     */
    module.name = "kick";

    /**
     * The element containing the table.
     * @type {Element}
     */
    module.div = document.getElementById("ts3-kickTable");

    /**
     * Returns the table div (calls document.getElementById("tableDivId"))
     * @returns {Element}
     */
    module.getTableDiv = function () {
        return document.getElementById("kickTable");
    };

    // Todo: doc
    module.checkbox = module.checkbox || undefined;

    /**
     * Builds the kick table.
     */
    module.build = function () {
        var kickTableControlSection = document.createElement("div");
        kickTableControlSection.className = "row";

        var kickTableHeading = document.createElement("div");
        kickTableHeading.className = "tableheading large-12 columns";
        kickTableHeading.innerHTML = "Kick table";
        kickTableControlSection.appendChild(kickTableHeading);

        ts3ldv.tables.addPagerSection(kickTableControlSection, this);

        this.div.appendChild(kickTableControlSection);

        var Kick = ts3ldv.Json.KickList,
            kickTable = document.createElement("table"),
            kickHead = document.createElement("thead"),
            kickHeadRow = document.createElement("tr"),
            headCell_KickDateTime = document.createElement("th"),
            headCell_KickedID = document.createElement("th"),
            headCell_KickedNickname = document.createElement("th"),
            headCell_KickedByNickname = document.createElement("th"),
            headCell_KickedByUID = document.createElement("th"),
            headCell_KickReason = document.createElement("th");

        headCell_KickDateTime.innerHTML = "Date and Time";
        headCell_KickedID.innerHTML = "Kicked ID";
        headCell_KickedNickname.innerHTML = "Kicked Nickname";
        headCell_KickedByNickname.innerHTML = "Kicked by Nickname";
        headCell_KickedByUID.innerHTML = "Kicked by UID";
        headCell_KickReason.innerHTML = "Reason";

        kickHeadRow.appendChild(headCell_KickDateTime);
        kickHeadRow.appendChild(headCell_KickedID);
        kickHeadRow.appendChild(headCell_KickedNickname);
        kickHeadRow.appendChild(headCell_KickedByNickname);
        kickHeadRow.appendChild(headCell_KickedByUID);
        kickHeadRow.appendChild(headCell_KickReason);

        kickHead.appendChild(kickHeadRow);
        kickTable.appendChild(kickHead);

        var kickBody = document.createElement("tbody");
        for (var i = 0; i < Kick.length; i++) {
            var KickDateTime = Kick[i].kickDateTime,
                KickedID = Kick[i].kickedID,
                KickedNickname = Kick[i].kickedNickname,
                KickedByNickname = Kick[i].kickedByNickname,
                KickedByUID = Kick[i].kickedByUID,
                KickReason;

            if (Kick[i].kickReason.length !== 0)
                KickReason = Kick[i].kickReason;
            else KickReason = "No Reason given";

            var kickBodyRow = document.createElement("tr"),
                cell_DateTime = document.createElement("td"),
                cell_KickedID = document.createElement("td"),
                cell_KickedNickname = document.createElement("td"),
                cell_KickedByNickname = document.createElement("td"),
                cell_KickedByUID = document.createElement("td"),
                cell_KickReason = document.createElement("td");

            cell_DateTime.setAttribute("data-title", "Date and Time");
            cell_KickedID.setAttribute("data-title", "Kicked ID");
            cell_KickedNickname.setAttribute("data-title", "Kicked Nickname");
            cell_KickedByNickname.setAttribute("data-title", "Kicked by Nickname");
            cell_KickedByUID.setAttribute("data-title", "Kicked by UID");
            cell_KickReason.setAttribute("data-title", "Reason");

            var cell_DateTime_Div = document.createElement("div");
            cell_DateTime_Div.innerHTML = ts3ldv.time.dateTimeToMomentString(KickDateTime);
            cell_DateTime.appendChild(cell_DateTime_Div);
            kickBodyRow.appendChild(cell_DateTime);

            cell_KickedID.innerHTML = KickedID;
            kickBodyRow.appendChild(cell_KickedID);

            cell_KickedNickname.innerHTML = KickedNickname;
            kickBodyRow.appendChild(cell_KickedNickname);
            cell_KickedByNickname.innerHTML = KickedByNickname;
            kickBodyRow.appendChild(cell_KickedByNickname);

            cell_KickedByUID.innerHTML = KickedByUID;
            kickBodyRow.appendChild(cell_KickedByUID);

            cell_KickReason.innerHTML = KickReason;
            kickBodyRow.appendChild(cell_KickReason);

            kickBody.appendChild(kickBodyRow);
        }
        kickTable.appendChild(kickBody);

        kickTable.id = "kickTable";
        kickTable.className += "ui-table-reflow";

        $(kickTable).tablesorter({
            headers: {
                0: {sorter: "ignoreMoment"}
            },
            widgets: ["filter"],
            widgetOptions: {filter_searchDelay: 0},
            sortList: ts3ldv.storage.getTableSortOrder(this)
        }).bind("sortEnd", function () {
            ts3ldv.storage.setTableSortOrder(this, kickTable.config.sortList)
        }).tablesorterPager({
            container: $(document.getElementById(module.name + "Pager")),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            savePages: false
        });

        this.div.appendChild(kickTable);
    };

    return module;
}(ts3ldv.tables || {}));
