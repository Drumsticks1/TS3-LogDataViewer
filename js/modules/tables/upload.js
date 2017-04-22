// js/modules/tables/upload.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to the Upload table.
 */
(function (parent) {
    var module = parent.upload = parent.upload || {};

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
        return document.getElementById("kickTable");
    };

    // Todo: doc
    module.checkbox = module.checkbox || undefined;

    /**
     * Builds the upload table.
     */
    module.build = function () {
        var uploadTableControlSection = document.createElement("div");
        uploadTableControlSection.className = "row";

        var uploadTableHeading = document.createElement("div");
        uploadTableHeading.className = "tableheading large-12 columns";
        uploadTableHeading.innerHTML = "Upload table";
        uploadTableControlSection.appendChild(uploadTableHeading);

        ts3ldv.tables.addPagerSection(uploadTableControlSection, "uploadTable");

        this.div.appendChild(uploadTableControlSection);

        var Upload = ts3ldv.Json.UploadList,
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
            cell_UploadDateTime_Div.innerHTML = ts3ldv.time.dateTimeToMomentString(UploadDateTime);
            cell_UploadDateTime.appendChild(cell_UploadDateTime_Div);
            uploadBodyRow.appendChild(cell_UploadDateTime);

            cell_ChannelID.innerHTML = ChannelID;
            uploadBodyRow.appendChild(cell_ChannelID);

            cell_ChannelName.innerHTML = ts3ldv.tables.lookup.ChannelList[ChannelID].channelName;
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
            sortList: ts3ldv.storage.getTableSortOrder(this)
        }).bind("sortEnd", function () {
            ts3ldv.storage.setTableSortOrder(this, uploadTable.config.sortList)
        }).tablesorterPager({
            container: $(".uploadTablePager"),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            savePages: false
        });

        this.div.appendChild(uploadTable);
    };

    return module;
}(ts3ldv.tables || {}));
