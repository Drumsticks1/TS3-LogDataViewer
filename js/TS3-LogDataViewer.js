// TS3-LogDataViewer.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Global Variables
 */
var connectedClientsCount, nanobar, momentInterval, json, lastBuildCallTime, timeBetweenBuilds, buildError = false, buildRequestInProgress = false,
  eventListeners = [];

/**
 * Constants
 */
const sortStrings = ["Currently sorting connections by the first connect", "Currently sorting connections by the last connect"],
  timeFormat = "YYYY-MM-DD HH:mm:ss",
  tables = ["clientTable", "banTable", "kickTable", "complaintTable", "uploadTable"],
  tableNames = ["Client", "Ban", "Kick", "Complaint", "Upload"];

// Lookup object, used for calling elements of some arrays via the ID of the wanted entry.
// Required when ID and index of entries differ in lists (ClientList, ChannelList, ServerGroupList).
// The lookup object is updated when the data is fetched.
var lookup = {ClientList: {}, ChannelList: {}, ServerGroupList: {}};

/**
 * Updates the lookup object for the given list
 * @param {string} list name of the list, e.g. ClientList
 * @param {string} idIdentifier name of the id property in the list
 */
function updateLookupObject(list, idIdentifier) {
  lookup[list] = {};

  var bufferObj = json[list];
  for (var i = 0; i < bufferObj.length; i++) {
    lookup[list][bufferObj[i][idIdentifier]] = bufferObj[i];
  }
}

/**
 * Sends a request for building the JSON to the server.
 *
 * @param {boolean} clearBuffer if true: clears the buffer before building the json.
 */
function buildJSON(clearBuffer) {
  /* Requests are only sent if the time span between the last two requests is bigger than timeBetweenBuilds and
   there is no request in progress. Invalid requests are only sent when the remote timeBetweenBuilds is unknown
   or has increased since the last request */
  if (!buildRequestInProgress && (lastBuildCallTime == null || timeBetweenBuilds == null || Date.now().valueOf() - lastBuildCallTime > timeBetweenBuilds)) {
    buildRequestInProgress = true;
    lastBuildCallTime = Date.now().valueOf();

    $.get("./express/buildJSON", {"clearBuffer": clearBuffer}, function (res) {
      if (res.success) {
        updateTimeBetweenBuilds(res);

        if (res.newJSON)
          if (res.fetchLogsError)
            addCallout("An error occurred while fetching the log files, please check the ts3-ldv.log for more information.", "alert");
          else
            buildTables();
        else
          addCallout("No new information!", "secondary", 2500);
      }
      else {
        updateTimeBetweenBuilds(res);

        var timeUntilNextBuild = (timeBetweenBuilds - res.timeDifference);
        addCallout("Next JSON build request allowed in " + timeUntilNextBuild + " ms!\n(This message will disappear when the next request is allowed)", "warning nextRequestCallout", timeUntilNextBuild);
      }
      buildRequestInProgress = false;
    });
    return;
  }

  if (buildRequestInProgress)
    addCallout("A JSON build request has already been sent!", "warning", 1500);
  else {
    var timeUntilNextBuild = timeBetweenBuilds - (Date.now().valueOf() - lastBuildCallTime);
    addCallout("Next JSON build request allowed in " + timeUntilNextBuild + " ms!\n(This message will disappear when the next request is allowed)", "warning nextRequestCallout", timeUntilNextBuild);
  }

  document.getElementById("buildJSONButton").disabled = document.getElementById("buildJSONWithoutBufferButton").disabled = false;
  nanobar.go(100);
}

/**
 * Updates the stored timeBetweenBuilds if necessary.
 *
 * @param {object} response response object of a request.
 */
function updateTimeBetweenBuilds(response) {
  if (timeBetweenBuilds != response.timeBetweenBuilds)
    timeBetweenBuilds = response.timeBetweenBuilds;
}

/**
 * Adds a removable callout.
 * If duration is specified the created object fades out after the duration and is removed afterwards.
 *
 * @param {string} message
 * @param {string} calloutClass
 * @param {number} [duration]
 */
function addCallout(message, calloutClass, duration) {

  // Updates the message of the nextRequestCallout if one is already existing.
  if (calloutClass.indexOf("nextRequestCallout") != -1) {
    var nextRequestCallouts = document.getElementsByClassName("nextRequestCallout");

    if (nextRequestCallouts.length != 0) {
      nextRequestCallouts[0].innerText = message;
      return;
    }
  }

  var callout = document.createElement("div"),
    calloutCloseButton = document.createElement("button");

  callout.innerText = message;
  callout.className = "callout " + calloutClass;
  callout.setAttribute("data-closable", "");

  calloutCloseButton.innerHTML = "&#215;";
  calloutCloseButton.className = "close-button";
  calloutCloseButton.setAttribute("data-close", "");

  callout.appendChild(calloutCloseButton);
  document.getElementById("calloutDiv").appendChild(callout);

  if (duration != undefined) {
    setTimeout(function () {
      $(callout).fadeOut(function () {
        callout.parentNode.removeChild(callout);
      });
    }, duration)
  }
}

/**
 * Expands or collapses the list, depending on its current state.
 *
 * @param {string} list - name of the list ("Connections" or "IPs").
 * @param {number} ID - ID of the client.
 */
function expandOrCollapseList(list, ID) {
  var column, collapsedCellCount;
  if (list == "IPs") {
    column = 3;
    collapsedCellCount = 1;
  } else
    column = collapsedCellCount = 2;

  var currentDiv = document.getElementById(list + "_" + ID + "_1");

  if (currentDiv === null || currentDiv.style.display == "none")
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
  var x = document.getElementById(String(ID)).childNodes[column],
    listContent = lookup.ClientList[ID][list];

  var currentDiv = document.getElementById(list + "Button_" + ID);
  currentDiv.innerHTML = "- " + (listContent.length - collapsedCellCount);
  currentDiv.parentNode.setAttribute("expanded", "true");

  for (var j = 1; j < listContent.length; j++) {
    var currentDivString = list + "_" + ID + "_" + j;

    if (document.getElementById(currentDivString) === null) {
      var newDiv = document.createElement("div");
      newDiv.id = currentDivString;

      if (collapsedCellCount == 1)
        newDiv.innerHTML = listContent[j];
      else
        newDiv.innerHTML = UTCDateStringToLocaltimeString(listContent[j]);

      if (column == 3)
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
  var listContent = lookup.ClientList[ID][list];

  document.getElementById(list + "Button_" + ID).innerHTML = "+ " + (listContent.length - collapsedCellCount);
  document.getElementById(list + "Button_" + ID).parentNode.setAttribute("expanded", "false");

  if (document.getElementById(String(ID)) !== null) {
    var hideLength = document.getElementById(String(ID)).childNodes[column].childNodes.length;

    if (column == 3)
      hideLength++;

    for (var j = 1; j < hideLength - 2; j++) {
      document.getElementById(list + "_" + ID + "_" + j).style.display = "none";
    }
  }
}

/**
 * Collapses all expanded lists.
 */
function collapseAll() {
  var rows = document.getElementById("clientTable").lastChild.childNodes;
  for (var j = 0; j < rows.length; j++) {
    if (rows[j].childNodes[2].getAttribute("expanded") == "true")
      collapseList("Connections", Number(rows[j].getAttribute("id")), 2, 2);

    if (rows[j].childNodes[3].getAttribute("expanded") == "true")
      collapseList("IPs", Number(rows[j].getAttribute("id")), 3, 1);
  }
}

/**
 * Adds the custom tablesorter parsers.
 * ignoreMoment:    Ignores the moment.js timestamps.
 * connections:     Ignores the expand/collapse buttons in the Connections column.
 * ips:             Ignores the expand/collapse buttons in the IPs column.
 */
function addCustomParsers() {
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
      if (localStorage.getItem("connectionsSortType") == "1") {
        if (cell.firstChild.localName == "button")
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
      if (cell.firstChild.localName == "button")
        return cell.childNodes[1].innerHTML;
      else
        return cell.firstChild.innerHTML;
    },
    type: "text"
  });
}

/**
 * Switches between ID/UID columns in the ban table.
 */
function switchBetweenIDAndUID() {
  var rowId, banId, idOrUid, bannedByIDOrUID, Ban = json.BanList,
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
      if (currentRowCells[3].innerHTML != "Unknown")
        bannedByIDOrUID = Ban[banId].bannedByID;
      else
        bannedByIDOrUID = "Unknown";
    } else {
      if (Ban[banId].bannedByUID.length != 0)
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
 * Imports and uses the local storage data for the table.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function importLocalStorage(table) {
  if (localStorage.getItem(table)) {
    var checkboxState = Boolean(Number(localStorage.getItem(table)));
    document.getElementById(table + "Checkbox").checked = checkboxState;
    if (!checkboxState)
      document.getElementById("ts3-" + table).style.display = "";

  } else {
    document.getElementById(table + "Checkbox").checked = true;
    localStorage.setItem(table, "1");
  }
}

/**
 * Adds a checkbox listener for the table and displays/hides the navbar scroll buttons for the table.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function addTableCheckboxListener(table) {
  document.getElementById(table + "Checkbox").addEventListener("click", function () {
    var displayString = "";

    if (this.checked) {
      localStorage.setItem(table, "1");

      if (sessionStorage.getItem(table + "-built") == "0")
        buildTableWithAlertCheckAndLocalStorage(table);

    } else {
      localStorage.setItem(table, "0");
      displayString = "none";
    }

    document.getElementById("ts3-" + table).style.display =
      document.getElementById("scrollTo" + table.charAt(0).toUpperCase() + table.substring(1))
        .style.display = displayString;

    setFilterPlaceholders(table);
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
  if (x < 10) y = "0" + y;
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
  return dateObject.getFullYear()
    + "-" + toDoubleDigit(dateObject.getMonth() + 1)
    + "-" + toDoubleDigit(dateObject.getDate())
    + " " + toDoubleDigit(dateObject.getHours())
    + ":" + toDoubleDigit(dateObject.getMinutes())
    + ":" + toDoubleDigit(dateObject.getSeconds());
}

/**
 * Converts the given dateTime string to a string with the format
 *
 * YYYY-MM-DD HH:mm:ss
 * (about ...... ago)
 *
 * @param {string} dateTime - the given dateTime string.
 * @returns {string} string with the described format.
 */
function dateTimeToMomentString(dateTime) {
  var dateTimeObject = moment(UTCDateStringToDate(dateTime));
  return dateTimeObject.format(timeFormat) + "<br />(about " + dateTimeObject.fromNow() + ")";
}

/**
 * Adds the onclick event to the object and adds the object to the eventListeners array.
 *
 * @param {object} object - the given object
 * @param {function} onclickEvent - the given onclickEvent.
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
 * Sets the placeholder text for the tablesorter filter cells of the given table according to their column name.
 * @param tableName the tableName.
 */
function setFilterPlaceholders(tableName) {
  var placeholders = document.getElementById(tableName).getElementsByClassName("tablesorter-filter-row")[0].getElementsByTagName("input");
  for (var i = 0; i < placeholders.length; i++) {
    placeholders[i].setAttribute("placeholder",
      placeholders[i].parentNode.parentNode.previousSibling.children[placeholders[i].getAttribute("data-column")].firstChild.innerHTML);
  }
}

/**
 * Adds a pager section to the given control section.
 * @param tableControlSection the control section.
 * @param tableName the name of the table.
 */
function addPagerSection(tableControlSection, tableName) {
  var pager = document.createElement("div"),
    first = document.createElement("div"),
    prev = document.createElement("div"),
    pageState = document.createElement("div"),
    next = document.createElement("div"),
    last = document.createElement("div"),
    selectDiv = document.createElement("div"),
    select = document.createElement("select"),
    options = [document.createElement("option"), document.createElement("option"), document.createElement("option"), document.createElement("option"), document.createElement("option")];

  pager.className = tableName + "Pager";
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
  connectionsSortTypeButton.innerHTML = sortStrings[1];

  if (localStorage.getItem("connectionsSortType") === null)
    localStorage.setItem("connectionsSortType", "1");
  else if (localStorage.getItem("connectionsSortType") == "0")
    connectionsSortTypeButton.innerHTML = sortStrings[0];

  addOnClickEvent(connectionsSortTypeButton, function () {
    if (localStorage.getItem("connectionsSortType") == "1") {
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
    if (ID != -1) {
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
      divLastConnection.innerHTML = UTCDateStringToLocaltimeString(Connections[0]);
      cell_Connections.appendChild(divLastConnection);

      if (Connections.length > 1) {
        var divFirstConnection = document.createElement("div");
        divFirstConnection.id = "Connections_" + ID + "_" + (Connections.length - 1);
        divFirstConnection.innerHTML = UTCDateStringToLocaltimeString(Connections[Connections.length - 1]);
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
        divDateTime.innerHTML = moment(UTCDateStringToDate(ServerGroupAssignmentDateTimes[j])).format(timeFormat);

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
          var connections = json.ClientList[Number(data.$cells[0].innerHTML)].Connections;

          for (i = 0; i < connections.length; i++) {
            if (connections[i].indexOf(data.filter) != -1)
              return true;
          }

          return false;
        },
        3: function (e, n, f, i, $r, c, data) {
          var ips = json.ClientList[Number(data.$cells[0].innerHTML)].IPs;

          for (i = 0; i < ips.length; i++) {
            if (ips[i].indexOf(data.filter) != -1)
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
}

/**
 * Builds the ban table.
 */
function buildBanTable() {
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

    if (BannedIP != "Unknown")
      BannedByID = Ban[i].bannedByID;
    else
      BannedByID = "Unknown";

    if (Ban[i].banReason.length != 0)
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
    cell_BanDateTime_Div.innerHTML = dateTimeToMomentString(BanDateTime);
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

  addPagerSection(kickTableControlSection, "kickTable");

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

    if (Kick[i].kickReason.length != 0)
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
    cell_DateTime_Div.innerHTML = dateTimeToMomentString(KickDateTime);
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
    sortList: JSON.parse(localStorage.getItem("kickTableSortOrder"))
  }).bind("sortEnd", function () {
    localStorage.setItem("kickTableSortOrder", JSON.stringify(kickTable.config.sortList));
  }).tablesorterPager({
    container: $(".kickTablePager"),
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
    savePages: false
  });

  document.getElementById("ts3-kickTable").appendChild(kickTable);
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

  addPagerSection(complaintTableControlSection, "complaintTable");

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

    var cell_ComplaintDateTime_Div = document.createElement("div");
    cell_ComplaintDateTime_Div.innerHTML = dateTimeToMomentString(ComplaintDateTime);
    cell_ComplaintDateTime.appendChild(cell_ComplaintDateTime_Div);
    complaintBodyRow.appendChild(cell_ComplaintDateTime);

    cell_ComplaintAboutID.innerHTML = ComplaintAboutID;
    complaintBodyRow.appendChild(cell_ComplaintAboutID);

    cell_ComplaintAboutNickname.innerHTML = ComplaintAboutNickname;
    complaintBodyRow.appendChild(cell_ComplaintAboutNickname);

    cell_ComplaintReason.innerHTML = ComplaintReason;
    complaintBodyRow.appendChild(cell_ComplaintReason);

    cell_ComplaintByID.innerHTML = ComplaintByID;
    complaintBodyRow.appendChild(cell_ComplaintByID);

    cell_ComplaintByNickname.innerHTML = ComplaintByNickname;
    complaintBodyRow.appendChild(cell_ComplaintByNickname);

    complaintBody.appendChild(complaintBodyRow);
  }
  complaintTable.appendChild(complaintBody);

  complaintTable.id = "complaintTable";
  complaintTable.className += "ui-table-reflow";

  $(complaintTable).tablesorter({
    headers: {
      0: {sorter: "ignoreMoment"}
    },
    widgets: ["filter"],
    widgetOptions: {filter_searchDelay: 0},
    sortList: JSON.parse(localStorage.getItem("complaintTableSortOrder"))
  }).bind("sortEnd", function () {
    localStorage.setItem("complaintTableSortOrder", JSON.stringify(complaintTable.config.sortList));
  }).tablesorterPager({
    container: $(".complaintTablePager"),
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
    savePages: false
  });

  document.getElementById("ts3-complaintTable").appendChild(complaintTable);
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

  addPagerSection(uploadTableControlSection, "uploadTable");

  document.getElementById("ts3-uploadTable").appendChild(uploadTableControlSection);

  var Upload = json.UploadList,
    uploadTable = document.createElement("table"),
    uploadHead = document.createElement("thead"),
    uploadHeadRow = document.createElement("tr"),
    headCell_UploadDateTime = document.createElement("th"),
    headCell_ChannelID = document.createElement("th"),
    headCell_ChannelName = document.createElement("th"),
    headCell_Filename = document.createElement("th"),
    headCell_UploadedByID = document.createElement("th"),
    headCell_UploadedByNickname = document.createElement("th"),

    headCell_DeletedByID = document.createElement("th"),
    headCell_DeletedByNickname = document.createElement("th");

  headCell_UploadDateTime.innerHTML = "Date and Time";
  headCell_ChannelID.innerHTML = "Channel ID";
  headCell_ChannelName.innerHTML = "Channel Name";
  headCell_Filename.innerHTML = "Filename";
  headCell_UploadedByID.innerHTML = "Uploaded by ID";
  headCell_UploadedByNickname.innerHTML = "Uploaded by Nickname";
  headCell_DeletedByID.innerHTML = "Deleted by ID";
  headCell_DeletedByNickname.innerHTML = "Deleted by Nickname";

  uploadHeadRow.appendChild(headCell_UploadDateTime);
  uploadHeadRow.appendChild(headCell_ChannelID);
  uploadHeadRow.appendChild(headCell_ChannelName);
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

    var uploadBodyRow = document.createElement("tr");

    if (Upload[i].deleted) {
      uploadBodyRow.className += "deleted";
      DeletedByID = Upload[i].deletedByID;
      DeletedByNickname = Upload[i].deletedByNickname;
    } else {
      DeletedByID = DeletedByNickname = "/";
    }

    var cell_UploadDateTime = document.createElement("td"),
      cell_ChannelID = document.createElement("td"),
      cell_ChannelName = document.createElement("td"),
      cell_Filename = document.createElement("td"),
      cell_UploadedByID = document.createElement("td"),
      cell_UploadedByNickname = document.createElement("td"),
      cell_DeletedByID = document.createElement("td"),
      cell_DeletedByNickname = document.createElement("td");

    cell_UploadDateTime.setAttribute("data-title", "Date and Time");
    cell_ChannelID.setAttribute("data-title", "Channel ID");
    cell_ChannelName.setAttribute("data-title", "Channel Name");
    cell_Filename.setAttribute("data-title", "Filename");
    cell_UploadedByID.setAttribute("data-title", "Uploaded by ID");
    cell_UploadedByNickname.setAttribute("data-title", "Uploaded by Nickname");
    cell_DeletedByID.setAttribute("data-title", "Deleted by ID");
    cell_DeletedByNickname.setAttribute("data-title", "Deleted by Nickname");


    var cell_UploadDateTime_Div = document.createElement("div");
    cell_UploadDateTime_Div.innerHTML = dateTimeToMomentString(UploadDateTime);
    cell_UploadDateTime.appendChild(cell_UploadDateTime_Div);
    uploadBodyRow.appendChild(cell_UploadDateTime);

    cell_ChannelID.innerHTML = ChannelID;
    uploadBodyRow.appendChild(cell_ChannelID);

    cell_ChannelName.innerHTML = lookup.ChannelList[ChannelID].channelName;
    uploadBodyRow.appendChild(cell_ChannelName);

    cell_Filename.innerHTML = Filename;
    uploadBodyRow.appendChild(cell_Filename);

    cell_UploadedByID.innerHTML = UploadedByID;
    uploadBodyRow.appendChild(cell_UploadedByID);

    cell_UploadedByNickname.innerHTML = UploadedByNickname;
    uploadBodyRow.appendChild(cell_UploadedByNickname);

    cell_DeletedByID.innerHTML = DeletedByID;
    uploadBodyRow.appendChild(cell_DeletedByID);

    cell_DeletedByNickname.innerHTML = DeletedByNickname;
    uploadBodyRow.appendChild(cell_DeletedByNickname);

    uploadBody.appendChild(uploadBodyRow);
  }
  uploadTable.appendChild(uploadBody);

  uploadTable.id = "uploadTable";
  uploadTable.className += "ui-table-reflow";

  $(uploadTable).tablesorter({
    headers: {
      0: {sorter: "ignoreMoment"}
    },
    widgets: ["filter"],
    widgetOptions: {filter_searchDelay: 0},
    sortList: JSON.parse(localStorage.getItem("uploadTableSortOrder"))
  }).bind("sortEnd", function () {
    localStorage.setItem("uploadTableSortOrder", JSON.stringify(uploadTable.config.sortList));
  }).tablesorterPager({
    container: $(".uploadTablePager"),
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
    savePages: false
  });

  document.getElementById("ts3-uploadTable").appendChild(uploadTable);
}

/**
 * Imports the local storage, builds the table if it would not be empty and sets the session storage.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function buildTableWithAlertCheckAndLocalStorage(table) {
  if (document.getElementById(table) != null) {
    $(document.getElementById(table)).trigger("destroy");
    $(document.getElementById("ts3-" + table)).empty();
  }

  if (localStorage.getItem(table + "SortOrder") === null)
    localStorage.setItem(table + "SortOrder", "[]");

  if (localStorage.getItem(table) != "0") {
    sessionStorage.setItem(table + "-built", "1");

    var leadingCapitalLetterTable = table.charAt(0).toUpperCase() + table.substring(1);
    document.getElementById("scrollTo" + leadingCapitalLetterTable).style.display = "";

    if (json[leadingCapitalLetterTable.substring(0, leadingCapitalLetterTable.indexOf("Table")) + "List"].length) {
      switch (table) {
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

      setFilterPlaceholders(table);
      $(document.getElementById(table)).trigger("applyWidgetId", ["stickyHeaders"]);
    } else {
      var alertBox = document.createElement("div");
      alertBox.className = "alertBox";
      alertBox.innerHTML = "No " + table.substring(0, table.search("Table")) + "s were found.";
      document.getElementById("ts3-" + table).appendChild(alertBox);
    }
  } else
    sessionStorage.setItem(table + "-built", "0");
}

/**
 * Builds all tables using the data from the JSON.
 */
function buildTables() {
  nanobar.go(50);
  $.ajax({
    url: "./output.json",
    cache: false,
    dataType: "json",
    error: function () {
      if (buildError)
        addCallout("Building the JSON failed!", "error");
      else {
        buildError = true;
        buildJSON(false);
      }
    },
    success: function (fetchedJSON) {
      buildError = false;
      json = fetchedJSON;
      connectedClientsCount = 0;

      updateLookupObject("ClientList", "ID");
      updateLookupObject("ChannelList", "channelId");
      lookup.ChannelList[0] = {
        ID: 0,
        channelName: "Server",
        deleted: false
      };
      updateLookupObject("ServerGroupList", "serverGroupId");

      removeEventListeners();
      for (var i = 0; i < tables.length; i++) {
        buildTableWithAlertCheckAndLocalStorage(tables[i]);
      }

      // Ban table UID state action.
      var uidState = localStorage.getItem("uidState");
      if (document.getElementById("banTable") != null && (uidState == null || uidState == "1")) {
        localStorage.setItem("uidState", "0");

        if (uidState == "1")
          switchBetweenIDAndUID();
      }

      var Attributes = json.Attributes,
        creationTime = Attributes.creationTime;

      document.getElementById("creationTimestamp_localtime").innerHTML = creationTime.localTime;
      document.getElementById("creationTimestamp_utc").innerHTML = creationTime.UTC;
      document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTime.UTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();

      clearInterval(momentInterval);
      momentInterval = setInterval(function () {
        document.getElementById("creationTimestamp_moment").innerHTML = moment(creationTime.UTC + " +0000", "DD.MM.YYYY HH:mm:ss Z").fromNow();
      }, 1000);

      if (!document.getElementById("clientTable") || document.getElementById("ts3-clientTable").style.display == "none") {
        var Client = json.ClientList;
        for (var j = 0; j < Client.length; j++) {
          if (Client[j].ConnectedState)
            connectedClientsCount++;
        }
      }
      document.getElementById("connectedClientsCount").innerHTML = "Connected clients: " + connectedClientsCount;

      document.getElementById("buildJSONButton").disabled = document.getElementById("buildJSONWithoutBufferButton").disabled = false;
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
    buildJSON(false);
  };
  buildJSONWithoutBufferButton.onclick = function () {
    buildJSON(true);
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
}

document.addEventListener("DOMContentLoaded", function () {
  $(document).foundation();

  nanobar = new Nanobar({
    bg: "white",
    id: "nanobar"
  });

  buildControlSection();
  addCustomParsers();
  nanobar.go(25);

  for (var i = 0; i < tables.length; i++) {
    importLocalStorage(tables[i]);
    addTableCheckboxListener(tables[i]);
  }

  buildTables();
});
