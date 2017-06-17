// js/modules/tables/ban.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Ban table.
 */
(function (parent) {
  const module = parent.ban = parent.ban || {};

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
    const Ban = ts3ldv.Json.BanList,
      banTableRows = module.getTableDiv().lastChild.childNodes,
      headRowCells = module.getTableDiv().firstChild.firstChild.childNodes,
      filterRowCells = module.getTableDiv().firstChild.childNodes[1].childNodes,
      showUID = ts3ldv.storage.getBanShowUID();

    let bannedString, bannedByString;
    if (showUID) {
      bannedString = "Banned UID";
      bannedByString = "Banned by UID";
    } else {
      bannedString = "Banned ID";
      bannedByString = "Banned by ID";
    }

    headRowCells[1].innerText = bannedString;
    headRowCells[4].innerText = bannedByString;
    filterRowCells[1].firstChild.setAttribute("Placeholder", bannedString);
    filterRowCells[4].firstChild.setAttribute("Placeholder", bannedByString);

    for (let j = 0; j < banTableRows.length; j++) {
      let rowId = banTableRows[j].getAttribute("id"),
        banId = rowId.slice(4, rowId.length);

      const currentRowCells = document.getElementById(rowId).childNodes;

      $(currentRowCells[1]).text(showUID ? Ban[banId].bannedUID : Ban[banId].bannedID);

      if (showUID) {
        if (Ban[banId].bannedByUID.length !== 0)
          $(currentRowCells[4]).text(Ban[banId].bannedByUID);
        else
          currentRowCells[4].innerText = "No UID";
      } else {
        if (currentRowCells[3].innerText !== "Unknown")
          $(currentRowCells[4]).text(Ban[banId].bannedByID);
        else
          currentRowCells[4].innerText = "Unknown";
      }

      currentRowCells[1].setAttribute("data-title", bannedString);
      currentRowCells[4].setAttribute("data-title", bannedByString);
    }
  }

  /**
   * Builds the ban table.
   */
  module.build = function () {
    const banTableControlSection = document.createElement("div");
    banTableControlSection.className = "row";

    const banTableHeading = document.createElement("div");
    banTableHeading.className = "tableheading large-12 columns";
    banTableHeading.innerText = "Ban Table";
    banTableControlSection.appendChild(banTableHeading);

    const switchBetweenIDAndUIDButton = document.createElement("button");
    switchBetweenIDAndUIDButton.id = "switchBetweenIDAndUIDButton";
    switchBetweenIDAndUIDButton.innerText = "Switch between IDs and UIDs";

    ts3ldv.event.addOnClickEventListener(switchBetweenIDAndUIDButton, function () {
      ts3ldv.storage.switchBanShowUID();
      switchBetweenIDAndUID();
    });
    banTableControlSection.appendChild(switchBetweenIDAndUIDButton);

    ts3ldv.tables.addPagerSection(banTableControlSection, module);

    module.div.appendChild(banTableControlSection);

    const Ban = ts3ldv.Json.BanList,
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

    headCell_BanDateTime.innerText = "Date and Time";
    headCell_BannedID.innerText = "Banned ID";
    headCell_BannedNickname.innerText = "Banned Nickname";
    headCell_BannedIP.innerText = "Banned IP";
    headCell_BannedByID.innerText = "Banned by ID";
    headCell_BannedByNickname.innerText = "Banned by Nickname";
    headCell_BanReason.innerText = "Reason";
    headCell_BanTime.innerText = "BanTime";

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

    const banBody = document.createElement("tbody");
    for (let i = 0; i < Ban.length; i++) {
      const BanDateTime = Ban[i].banDateTime,
        BannedID = Ban[i].bannedID,
        BannedNickname = Ban[i].bannedNickname,
        BannedIP = Ban[i].bannedIP,
        BannedByNickname = Ban[i].bannedByNickname,
        BanTime = Ban[i].banTime;
      let BannedByID = BannedIP === "Unknown" ? "Unknown" : Ban[i].bannedByID,
        BanReason = Ban[i].banReason.length === 0 ? "No Reason given" : Ban[i].banReason;

      const banBodyRow = document.createElement("tr");
      banBodyRow.id = "ban_" + i;

      const cell_BanDateTime = document.createElement("td"),
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

      const cell_BanDateTime_Div = document.createElement("div");
      cell_BanDateTime_Div.innerHTML = ts3ldv.time.dateTimeToMomentString(BanDateTime);
      cell_BanDateTime.appendChild(cell_BanDateTime_Div);
      banBodyRow.appendChild(cell_BanDateTime);

      $(cell_BannedID).text(BannedID);
      banBodyRow.appendChild(cell_BannedID);

      $(cell_BannedNickname).text(BannedNickname);
      banBodyRow.appendChild(cell_BannedNickname);

      $(cell_BannedIP).text(BannedIP);
      banBodyRow.appendChild(cell_BannedIP);

      $(cell_BannedByID).text(BannedByID);
      banBodyRow.appendChild(cell_BannedByID);

      $(cell_BannedByNickname).text(BannedByNickname);
      banBodyRow.appendChild(cell_BannedByNickname);

      $(cell_BanReason).text(BanReason);
      banBodyRow.appendChild(cell_BanReason);

      $(cell_BanTime).text(BanTime);
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
      sortList: ts3ldv.storage.getTableSortOrder(module)
    }).bind("sortEnd", function () {
      ts3ldv.storage.setTableSortOrder(module, banTable.config.sortList)
    }).tablesorterPager({
      container: $(document.getElementById(module.name + "Pager")),
      output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
      savePages: false
    });

    module.div.appendChild(banTable);

    // Todo: maybe instead of calling this after creation move it into the creation
    if (ts3ldv.storage.getBanShowUID())
      switchBetweenIDAndUID();
  };

  return module;
}(ts3ldv.tables || {}));
