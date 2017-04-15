// TS3-LogDataViewer.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Constants
 */
const sortStrings = ["Currently sorting connections by the first connect", "Currently sorting connections by the last connect"],
  timeFormat = "YYYY-MM-DD HH:mm:ss",
  tables = ["clientTable", "banTable", "kickTable", "complaintTable", "uploadTable"],
  tableNames = ["Client", "Ban", "Kick", "Complaint", "Upload"];

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
