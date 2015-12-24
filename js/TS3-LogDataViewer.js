// TS3-LogDataViewer.js
// Author: Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

// Global Variables
var ConnectedClientsCount, nanobar, momentInterval, XML, rebuildError = false,
    eventListeners = [];

// Rebuilds the XML and calls buildTable() when the XML creation has finished.
function rebuildXML() {
    nanobar.go(35);
    document.getElementById('rebuildXMLButton').disabled = document.getElementById('buildNewXMLButton').disabled = true;
    $.get('./rebuildXML.php', function() {
        buildTables();
    });
}

// Deletes the current XML and builds a new one after.
function buildNewXML() {
    $.get('./deleteXML.php', function() {
        rebuildXML();
    });
}

// Expands or collapses the list, depending on its current state.
function expandOrCollapseList(List, ID) {
    var Column, UpperList, numberIfCollapsed;
    if (List == 'ips') {
        Column = 3;
        UpperList = 'IPs';
        numberIfCollapsed = 1;
    } else {
        Column = numberIfCollapsed = 2;
        UpperList = 'Connections';
    }

    var currentDiv = document.getElementById(List + '_' + ID + '_1');
    if (currentDiv === null || currentDiv.style.display == 'none')
        expandList(List, UpperList, ID, Column, numberIfCollapsed);
    else collapseList(List, UpperList, ID, Column, numberIfCollapsed);
}

// Expands the current list.
function expandList(List, UpperList, ID, Column, numberIfCollapsed) {
    var x = document.getElementById(ID).childNodes[Column],
        ListContent = XML.getElementsByTagName('Client')[ID].getElementsByTagName(UpperList)[0].getElementsByTagName(UpperList[0]);
    document.getElementById(List + 'Button_' + ID).innerHTML = '- ' + (ListContent.length - numberIfCollapsed);
    document.getElementById(List + 'Button_' + ID).parentNode.setAttribute('expanded', true);
    for (var j = 1; j < ListContent.length; j++) {
        var currentDiv = List + '_' + ID + '_' + j;
        if (document.getElementById(currentDiv) === null) {
            var newDiv = document.createElement('div');
            newDiv.id = currentDiv;
            if (numberIfCollapsed == 1) newDiv.innerHTML = ListContent[j].firstChild.nodeValue;
            else newDiv.innerHTML = UTCDateStringToLocaltimeString(ListContent[j].firstChild.nodeValue);

            if (Column == 3) x.appendChild(newDiv);
            else x.insertBefore(newDiv, x.lastChild);
        } else document.getElementById(currentDiv).style.display = '';
    }
}

// Collapses the current list.
function collapseList(List, UpperList, ID, Column, numberIfCollapsed) {
    var ListContent = XML.getElementsByTagName('Client')[ID].getElementsByTagName(UpperList)[0].getElementsByTagName(UpperList[0]);
    document.getElementById(List + 'Button_' + ID).innerHTML = '+ ' + (ListContent.length - numberIfCollapsed);
    document.getElementById(List + 'Button_' + ID).parentNode.setAttribute('expanded', false);

    if (document.getElementById(ID) !== null) {
        var x = document.getElementById(ID).childNodes[Column].childNodes;
        for (var j = 1; j < x.length - 2; j++) {
            document.getElementById(List + '_' + ID + '_' + j).style.display = 'none';
        }
        if (Column == 3) document.getElementById(List + '_' + ID + '_' + j).style.display = 'none';
    }
}

// Collapses all expanded lists.
function collapseAll() {
    var j, x = document.getElementById('clientTable').lastChild.childNodes;
    for (j = 0; j < x.length; j++) {
        if (x.item(j).childNodes.item(2).getAttribute('expanded') == 'true')
            collapseList('connections', 'Connections', x.item(j).getAttribute('id'), 2, 2);
        if (x.item(j).childNodes.item(3).getAttribute('expanded') == 'true')
            collapseList('ips', 'IPs', x.item(j).getAttribute('id'), 3, 1);
    }
}

// Adds a custom parser which ignores the moment.js timestamps.
function addIgnoreMomentParser() {
    $.tablesorter.addParser({
        id: 'ignoreMoment',
        is: function() {
            return false;
        },
        format: function(s) {
            return s;
        },
        parsed: false,
        type: 'text'
    });
}

// Adds a custom parser which ignores the expand/collapse button in the Connections list.
function addConnectionsParser() {
    $.tablesorter.addParser({
        id: 'Connections',
        is: function() {
            return false;
        },
        format: function(s, table, cell) {
            if (localStorage.getItem('connectionsSortType') == '1') {
                if (cell.firstChild.localName == 'button') {
                    return cell.childNodes[1].innerHTML;
                } else return cell.firstChild.innerHTML;
            } else return cell.lastChild.innerHTML;
        },
        parsed: false,
        type: 'text'
    });
}

// Adds a custom parser which ignores the expand/collapse button in the IPs list.
function addIPsParser() {
    $.tablesorter.addParser({
        id: 'IPs',
        is: function() {
            return false;
        },
        format: function(s, table, cell) {
            if (cell.firstChild.localName == 'button') {
                return cell.childNodes[1].innerHTML;
            } else return cell.firstChild.innerHTML;
        },
        parsed: false,
        type: 'text'
    });
}

// Switches between ID/UID columns in the ban table.
function switchBetweenIDAndUID() {
    var rowID, banID, IDOrUID, bannedByIDOrUD, Ban = XML.getElementsByTagName('Ban'),
        x = document.getElementById('banTable').lastChild.childNodes,
        banTableHeadRow = document.getElementById('banTable').firstChild.firstChild,
        UIDState = Number(localStorage.getItem('UIDState'));

    if (UIDState) {
        IDOrUID = 'ID';
        localStorage.setItem('UIDState', '0');
    } else {
        IDOrUID = 'UID';
        localStorage.setItem('UIDState', '1');
    }

    banTableHeadRow.childNodes[1].innerHTML = 'Banned ' + IDOrUID;
    banTableHeadRow.childNodes[4].innerHTML = 'Banned by ' + IDOrUID;

    for (var j = 0; j < x.length; j++) {
        rowID = x.item(j).getAttribute('id');
        banID = rowID.substring(4, rowID.length);

        if (UIDState) {
            if (document.getElementById(rowID).childNodes[3].firstChild.nodeValue != 'Unknown') {
                bannedByIDOrUD = Ban[banID].getElementsByTagName('ByID')[0].firstChild.nodeValue;
            } else bannedByIDOrUD = 'Unknown';
        } else {
            if (Ban[banID].getElementsByTagName('ByUID')[0].firstChild !== null) {
                bannedByIDOrUD = Ban[banID].getElementsByTagName('ByUID')[0].firstChild.nodeValue;
            } else bannedByIDOrUD = 'No UID';
        }

        document.getElementById(rowID).childNodes[1].setAttribute('data-title', 'Banned ' + IDOrUID);
        document.getElementById(rowID).childNodes[4].setAttribute('data-title', 'Banned by ' + IDOrUID);
        document.getElementById(rowID).childNodes[1].lastChild.innerHTML = Ban[banID].getElementsByTagName(IDOrUID)[0].firstChild.nodeValue;
        document.getElementById(rowID).childNodes[4].lastChild.innerHTML = bannedByIDOrUD;
    }
}

// Imports and uses the local storage data for the given table.
function importLocalStorage(table) {
    if (localStorage.getItem(table)) {
        var checkState = Boolean(Number(localStorage.getItem(table)));
        document.getElementById(table + 'Checkbox').checked = checkState;
        if (!checkState) document.getElementById('ts3-' + table).style.display = '';
    } else {
        document.getElementById(table + 'Checkbox').checked = true;
        localStorage.setItem(table, '1');
    }
}

// Adds a checkbox listener for the given table.
function addTableCheckboxListener(table) {
    document.getElementById(table + 'Checkbox').addEventListener('click', function() {
        var leadingCapitalLetterTable = table.charAt(0).toUpperCase() + table.substring(1);
        if (this.checked) {
            localStorage.setItem(table, '1');
            if (sessionStorage.getItem(table + '-built') == '0') {
                nanobar.go(50);
                window['build' + leadingCapitalLetterTable]();
                nanobar.go(100);
            }
            document.getElementById('ts3-' + table).style.display = '';
            document.getElementById('scrollTo' + leadingCapitalLetterTable).style.display = '';
        } else {
            localStorage.setItem(table, '0');
            document.getElementById('ts3-' + table).style.display = 'none';
            document.getElementById('scrollTo' + leadingCapitalLetterTable).style.display = 'none';
        }
    });
}

// Executes importLocalStorage() and addTableCheckboxListener() for every table.
function localStorageAndTableCheckboxListener() {
    importLocalStorage('clientTable');
    importLocalStorage('banTable');
    importLocalStorage('kickTable');
    importLocalStorage('complaintTable');
    importLocalStorage('uploadTable');
    addTableCheckboxListener('clientTable');
    addTableCheckboxListener('banTable');
    addTableCheckboxListener('kickTable');
    addTableCheckboxListener('complaintTable');
    addTableCheckboxListener('uploadTable');
}

// Converts a UTC dateTime string with the format YYYY-MM-DD HH:mm:ss into a Date object.
function UTCDateStringToDate(dateString, moment) {
    return new Date(Date.UTC(dateString.substr(0, 4), dateString.substr(5, 2) - 1, dateString.substr(8, 2), dateString.substr(11, 2), dateString.substr(14, 2), dateString.substr(17, 2)));
}

// Returns the parameter as double digit string.
function toDoubleDigit(x) {
    if (x < 10) x = '0' + x;
    return x;
}

// Converts a UTC dateTime string with the format YYYY-MM-DD HH:mm:ss into a localtime string with the same format.
function UTCDateStringToLocaltimeString(dateString) {
    var dateObject = UTCDateStringToDate(dateString);
    return dateObject.getFullYear() + '-' + toDoubleDigit(dateObject.getMonth() + 1) + '-' + toDoubleDigit(dateObject.getDate()) + ' ' +
        toDoubleDigit(dateObject.getHours()) + ':' + toDoubleDigit(dateObject.getMinutes()) + ':' + toDoubleDigit(dateObject.getSeconds());
}

// Adds an onclick event to the given object and adds the object to the eventListeners array.
function addOnclickEvent(object, action) {
    object.onclick = action;
    eventListeners.push(object);
}

// Removes the onclick listeners that are listed in the eventListeners array.
function removeEventListeners() {
    for (var i = eventListeners.length - 1; i >= 0; i--) {
        eventListeners[i].onclick = null;
        eventListeners.pop();
    }
}

// Builds the client table.
function buildClientTable() {
    var clientTableControlSection = document.createElement('div');
    clientTableControlSection.className = 'row';

    var clientTableHeading = document.createElement('div');
    clientTableHeading.className = 'tableheading large-12 columns';
    clientTableHeading.innerHTML = 'Client table';
    clientTableControlSection.appendChild(clientTableHeading);

    var connectionsSortTypeButton = document.createElement('button');
    connectionsSortTypeButton.id = 'connectionsSortTypeButton';
    connectionsSortTypeButton.className = 'small-12 medium-8 large-6 columns';
    connectionsSortTypeButton.innerHTML = 'Currently sorting connections by the last connect';

    if (localStorage.getItem('connectionsSortType') === null) {
        localStorage.setItem('connectionsSortType', '1');
    } else if (localStorage.getItem('connectionsSortType') == '0') {
        connectionsSortTypeButton.innerHTML = 'Currently sorting connections by the first connect';
    }

    addOnclickEvent(connectionsSortTypeButton, function() {
        if (localStorage.getItem('connectionsSortType') == '1') {
            connectionsSortTypeButton.innerHTML = 'Currently sorting connections by the first connect';
            localStorage.setItem('connectionsSortType', '0');
        } else {
            connectionsSortTypeButton.innerHTML = 'Currently sorting connections by the last connect';
            localStorage.setItem('connectionsSortType', '1');
        }
        $.tablesorter.updateCache(clientTable.config);
        $.tablesorter.sortOn(clientTable.config, clientTable.config.sortList);
    });
    clientTableControlSection.appendChild(connectionsSortTypeButton);

    var collapseAllButton = document.createElement('button');
    collapseAllButton.id = 'collapseAllButton';
    collapseAllButton.className = 'small-12 medium-4 large-6 columns';
    collapseAllButton.innerHTML = 'Collapse expanded lists';

    addOnclickEvent(collapseAllButton, function() {
        collapseAll();
    });
    clientTableControlSection.appendChild(collapseAllButton);
    document.getElementById('ts3-clientTable').appendChild(clientTableControlSection);

    var Client = XML.getElementsByTagName('Client'),
        clientTable = document.createElement('table'),
        clientHead = document.createElement('thead'),
        clientHeadRow = document.createElement('tr'),
        clientHeadCell_ID = document.createElement('th'),
        clientHeadCell_Nicknames = document.createElement('th'),
        clientHeadCell_Connections = document.createElement('th'),
        clientHeadCell_IPs = document.createElement('th'),
        clientHeadCell_ConnectionCount = document.createElement('th'),
        clientHeadCell_Connected = document.createElement('th'),
        clientHeadCell_Deleted = document.createElement('th');

    clientHeadCell_ID.innerHTML = 'ID';
    clientHeadCell_Nicknames.innerHTML = 'Nicknames';
    clientHeadCell_Connections.innerHTML = 'Connections';
    clientHeadCell_IPs.innerHTML = 'IPs';
    clientHeadCell_ConnectionCount.innerHTML = 'Connection Count';
    clientHeadCell_Connected.innerHTML = 'Connected';
    clientHeadCell_Deleted.innerHTML = 'Deleted';

    clientHeadRow.appendChild(clientHeadCell_ID);
    clientHeadRow.appendChild(clientHeadCell_Nicknames);
    clientHeadRow.appendChild(clientHeadCell_Connections);
    clientHeadRow.appendChild(clientHeadCell_IPs);
    clientHeadRow.appendChild(clientHeadCell_ConnectionCount);
    clientHeadRow.appendChild(clientHeadCell_Connected);
    clientHeadRow.appendChild(clientHeadCell_Deleted);

    clientHead.appendChild(clientHeadRow);
    clientTable.appendChild(clientHead);

    var clientBody = document.createElement('tbody');
    for (var i = 0; i < Client.length; i++) {
        var ID = Client[i].getElementsByTagName('ID')[0].firstChild.nodeValue;
        if (ID !== '-1') {
            var Nicknames = Client[ID].getElementsByTagName('Nicknames')[0].getElementsByTagName('N'),
                Connections = Client[ID].getElementsByTagName('Connections')[0].getElementsByTagName('C'),
                IPs = Client[ID].getElementsByTagName('IPs')[0].getElementsByTagName('I'),
                Connection_Count = Connections.length,
                Connected, Deleted;
            if (Client[ID].getElementsByTagName('Connected')[0] !== undefined) {
                Connected = 'true';
                ConnectedClientsCount++;
            } else Connected = 'false';
            if (Client[ID].getElementsByTagName('Deleted')[0] !== undefined) {
                Deleted = 'true';
            } else Deleted = 'false';

            var clientBodyRow = document.createElement('tr'),
                clientBodyCell_ID = document.createElement('td'),
                clientBodyCell_Nicknames = document.createElement('td'),
                clientBodyCell_Connections = document.createElement('td'),
                clientBodyCell_IPs = document.createElement('td'),
                clientBodyCell_ConnectionCount = document.createElement('td'),
                clientBodyCell_Connected = document.createElement('td'),
                clientBodyCell_Deleted = document.createElement('td');

            clientBodyRow.id = ID;
            clientBodyCell_ID.setAttribute('data-title', 'ID');
            clientBodyCell_Nicknames.setAttribute('data-title', 'Nicknames');
            clientBodyCell_Connections.setAttribute('data-title', 'Connections');
            clientBodyCell_IPs.setAttribute('data-title', 'IPs');
            clientBodyCell_ConnectionCount.setAttribute('data-title', 'Connection Count');
            clientBodyCell_Connected.setAttribute('data-title', 'Connected');
            clientBodyCell_Deleted.setAttribute('data-title', 'Deleted');

            clientBodyCell_ID.innerHTML = ID;
            clientBodyRow.appendChild(clientBodyCell_ID);

            for (var j = 0; j < Nicknames.length; j++) {
                var divNicknames = document.createElement('div');
                divNicknames.innerHTML = Nicknames[j].firstChild.nodeValue;
                clientBodyCell_Nicknames.appendChild(divNicknames);
            }
            clientBodyRow.appendChild(clientBodyCell_Nicknames);

            if (Connections.length > 2) {
                var buttonExpandCollapseConnections = document.createElement('button');
                buttonExpandCollapseConnections.id = 'connectionsButton_' + ID;
                buttonExpandCollapseConnections.innerHTML = '+ ' + (Connections.length - 2);
                (function(ID) {
                    addOnclickEvent(buttonExpandCollapseConnections, function() {
                        expandOrCollapseList('connections', ID);
                    });
                })(ID);
                clientBodyCell_Connections.appendChild(buttonExpandCollapseConnections);
            }

            var divLastConnection = document.createElement('div');
            divLastConnection.id = 'connections_' + ID + '_0';
            divLastConnection.innerHTML = UTCDateStringToLocaltimeString(Connections[0].firstChild.nodeValue);
            clientBodyCell_Connections.appendChild(divLastConnection);

            if (Connections.length > 1) {
                var divFirstConnection = document.createElement('div');
                divFirstConnection.id = 'connections_' + ID + '_' + (Connections.length - 1);
                divFirstConnection.innerHTML = UTCDateStringToLocaltimeString(Connections[Connections.length - 1].firstChild.nodeValue);
                clientBodyCell_Connections.appendChild(divFirstConnection);
            }
            clientBodyRow.appendChild(clientBodyCell_Connections);

            if (IPs.length > 1) {
                var buttonExpandCollapseIPs = document.createElement('button');
                buttonExpandCollapseIPs.id = 'ipsButton_' + ID;
                buttonExpandCollapseIPs.innerHTML = '+ ' + (IPs.length - 1);
                (function(ID) {
                    addOnclickEvent(buttonExpandCollapseIPs, function() {
                        expandOrCollapseList('ips', ID);
                    });
                })(ID);
                clientBodyCell_IPs.appendChild(buttonExpandCollapseIPs);
            }

            var divLastIP = document.createElement('div');
            divLastIP.id = 'ips_' + ID + '_0';
            divLastIP.innerHTML = IPs[0].firstChild.nodeValue;
            clientBodyCell_IPs.appendChild(divLastIP);

            clientBodyRow.appendChild(clientBodyCell_IPs);

            clientBodyCell_ConnectionCount.innerHTML = Connection_Count;
            clientBodyRow.appendChild(clientBodyCell_ConnectionCount);

            clientBodyCell_Connected.innerHTML = Connected;
            clientBodyRow.appendChild(clientBodyCell_Connected);

            clientBodyCell_Deleted.innerHTML = Deleted;
            clientBodyRow.appendChild(clientBodyCell_Deleted);

            clientBody.appendChild(clientBodyRow);
        }
    }
    clientTable.appendChild(clientBody);
    clientTable.id = 'clientTable';
    clientTable.className += 'ui-table-reflow';
    document.getElementById('ts3-clientTable').appendChild(clientTable);

    addConnectionsParser();
    addIPsParser();
    $(clientTable).tablesorter({
        headers: {
            2: {
                sorter: 'Connections'
            },
            3: {
                sorter: 'IPs'
            }
        },
        sortList: JSON.parse(localStorage.getItem('clientTableSortOrder'))
    }).bind('sortEnd', function() {
        localStorage.setItem('clientTableSortOrder', JSON.stringify(clientTable.config.sortList));
    }).trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('clientTable-built', '1');
    document.getElementById('scrollToClientTable').style.display = '';
}

// Builds the ban table.
function buildBanTable() {
    if (localStorage.getItem('UIDState') === null) {
        localStorage.setItem('UIDState', '0');
    }

    var banTableControlSection = document.createElement('div');
    banTableControlSection.className = 'row';

    var banTableHeading = document.createElement('div');
    banTableHeading.className = 'tableheading large-12 columns';
    banTableHeading.innerHTML = 'Ban table';
    banTableControlSection.appendChild(banTableHeading);

    var switchBetweenIDandUIDButton = document.createElement('button');
    switchBetweenIDandUIDButton.id = 'switchBetweenIDandUIDButton';
    switchBetweenIDandUIDButton.innerHTML = 'Switch between IDs and UIDs';
    addOnclickEvent(switchBetweenIDandUIDButton, function() {
        switchBetweenIDAndUID();
    });
    banTableControlSection.appendChild(switchBetweenIDandUIDButton);
    document.getElementById('ts3-banTable').appendChild(banTableControlSection);

    var Ban = XML.getElementsByTagName('Ban'),
        banTable = document.createElement('table'),
        banHead = document.createElement('thead'),
        banHeadRow = document.createElement('tr'),
        banHeadCell_BanDateTime = document.createElement('th'),
        banHeadCell_BannedID = document.createElement('th'),
        banHeadCell_BannedNickname = document.createElement('th'),
        banHeadCell_BannedIP = document.createElement('th'),
        banHeadCell_BannedByID = document.createElement('th'),
        banHeadCell_BannedByNickname = document.createElement('th'),
        banHeadCell_BanReason = document.createElement('th'),
        banHeadCell_Bantime = document.createElement('th');

    banHeadCell_BanDateTime.innerHTML = 'Date and Time';
    banHeadCell_BannedID.innerHTML = 'Banned ID';
    banHeadCell_BannedNickname.innerHTML = 'Banned Nickname';
    banHeadCell_BannedIP.innerHTML = 'Banned IP';
    banHeadCell_BannedByID.innerHTML = 'Banned by ID';
    banHeadCell_BannedByNickname.innerHTML = 'Banned by Nickname';
    banHeadCell_BanReason.innerHTML = 'Reason';
    banHeadCell_Bantime.innerHTML = 'Bantime';

    banHeadRow.appendChild(banHeadCell_BanDateTime);
    banHeadRow.appendChild(banHeadCell_BannedID);
    banHeadRow.appendChild(banHeadCell_BannedNickname);
    banHeadRow.appendChild(banHeadCell_BannedIP);
    banHeadRow.appendChild(banHeadCell_BannedByID);
    banHeadRow.appendChild(banHeadCell_BannedByNickname);
    banHeadRow.appendChild(banHeadCell_BanReason);
    banHeadRow.appendChild(banHeadCell_Bantime);

    banHead.appendChild(banHeadRow);
    banTable.appendChild(banHead);

    var banBody = document.createElement('tbody');
    for (var i = 0; i < Ban.length; i++) {
        var BanDateTime = Ban[i].getElementsByTagName('DateTime')[0].firstChild.nodeValue,
            BannedID = Ban[i].getElementsByTagName('ID')[0].firstChild.nodeValue,
            BannedNickname = Ban[i].getElementsByTagName('Nickname')[0].firstChild.nodeValue,
            BannedIP = Ban[i].getElementsByTagName('IP')[0].firstChild.nodeValue,
            BannedByID;
        if (BannedIP != 'Unknown') {
            BannedByID = Ban[i].getElementsByTagName('ByID')[0].firstChild.nodeValue;
        } else BannedByID = 'Unknown';

        var BannedByNickname = Ban[i].getElementsByTagName('ByNickname')[0].firstChild.nodeValue,
            BanReason;
        if (Ban[i].getElementsByTagName('Reason')[0].firstChild !== null) {
            BanReason = Ban[i].getElementsByTagName('Reason')[0].firstChild.nodeValue;
        } else BanReason = 'No Reason given';

        var Bantime = Ban[i].getElementsByTagName('Bantime')[0].firstChild.nodeValue;

        var banBodyRow = document.createElement('tr');
        banBodyRow.id = 'ban_' + i;

        var banBodyCell_BanDateTime = document.createElement('td'),
            banBodyCell_BannedID = document.createElement('td'),
            banBodyCell_BannedNickname = document.createElement('td'),
            banBodyCell_BannedIP = document.createElement('td'),
            banBodyCell_BannedByID = document.createElement('td'),
            banBodyCell_BannedByNickname = document.createElement('td'),
            banBodyCell_BanReason = document.createElement('td'),
            banBodyCell_Bantime = document.createElement('td');

        banBodyCell_BanDateTime.setAttribute('data-title', 'Date and Time');
        banBodyCell_BannedID.setAttribute('data-title', 'Banned ID');
        banBodyCell_BannedNickname.setAttribute('data-title', 'Banned Nickname');
        banBodyCell_BannedIP.setAttribute('data-title', 'Banned IP');
        banBodyCell_BannedByID.setAttribute('data-title', 'Banned by ID');
        banBodyCell_BannedByNickname.setAttribute('data-title', 'Banned by Nickname');
        banBodyCell_BanReason.setAttribute('data-title', 'Reason');
        banBodyCell_Bantime.setAttribute('data-title', 'Bantime');

        var UTCBanDateTime = moment(UTCDateStringToDate(BanDateTime)),
            banBodyCell_BanDateTime_Div = document.createElement('div');
        banBodyCell_BanDateTime_Div.innerHTML = UTCBanDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCBanDateTime.fromNow() + ')';
        banBodyCell_BanDateTime.appendChild(banBodyCell_BanDateTime_Div);
        banBodyRow.appendChild(banBodyCell_BanDateTime);

        var banBodyCell_BannedID_Div = document.createElement('div');
        banBodyCell_BannedID_Div.innerHTML = BannedID;
        banBodyCell_BannedID.appendChild(banBodyCell_BannedID_Div);
        banBodyRow.appendChild(banBodyCell_BannedID);

        var banBodyCell_BannedNickname_Div = document.createElement('div');
        banBodyCell_BannedNickname_Div.innerHTML = BannedNickname;
        banBodyCell_BannedNickname.appendChild(banBodyCell_BannedNickname_Div);
        banBodyRow.appendChild(banBodyCell_BannedNickname);

        banBodyCell_BannedIP.innerHTML = BannedIP;
        banBodyRow.appendChild(banBodyCell_BannedIP);

        var banBodyCell_BannedByID_Div = document.createElement('div');
        banBodyCell_BannedByID_Div.innerHTML = BannedByID;
        banBodyCell_BannedByID.appendChild(banBodyCell_BannedByID_Div);
        banBodyRow.appendChild(banBodyCell_BannedByID);

        var banBodyCell_BannedByNickname_Div = document.createElement('div');
        banBodyCell_BannedByNickname_Div.innerHTML = BannedByNickname;
        banBodyCell_BannedByNickname.appendChild(banBodyCell_BannedByNickname_Div);
        banBodyRow.appendChild(banBodyCell_BannedByNickname);

        var banBodyCell_BanReason_Div = document.createElement('div');
        banBodyCell_BanReason_Div.innerHTML = BanReason;
        banBodyCell_BanReason.appendChild(banBodyCell_BanReason_Div);
        banBodyRow.appendChild(banBodyCell_BanReason);

        banBodyCell_Bantime.innerHTML = Bantime;
        banBodyRow.appendChild(banBodyCell_Bantime);

        banBody.appendChild(banBodyRow);
    }
    banTable.appendChild(banBody);

    banTable.id = 'banTable';
    banTable.className += 'ui-table-reflow';
    document.getElementById('ts3-banTable').appendChild(banTable);

    if (localStorage.getItem('UIDState') == '1') {
        localStorage.setItem('UIDState', '0');
        switchBetweenIDAndUID();
    }

    addIgnoreMomentParser();
    $(banTable).tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        },
        sortList: JSON.parse(localStorage.getItem('banTableSortOrder'))
    }).bind('sortEnd', function() {
        localStorage.setItem('banTableSortOrder', JSON.stringify(banTable.config.sortList));
    }).trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('banTable-built', '1');
    document.getElementById('scrollToBanTable').style.display = '';
}

// Builds the kick table.
function buildKickTable() {
    var kickTableControlSection = document.createElement('div');
    kickTableControlSection.className = 'row';

    var kickTableHeading = document.createElement('div');
    kickTableHeading.className = 'tableheading large-12 columns';
    kickTableHeading.innerHTML = 'Kick table';
    kickTableControlSection.appendChild(kickTableHeading);

    document.getElementById('ts3-kickTable').appendChild(kickTableControlSection);

    var Kick = XML.getElementsByTagName('Kick'),
        kickTable = document.createElement('table'),
        kickHead = document.createElement('thead'),
        kickHeadRow = document.createElement('tr'),
        kickHeadCell_KickDateTime = document.createElement('th'),
        kickHeadCell_KickedID = document.createElement('th'),
        kickHeadCell_KickedNickname = document.createElement('th'),
        kickHeadCell_KickedByNickname = document.createElement('th'),
        kickHeadCell_KickedByUID = document.createElement('th'),
        kickHeadCell_KickReason = document.createElement('th');

    kickHeadCell_KickDateTime.innerHTML = 'Date and Time';
    kickHeadCell_KickedID.innerHTML = 'Kicked Client ID';
    kickHeadCell_KickedNickname.innerHTML = 'Kicked Client Nickname';
    kickHeadCell_KickedByNickname.innerHTML = 'Kicked by Nickname';
    kickHeadCell_KickedByUID.innerHTML = 'Kicked by UID';
    kickHeadCell_KickReason.innerHTML = 'Reason';

    kickHeadRow.appendChild(kickHeadCell_KickDateTime);
    kickHeadRow.appendChild(kickHeadCell_KickedID);
    kickHeadRow.appendChild(kickHeadCell_KickedNickname);
    kickHeadRow.appendChild(kickHeadCell_KickedByNickname);
    kickHeadRow.appendChild(kickHeadCell_KickedByUID);
    kickHeadRow.appendChild(kickHeadCell_KickReason);

    kickHead.appendChild(kickHeadRow);
    kickTable.appendChild(kickHead);

    var kickBody = document.createElement('tbody');
    for (var i = 0; i < Kick.length; i++) {
        var KickDateTime = Kick[i].getElementsByTagName('DateTime')[0].firstChild.nodeValue,
            KickedID = Kick[i].getElementsByTagName('ID')[0].firstChild.nodeValue,
            KickedNickname = Kick[i].getElementsByTagName('Nickname')[0].firstChild.nodeValue,
            KickedByNickname = Kick[i].getElementsByTagName('ByNickname')[0].firstChild.nodeValue,
            KickedByUID = Kick[i].getElementsByTagName('ByUID')[0].firstChild.nodeValue,
            KickReason;
        if (Kick[i].getElementsByTagName('Reason')[0].firstChild !== null) {
            KickReason = Kick[i].getElementsByTagName('Reason')[0].firstChild.nodeValue;
        } else KickReason = 'No Reason given';

        var kickBodyRow = document.createElement('tr'),
            kickBodyCell_DateTime = document.createElement('td'),
            kickBodyCell_KickedID = document.createElement('td'),
            kickBodyCell_KickedNickname = document.createElement('td'),
            kickBodyCell_KickedByNickname = document.createElement('td'),
            kickBodyCell_KickedByUID = document.createElement('td'),
            kickBodyCell_KickReason = document.createElement('td');

        kickBodyCell_DateTime.setAttribute('data-title', 'Date and Time');
        kickBodyCell_KickedID.setAttribute('data-title', 'Kicked ID');
        kickBodyCell_KickedNickname.setAttribute('data-title', 'Kicked Nickname');
        kickBodyCell_KickedByNickname.setAttribute('data-title', 'Kicked by Nickname');
        kickBodyCell_KickedByUID.setAttribute('data-title', 'Kicked by UID');
        kickBodyCell_KickReason.setAttribute('data-title', 'Reason');

        var UTCKickDateTime = moment(UTCDateStringToDate(KickDateTime)),
            kickBodyCell_DateTime_Div = document.createElement('div');
        kickBodyCell_DateTime_Div.innerHTML = UTCKickDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCKickDateTime.fromNow() + ')';
        kickBodyCell_DateTime.appendChild(kickBodyCell_DateTime_Div);
        kickBodyRow.appendChild(kickBodyCell_DateTime);

        kickBodyCell_KickedID.innerHTML = KickedID;
        kickBodyRow.appendChild(kickBodyCell_KickedID);

        var kickBodyCell_KickedNickname_Div = document.createElement('div');
        kickBodyCell_KickedNickname_Div.innerHTML = KickedNickname;
        kickBodyCell_KickedNickname.appendChild(kickBodyCell_KickedNickname_Div);
        kickBodyRow.appendChild(kickBodyCell_KickedNickname);

        var kickBodyCell_KickedByNickname_Div = document.createElement('div');
        kickBodyCell_KickedByNickname_Div.innerHTML = KickedByNickname;
        kickBodyCell_KickedByNickname.appendChild(kickBodyCell_KickedByNickname_Div);
        kickBodyRow.appendChild(kickBodyCell_KickedByNickname);

        var kickBodyCell_KickedByUID_Div = document.createElement('div');
        kickBodyCell_KickedByUID_Div.innerHTML = KickedByUID;
        kickBodyCell_KickedByUID.appendChild(kickBodyCell_KickedByUID_Div);
        kickBodyRow.appendChild(kickBodyCell_KickedByUID);

        var kickBodyCell_KickReason_Div = document.createElement('div');
        kickBodyCell_KickReason_Div.innerHTML = KickReason;
        kickBodyCell_KickReason.appendChild(kickBodyCell_KickReason_Div);
        kickBodyRow.appendChild(kickBodyCell_KickReason);

        kickBody.appendChild(kickBodyRow);
    }
    kickTable.appendChild(kickBody);

    kickTable.id = 'kickTable';
    kickTable.className += 'ui-table-reflow';
    document.getElementById('ts3-kickTable').appendChild(kickTable);

    addIgnoreMomentParser();
    $(kickTable).tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        },
        sortList: JSON.parse(localStorage.getItem('kickTableSortOrder'))
    }).bind('sortEnd', function() {
        localStorage.setItem('kickTableSortOrder', JSON.stringify(kickTable.config.sortList));
    }).trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('kickTable-built', '1');
    document.getElementById('scrollToKickTable').style.display = '';
}

// Builds the complaint table.
function buildComplaintTable() {
    var complaintTableControlSection = document.createElement('div');
    complaintTableControlSection.className = 'row';

    var complaintTableHeading = document.createElement('div');
    complaintTableHeading.className = 'tableheading large-12 columns';
    complaintTableHeading.innerHTML = 'Complaint table';
    complaintTableControlSection.appendChild(complaintTableHeading);

    document.getElementById('ts3-complaintTable').appendChild(complaintTableControlSection);

    var Complaint = XML.getElementsByTagName('Complaint'),
        complaintTable = document.createElement('table'),
        complaintHead = document.createElement('thead'),
        complaintHeadRow = document.createElement('tr'),
        complaintHeadCell_ComplaintDateTime = document.createElement('th'),
        complaintHeadCell_ComplaintAboutID = document.createElement('th'),
        complaintHeadCell_ComplaintAboutNickname = document.createElement('th'),
        complaintHeadCell_ComplaintReason = document.createElement('th'),
        complaintHeadCell_ComplaintByID = document.createElement('th'),
        complaintHeadCell_ComplaintByNickname = document.createElement('th');

    complaintHeadCell_ComplaintDateTime.innerHTML = 'Date and Time';
    complaintHeadCell_ComplaintAboutID.innerHTML = 'About ID';
    complaintHeadCell_ComplaintAboutNickname.innerHTML = 'About Nickname';
    complaintHeadCell_ComplaintReason.innerHTML = 'Reason';
    complaintHeadCell_ComplaintByID.innerHTML = 'By ID';
    complaintHeadCell_ComplaintByNickname.innerHTML = 'By Nickname';

    complaintHeadRow.appendChild(complaintHeadCell_ComplaintDateTime);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintAboutID);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintAboutNickname);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintReason);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintByID);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintByNickname);

    complaintHead.appendChild(complaintHeadRow);
    complaintTable.appendChild(complaintHead);

    var complaintBody = document.createElement('tbody');
    for (var i = 0; i < Complaint.length; i++) {
        var ComplaintDateTime = Complaint[i].getElementsByTagName('DateTime')[0].firstChild.nodeValue,
            ComplaintAboutID = Complaint[i].getElementsByTagName('AboutID')[0].firstChild.nodeValue,
            ComplaintAboutNickname = Complaint[i].getElementsByTagName('AboutNickname')[0].firstChild.nodeValue,
            ComplaintReason = Complaint[i].getElementsByTagName('Reason')[0].firstChild.nodeValue,
            ComplaintByID = Complaint[i].getElementsByTagName('ByID')[0].firstChild.nodeValue,
            ComplaintByNickname = Complaint[i].getElementsByTagName('ByNickname')[0].firstChild.nodeValue;

        var complaintBodyRow = document.createElement('tr'),
            complaintBodyCell_ComplaintDateTime = document.createElement('td'),
            complaintBodyCell_ComplaintAboutID = document.createElement('td'),
            complaintBodyCell_ComplaintAboutNickname = document.createElement('td'),
            complaintBodyCell_ComplaintReason = document.createElement('td'),
            complaintBodyCell_ComplaintByID = document.createElement('td'),
            complaintBodyCell_ComplaintByNickname = document.createElement('td');

        complaintBodyCell_ComplaintDateTime.setAttribute('data-title', 'Date and Time');
        complaintBodyCell_ComplaintAboutID.setAttribute('data-title', 'About ID');
        complaintBodyCell_ComplaintAboutNickname.setAttribute('data-title', 'About Nickname');
        complaintBodyCell_ComplaintReason.setAttribute('data-title', 'Reason');
        complaintBodyCell_ComplaintByID.setAttribute('data-title', 'By ID');
        complaintBodyCell_ComplaintByNickname.setAttribute('data-title', 'By Nickname');

        var UTCComplaintDateTime = moment(UTCDateStringToDate(ComplaintDateTime)),
            complaintBodyCell_ComplaintDateTime_Div = document.createElement('div');
        complaintBodyCell_ComplaintDateTime_Div.innerHTML = UTCComplaintDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCComplaintDateTime.fromNow() + ')';
        complaintBodyCell_ComplaintDateTime.appendChild(complaintBodyCell_ComplaintDateTime_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintDateTime);

        complaintBodyCell_ComplaintAboutID.innerHTML = ComplaintAboutID;
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintAboutID);

        var complaintBodyCell_ComplaintAboutNickname_Div = document.createElement('div');
        complaintBodyCell_ComplaintAboutNickname_Div.innerHTML = ComplaintAboutNickname;
        complaintBodyCell_ComplaintAboutNickname.appendChild(complaintBodyCell_ComplaintAboutNickname_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintAboutNickname);

        var complaintBodyCell_ComplaintReason_Div = document.createElement('div');
        complaintBodyCell_ComplaintReason_Div.innerHTML = ComplaintReason;
        complaintBodyCell_ComplaintReason.appendChild(complaintBodyCell_ComplaintReason_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintReason);

        complaintBodyCell_ComplaintByID.innerHTML = ComplaintByID;
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintByID);

        var complaintBodyCell_ComplaintByNickname_Div = document.createElement('div');
        complaintBodyCell_ComplaintByNickname_Div.innerHTML = ComplaintByNickname;
        complaintBodyCell_ComplaintByNickname.appendChild(complaintBodyCell_ComplaintByNickname_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintByNickname);

        complaintBody.appendChild(complaintBodyRow);
    }
    complaintTable.appendChild(complaintBody);

    complaintTable.id = 'complaintTable';
    complaintTable.className += 'ui-table-reflow';
    document.getElementById('ts3-complaintTable').appendChild(complaintTable);

    addIgnoreMomentParser();
    $(complaintTable).tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        },
        sortList: JSON.parse(localStorage.getItem('complaintTableSortOrder'))
    }).bind('sortEnd', function() {
        localStorage.setItem('complaintTableSortOrder', JSON.stringify(complaintTable.config.sortList));
    }).trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('complaintTable-built', '1');
    document.getElementById('scrollToComplaintTable').style.display = '';
}

// Builds the upload table.
function buildUploadTable() {
    var uploadTableControlSection = document.createElement('div');
    uploadTableControlSection.className = 'row';

    var uploadTableHeading = document.createElement('div');
    uploadTableHeading.className = 'tableheading large-12 columns';
    uploadTableHeading.innerHTML = 'Upload table';
    uploadTableControlSection.appendChild(uploadTableHeading);

    document.getElementById('ts3-uploadTable').appendChild(uploadTableControlSection);

    var Upload = XML.getElementsByTagName('Upload'),
        uploadTable = document.createElement('table'),
        uploadHead = document.createElement('thead'),
        uploadHeadRow = document.createElement('tr'),
        uploadHeadCell_UploadDateTime = document.createElement('th'),
        uploadHeadCell_ChannelID = document.createElement('th'),
        uploadHeadCell_Filename = document.createElement('th'),
        uploadHeadCell_UploadedByID = document.createElement('th'),
        uploadHeadCell_UploadedByNickname = document.createElement('th'),

        uploadHeadCell_DeletedByID = document.createElement('th'),
        uploadHeadCell_DeletedByNickname = document.createElement('th');

    uploadHeadCell_UploadDateTime.innerHTML = 'Date and Time';
    uploadHeadCell_ChannelID.innerHTML = 'Channel ID';
    uploadHeadCell_Filename.innerHTML = 'Filename';
    uploadHeadCell_UploadedByID.innerHTML = 'Uploaded by ID';
    uploadHeadCell_UploadedByNickname.innerHTML = 'Uploaded by Nickname';
    uploadHeadCell_DeletedByID.innerHTML = 'Deleted by ID';
    uploadHeadCell_DeletedByNickname.innerHTML = 'Deleted by Nickname';

    uploadHeadRow.appendChild(uploadHeadCell_UploadDateTime);
    uploadHeadRow.appendChild(uploadHeadCell_ChannelID);
    uploadHeadRow.appendChild(uploadHeadCell_Filename);
    uploadHeadRow.appendChild(uploadHeadCell_UploadedByID);
    uploadHeadRow.appendChild(uploadHeadCell_UploadedByNickname);
    uploadHeadRow.appendChild(uploadHeadCell_DeletedByID);
    uploadHeadRow.appendChild(uploadHeadCell_DeletedByNickname);

    uploadHead.appendChild(uploadHeadRow);
    uploadTable.appendChild(uploadHead);

    var uploadBody = document.createElement('tbody');
    for (var i = 0; i < Upload.length; i++) {
        var UploadDateTime = Upload[i].getElementsByTagName('DateTime')[0].firstChild.nodeValue,
            ChannelID = Upload[i].getElementsByTagName('ChannelID')[0].firstChild.nodeValue,
            Filename = Upload[i].getElementsByTagName('Filename')[0].firstChild.nodeValue,
            UploadedByID = Upload[i].getElementsByTagName('UplByID')[0].firstChild.nodeValue,
            UploadedByNickname = Upload[i].getElementsByTagName('UplByNickname')[0].firstChild.nodeValue,
            DeletedByID, DeletedByNickname;

        if (Upload[i].getElementsByTagName('DelByID')[0] !== undefined) {
            DeletedByID = Upload[i].getElementsByTagName('DelByID')[0].firstChild.nodeValue;
        } else DeletedByID = '/';
        if (Upload[i].getElementsByTagName('DelByNickname')[0] !== undefined) {
            DeletedByNickname = Upload[i].getElementsByTagName('DelByNickname')[0].firstChild.nodeValue;
        } else DeletedByNickname = '/';

        var uploadBodyRow = document.createElement('tr'),
            uploadBodyCell_UploadDateTime = document.createElement('td'),
            uploadBodyCell_ChannelID = document.createElement('td'),
            uploadBodyCell_Filename = document.createElement('td'),
            uploadBodyCell_UploadedByID = document.createElement('td'),
            uploadBodyCell_UploadedByNickname = document.createElement('td'),
            uploadBodyCell_DeletedByID = document.createElement('td'),
            uploadBodyCell_DeletedByNickname = document.createElement('td');

        uploadBodyCell_UploadDateTime.setAttribute('data-title', 'Date and Time');
        uploadBodyCell_ChannelID.setAttribute('data-title', 'Channel ID');
        uploadBodyCell_Filename.setAttribute('data-title', 'Filename');
        uploadBodyCell_UploadedByID.setAttribute('data-title', 'Uploaded by ID');
        uploadBodyCell_UploadedByNickname.setAttribute('data-title', 'Uploaded by Nickname');
        uploadBodyCell_DeletedByID.setAttribute('data-title', 'Deleted by ID');
        uploadBodyCell_DeletedByNickname.setAttribute('data-title', 'Deleted by Nickname');

        var UTCUploadDateTime = moment(UTCDateStringToDate(UploadDateTime)),
            uploadBodyCell_UploadDateTime_Div = document.createElement('div');
        uploadBodyCell_UploadDateTime_Div.innerHTML = UTCUploadDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCUploadDateTime.fromNow() + ')';
        uploadBodyCell_UploadDateTime.appendChild(uploadBodyCell_UploadDateTime_Div);
        uploadBodyRow.appendChild(uploadBodyCell_UploadDateTime);

        uploadBodyCell_ChannelID.innerHTML = ChannelID;
        uploadBodyRow.appendChild(uploadBodyCell_ChannelID);

        var uploadBodyCell_Filename_Div = document.createElement('div');
        uploadBodyCell_Filename_Div.innerHTML = Filename;
        uploadBodyCell_Filename.appendChild(uploadBodyCell_Filename_Div);
        uploadBodyRow.appendChild(uploadBodyCell_Filename);

        uploadBodyCell_UploadedByID.innerHTML = UploadedByID;
        uploadBodyRow.appendChild(uploadBodyCell_UploadedByID);

        var uploadBodyCell_UploadedByNickname_Div = document.createElement('div');
        uploadBodyCell_UploadedByNickname_Div.innerHTML = UploadedByNickname;
        uploadBodyCell_UploadedByNickname.appendChild(uploadBodyCell_UploadedByNickname_Div);
        uploadBodyRow.appendChild(uploadBodyCell_UploadedByNickname);

        uploadBodyCell_DeletedByID.innerHTML = DeletedByID;
        uploadBodyRow.appendChild(uploadBodyCell_DeletedByID);

        var uploadBodyCell_DeletedByNickname_Div = document.createElement('div');
        uploadBodyCell_DeletedByNickname_Div.innerHTML = DeletedByNickname;
        uploadBodyCell_DeletedByNickname.appendChild(uploadBodyCell_DeletedByNickname_Div);
        uploadBodyRow.appendChild(uploadBodyCell_DeletedByNickname);

        uploadBody.appendChild(uploadBodyRow);
    }
    uploadTable.appendChild(uploadBody);

    uploadTable.id = 'uploadTable';
    uploadTable.className += 'ui-table-reflow';
    document.getElementById('ts3-uploadTable').appendChild(uploadTable);

    addIgnoreMomentParser();
    $(uploadTable).tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        },
        sortList: JSON.parse(localStorage.getItem('uploadTableSortOrder'))
    }).bind('sortEnd', function() {
        localStorage.setItem('uploadTableSortOrder', JSON.stringify(uploadTable.config.sortList));
    }).trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('uploadTable-built', '1');
    document.getElementById('scrollToUploadTable').style.display = '';
}

// Imports the local storage, builds a table when it will have content and sets the session storage.
function buildTableWithAlertCheckAndLocalStorage(table) {
    $(document.getElementById('ts3-' + table)).empty();
    if (localStorage.getItem(table + 'SortOrder') === null) {
        localStorage.setItem(table + 'SortOrder', '[]');
    }
    if (localStorage.getItem(table) != '0') {
        var leadingCapitalLetterTable = table.charAt(0).toUpperCase() + table.substring(1);
        if (XML.getElementsByTagName(leadingCapitalLetterTable.substring(0, table.search('Table'))).length) {
            window['build' + leadingCapitalLetterTable]();
        } else {
            var alertBox = document.createElement('div');
            alertBox.className = 'alertBox';
            alertBox.innerHTML = 'No ' + table.substring(0, table.search('Table')) + 's were found.';
            document.getElementById('ts3-' + table).appendChild(alertBox);
        }
    } else sessionStorage.setItem(table + '-built', '0');
}

// Builds the tables using the XML.
function buildTables() {
    nanobar.go(50);
    $.ajax({
        url: './output.xml',
        cache: false,
        error: function() {
            if (rebuildError) alert('Rebuilding failed!');
            else {
                rebuildError = true;
                rebuildXML();
            }
        },
        success: function(tempXML) {
            rebuildError = false;
            XML = tempXML;
            ConnectedClientsCount = 0;

            removeEventListeners();
            buildTableWithAlertCheckAndLocalStorage('clientTable');
            buildTableWithAlertCheckAndLocalStorage('banTable');
            buildTableWithAlertCheckAndLocalStorage('kickTable');
            buildTableWithAlertCheckAndLocalStorage('complaintTable');
            buildTableWithAlertCheckAndLocalStorage('uploadTable');

            var Attributes = XML.getElementsByTagName('Attributes')[0],
                CreationTimestampLocaltime = Attributes.getElementsByTagName('CreationTimestamp_Localtime')[0].firstChild.nodeValue,
                CreationTimestampUTC = Attributes.getElementsByTagName('CreationTimestamp_UTC')[0].firstChild.nodeValue;

            document.getElementById('creationTimestamp_localtime').innerHTML = CreationTimestampLocaltime;
            document.getElementById('creationTimestamp_utc').innerHTML = CreationTimestampUTC;
            document.getElementById('creationTimestamp_moment').innerHTML = moment(CreationTimestampUTC + ' +0000', 'DD.MM.YYYY HH:mm:ss Z').fromNow();

            clearInterval(momentInterval);
            momentInterval = setInterval(function() {
                document.getElementById('creationTimestamp_moment').innerHTML = moment(CreationTimestampUTC + ' +0000', 'DD.MM.YYYY HH:mm:ss Z').fromNow();
            }, 1000);

            if (!document.getElementById('clientTable')) {
                var Client = XML.getElementsByTagName('Client');
                for (var i = 0; i < Client.length; i++) {
                    if (Client[i].getElementsByTagName('Connected')[0] !== undefined) {
                        ConnectedClientsCount++;
                    }
                }
            }
            document.getElementById('connectedClientsCount').innerHTML = 'Connected clients: ' + ConnectedClientsCount;

            if (Attributes.getElementsByTagName('SKIPLOCKFILE')[0].firstChild.nodeValue == 'true') {
                alert('Alert: The debug variable SKIPLOCKFILE was set to true on the last XML creation. Please recompile the program with this variable set to false and rebuild the XML afterwards to prevent this alert to show up again.');
            }

            document.getElementById('rebuildXMLButton').disabled = document.getElementById('buildNewXMLButton').disabled = false;
            nanobar.go(100);
        }
    });
}

// Builds the control section.
function buildControlSection() {
    var controlSection = document.createElement('div'),
        tableSelectionSection = document.createElement('div'),
        clientTableCheckboxSection = document.createElement('div'),
        banTableCheckboxSection = document.createElement('div'),
        kickTableCheckboxSection = document.createElement('div'),
        complaintTableCheckboxSection = document.createElement('div'),
        uploadTableCheckboxSection = document.createElement('div'),
        clientTableCheckbox = document.createElement('input'),
        banTableCheckbox = document.createElement('input'),
        kickTableCheckbox = document.createElement('input'),
        complaintTableCheckbox = document.createElement('input'),
        uploadTableCheckbox = document.createElement('input'),
        clientTableCheckboxLabel = document.createElement('label'),
        banTableCheckboxLabel = document.createElement('label'),
        kickTableCheckboxLabel = document.createElement('label'),
        complaintTableCheckboxLabel = document.createElement('label'),
        uploadTableCheckboxLabel = document.createElement('label');

    controlSection.id = 'controlSection';
    tableSelectionSection.id = 'tableSelectionSection';
    controlSection.className = 'row';
    tableSelectionSection.className = 'columns row';
    clientTableCheckboxSection.className = 'small-12 medium-12 large-6 columns';
    banTableCheckboxSection.className = 'small-12 medium-6 large-6 columns';
    kickTableCheckboxSection.className = complaintTableCheckboxSection.className = uploadTableCheckboxSection.className = 'small-12 medium-6 large-4 columns';
    clientTableCheckbox.type = banTableCheckbox.type = kickTableCheckbox.type = complaintTableCheckbox.type = uploadTableCheckbox.type = 'checkbox';
    clientTableCheckbox.id = 'clientTableCheckbox';
    banTableCheckbox.id = 'banTableCheckbox';
    kickTableCheckbox.id = 'kickTableCheckbox';
    complaintTableCheckbox.id = 'complaintTableCheckbox';
    uploadTableCheckbox.id = 'uploadTableCheckbox';
    clientTableCheckboxLabel.htmlFor = 'clientTableCheckbox';
    banTableCheckboxLabel.htmlFor = 'banTableCheckbox';
    kickTableCheckboxLabel.htmlFor = 'kickTableCheckbox';
    complaintTableCheckboxLabel.htmlFor = 'complaintTableCheckbox';
    uploadTableCheckboxLabel.htmlFor = 'uploadTableCheckbox';
    clientTableCheckboxLabel.innerHTML = 'Client table';
    banTableCheckboxLabel.innerHTML = 'Ban table';
    kickTableCheckboxLabel.innerHTML = 'Kick table';
    complaintTableCheckboxLabel.innerHTML = 'Complaint table';
    uploadTableCheckboxLabel.innerHTML = 'Upload table';

    clientTableCheckboxSection.appendChild(clientTableCheckbox);
    clientTableCheckboxSection.appendChild(clientTableCheckboxLabel);
    banTableCheckboxSection.appendChild(banTableCheckbox);
    banTableCheckboxSection.appendChild(banTableCheckboxLabel);
    kickTableCheckboxSection.appendChild(kickTableCheckbox);
    kickTableCheckboxSection.appendChild(kickTableCheckboxLabel);
    complaintTableCheckboxSection.appendChild(complaintTableCheckbox);
    complaintTableCheckboxSection.appendChild(complaintTableCheckboxLabel);
    uploadTableCheckboxSection.appendChild(uploadTableCheckbox);
    uploadTableCheckboxSection.appendChild(uploadTableCheckboxLabel);

    tableSelectionSection.appendChild(clientTableCheckboxSection);
    tableSelectionSection.appendChild(banTableCheckboxSection);
    tableSelectionSection.appendChild(kickTableCheckboxSection);
    tableSelectionSection.appendChild(complaintTableCheckboxSection);
    tableSelectionSection.appendChild(uploadTableCheckboxSection);

    var creationTimestampSection = document.createElement('div'),
        creationTimestampTable = document.createElement('table'),
        ctTHead = document.createElement('thead'),
        ctTHeadRow = document.createElement('tr'),
        ctTHead_localtime = document.createElement('th'),
        ctTHead_utc = document.createElement('th'),
        ctTHead_moment = document.createElement('th'),
        ctTBody = document.createElement('tbody'),
        ctTBodyRow = document.createElement('tr'),
        ctT_localtime = document.createElement('td'),
        ctT_utc = document.createElement('td'),
        ctT_moment = document.createElement('td'),
        connectedClientsCount = document.createElement('div');

    creationTimestampSection.id = 'creationTimestampSection';
    creationTimestampSection.className = 'small-12 medium-8 large-8 columns';
    creationTimestampSection.innerHTML = 'Creation DateTime of the current XML';
    creationTimestampTable.id = 'creationTimestampTable';

    ctT_localtime.id = 'creationTimestamp_localtime';
    ctT_utc.id = 'creationTimestamp_utc';
    ctT_moment.id = 'creationTimestamp_moment';
    connectedClientsCount.id = 'connectedClientsCount';
    ctTHead_localtime.innerHTML = 'Server localtime';
    ctTHead_utc.innerHTML = 'UTC';
    ctTHead_moment.innerHTML = 'moment.js';
    ctT_localtime.innerHTML = ctT_utc.innerHTML = ctT_moment.innerHTML = connectedClientsCount.innerHTML = 'Analyzing...';

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

    var rebuildSection = document.createElement('div'),
        rebuildXMLButton = document.createElement('button'),
        buildNewXMLButton = document.createElement('button');

    rebuildSection.id = 'rebuildSection';
    rebuildSection.className = 'small-12 medium-4 large-4 columns';
    rebuildXMLButton.id = 'rebuildXMLButton';
    buildNewXMLButton.id = 'buildNewXMLButton';
    rebuildXMLButton.innerHTML = 'Update current XML';
    buildNewXMLButton.innerHTML = 'Generate new XML';
    rebuildXMLButton.disabled = buildNewXMLButton.disabled = true;

    rebuildXMLButton.onclick = function() {
        rebuildXML();
    };
    buildNewXMLButton.onclick = function() {
        buildNewXML();
    };

    rebuildSection.appendChild(rebuildXMLButton);
    rebuildSection.appendChild(buildNewXMLButton);

    var navbar = document.createElement('div'),
        scrollBackToTopButton = document.createElement('button'),
        scrollToClientTable = document.createElement('button'),
        scrollToBanTable = document.createElement('button'),
        scrollToKickTable = document.createElement('button'),
        scrollToComplaintTable = document.createElement('button'),
        scrollToUploadTable = document.createElement('button');

    scrollToClientTable.style.display = scrollToBanTable.style.display = scrollToKickTable.style.display = scrollToComplaintTable.style.display = scrollToUploadTable.style.display = 'none';

    navbar.id = 'navbar';
    scrollToClientTable.id = 'scrollToClientTable';
    scrollToBanTable.id = 'scrollToBanTable';
    scrollToKickTable.id = 'scrollToKickTable';
    scrollToComplaintTable.id = 'scrollToComplaintTable';
    scrollToUploadTable.id = 'scrollToUploadTable';
    scrollBackToTopButton.innerHTML = 'Top';
    scrollToClientTable.innerHTML = 'Clients';
    scrollToBanTable.innerHTML = 'Bans';
    scrollToKickTable.innerHTML = 'Kicks';
    scrollToComplaintTable.innerHTML = 'Complaints';
    scrollToUploadTable.innerHTML = 'Uploads';

    scrollBackToTopButton.onclick = function() {
        scrollTo(0, 0);
    };
    scrollToClientTable.onclick = function() {
        document.getElementById('ts3-clientTable').scrollIntoView();
    };
    scrollToBanTable.onclick = function() {
        document.getElementById('ts3-banTable').scrollIntoView();
    };
    scrollToKickTable.onclick = function() {
        document.getElementById('ts3-kickTable').scrollIntoView();
    };
    scrollToComplaintTable.onclick = function() {
        document.getElementById('ts3-complaintTable').scrollIntoView();
    };
    scrollToUploadTable.onclick = function() {
        document.getElementById('ts3-uploadTable').scrollIntoView();
    };

    navbar.appendChild(scrollBackToTopButton);
    navbar.appendChild(scrollToClientTable);
    navbar.appendChild(scrollToBanTable);
    navbar.appendChild(scrollToKickTable);
    navbar.appendChild(scrollToComplaintTable);
    navbar.appendChild(scrollToUploadTable);

    controlSection.appendChild(tableSelectionSection);
    controlSection.appendChild(creationTimestampSection);
    controlSection.appendChild(rebuildSection);
    controlSection.appendChild(navbar);
    document.getElementById('ts3-control').appendChild(controlSection);
}

document.addEventListener('DOMContentLoaded', function(event) {
    $(document).foundation();
    if (document.getElementById('ts3-control') !== null) {
        nanobar = new Nanobar({
            bg: 'white',
            id: 'nanobar'
        });

        buildControlSection();
        nanobar.go(25);
        localStorageAndTableCheckboxListener();
        buildTables();
    } else {
        alert('The html is missing the control section. Please use the provided index.html.');
    }
});
