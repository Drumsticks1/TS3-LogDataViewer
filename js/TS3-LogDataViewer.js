// TS3-LogDataViewer.
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";


/**
 * Sets the placeholder text for the tablesorter filter cells of the given table according to their column name.
 * @param tableModule the module of the table (e.g ts3ldv.tables.client)
 */
function setFilterPlaceholders(tableModule) {
    var placeholders = tableModule.div.getElementsByClassName("tablesorter-filter-row")[0].getElementsByTagName("input");
    for (var i = 0; i < placeholders.length; i++) {
        placeholders[i].setAttribute("placeholder",
            placeholders[i].parentNode.parentNode.previousSibling.children[placeholders[i].getAttribute("data-column")].firstChild.innerHTML);
    }
}

// todo: decentralize and put it in the table build methods, will create code duplication but could be resolved by inheritance in the future and eliminates this dirty solution
/**
 * Imports the local storage, builds the table if it would not be empty and sets the session storage.
 * TODO: update doc
 * @param tableModule TODO
 */
function buildTableWithAlertCheckAndLocalStorage(tableModule) {
    // Delete old table when rebuilding
    if (tableModule.getTableDiv() !== null) {
        $(tableModule.getTableDiv()).trigger("destroy");
        $(tableModule.div).empty();
    }

    // TODO: doc (short comment about if-else
    if (ts3ldv.storage.getTableActive(tableModule)) {
        // todo maybe set this flag after the table is built = at the end of this code
        ts3ldv.storage.setTableBuilt(tableModule, true);

        ts3ldv.controlSection.navbar.showScrollToButton(tableModule);

        // Todo (check if there is data for the requested table in the json), currently check is disabled!
        if (true) {
            tableModule.build();
            setFilterPlaceholders(tableModule);
            $(tableModule.getTableDiv()).trigger("applyWidgetId", ["stickyHeaders"]);
        } else {
            var alertBox = document.createElement("div");
            alertBox.className = "alertBox";
            // Todo
            // alertBox.innerHTML = "No " + table.substring(0, table.search("Table")) + "s were found.";
            tableModule.div.appendChild(alertBox);
        }
    } else {
        ts3ldv.storage.setTableBuilt(tableModule, false);
        ts3ldv.controlSection.navbar.hideScrollToButton(tableModule);
    }
}
