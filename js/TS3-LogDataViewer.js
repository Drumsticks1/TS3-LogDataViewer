// TS3-LogDataViewer.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Global Variables
 */
var connectedClientsCount, nanobar, momentInterval, eventListeners = [];

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

  var bufferObj = ts3ldv.Json[list];
  for (var i = 0; i < bufferObj.length; i++) {
    lookup[list][bufferObj[i][idIdentifier]] = bufferObj[i];
  }
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
  var calloutsWithTheSameClass = document.getElementsByClassName(calloutClass);

  // Prevents duplicate callouts
  if (calloutsWithTheSameClass.length !== 0) {
    // Updates the message of the nextRequestCallout if one is already existing.
    if (calloutClass.indexOf("nextRequestCallout") !== -1)
      calloutsWithTheSameClass[0].innerText = message;

    return;
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

  if (duration !== undefined) {
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
  if (list === "IPs") {
    column = 3;
    collapsedCellCount = 1;
  } else
    column = collapsedCellCount = 2;

  var currentDiv = document.getElementById(list + "_" + ID + "_1");

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

      if (collapsedCellCount === 1)
        newDiv.innerHTML = listContent[j];
      else
        newDiv.innerHTML = ts3ldv.timeFunctions.UTCDateStringToLocaltimeString(listContent[j]);

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
  var listContent = lookup.ClientList[ID][list];

  document.getElementById(list + "Button_" + ID).innerHTML = "+ " + (listContent.length - collapsedCellCount);
  document.getElementById(list + "Button_" + ID).parentNode.setAttribute("expanded", "false");

  if (document.getElementById(String(ID)) !== null) {
    var hideLength = document.getElementById(String(ID)).childNodes[column].childNodes.length;

    if (column === 3)
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
    if (rows[j].childNodes[2].getAttribute("expanded") === "true")
      collapseList("Connections", Number(rows[j].getAttribute("id")), 2, 2);

    if (rows[j].childNodes[3].getAttribute("expanded") === "true")
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
      if (localStorage.getItem("connectionsSortType") === "1") {
        if (cell.firstChild.localName === "button")
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
      if (cell.firstChild.localName === "button")
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

      if (sessionStorage.getItem(table + "-built") === "0")
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
 * Imports the local storage, builds the table if it would not be empty and sets the session storage.
 *
 * @param {string} table - name of the table (e.g. "clientTable").
 */
function buildTableWithAlertCheckAndLocalStorage(table) {
  if (document.getElementById(table) !== null) {
    $(document.getElementById(table)).trigger("destroy");
    $(document.getElementById("ts3-" + table)).empty();
  }

  if (localStorage.getItem(table + "SortOrder") === null)
    localStorage.setItem(table + "SortOrder", "[]");

  if (localStorage.getItem(table) !== "0") {
    sessionStorage.setItem(table + "-built", "1");

    var leadingCapitalLetterTable = table.charAt(0).toUpperCase() + table.substring(1);
    document.getElementById("scrollTo" + leadingCapitalLetterTable).style.display = "";

    if (ts3ldv.Json[leadingCapitalLetterTable.substring(0, leadingCapitalLetterTable.indexOf("Table")) + "List"].length) {
      switch (table) {
        case tables[0]:
          ts3ldv.tables.client.build();
          break;
          case tables[1]:
          ts3ldv.tables.ban.build();
          break;
        case tables[2]:
          ts3ldv.tables.kick.build();
          break;
        case tables[3]:
          ts3ldv.tables.complaint.build();
          break;
        case tables[4]:
          ts3ldv.tables.upload.build();
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
}

document.addEventListener("DOMContentLoaded", function () {
  $(document).foundation();

  nanobar = new Nanobar({
    id: "nanobar"
  });

  buildControlSection();
  addCustomParsers();
  nanobar.go(25);

  for (var i = 0; i < tables.length; i++) {
    importLocalStorage(tables[i]);
    addTableCheckboxListener(tables[i]);
  }

  ts3ldv.tables.build();
});
