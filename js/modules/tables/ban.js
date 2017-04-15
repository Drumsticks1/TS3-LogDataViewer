// js/modules/tables/ban.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

/**
 * Module containing functions that are related to the Ban table.
 */
ts3ldv.tables.ban = (function (module) {

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

        addOnClickEvent(switchBetweenIDAndUIDButton, function () {
            switchBetweenIDAndUID();
        });
        banTableControlSection.appendChild(switchBetweenIDAndUIDButton);

        addPagerSection(banTableControlSection, "banTable");

        document.getElementById("ts3-banTable").appendChild(banTableControlSection);

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
            cell_BanDateTime_Div.innerHTML = ts3ldv.timeFunctions.dateTimeToMomentString(BanDateTime);
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
            sortList: JSON.parse(localStorage.getItem("banTableSortOrder"))
        }).bind("sortEnd", function () {
            localStorage.setItem("banTableSortOrder", JSON.stringify(banTable.config.sortList));
        }).tablesorterPager({
            container: $(".banTablePager"),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            savePages: false
        });

        document.getElementById("ts3-banTable").appendChild(banTable);
    };

    return module;
}(ts3ldv.tables.ban || {}));
