// js/modules/tables/client.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Client table.
 */
(function (parent) {
  const module = parent.client = parent.client || {};

  /**
   * The name of the module
   * @type {string}
   */
  module.name = "client";

  /**
   * The element containing the table.
   * @type {Element}
   */
  module.div = document.getElementById("ts3-clientTable");

  /**
   * Returns the table div (calls document.getElementById("tableDivId"))
   * @returns {Element}
   */
  module.getTableDiv = function () {
    return document.getElementById("clientTable");
  };

  /**
   * The input object of type checkbox in the tableSelection section that toggles the table of this module.
   * @type {Element}
   */
  module.checkbox = module.checkbox || undefined;

  /**
   * Expands or collapses the list, depending on its current state.
   *
   * @param {string} list - name of the list ("Connections" or "IPs").
   * @param {number} ID - ID of the client.
   */
  function expandOrCollapseList(list, ID) {
    let column, collapsedCellCount;
    if (list === "IPs") {
      column = 3;
      collapsedCellCount = 1;
    } else
      column = collapsedCellCount = 2;

    const currentDiv = document.getElementById(list + "_" + ID + "_1");

    if (currentDiv === null || currentDiv.style.display === "none")
      expandList(list, ID, column, collapsedCellCount);
    else
      collapseList(list, ID, column, collapsedCellCount);
  }

  /**
   * Expands the list with the given parameters.
   *
   * @param {string} list - name of the list ("Connections" or "IPs").
   * @param {number} ID - ID of the client.
   * @param {number} column - the column ID.
   * @param {number} collapsedCellCount - count of the cells if collapsed.
   */
  function expandList(list, ID, column, collapsedCellCount) {
    const x = document.getElementById(String(ID)).childNodes[column],
      listContent = ts3ldv.tables.lookup.ClientList[ID][list];

    const currentDiv = document.getElementById(list + "Button_" + ID);
    currentDiv.innerText = "- " + (listContent.length - collapsedCellCount);
    currentDiv.parentNode.setAttribute("expanded", "true");

    for (let j = 1; j < listContent.length; j++) {
      const currentDivString = list + "_" + ID + "_" + j;

      if (document.getElementById(currentDivString) === null) {
        const newDiv = document.createElement("div");
        newDiv.id = currentDivString;

        if (collapsedCellCount === 1)
          newDiv.innerText = listContent[j];
        else
          newDiv.innerText = ts3ldv.time.UTCDateStringToLocaltimeString(listContent[j]);

        if (column === 3)
          x.appendChild(newDiv);
        else
          x.insertBefore(newDiv, x.lastChild);

      } else document.getElementById(currentDivString).style.display = "";
    }
  }

  /**
   * Collapses the list with the given parameters.
   *
   * @param {string} list - name of the list ("Connections" or "IPs").
   * @param {number} ID - ID of the client.
   * @param {number} column - the column ID.
   * @param {number} collapsedCellCount - count of the cells if collapsed.
   */
  function collapseList(list, ID, column, collapsedCellCount) {
    const listContent = ts3ldv.tables.lookup.ClientList[ID][list];

    document.getElementById(list + "Button_" + ID).innerText = "+ " + (listContent.length - collapsedCellCount);
    document.getElementById(list + "Button_" + ID).parentNode.setAttribute("expanded", "false");

    if (document.getElementById(String(ID)) !== null) {
      let hideLength = document.getElementById(String(ID)).childNodes[column].childNodes.length;

      if (column === 3)
        hideLength++;

      for (let j = 1; j < hideLength - 2; j++) {
        document.getElementById(list + "_" + ID + "_" + j).style.display = "none";
      }
    }
  }

  /**
   * Collapses all expanded lists.
   */
  function collapseAll() {
    const rows = document.getElementById("clientTable").lastChild.childNodes;
    for (let j = 0; j < rows.length; j++) {
      if (rows[j].childNodes[2].getAttribute("expanded") === "true")
        collapseList("Connections", Number(rows[j].getAttribute("id")), 2, 2);

      if (rows[j].childNodes[3].getAttribute("expanded") === "true")
        collapseList("IPs", Number(rows[j].getAttribute("id")), 3, 1);
    }
  }

  /**
   * Builds the client table.
   */
  module.build = function () {
    const clientTableControlSection = document.createElement("div");
    clientTableControlSection.className = "row";

    const clientTableHeading = document.createElement("div");
    clientTableHeading.className = "tableheading large-12 columns";
    clientTableHeading.innerText = "Client Table";
    clientTableControlSection.appendChild(clientTableHeading);

    const connectionsSortType = {
      first: "Currently sorting connections by the first connect",
      last: "Currently sorting connections by the last connect"
    };

    const connectionsSortTypeButton = document.createElement("button");
    connectionsSortTypeButton.id = "connectionsSortTypeButton";
    connectionsSortTypeButton.className = "small-12 medium-8 large-6 columns";

    if (ts3ldv.storage.getClientConnectionsSortType())
      connectionsSortTypeButton.innerText = connectionsSortType.last;
    else
      connectionsSortTypeButton.innerText = connectionsSortType.first;

    ts3ldv.event.addOnClickEventListener(connectionsSortTypeButton, function () {
      ts3ldv.storage.switchClientConnectionsSortType();

      if (ts3ldv.storage.getClientConnectionsSortType())
        connectionsSortTypeButton.innerText = connectionsSortType.last;
      else
        connectionsSortTypeButton.innerText = connectionsSortType.first;

      $.tablesorter.updateCache(clientTable.config);
      $.tablesorter.sortOn(clientTable.config, clientTable.config.sortList);
    });
    clientTableControlSection.appendChild(connectionsSortTypeButton);

    const collapseAllButton = document.createElement("button");
    collapseAllButton.id = "collapseAllButton";
    collapseAllButton.className = "small-12 medium-4 large-6 columns";
    collapseAllButton.innerText = "Collapse expanded lists";

    ts3ldv.event.addOnClickEventListener(collapseAllButton, collapseAll);

    clientTableControlSection.appendChild(collapseAllButton);

    const coloredRowsDescription_green = document.createElement("div"),
      coloredRowsDescription_grey = document.createElement("div");

    coloredRowsDescription_green.id = "description_connected";
    coloredRowsDescription_grey.id = "description_deleted";
    coloredRowsDescription_green.className = coloredRowsDescription_grey.className = "small-6 columns";
    coloredRowsDescription_green.innerText = "Connected Client";
    coloredRowsDescription_grey.innerText = "Deleted Client";

    clientTableControlSection.appendChild(coloredRowsDescription_green);
    clientTableControlSection.appendChild(coloredRowsDescription_grey);

    ts3ldv.tables.addPagerSection(clientTableControlSection, module);

    module.div.appendChild(clientTableControlSection);

    const Client = ts3ldv.Json.ClientList,
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

    headCell_ID.innerText = "ID";
    headCell_Nicknames.innerText = "Nicknames";
    headCell_Connections.innerText = "Connections";
    headCell_IPs.innerText = "IPs";
    headCell_Connects.innerText = "Connects";
    headCell_Connected.innerText = "Connected";
    headCell_ServerGroupInfo.innerText = "Server Groups";

    clientHeadRow.appendChild(headCell_ID);
    clientHeadRow.appendChild(headCell_Nicknames);
    clientHeadRow.appendChild(headCell_Connections);
    clientHeadRow.appendChild(headCell_IPs);
    clientHeadRow.appendChild(headCell_Connects);
    clientHeadRow.appendChild(headCell_Connected);
    clientHeadRow.appendChild(headCell_ServerGroupInfo);

    clientHead.appendChild(clientHeadRow);
    clientTable.appendChild(clientHead);

    const clientBody = document.createElement("tbody");
    for (let i = 0; i < Client.length; i++) {
      const ID = Number(Client[i].clientId);

      if (Client[ID].Nicknames.length !== 0) {
        const Nicknames = Client[ID].Nicknames,
          Connections = Client[ID].Connections,
          IPs = Client[ID].IPs,
          Connection_Count = Connections.length,
          ServerGroupIDs = Client[ID].ServerGroupIDs,
          ServerGroupAssignmentDateTimes = Client[ID].ServerGroupAssignmentDateTimes;

        const clientBodyRow = document.createElement("tr"),
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
        cell_ServerGroupInfo.setAttribute("data-title", "Server Groups");

        cell_ID.innerText = ID;
        clientBodyRow.appendChild(cell_ID);

        for (let j = 0; j < Nicknames.length; j++) {
          const divNicknames = document.createElement("div");
          $(divNicknames).text(Nicknames[j]);
          cell_Nicknames.appendChild(divNicknames);
        }
        clientBodyRow.appendChild(cell_Nicknames);

        if (Connections.length > 2) {
          const buttonExpandCollapseConnections = document.createElement("button");
          buttonExpandCollapseConnections.id = "ConnectionsButton_" + ID;
          buttonExpandCollapseConnections.innerText = "+ " + (Connections.length - 2);

          (function (ID) {
            ts3ldv.event.addOnClickEventListener(buttonExpandCollapseConnections, function () {
              expandOrCollapseList("Connections", ID);
            });
          })(ID);
          cell_Connections.appendChild(buttonExpandCollapseConnections);
        }

        const divLastConnection = document.createElement("div");
        divLastConnection.id = "Connections_" + ID + "_0";
        divLastConnection.innerText = ts3ldv.time.UTCDateStringToLocaltimeString(Connections[0]);
        cell_Connections.appendChild(divLastConnection);

        if (Connections.length > 1) {
          const divFirstConnection = document.createElement("div");
          divFirstConnection.id = "Connections_" + ID + "_" + (Connections.length - 1);
          divFirstConnection.innerText = ts3ldv.time.UTCDateStringToLocaltimeString(Connections[Connections.length - 1]);
          cell_Connections.appendChild(divFirstConnection);
        }
        clientBodyRow.appendChild(cell_Connections);

        if (IPs.length > 1) {
          const buttonExpandCollapseIPs = document.createElement("button");
          buttonExpandCollapseIPs.id = "IPsButton_" + ID;
          buttonExpandCollapseIPs.innerText = "+ " + (IPs.length - 1);

          (function (ID) {
            ts3ldv.event.addOnClickEventListener(buttonExpandCollapseIPs, function () {
              expandOrCollapseList("IPs", ID);
            });
          })(ID);
          cell_IPs.appendChild(buttonExpandCollapseIPs);
        }

        const divLastIP = document.createElement("div");
        divLastIP.id = "IPs_" + ID + "_0";
        $(divLastIP).text(IPs[0]);
        cell_IPs.appendChild(divLastIP);

        clientBodyRow.appendChild(cell_IPs);

        $(cell_Connects).text(Connection_Count);
        clientBodyRow.appendChild(cell_Connects);

        if (Client[ID].deleted)
          clientBodyRow.className += "deleted";
        else if (Client[ID].ConnectedState)
          clientBodyRow.className += "connected";

        $(cell_Connected).text(String(Boolean(Client[ID].ConnectedState)));
        clientBodyRow.appendChild(cell_Connected);

        if (ServerGroupIDs.length === 0)
          cell_ServerGroupInfo.innerText = "/";

        for (let j = 0; j < ServerGroupIDs.length; j++) {
          const divName = document.createElement("div"),
            divDateTime = document.createElement("div");
          $(divName).text(ts3ldv.tables.lookup.ServerGroupList[ServerGroupIDs[j]].serverGroupName);
          divDateTime.innerText = moment(ts3ldv.time.UTCDateStringToDate(ServerGroupAssignmentDateTimes[j])).format(ts3ldv.time.format);

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
            const connections = ts3ldv.Json.ClientList[Number(data.$cells[0].innerText)].Connections;

            for (i = 0; i < connections.length; i++) {
              if (connections[i].includes(data.filter))
                return true;
            }

            return false;
          },
          3: function (e, n, f, i, $r, c, data) {
            const ips = ts3ldv.Json.ClientList[Number(data.$cells[0].innerText)].IPs;

            for (i = 0; i < ips.length; i++) {
              if (ips[i].includes(data.filter))
                return true;
            }

            return false;
          }
        }
      },
      sortList: ts3ldv.storage.getTableSortOrder(module)
    }).bind("sortEnd", function () {
      ts3ldv.storage.setTableSortOrder(module, clientTable.config.sortList)
    }).tablesorterPager({
      container: $(document.getElementById(module.name + "Pager")),
      output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
      savePages: false
    });

    module.div.appendChild(clientTable);
  };

  return module;
}(ts3ldv.tables || {}));
