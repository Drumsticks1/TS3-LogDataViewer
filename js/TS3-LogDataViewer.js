// TS3-LogDataViewer.js
// Author: Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Global Variables
 */
var connectedClientsCount, nanobar, momentInterval, json, rebuildError = false,
    eventListeners = [],
    tables = ["clientTable", "banTable", "kickTable", "complaintTable", "uploadTable"],
    tableNames = ["Client", "Ban", "Kick", "Complaint", "Upload"];

/**
 * Rebuilds the JSON and calls buildTables() when the JSON is fetched.
 */
function rebuildJSON() {
    nanobar.go(35);
    document.getElementById("rebuildJSONButton").disabled = document.getElementById("buildNewJSONButton").disabled = true;
    $.get("./express/rebuildJSON", function() {
        buildTables();
    });
}

/**
 * Deletes the current JSON and builds a new one after the deletion.
 */
function buildNewJSON() {
    $.get("./express/deleteJSON", function() {
        rebuildJSON();
    });
}

/**
 * Expands or collapses the list, depending on its current state.
 *
 * @param {string} list - name of the list ("connections" or "ips").
 * @param {number} ID - ID of the client.
 */
function expandOrCollapseList(list, ID) {
    var column, upperList, collapsedCellCount;
    if (list == "ips") {
        column = 3;
        upperList = "IPs";
        collapsedCellCount = 1;
    } else {
        column = collapsedCellCount = 2;
        upperList = "Connections";
    }

    var currentDiv = document.getElementById(list + "_" + ID + "_1");
    if (currentDiv === null || currentDiv.style.display == "none")
        expandList(list, upperList, ID, column, collapsedCellCount);
    else collapseList(list, upperList, ID, column, collapsedCellCount);
}

/**
 * Expands the list with the given parameters.
 *
 * @param {string} list - name of the list ("connections" or "ips").
 * @param {string} upperList - name of the list with upper characters ("Connections" or "IPs").
 * @param {number} ID - ID of the client.
 * @param {number} column - the column ID.
 * @param {number} collapsedCellCount - count of the cells if collapsed.
 */
function expandList(list, upperList, ID, column, collapsedCellCount) {
    var x = document.getElementById(String(ID)).childNodes[column],
        listContent = json.ClientList[ID].getElementsByTagName(upperList)[0].getElementsByTagName(upperList[0]);
    document.getElementById(list + "Button_" + ID).innerHTML = "- " + (listContent.length - collapsedCellCount);
    document.getElementById(list + "Button_" + ID).parentNode.setAttribute("expanded", "false");
    for (var j = 1; j < listContent.length; j++) {
        var currentDiv = list + "_" + ID + "_" + j;
        if (document.getElementById(currentDiv) === null) {
            var newDiv = document.createElement("div");
            newDiv.id = currentDiv;
            if (collapsedCellCount == 1) newDiv.innerHTML = listContent[j].firstChild.nodeValue;
            else newDiv.innerHTML = UTCDateStringToLocaltimeString(listContent[j].firstChild.nodeValue);

            if (column == 3) x.appendChild(newDiv);
            else x.insertBefore(newDiv, x.lastChild);
        } else document.getElementById(currentDiv).style.display = "";
    }
}

//
/**
 * Collapses the list with the given parameters.
 *
 * @param {string} list - name of the list ("connections" or "ips").
 * @param {string} upperList - name of the list with upper characters ("Connections" or "IPs").
 * @param {number} ID - ID of the client.
 * @param {number} column - the column ID.
 * @param {number} collapsedCellCount - count of the cells if collapsed.
 */
function collapseList(list, upperList, ID, column, collapsedCellCount) {
    var listContent = json.ClientList[ID].getElementsByTagName(upperList)[0].getElementsByTagName(upperList[0]);
    document.getElementById(list + "Button_" + ID).innerHTML = "+ " + (listContent.length - collapsedCellCount);
    document.getElementById(list + "Button_" + ID).parentNode.setAttribute("expanded", "true");

    if (document.getElementById(String(ID)) !== null) {
        var x = document.getElementById(String(ID)).childNodes[column].childNodes;
        for (var j = 1; j < x.length - 2; j++) {
            document.getElementById(list + "_" + ID + "_" + j).style.display = "none";
        }
        if (column == 3) document.getElementById(list + "_" + ID + "_" + j).style.display = "none";
    }
}

/**
 * Collapses all expanded lists.
 */
function collapseAll() {
    var x = document.getElementById("clientTable").lastChild.childNodes;
    for (var j = 0; j < x.length; j++) {
        if (x.item(j).childNodes.item(2).getAttribute("expanded") == "false")
            collapseList("connections", "Connections", Number(x.item(j).getAttribute("id")), 2, 2);
        if (x.item(j).childNodes.item(3).getAttribute("expanded") == "true")
            collapseList("ips", "IPs", Number(x.item(j).getAttribute("id")), 3, 1);
    }
}

/**
 * Adds a custom parser which ignores the moment.js timestamps.
 */
function addIgnoreMomentParser() {
    $.tablesorter.addParser({
        id: "ignoreMoment",
        is: function() {
            return false;
        },
        format: function(s) {
            return s;
        },
        parsed: false,
        type: "text"
    });
}
/**
 * Adds a custom parser which ignores the expand/collapse button in the Connections list.
 */
function addConnectionsParser() {
    $.tablesorter.addParser({
        id: "Connections",
        is: function() {
            return false;
        },
        format: function(s, table, cell) {
            if (localStorage.getItem("connectionsSortType") == "1") {
                if (cell.firstChild.localName == "button") {
                    return cell.childNodes[1].innerHTML;
                } else return cell.firstChild.innerHTML;
            } else return cell.lastChild.innerHTML;
        },
        parsed: false,
        type: "text"
    });
}

/**
 * Adds a custom parser which ignores the expand/collapse button in the IPs list.
 */
function addIPsParser() {
    $.tablesorter.addParser({
        id: "IPs",
        is: function() {
            return false;
        },
        format: function(s, table, cell) {
            if (cell.firstChild.localName == "button") {
                return cell.childNodes[1].innerHTML;
            } else return cell.firstChild.innerHTML;
        },
        parsed: false,
        type: "text"
    });
}

/**
 * Switches between ID/UID columns in the ban table.
 */
function switchBetweenIDAndUID() {
    var rowId, banId, idOrUid, bannedByIDOrUD, Ban = json.BanList,
        x = document.getElementById("banTable").lastChild.childNodes,
        headRow = document.getElementById("banTable").firstChild.firstChild,
        uidState = Number(localStorage.getItem("uidState"));

    if (uidState) {
        idOrUid = "ID";
        localStorage.setItem("uidState", "0");
    } else {
        idOrUid = "UID";
        localStorage.setItem("uidState", "1");
    }

    headRow.childNodes[1].innerHTML = "Banned " + idOrUid;
    headRow.childNodes[4].innerHTML = "Banned by " + idOrUid;

    for (var j = 0; j < x.length; j++) {
        rowId = x.item(j).getAttribute("id");
        banId = rowId.substring(4, rowId.length);

        if (uidState) {
            if (document.getElementById(rowId).childNodes[3].firstChild.nodeValue != "Unknown") {
                bannedByIDOrUD = Ban[banId].bannedByID;
            } else bannedByIDOrUD = "Unknown";
        } else {
            if (Ban[banId].bannedByUID.length != 0) {
                bannedByIDOrUD = Ban[banId].bannedByUID;
            } else bannedByIDOrUD = "No UID";
        }

        document.getElementById(rowId).childNodes[1].setAttribute("data-title", "Banned " + idOrUid);
        document.getElementById(rowId).childNodes[4].setAttribute("data-title", "Banned by " + idOrUid);
        document.getElementById(rowId).childNodes[1].lastChild.innerHTML = Ban[banId]["bannedBy" + idOrUid];
        document.getElementById(rowId).childNodes[4].lastChild.innerHTML = bannedByIDOrUD;
    }
}

/**
 * Imports and uses the local storage data for the table.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function importLocalStorage(table) {
    if (localStorage.getItem(table)) {
        var checkState = Boolean(Number(localStorage.getItem(table)));
        document.getElementById(table + "Checkbox").checked = checkState;
        if (!checkState) document.getElementById("ts3-" + table).style.display = "";
    } else {
        document.getElementById(table + "Checkbox").checked = true;
        localStorage.setItem(table, "1");
    }
}

/**
 * Todo: Better description.
 * Adds a checkbox listener for the table.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function addTableCheckboxListener(table) {
    document.getElementById(table + "Checkbox").addEventListener("click", function() {
        var leadingCapitalLetterTable = table.charAt(0).toUpperCase() + table.substring(1);
        if (this.checked) {
            localStorage.setItem(table, "1");
            if (sessionStorage.getItem(table + "-built") == "0") {
                nanobar.go(50);
                buildTable(table);
                nanobar.go(100);
            }
            document.getElementById("ts3-" + table).style.display =
                document.getElementById("scrollTo" + leadingCapitalLetterTable).style.display = "";
        } else {
            localStorage.setItem(table, "0");
            document.getElementById("ts3-" + table).style.display =
                document.getElementById("scrollTo" + leadingCapitalLetterTable).style.display = "none";
        }
    });
}

/**
 * Converts a UTC dateTime string into a Date object which can be handled by moment.js functions.
 *
 * @param {string} dateString - UTC dateTime string with the format YYYY-MM-DD HH:mm:ss.
 * @returns {Date} - UTC Date object that can be handeled by moment.js functions.
 * @constructor
 */
function UTCDateStringToDate(dateString) {
    return new Date(Date.UTC(
        Number(dateString.substr(0, 4)),
        Number(dateString.substr(5, 2)) - 1,
        Number(dateString.substr(8, 2)),
        Number(dateString.substr(11, 2)),
        Number(dateString.substr(14, 2)),
        Number(dateString.substr(17, 2))));
}

/**
 * Returns the number x as double digit string.
 *
 * @param {number} x - given number.
 * @returns {string} - double digit string.
 */
function toDoubleDigit(x) {
    var y = String(x);
    if (x < 10) y = "0" + String(x);
    return y;
}

/**
 * Calls UTCDateStringToDate and converts the returned UTC Date object to a Localtime string.
 *
 * @param {string} dateString - UTC dateTime string with the format YYYY-MM-DD HH:mm:ss.
 * @returns {string} - Localtime string.
 * @constructor
 */
function UTCDateStringToLocaltimeString(dateString) {
    var dateObject = new UTCDateStringToDate(dateString);
    return dateObject.getFullYear() + "-" + toDoubleDigit(dateObject.getMonth() + 1) + "-" + toDoubleDigit(dateObject.getDate()) + " " +
        toDoubleDigit(dateObject.getHours()) + ":" + toDoubleDigit(dateObject.getMinutes()) + ":" + toDoubleDigit(dateObject.getSeconds());
}


/**
 * Adds the onclick event to the object and adds the object to the eventListeners array.
 *
 * @param {object} object
 * @param {function} onclickEvent
 */
function addOnClickEvent(object, onclickEvent) {
    object.onclick = onclickEvent;
    eventListeners.push(object);
}

/**
 * Destroys all onclick listeners that are listed in the eventListeners array.
 */
function removeEventListeners() {
    for (var i = eventListeners.length - 1; i >= 0; i--) {
        eventListeners[i].onclick = null;
        eventListeners.pop();
    }
}

/**
 * Returns the server group name for the given ID.
 *
 * @param {number} ID - ID of the server group.
 * @returns {string} - name of the server group.
 */
function getServerGroupByID(ID) {
    return json.ServerGroupList[ID].ServerGroupName;

}

/**
 * Resets the sorting of all tables.
 */
function resetSorting() {
    for (var i = 0; i < tables.length; i++) {
        $(document.getElementById(tables[i])).trigger("sortReset");
        localStorage.setItem(tables[i] + "SortOrder", JSON.stringify([]));
    }
}

/**
 * Builds the client table.
 */
function buildClientTable() {
    var clientTableControlSection = document.createElement("div");
    clientTableControlSection.className = "row";

    var clientTableHeading = document.createElement("div");
    clientTableHeading.className = "tableheading large-12 columns";
    clientTableHeading.innerHTML = "Client table";
    clientTableControlSection.appendChild(clientTableHeading);

    var connectionsSortTypeButton = document.createElement("button");
    connectionsSortTypeButton.id = "connectionsSortTypeButton";
    connectionsSortTypeButton.className = "small-12 medium-8 large-6 columns";
    connectionsSortTypeButton.innerHTML = "Currently sorting connections by the last connect";

    if (localStorage.getItem("connectionsSortType") === null) {
        localStorage.setItem("connectionsSortType", "1");
    } else if (localStorage.getItem("connectionsSortType") == "0") {
        connectionsSortTypeButton.innerHTML = "Currently sorting connections by the first connect";
    }

    addOnClickEvent(connectionsSortTypeButton, function() {
        if (localStorage.getItem("connectionsSortType") == "1") {
            connectionsSortTypeButton.innerHTML = "Currently sorting connections by the first connect";
            localStorage.setItem("connectionsSortType", "0");
        } else {
            connectionsSortTypeButton.innerHTML = "Currently sorting connections by the last connect";
            localStorage.setItem("connectionsSortType", "1");
        }
        $.tablesorter.updateCache(clientTable.config);
        $.tablesorter.sortOn(clientTable.config, clientTable.config.sortList);
    });
    clientTableControlSection.appendChild(connectionsSortTypeButton);

    var collapseAllButton = document.createElement("button");
    collapseAllButton.id = "collapseAllButton";
    collapseAllButton.className = "small-12 medium-4 large-6 columns";
    collapseAllButton.innerHTML = "Collapse expanded lists";

    addOnClickEvent(collapseAllButton, function() {
        collapseAll();
    });
    clientTableControlSection.appendChild(collapseAllButton);

    var coloredRowsDescription_green = document.createElement("div"),
        coloredRowsDescription_grey = document.createElement("div");
    coloredRowsDescription_green.id = "description_connected";
    coloredRowsDescription_grey.id = "description_deleted";
    coloredRowsDescription_green.className = coloredRowsDescription_grey.className = "small-6 columns";
    coloredRowsDescription_green.innerHTML = "Connected clients";
    coloredRowsDescription_grey.innerHTML = "Deleted clients";

    clientTableControlSection.appendChild(coloredRowsDescription_green);
    clientTableControlSection.appendChild(coloredRowsDescription_grey);

    document.getElementById("ts3-clientTable").appendChild(clientTableControlSection);

    var Client = json.ClientList,
        clientTable = document.createElement("table"),
        clientHead = document.createElement("thead"),
        clientHeadRow = document.createElement("tr"),
        headCell_ID = document.createElement("th"),
        headCell_Nicknames = document.createElement("th"),
        headCell_Connections = document.createElement("th"),
        headCell_IPs = document.createElement("th"),
        headCell_Connects = document.createElement("th"),
        headCell_Connected = document.createElement("th"),
        headCell_ServerGroupInfo = document.createElement("th");

    headCell_ID.innerHTML = "ID";
    headCell_Nicknames.innerHTML = "Nicknames";
    headCell_Connections.innerHTML = "Connections";
    headCell_IPs.innerHTML = "IPs";
    headCell_Connects.innerHTML = "Connects";
    headCell_Connected.innerHTML = "Connected";
    headCell_ServerGroupInfo.innerHTML = "Server groups";

    clientHeadRow.appendChild(headCell_ID);
    clientHeadRow.appendChild(headCell_Nicknames);
    clientHeadRow.appendChild(headCell_Connections);
    clientHeadRow.appendChild(headCell_IPs);
    clientHeadRow.appendChild(headCell_Connects);
    clientHeadRow.appendChild(headCell_Connected);
    clientHeadRow.appendChild(headCell_ServerGroupInfo);

    clientHead.appendChild(clientHeadRow);
    clientTable.appendChild(clientHead);

    var clientBody = document.createElement("tbody");
    for (var i = 0; i < Client.length; i++) {
        var ID = Number(Client[i].ID);
        if (ID != 0) {
            var Nicknames = Client[ID].Nickname,
                Connections = Client[ID].DateTime,
                IPs = Client[ID].IP,
                Connection_Count = Connections.length,
                ServerGroupIDs = Client[ID].ServerGroupID,
                ServerGroupAssignmentDateTimes = Client[ID].ServerGroupAssignmentDateTime;

            var clientBodyRow = document.createElement("tr"),
                cell_ID = document.createElement("td"),
                cell_Nicknames = document.createElement("td"),
                cell_Connections = document.createElement("td"),
                cell_IPs = document.createElement("td"),
                cell_Connects = document.createElement("td"),
                cell_Connected = document.createElement("td"),
                cell_ServerGroupInfo = document.createElement("td");

            clientBodyRow.id = ID;
            cell_ID.setAttribute("data-title", "ID");
            cell_Nicknames.setAttribute("data-title", "Nicknames");
            cell_Connections.setAttribute("data-title", "Connections");
            cell_IPs.setAttribute("data-title", "IPs");
            cell_Connects.setAttribute("data-title", "Connects");
            cell_Connected.setAttribute("data-title", "Connected");
            cell_ServerGroupInfo.setAttribute("data-title", "Server groups");

            cell_ID.innerHTML = ID;
            clientBodyRow.appendChild(cell_ID);

            for (var j = 0; j < Nicknames.length; j++) {
                var divNicknames = document.createElement("div");
                divNicknames.innerHTML = Nicknames[j];
                cell_Nicknames.appendChild(divNicknames);
            }
            clientBodyRow.appendChild(cell_Nicknames);

            if (Connections.length > 2) {
                var buttonExpandCollapseConnections = document.createElement("button");
                buttonExpandCollapseConnections.id = "connectionsButton_" + ID;
                buttonExpandCollapseConnections.innerHTML = "+ " + (Connections.length - 2);
                (function(ID) {
                    addOnClickEvent(buttonExpandCollapseConnections, function() {
                        expandOrCollapseList("connections", ID);
                    });
                })(ID);
                cell_Connections.appendChild(buttonExpandCollapseConnections);
            }

            var divLastConnection = document.createElement("div");
            divLastConnection.id = "connections_" + ID + "_0";
            divLastConnection.innerHTML = UTCDateStringToLocaltimeString(Connections[0]);
            cell_Connections.appendChild(divLastConnection);

            if (Connections.length > 1) {
                var divFirstConnection = document.createElement("div");
                divFirstConnection.id = "connections_" + ID + "_" + (Connections.length - 1);
                divFirstConnection.innerHTML = UTCDateStringToLocaltimeString(Connections[Connections.length - 1]);
                cell_Connections.appendChild(divFirstConnection);
            }
            clientBodyRow.appendChild(cell_Connections);

            if (IPs.length > 1) {
                var buttonExpandCollapseIPs = document.createElement("button");
                buttonExpandCollapseIPs.id = "ipsButton_" + ID;
                buttonExpandCollapseIPs.innerHTML = "+ " + (IPs.length - 1);
                (function(ID) {
                    addOnClickEvent(buttonExpandCollapseIPs, function() {
                        expandOrCollapseList("ips", ID);
                    });
                })(ID);
                cell_IPs.appendChild(buttonExpandCollapseIPs);
            }

            var divLastIP = document.createElement("div");
            divLastIP.id = "ips_" + ID + "_0";
            divLastIP.innerHTML = IPs[0];
            cell_IPs.appendChild(divLastIP);

            clientBodyRow.appendChild(cell_IPs);

            cell_Connects.innerHTML = Connection_Count;
            clientBodyRow.appendChild(cell_Connects);
            if (Client[ID].deleted) {
                clientBodyRow.className += "deleted";
            } else if (Client[ID].ConnectedState) {
                clientBodyRow.className += "connected";
                connectedClientsCount++;
            }
            cell_Connected.innerHTML = String(Boolean(Client[ID].ConnectedState));

            clientBodyRow.appendChild(cell_Connected);

            if (ServerGroupIDs.length === 0)
                cell_ServerGroupInfo.innerHTML = "/";


            for (j = 0; j < ServerGroupIDs.length; j++) {
                var divName = document.createElement("div"),
                    divDateTime = document.createElement("div");
                divName.innerHTML = getServerGroupByID(Number(ServerGroupIDs[j]));
                divDateTime.innerHTML = moment(UTCDateStringToDate(ServerGroupAssignmentDateTimes[j])).format("YYYY-MM-DD HH:mm:ss");

                cell_ServerGroupInfo.appendChild(divName);
                cell_ServerGroupInfo.appendChild(divDateTime);
            }
            clientBodyRow.appendChild(cell_ServerGroupInfo);

            clientBody.appendChild(clientBodyRow);
        }
    }
    clientTable.appendChild(clientBody);
    clientTable.id = "clientTable";
    clientTable.className += "ui-table-reflow";
    document.getElementById("ts3-clientTable").appendChild(clientTable);

    addConnectionsParser();
    addIPsParser();
    $(clientTable).tablesorter({
        headers: {
            2: {
                sorter: "Connections"
            },
            3: {
                sorter: "IPs"
            }
        },
        sortList: JSON.parse(localStorage.getItem("clientTableSortOrder"))
    }).bind("sortEnd", function() {
        localStorage.setItem("clientTableSortOrder", JSON.stringify(clientTable.config.sortList));
    }).trigger("applyWidgetId", ["stickyHeaders"]);
}

/**
 * Builds the ban table.
 */
function buildBanTable() {
    if (localStorage.getItem("uidState") === null) {
        localStorage.setItem("uidState", "0");
    }

    var banTableControlSection = document.createElement("div");
    banTableControlSection.className = "row";

    var banTableHeading = document.createElement("div");
    banTableHeading.className = "tableheading large-12 columns";
    banTableHeading.innerHTML = "Ban table";
    banTableControlSection.appendChild(banTableHeading);

    var switchBetweenIDandUIDButton = document.createElement("button");
    switchBetweenIDandUIDButton.id = "switchBetweenIDandUIDButton";
    switchBetweenIDandUIDButton.innerHTML = "Switch between IDs and UIDs";
    addOnClickEvent(switchBetweenIDandUIDButton, function() {
        switchBetweenIDAndUID();
    });
    banTableControlSection.appendChild(switchBetweenIDandUIDButton);
    document.getElementById("ts3-banTable").appendChild(banTableControlSection);

    var Ban = json.BanList,
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
        headCell_Bantime = document.createElement("th");

    headCell_BanDateTime.innerHTML = "Date and Time";
    headCell_BannedID.innerHTML = "Banned ID";
    headCell_BannedNickname.innerHTML = "Banned Nickname";
    headCell_BannedIP.innerHTML = "Banned IP";
    headCell_BannedByID.innerHTML = "Banned by ID";
    headCell_BannedByNickname.innerHTML = "Banned by Nickname";
    headCell_BanReason.innerHTML = "Reason";
    headCell_Bantime.innerHTML = "Bantime";

    banHeadRow.appendChild(headCell_BanDateTime);
    banHeadRow.appendChild(headCell_BannedID);
    banHeadRow.appendChild(headCell_BannedNickname);
    banHeadRow.appendChild(headCell_BannedIP);
    banHeadRow.appendChild(headCell_BannedByID);
    banHeadRow.appendChild(headCell_BannedByNickname);
    banHeadRow.appendChild(headCell_BanReason);
    banHeadRow.appendChild(headCell_Bantime);

    banHead.appendChild(banHeadRow);
    banTable.appendChild(banHead);

    var banBody = document.createElement("tbody");
    for (var i = 0; i < Ban.length; i++) {
        var BanDateTime = Ban[i]["banDateTime"],
            BannedID = Ban[i]["bannedID"],
            BannedNickname = Ban[i]["bannedNickname"],
            BannedIP = Ban[i]["bannedIP"],
            BannedByID;
        if (BannedIP != "Unknown") {
            BannedByID = Ban[i]["bannedByID"];
        } else BannedByID = "Unknown";

        var BannedByNickname = Ban[i]["bannedByNickname"],
            BanReason;
        if (Ban[i]["banReason"].length != 0) {
            BanReason = Ban[i]["banReason"];
        } else BanReason = "No Reason given";

        var Bantime = Ban[i]["bantime"];

        var banBodyRow = document.createElement("tr");
        banBodyRow.id = "ban_" + i;

        var cell_BanDateTime = document.createElement("td"),
            cell_BannedID = document.createElement("td"),
            cell_BannedNickname = document.createElement("td"),
            cell_BannedIP = document.createElement("td"),
            cell_BannedByID = document.createElement("td"),
            cell_BannedByNickname = document.createElement("td"),
            cell_BanReason = document.createElement("td"),
            cell_Bantime = document.createElement("td");

        cell_BanDateTime.setAttribute("data-title", "Date and Time");
        cell_BannedID.setAttribute("data-title", "Banned ID");
        cell_BannedNickname.setAttribute("data-title", "Banned Nickname");
        cell_BannedIP.setAttribute("data-title", "Banned IP");
        cell_BannedByID.setAttribute("data-title", "Banned by ID");
        cell_BannedByNickname.setAttribute("data-title", "Banned by Nickname");
        cell_BanReason.setAttribute("data-title", "Reason");
        cell_Bantime.setAttribute("data-title", "Bantime");

        var UTCBanDateTime = moment(UTCDateStringToDate(BanDateTime)),
            cell_BanDateTime_Div = document.createElement("div");
        cell_BanDateTime_Div.innerHTML = UTCBanDateTime.format("YYYY-MM-DD HH:mm:ss") + "<br />(about " + UTCBanDateTime.fromNow() + ")";
        cell_BanDateTime.appendChild(cell_BanDateTime_Div);
        banBodyRow.appendChild(cell_BanDateTime);

        var cell_BannedID_Div = document.createElement("div");
        cell_BannedID_Div.innerHTML = BannedID;
        cell_BannedID.appendChild(cell_BannedID_Div);
        banBodyRow.appendChild(cell_BannedID);

        var cell_BannedNickname_Div = document.createElement("div");
        cell_BannedNickname_Div.innerHTML = BannedNickname;
        cell_BannedNickname.appendChild(cell_BannedNickname_Div);
        banBodyRow.appendChild(cell_BannedNickname);

        cell_BannedIP.innerHTML = BannedIP;
        banBodyRow.appendChild(cell_BannedIP);

        var cell_BannedByID_Div = document.createElement("div");
        cell_BannedByID_Div.innerHTML = BannedByID;
        cell_BannedByID.appendChild(cell_BannedByID_Div);
        banBodyRow.appendChild(cell_BannedByID);

        var cell_BannedByNickname_Div = document.createElement("div");
        cell_BannedByNickname_Div.innerHTML = BannedByNickname;
        cell_BannedByNickname.appendChild(cell_BannedByNickname_Div);
        banBodyRow.appendChild(cell_BannedByNickname);

        var cell_BanReason_Div = document.createElement("div");
        cell_BanReason_Div.innerHTML = BanReason;
        cell_BanReason.appendChild(cell_BanReason_Div);
        banBodyRow.appendChild(cell_BanReason);

        cell_Bantime.innerHTML = Bantime;
        banBodyRow.appendChild(cell_Bantime);

        banBody.appendChild(banBodyRow);
    }
    banTable.appendChild(banBody);

    banTable.id = "banTable";
    banTable.className += "ui-table-reflow";
    document.getElementById("ts3-banTable").appendChild(banTable);

    if (localStorage.getItem("uidState") == "1") {
        localStorage.setItem("uidState", "0");
        switchBetweenIDAndUID();
    }

    addIgnoreMomentParser();
    $(banTable).tablesorter({
        headers: {
            0: {
                sorter: "ignoreMoment"
            }
        },
        sortList: JSON.parse(localStorage.getItem("banTableSortOrder"))
    }).bind("sortEnd", function() {
        localStorage.setItem("banTableSortOrder", JSON.stringify(banTable.config.sortList));
    }).trigger("applyWidgetId", ["stickyHeaders"]);
}

/**
 * Builds the kick table.
 */
function buildKickTable() {
    var kickTableControlSection = document.createElement("div");
    kickTableControlSection.className = "row";

    var kickTableHeading = document.createElement("div");
    kickTableHeading.className = "tableheading large-12 columns";
    kickTableHeading.innerHTML = "Kick table";
    kickTableControlSection.appendChild(kickTableHeading);

    document.getElementById("ts3-kickTable").appendChild(kickTableControlSection);

    var Kick = json.KickList,
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
    headCell_KickedID.innerHTML = "Kicked Client ID";
    headCell_KickedNickname.innerHTML = "Kicked Client Nickname";
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
        if (Kick[i].kickReason.length != 0) {
            KickReason = Kick[i].kickReason;
        } else KickReason = "No Reason given";

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

        var UTCKickDateTime = moment(UTCDateStringToDate(KickDateTime)),
            cell_DateTime_Div = document.createElement("div");
        cell_DateTime_Div.innerHTML = UTCKickDateTime.format("YYYY-MM-DD HH:mm:ss") + "<br />(about " + UTCKickDateTime.fromNow() + ")";
        cell_DateTime.appendChild(cell_DateTime_Div);
        kickBodyRow.appendChild(cell_DateTime);

        cell_KickedID.innerHTML = KickedID;
        kickBodyRow.appendChild(cell_KickedID);

        var cell_KickedNickname_Div = document.createElement("div");
        cell_KickedNickname_Div.innerHTML = KickedNickname;
        cell_KickedNickname.appendChild(cell_KickedNickname_Div);
        kickBodyRow.appendChild(cell_KickedNickname);

        var cell_KickedByNickname_Div = document.createElement("div");
        cell_KickedByNickname_Div.innerHTML = KickedByNickname;
        cell_KickedByNickname.appendChild(cell_KickedByNickname_Div);
        kickBodyRow.appendChild(cell_KickedByNickname);

        var cell_KickedByUID_Div = document.createElement("div");
        cell_KickedByUID_Div.innerHTML = KickedByUID;
        cell_KickedByUID.appendChild(cell_KickedByUID_Div);
        kickBodyRow.appendChild(cell_KickedByUID);

        var cell_KickReason_Div = document.createElement("div");
        cell_KickReason_Div.innerHTML = KickReason;
        cell_KickReason.appendChild(cell_KickReason_Div);
        kickBodyRow.appendChild(cell_KickReason);

        kickBody.appendChild(kickBodyRow);
    }
    kickTable.appendChild(kickBody);

    kickTable.id = "kickTable";
    kickTable.className += "ui-table-reflow";
    document.getElementById("ts3-kickTable").appendChild(kickTable);

    addIgnoreMomentParser();
    $(kickTable).tablesorter({
        headers: {
            0: {
                sorter: "ignoreMoment"
            }
        },
        sortList: JSON.parse(localStorage.getItem("kickTableSortOrder"))
    }).bind("sortEnd", function() {
        localStorage.setItem("kickTableSortOrder", JSON.stringify(kickTable.config.sortList));
    }).trigger("applyWidgetId", ["stickyHeaders"]);
}

/**
 * Builds the complaint table.
 */
function buildComplaintTable() {
    var complaintTableControlSection = document.createElement("div");
    complaintTableControlSection.className = "row";

    var complaintTableHeading = document.createElement("div");
    complaintTableHeading.className = "tableheading large-12 columns";
    complaintTableHeading.innerHTML = "Complaint table";
    complaintTableControlSection.appendChild(complaintTableHeading);

    document.getElementById("ts3-complaintTable").appendChild(complaintTableControlSection);

    var Complaint = json.ComplaintList,
        complaintTable = document.createElement("table"),
        complaintHead = document.createElement("thead"),
        complaintHeadRow = document.createElement("tr"),
        headCell_ComplaintDateTime = document.createElement("th"),
        headCell_ComplaintAboutID = document.createElement("th"),
        headCell_ComplaintAboutNickname = document.createElement("th"),
        headCell_ComplaintReason = document.createElement("th"),
        headCell_ComplaintByID = document.createElement("th"),
        headCell_ComplaintByNickname = document.createElement("th");

    headCell_ComplaintDateTime.innerHTML = "Date and Time";
    headCell_ComplaintAboutID.innerHTML = "About ID";
    headCell_ComplaintAboutNickname.innerHTML = "About Nickname";
    headCell_ComplaintReason.innerHTML = "Reason";
    headCell_ComplaintByID.innerHTML = "By ID";
    headCell_ComplaintByNickname.innerHTML = "By Nickname";

    complaintHeadRow.appendChild(headCell_ComplaintDateTime);
    complaintHeadRow.appendChild(headCell_ComplaintAboutID);
    complaintHeadRow.appendChild(headCell_ComplaintAboutNickname);
    complaintHeadRow.appendChild(headCell_ComplaintReason);
    complaintHeadRow.appendChild(headCell_ComplaintByID);
    complaintHeadRow.appendChild(headCell_ComplaintByNickname);

    complaintHead.appendChild(complaintHeadRow);
    complaintTable.appendChild(complaintHead);

    var complaintBody = document.createElement("tbody");
    for (var i = 0; i < Complaint.length; i++) {
        var ComplaintDateTime = Complaint[i].complaintDateTime,
            ComplaintAboutID = Complaint[i].complaintAboutID,
            ComplaintAboutNickname = Complaint[i].complaintAboutNickname,
            ComplaintReason = Complaint[i].complaintReason,
            ComplaintByID = Complaint[i].complaintByID,
            ComplaintByNickname = Complaint[i].complaintByNickname;

        var complaintBodyRow = document.createElement("tr"),
            cell_ComplaintDateTime = document.createElement("td"),
            cell_ComplaintAboutID = document.createElement("td"),
            cell_ComplaintAboutNickname = document.createElement("td"),
            cell_ComplaintReason = document.createElement("td"),
            cell_ComplaintByID = document.createElement("td"),
            cell_ComplaintByNickname = document.createElement("td");

        cell_ComplaintDateTime.setAttribute("data-title", "Date and Time");
        cell_ComplaintAboutID.setAttribute("data-title", "About ID");
        cell_ComplaintAboutNickname.setAttribute("data-title", "About Nickname");
        cell_ComplaintReason.setAttribute("data-title", "Reason");
        cell_ComplaintByID.setAttribute("data-title", "By ID");
        cell_ComplaintByNickname.setAttribute("data-title", "By Nickname");

        var UTCComplaintDateTime = moment(UTCDateStringToDate(ComplaintDateTime)),
            cell_ComplaintDateTime_Div = document.createElement("div");
        cell_ComplaintDateTime_Div.innerHTML = UTCComplaintDateTime.format("YYYY-MM-DD HH:mm:ss") + "<br />(about " + UTCComplaintDateTime.fromNow() + ")";
        cell_ComplaintDateTime.appendChild(cell_ComplaintDateTime_Div);
        complaintBodyRow.appendChild(cell_ComplaintDateTime);

        cell_ComplaintAboutID.innerHTML = ComplaintAboutID;
        complaintBodyRow.appendChild(cell_ComplaintAboutID);

        var cell_ComplaintAboutNickname_Div = document.createElement("div");
        cell_ComplaintAboutNickname_Div.innerHTML = ComplaintAboutNickname;
        cell_ComplaintAboutNickname.appendChild(cell_ComplaintAboutNickname_Div);
        complaintBodyRow.appendChild(cell_ComplaintAboutNickname);

        var cell_ComplaintReason_Div = document.createElement("div");
        cell_ComplaintReason_Div.innerHTML = ComplaintReason;
        cell_ComplaintReason.appendChild(cell_ComplaintReason_Div);
        complaintBodyRow.appendChild(cell_ComplaintReason);

        cell_ComplaintByID.innerHTML = ComplaintByID;
        complaintBodyRow.appendChild(cell_ComplaintByID);

        var cell_ComplaintByNickname_Div = document.createElement("div");
        cell_ComplaintByNickname_Div.innerHTML = ComplaintByNickname;
        cell_ComplaintByNickname.appendChild(cell_ComplaintByNickname_Div);
        complaintBodyRow.appendChild(cell_ComplaintByNickname);

        complaintBody.appendChild(complaintBodyRow);
    }
    complaintTable.appendChild(complaintBody);

    complaintTable.id = "complaintTable";
    complaintTable.className += "ui-table-reflow";
    document.getElementById("ts3-complaintTable").appendChild(complaintTable);

    addIgnoreMomentParser();
    $(complaintTable).tablesorter({
        headers: {
            0: {
                sorter: "ignoreMoment"
            }
        },
        sortList: JSON.parse(localStorage.getItem("complaintTableSortOrder"))
    }).bind("sortEnd", function() {
        localStorage.setItem("complaintTableSortOrder", JSON.stringify(complaintTable.config.sortList));
    }).trigger("applyWidgetId", ["stickyHeaders"]);
}

/**
 * Builds the upload table.
 */
function buildUploadTable() {
    var uploadTableControlSection = document.createElement("div");
    uploadTableControlSection.className = "row";

    var uploadTableHeading = document.createElement("div");
    uploadTableHeading.className = "tableheading large-12 columns";
    uploadTableHeading.innerHTML = "Upload table";
    uploadTableControlSection.appendChild(uploadTableHeading);

    document.getElementById("ts3-uploadTable").appendChild(uploadTableControlSection);

    var Upload = json.UploadList,
        uploadTable = document.createElement("table"),
        uploadHead = document.createElement("thead"),
        uploadHeadRow = document.createElement("tr"),
        headCell_UploadDateTime = document.createElement("th"),
        headCell_ChannelID = document.createElement("th"),
        headCell_Filename = document.createElement("th"),
        headCell_UploadedByID = document.createElement("th"),
        headCell_UploadedByNickname = document.createElement("th"),

        headCell_DeletedByID = document.createElement("th"),
        headCell_DeletedByNickname = document.createElement("th");

    headCell_UploadDateTime.innerHTML = "Date and Time";
    headCell_ChannelID.innerHTML = "Channel ID";
    headCell_Filename.innerHTML = "Filename";
    headCell_UploadedByID.innerHTML = "Uploaded by ID";
    headCell_UploadedByNickname.innerHTML = "Uploaded by Nickname";
    headCell_DeletedByID.innerHTML = "Deleted by ID";
    headCell_DeletedByNickname.innerHTML = "Deleted by Nickname";

    uploadHeadRow.appendChild(headCell_UploadDateTime);
    uploadHeadRow.appendChild(headCell_ChannelID);
    uploadHeadRow.appendChild(headCell_Filename);
    uploadHeadRow.appendChild(headCell_UploadedByID);
    uploadHeadRow.appendChild(headCell_UploadedByNickname);
    uploadHeadRow.appendChild(headCell_DeletedByID);
    uploadHeadRow.appendChild(headCell_DeletedByNickname);

    uploadHead.appendChild(uploadHeadRow);
    uploadTable.appendChild(uploadHead);

    var uploadBody = document.createElement("tbody");
    for (var i = 0; i < Upload.length; i++) {
        var UploadDateTime = Upload[i].uploadDateTime,
            ChannelID = Upload[i].channelID,
            Filename = Upload[i].filename,
            UploadedByID = Upload[i].uploadedByID,
            UploadedByNickname = Upload[i].uploadedByNickname,
            DeletedByID, DeletedByNickname;

        if (Upload[i].deleted) {
            DeletedByID = Upload[i].deletedByID;
            DeletedByNickname = Upload[i].deletedByNickname;
        } else {
            DeletedByID = DeletedByNickname = "/";
        }

        var uploadBodyRow = document.createElement("tr"),
            cell_UploadDateTime = document.createElement("td"),
            cell_ChannelID = document.createElement("td"),
            cell_Filename = document.createElement("td"),
            cell_UploadedByID = document.createElement("td"),
            cell_UploadedByNickname = document.createElement("td"),
            cell_DeletedByID = document.createElement("td"),
            cell_DeletedByNickname = document.createElement("td");

        cell_UploadDateTime.setAttribute("data-title", "Date and Time");
        cell_ChannelID.setAttribute("data-title", "Channel ID");
        cell_Filename.setAttribute("data-title", "Filename");
        cell_UploadedByID.setAttribute("data-title", "Uploaded by ID");
        cell_UploadedByNickname.setAttribute("data-title", "Uploaded by Nickname");
        cell_DeletedByID.setAttribute("data-title", "Deleted by ID");
        cell_DeletedByNickname.setAttribute("data-title", "Deleted by Nickname");

        var UTCUploadDateTime = moment(UTCDateStringToDate(UploadDateTime)),
            cell_UploadDateTime_Div = document.createElement("div");
        cell_UploadDateTime_Div.innerHTML = UTCUploadDateTime.format("YYYY-MM-DD HH:mm:ss") + "<br />(about " + UTCUploadDateTime.fromNow() + ")";
        cell_UploadDateTime.appendChild(cell_UploadDateTime_Div);
        uploadBodyRow.appendChild(cell_UploadDateTime);

        cell_ChannelID.innerHTML = ChannelID;
        uploadBodyRow.appendChild(cell_ChannelID);

        var cell_Filename_Div = document.createElement("div");
        cell_Filename_Div.innerHTML = Filename;
        cell_Filename.appendChild(cell_Filename_Div);
        uploadBodyRow.appendChild(cell_Filename);

        cell_UploadedByID.innerHTML = UploadedByID;
        uploadBodyRow.appendChild(cell_UploadedByID);

        var cell_UploadedByNickname_Div = document.createElement("div");
        cell_UploadedByNickname_Div.innerHTML = UploadedByNickname;
        cell_UploadedByNickname.appendChild(cell_UploadedByNickname_Div);
        uploadBodyRow.appendChild(cell_UploadedByNickname);

        cell_DeletedByID.innerHTML = DeletedByID;
        uploadBodyRow.appendChild(cell_DeletedByID);

        var cell_DeletedByNickname_Div = document.createElement("div");
        cell_DeletedByNickname_Div.innerHTML = DeletedByNickname;
        cell_DeletedByNickname.appendChild(cell_DeletedByNickname_Div);
        uploadBodyRow.appendChild(cell_DeletedByNickname);

        uploadBody.appendChild(uploadBodyRow);
    }
    uploadTable.appendChild(uploadBody);

    uploadTable.id = "uploadTable";
    uploadTable.className += "ui-table-reflow";
    document.getElementById("ts3-uploadTable").appendChild(uploadTable);

    addIgnoreMomentParser();
    $(uploadTable).tablesorter({
        headers: {
            0: {
                sorter: "ignoreMoment"
            }
        },
        sortList: JSON.parse(localStorage.getItem("uploadTableSortOrder"))
    }).bind("sortEnd", function() {
        localStorage.setItem("uploadTableSortOrder", JSON.stringify(uploadTable.config.sortList));
    }).trigger("applyWidgetId", ["stickyHeaders"]);
}

/**
 * Calls the build function for the table.
 *
 * @param tableName - name of the table (e.g. "clientTable").
 */
function buildTable(tableName) {
    switch (tableName) {
        case tables[0]:
            buildClientTable();
            break;
        case tables[1]:
            buildBanTable();
            break;
        case tables[2]:
            buildKickTable();
            break;
        case tables[3]:
            buildComplaintTable();
            break;
        case tables[4]:
            buildUploadTable();
    }
}

/**
 * Imports the local storage, builds the table if it would not be empty and sets the session storage.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function buildTableWithAlertCheckAndLocalStorage(table) {
    $(document.getElementById(table)).trigger("destroy");
    $(document.getElementById("ts3-" + table)).empty();

    if (localStorage.getItem(table + "SortOrder") === null) {
        localStorage.setItem(table + "SortOrder", "[]");
    }

    if (localStorage.getItem(table) != "0") {
        sessionStorage.setItem(table + "-built", "1");

        var leadingCapitalLetterTable = table.charAt(0).toUpperCase() + table.substring(1);
        document.getElementById("scrollTo" + leadingCapitalLetterTable).style.display = "";

        if (json[leadingCapitalLetterTable.substring(0, leadingCapitalLetterTable.indexOf("Table")) + "List"].length) {
            buildTable(table);
        } else {
            var alertBox = document.createElement("div");
            alertBox.className = "alertBox";
            alertBox.innerHTML = "No " + table.substring(0, table.search("Table")) + "s were found.";
            document.getElementById("ts3-" + table).appendChild(alertBox);
        }
    } else sessionStorage.setItem(table + "-built", "0");
}

/**
 * Builds all tables using the data from the JSON.
 */
function buildTables() {
    nanobar.go(50);
    $.ajax({
        url: "./output.json",
        cache: false,
        error: function() {
            if (rebuildError) alert("Rebuilding failed!");
            else {
                rebuildError = true;
                rebuildJSON();
            }
        },
        success: function(fetchedJSON) {
            rebuildError = false;
            json = fetchedJSON;
            connectedClientsCount = 0;

            removeEventListeners();
            for (var i = 0; i < tables.length; i++) {
                buildTableWithAlertCheckAndLocalStorage(tables[i]);
            }

            var Attributes = json.Attributes,
                creationTimestampUTC = Attributes.creationTimestamp_UTC;

            document.getElementById("creationTimestamp_localtime").innerHTML = Attributes.creationTimestamp_LocalTime;
            document.getElementById("creationTimestamp_utc").innerHTML = creationTimestampUTC;
            document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTimestampUTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();

            clearInterval(momentInterval);
            momentInterval = setInterval(function() {
                document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTimestampUTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();
            }, 1000);

            if (!document.getElementById("clientTable") || document.getElementById("ts3-clientTable").style.display == "none") {
                var Client = json.ClientList;
                for (var j = 0; j < Client.length; j++) {
                    if (Client[j].ConnectedState) {
                        connectedClientsCount++;
                    }
                }
            }
            document.getElementById("connectedClientsCount").innerHTML = "Connected clients: " + connectedClientsCount;

            document.getElementById("rebuildJSONButton").disabled = document.getElementById("buildNewJSONButton").disabled = false;
            nanobar.go(100);
        }
    });
}

/**
 * Builds the control section.
 */
function buildControlSection() {
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


    var rebuildSection = document.createElement("div"),
        rebuildJSONButton = document.createElement("button"),
        buildNewJSONButton = document.createElement("button");

    rebuildSection.id = "rebuildSection";
    rebuildSection.className = "small-12 medium-4 large-4 columns";
    rebuildJSONButton.id = "rebuildJSONButton";
    buildNewJSONButton.id = "buildNewJSONButton";
    rebuildJSONButton.innerHTML = "Update current JSON";
    buildNewJSONButton.innerHTML = "Generate new JSON";
    rebuildJSONButton.disabled = buildNewJSONButton.disabled = true;

    rebuildJSONButton.onclick = function() {
        rebuildJSON();
    };
    buildNewJSONButton.onclick = function() {
        buildNewJSON();
    };

    rebuildSection.appendChild(rebuildJSONButton);
    rebuildSection.appendChild(buildNewJSONButton);


    var miscControlSection = document.createElement("div"),
        resetSortingButton = document.createElement("button");

    miscControlSection.className = "columns";
    resetSortingButton.className = "small-12";
    resetSortingButton.innerHTML = "Reset table sorting";
    resetSortingButton.onclick = function() {
        resetSorting();
    };

    miscControlSection.appendChild(resetSortingButton);


    var navbar = document.createElement("div"),
        scrollBackToTopButton = document.createElement("button");

    navbar.id = "navbar";
    scrollBackToTopButton.innerHTML = "Top";

    scrollBackToTopButton.onclick = function() {
        scrollTo(0, 0);
    };

    navbar.appendChild(scrollBackToTopButton);

    var scrollToTablesButtons = new Array(5);
    for (var j = 0; j < 5; j++) {
        scrollToTablesButtons[j] = document.createElement("button");
        scrollToTablesButtons[j].style.display = "none";
        scrollToTablesButtons[j].id = "scrollTo" + tableNames[j] + "Table";
        scrollToTablesButtons[j].innerHTML = tableNames[j] + "s";

        (function(j) {
            scrollToTablesButtons[j].onclick = function() {
                document.getElementById("ts3-" + tables[j]).scrollIntoView();
            };
        })(j);

        navbar.appendChild(scrollToTablesButtons[j]);
    }

    controlSection.appendChild(tableSelectionSection);
    controlSection.appendChild(creationTimestampSection);
    controlSection.appendChild(rebuildSection);
    controlSection.appendChild(miscControlSection);
    controlSection.appendChild(navbar);
    document.getElementById("ts3-control").appendChild(controlSection);
}

document.addEventListener("DOMContentLoaded", function() {
    $(document).foundation();

    nanobar = new Nanobar({
        bg: "white",
        id: "nanobar"
    });

    buildControlSection();
    nanobar.go(25);

    for (var i = 0; i < tables.length; i++) {
        importLocalStorage(tables[i]);
        addTableCheckboxListener(tables[i]);
    }

    buildTables();
});
