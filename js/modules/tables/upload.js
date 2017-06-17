// js/modules/tables/upload.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Upload table.
 */
(function (parent) {
  const module = parent.upload = parent.upload || {};

  /**
   * The name of the module
   * @type {string}
   */
  module.name = "upload";

  /**
   * The element containing the table.
   * @type {Element}
   */
  module.div = document.getElementById("ts3-uploadTable");

  /**
   * Returns the table div (calls document.getElementById("tableDivId"))
   * @returns {Element}
   */
  module.getTableDiv = function () {
    return document.getElementById("uploadTable");
  };

  /**
   * The input object of type checkbox in the tableSelection section that toggles the table of this module.
   * @type {Element}
   */
  module.checkbox = module.checkbox || undefined;

  /**
   * Builds the upload table.
   */
  module.build = function () {
    const uploadTableControlSection = document.createElement("div");
    uploadTableControlSection.className = "row";

    const uploadTableHeading = document.createElement("div");
    uploadTableHeading.className = "tableheading large-12 columns";
    uploadTableHeading.innerText = "Upload Table";
    uploadTableControlSection.appendChild(uploadTableHeading);

    ts3ldv.tables.addPagerSection(uploadTableControlSection, module);

    module.div.appendChild(uploadTableControlSection);

    const Upload = ts3ldv.Json.UploadList,
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

    headCell_UploadDateTime.innerText = "Date and Time";
    headCell_ChannelID.innerText = "Channel ID";
    headCell_ChannelName.innerText = "Channel Name";
    headCell_Filename.innerText = "Filename";
    headCell_UploadedByID.innerText = "Uploaded by ID";
    headCell_UploadedByNickname.innerText = "Uploaded by Nickname";
    headCell_DeletedByID.innerText = "Deleted by ID";
    headCell_DeletedByNickname.innerText = "Deleted by Nickname";

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

    const uploadBody = document.createElement("tbody");
    for (let i = 0; i < Upload.length; i++) {
      const UploadDateTime = Upload[i].uploadDateTime,
        ChannelID = Upload[i].channelID,
        Filename = Upload[i].filename,
        UploadedByID = Upload[i].uploadedByID,
        UploadedByNickname = Upload[i].uploadedByNickname;

      const uploadBodyRow = document.createElement("tr");
      let DeletedByID, DeletedByNickname;
      if (Upload[i].deleted) {
        uploadBodyRow.className += "deleted";
        DeletedByID = Upload[i].deletedByID;
        DeletedByNickname = Upload[i].deletedByNickname;
      } else {
        DeletedByID = DeletedByNickname = "/";
      }

      const cell_UploadDateTime = document.createElement("td"),
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


      const cell_UploadDateTime_Div = document.createElement("div");
      cell_UploadDateTime_Div.innerHTML = ts3ldv.time.dateTimeToMomentString(UploadDateTime);
      cell_UploadDateTime.appendChild(cell_UploadDateTime_Div);
      uploadBodyRow.appendChild(cell_UploadDateTime);

      $(cell_ChannelID).text(ChannelID);
      uploadBodyRow.appendChild(cell_ChannelID);

      $(cell_ChannelName).text(ts3ldv.tables.lookup.ChannelList[ChannelID].channelName);
      uploadBodyRow.appendChild(cell_ChannelName);

      $(cell_Filename).text(Filename);
      uploadBodyRow.appendChild(cell_Filename);

      $(cell_UploadedByID).text(UploadedByID);
      uploadBodyRow.appendChild(cell_UploadedByID);

      $(cell_UploadedByNickname).text(UploadedByNickname);
      uploadBodyRow.appendChild(cell_UploadedByNickname);

      $(cell_DeletedByID).text(DeletedByID);
      uploadBodyRow.appendChild(cell_DeletedByID);

      $(cell_DeletedByNickname).text(DeletedByNickname);
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
      sortList: ts3ldv.storage.getTableSortOrder(module)
    }).bind("sortEnd", function () {
      ts3ldv.storage.setTableSortOrder(module, uploadTable.config.sortList)
    }).tablesorterPager({
      container: $(document.getElementById(module.name + "Pager")),
      output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
      savePages: false
    });

    module.div.appendChild(uploadTable);
  };

  return module;
}(ts3ldv.tables || {}));
