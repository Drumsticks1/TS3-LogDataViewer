// js/modules/tables/client.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

/**
 * Module containing functions that are related to the Client table.
 */
ts3ldv.tables.client = (function (module) {

    /**
     * Builds the client table.
     */
    module.build = function () {
        var clientTableControlSection = document.createElement("div");
        clientTableControlSection.className = "row";

        var clientTableHeading = document.createElement("div");
        clientTableHeading.className = "tableheading large-12 columns";
        clientTableHeading.innerHTML = "Client table";
        clientTableControlSection.appendChild(clientTableHeading);

        var connectionsSortTypeButton = document.createElement("button");
        connectionsSortTypeButton.id = "connectionsSortTypeButton";
        connectionsSortTypeButton.className = "small-12 medium-8 large-6 columns";
        connectionsSortTypeButton.innerHTML = sortStrings[1];

        if (localStorage.getItem("connectionsSortType") === null)
            localStorage.setItem("connectionsSortType", "1");
        else if (localStorage.getItem("connectionsSortType") === "0")
            connectionsSortTypeButton.innerHTML = sortStrings[0];

        addOnClickEvent(connectionsSortTypeButton, function () {
            if (localStorage.getItem("connectionsSortType") === "1") {
                connectionsSortTypeButton.innerHTML = sortStrings[0];
                localStorage.setItem("connectionsSortType", "0");
            } else {
                connectionsSortTypeButton.innerHTML = sortStrings[1];
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

        addOnClickEvent(collapseAllButton, function () {
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

        addPagerSection(clientTableControlSection, "clientTable");

        document.getElementById("ts3-clientTable").appendChild(clientTableControlSection);

        var Client = ts3ldv.Json.ClientList,
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
            var ID = Number(Client[i].clientId);
            if (Client[ID].Nicknames.length !== 0) {
                var Nicknames = Client[ID].Nicknames,
                    Connections = Client[ID].Connections,
                    IPs = Client[ID].IPs,
                    Connection_Count = Connections.length,
                    ServerGroupIDs = Client[ID].ServerGroupIDs,
                    ServerGroupAssignmentDateTimes = Client[ID].ServerGroupAssignmentDateTimes;

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
                    buttonExpandCollapseConnections.id = "ConnectionsButton_" + ID;
                    buttonExpandCollapseConnections.innerHTML = "+ " + (Connections.length - 2);

                    (function (ID) {
                        addOnClickEvent(buttonExpandCollapseConnections, function () {
                            expandOrCollapseList("Connections", ID);
                        });
                    })(ID);
                    cell_Connections.appendChild(buttonExpandCollapseConnections);
                }

                var divLastConnection = document.createElement("div");
                divLastConnection.id = "Connections_" + ID + "_0";
                divLastConnection.innerHTML = ts3ldv.timeFunctions.UTCDateStringToLocaltimeString(Connections[0]);
                cell_Connections.appendChild(divLastConnection);

                if (Connections.length > 1) {
                    var divFirstConnection = document.createElement("div");
                    divFirstConnection.id = "Connections_" + ID + "_" + (Connections.length - 1);
                    divFirstConnection.innerHTML = ts3ldv.timeFunctions.UTCDateStringToLocaltimeString(Connections[Connections.length - 1]);
                    cell_Connections.appendChild(divFirstConnection);
                }
                clientBodyRow.appendChild(cell_Connections);

                if (IPs.length > 1) {
                    var buttonExpandCollapseIPs = document.createElement("button");
                    buttonExpandCollapseIPs.id = "IPsButton_" + ID;
                    buttonExpandCollapseIPs.innerHTML = "+ " + (IPs.length - 1);

                    (function (ID) {
                        addOnClickEvent(buttonExpandCollapseIPs, function () {
                            expandOrCollapseList("IPs", ID);
                        });
                    })(ID);
                    cell_IPs.appendChild(buttonExpandCollapseIPs);
                }

                var divLastIP = document.createElement("div");
                divLastIP.id = "IPs_" + ID + "_0";
                divLastIP.innerHTML = IPs[0];
                cell_IPs.appendChild(divLastIP);

                clientBodyRow.appendChild(cell_IPs);

                cell_Connects.innerHTML = Connection_Count;
                clientBodyRow.appendChild(cell_Connects);

                if (Client[ID].deleted)
                    clientBodyRow.className += "deleted";
                else if (Client[ID].ConnectedState) {
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
                    divName.innerHTML = lookup.ServerGroupList[ServerGroupIDs[j]].serverGroupName;
                    divDateTime.innerHTML = moment(ts3ldv.timeFunctions.UTCDateStringToDate(ServerGroupAssignmentDateTimes[j])).format(timeFormat);

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

        $(clientTable).tablesorter({
            headers: {
                2: {sorter: "connections"},
                3: {sorter: "ips"}
            },
            widgets: ["filter"],
            widgetOptions: {
                filter_searchDelay: 0,

                // Filter functions for filtering with all connections / ips data from the json.
                filter_functions: {
                    2: function (e, n, f, i, $r, c, data) {
                        var connections = ts3ldv.Json.ClientList[Number(data.$cells[0].innerHTML)].Connections;

                        for (i = 0; i < connections.length; i++) {
                            if (connections[i].indexOf(data.filter) !== -1)
                                return true;
                        }

                        return false;
                    },
                    3: function (e, n, f, i, $r, c, data) {
                        var ips = ts3ldv.Json.ClientList[Number(data.$cells[0].innerHTML)].IPs;

                        for (i = 0; i < ips.length; i++) {
                            if (ips[i].indexOf(data.filter) !== -1)
                                return true;
                        }

                        return false;
                    }
                }
            },
            sortList: JSON.parse(localStorage.getItem("clientTableSortOrder"))
        }).bind("sortEnd", function () {
            localStorage.setItem("clientTableSortOrder", JSON.stringify(clientTable.config.sortList));
        }).tablesorterPager({
            container: $(".clientTablePager"),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            savePages: true
        });

        document.getElementById("ts3-clientTable").appendChild(clientTable);
    };

    return module;
}(ts3ldv.tables.client || {}));
