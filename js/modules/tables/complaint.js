// js/modules/tables/complaint.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Complaint table.
 */
(function (parent) {
  const module = parent.complaint = parent.complaint || {};

  /**
   * The name of the module
   * @type {string}
   */
  module.name = "complaint";

  /**
   * The element containing the table.
   * @type {Element}
   */
  module.div = document.getElementById("ts3-complaintTable");

  /**
   * Returns the table div (calls document.getElementById("tableDivId"))
   * @returns {Element}
   */
  module.getTableDiv = function () {
    return document.getElementById("complaintTable");
  };

  /**
   * The input object of type checkbox in the tableSelection section that toggles the table of this module.
   * @type {Element}
   */
  module.checkbox = module.checkbox || undefined;

  /**
   * Builds the complaint table.
   */
  module.build = function () {
    const complaintTableControlSection = document.createElement("div");
    complaintTableControlSection.className = "row";

    const complaintTableHeading = document.createElement("div");
    complaintTableHeading.className = "tableheading large-12 columns";
    complaintTableHeading.innerText = "Complaint Table";
    complaintTableControlSection.appendChild(complaintTableHeading);

    ts3ldv.tables.addPagerSection(complaintTableControlSection, module);

    module.div.appendChild(complaintTableControlSection);

    const Complaint = ts3ldv.Json.ComplaintList,
      complaintTable = document.createElement("table"),
      complaintHead = document.createElement("thead"),
      complaintHeadRow = document.createElement("tr"),
      headCell_ComplaintDateTime = document.createElement("th"),
      headCell_ComplaintAboutID = document.createElement("th"),
      headCell_ComplaintAboutNickname = document.createElement("th"),
      headCell_ComplaintReason = document.createElement("th"),
      headCell_ComplaintByID = document.createElement("th"),
      headCell_ComplaintByNickname = document.createElement("th");

    headCell_ComplaintDateTime.innerText = "Date and Time";
    headCell_ComplaintAboutID.innerText = "About ID";
    headCell_ComplaintAboutNickname.innerText = "About Nickname";
    headCell_ComplaintReason.innerText = "Reason";
    headCell_ComplaintByID.innerText = "By ID";
    headCell_ComplaintByNickname.innerText = "By Nickname";

    complaintHeadRow.appendChild(headCell_ComplaintDateTime);
    complaintHeadRow.appendChild(headCell_ComplaintAboutID);
    complaintHeadRow.appendChild(headCell_ComplaintAboutNickname);
    complaintHeadRow.appendChild(headCell_ComplaintReason);
    complaintHeadRow.appendChild(headCell_ComplaintByID);
    complaintHeadRow.appendChild(headCell_ComplaintByNickname);

    complaintHead.appendChild(complaintHeadRow);
    complaintTable.appendChild(complaintHead);

    const complaintBody = document.createElement("tbody");
    for (let i = 0; i < Complaint.length; i++) {
      const ComplaintDateTime = Complaint[i].complaintDateTime,
        ComplaintAboutID = Complaint[i].complaintAboutID,
        ComplaintAboutNickname = Complaint[i].complaintAboutNickname,
        ComplaintReason = Complaint[i].complaintReason,
        ComplaintByID = Complaint[i].complaintByID,
        ComplaintByNickname = Complaint[i].complaintByNickname;

      const complaintBodyRow = document.createElement("tr"),
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

      const cell_ComplaintDateTime_Div = document.createElement("div");
      cell_ComplaintDateTime_Div.innerHTML = ts3ldv.time.dateTimeToMomentString(ComplaintDateTime);
      cell_ComplaintDateTime.appendChild(cell_ComplaintDateTime_Div);
      complaintBodyRow.appendChild(cell_ComplaintDateTime);

      $(cell_ComplaintAboutID).text(ComplaintAboutID);
      complaintBodyRow.appendChild(cell_ComplaintAboutID);

      $(cell_ComplaintAboutNickname).text(ComplaintAboutNickname);
      complaintBodyRow.appendChild(cell_ComplaintAboutNickname);

      $(cell_ComplaintReason).text(ComplaintReason);
      complaintBodyRow.appendChild(cell_ComplaintReason);

      $(cell_ComplaintByID).text(ComplaintByID);
      complaintBodyRow.appendChild(cell_ComplaintByID);

      $(cell_ComplaintByNickname).text(ComplaintByNickname);
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
      sortList: ts3ldv.storage.getTableSortOrder(module)
    }).bind("sortEnd", function () {
      ts3ldv.storage.setTableSortOrder(module, complaintTable.config.sortList)
    }).tablesorterPager({
      container: $(document.getElementById(module.name + "Pager")),
      output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
      savePages: false
    });

    module.div.appendChild(complaintTable);
  };

  return module;
}(ts3ldv.tables || {}));
