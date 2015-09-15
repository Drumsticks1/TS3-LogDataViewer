// TS3_EnhancedClientList.js
// Author: Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

// Global Variables
var ConnectedClientsCount, nanobar, currentDiv, momentInterval, XML, rebuildError = false,
    ConnectionsSortType = true,
    clientTableSortOrder, banTableSortOrder = [[0, 1]],
    kickTableSortOrder = [[0, 1]],
    complaintTableSortOrder = [[0, 1]],
    uploadTableSortOrder = [[0, 1]];

// Rebuilds the XML and calls buildTable() when the XML creation has finished.
function rebuildXML() {
    nanobar.go(35);
    document.getElementById('rebuildXMLButton').disabled = true;
    document.getElementById('buildNewXMLButton').disabled = true;
    $.get('rebuildXML.php', function() {
        saveSortOrder();
        buildTables();
    });
    return false;
}

// Deletes the current XML and builds a new one after.
function buildNewXML() {
    $.get('deleteXML.php', function() {
        rebuildXML();
    });
    return false;
}

// Expands or collapses the List, depending on its current state.
function expandcollapseList(List, ID) {
    currentDiv = List + '_' + ID + '_1';
    if (document.getElementById(currentDiv) === null || $('#' + currentDiv).is(':hidden')) {
        expandList(List, ID);
    } else {
        collapseList(List, ID);
    }
}

// Expands the current list.
function expandList(List, ID) {
    var Row, ListUpper, i;
    if (List == 'ips') {
        Row = 3;
        ListUpper = 'IPs';
        i = 1;
    } else {
        Row = 2;
        ListUpper = 'Connections';
        i = 2;
    }

    var x = document.getElementById(ID).childNodes[Row],
        ListContent = XML.getElementsByTagName('Client')[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper[0]);
    $('#' + List + 'Button_' + ID).html('- ' + (ListContent.length - i));
    $('#' + List + 'Button_' + ID).parent().attr('expanded', true);
    for (var j = 1; j < ListContent.length; j++) {
        currentDiv = List + '_' + ID + '_' + j;
        if (document.getElementById(currentDiv) === null) {
            var newDiv = document.createElement('div');
            $(newDiv).prop('id', currentDiv);
            if (i == 1) {
                $(newDiv).html(ListContent[j].firstChild.nodeValue);
            } else {
                $(newDiv).html(UTCDateStringToLocaltimeString(ListContent[j].firstChild.nodeValue));
            }

            if (Row == 3) {
                x.appendChild(newDiv);
            } else {
                x.insertBefore(newDiv, x.lastChild);
            }
        } else {
            document.getElementById(currentDiv).style.display = '';
        }
    }
}

// Collapses the current list.
function collapseList(List, ID) {
    var Row, ListUpper, i;
    if (List == 'ips') {
        Row = 3;
        ListUpper = 'IPs';
        i = 1;
    } else {
        Row = 2;
        ListUpper = 'Connections';
        i = 2;
    }

    var ListContent = XML.getElementsByTagName('Client')[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper[0]);
    $('#' + List + 'Button_' + ID).html('+ ' + (ListContent.length - i));
    $('#' + List + 'Button_' + ID).parent().attr('expanded', false);

    if (document.getElementById(ID) !== null) {
        var x = document.getElementById(ID).childNodes[Row].childNodes;
        for (var j = 1; j < x.length - 2; j++) {
            document.getElementById(List + '_' + ID + '_' + j).style.display = 'none';
        }
        if (Row == 3) {
            document.getElementById(List + '_' + ID + '_' + j).style.display = 'none';
        }
    }
}

// Collapses all expanded lists.
function collapseAll() {
    var j, x = document.getElementById('clientTable').lastChild.childNodes;
    for (j = 0; j < x.length; j++) {
        if (x.item(j).childNodes.item(2).getAttribute('expanded') === 'true') {
            collapseList('connections', x.item(j).getAttribute('id'));
        }
        if (x.item(j).childNodes.item(3).getAttribute('expanded') === 'true') {
            collapseList('ips', x.item(j).getAttribute('id'));
        }
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
            if (ConnectionsSortType) {
                if (cell.firstChild.localName == 'button') {
                    return cell.childNodes[1].innerHTML;
                } else {
                    return cell.firstChild.innerHTML;
                }
            } else {
                return cell.lastChild.innerHTML;
            }
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
            } else {
                return cell.firstChild.innerHTML;
            }
        },
        parsed: false,
        type: 'text'
    });
}

// Saves the current sort order of the existing tables.
function saveSortOrder() {
    if ($('#clientTable').length) {
        clientTableSortOrder = $('#clientTable')[0].config.sortList;
    }
    if ($('#banTable').length) {
        banTableSortOrder = $('#banTable')[0].config.sortList;
    }
    if ($('#kickTable').length) {
        kickTableSortOrder = $('#kickTable')[0].config.sortList;
    }
    if ($('#complaintTable').length) {
        complaintTableSortOrder = $('#complaintTable')[0].config.sortList;
    }
    if ($('#uploadTable').length) {
        uploadTableSortOrder = $('#uploadTable')[0].config.sortList;
    }
}

// Applies the saved sort order to the existing tables.
function applySortOrder() {
    if ($('#clientTable').length && clientTableSortOrder !== undefined) {
        $('#clientTable').trigger('sorton', [clientTableSortOrder]);
    }
    if ($('#banTable').length) {
        $('#banTable').trigger('sorton', [banTableSortOrder]);
    }
    if ($('#kickTable').length) {
        $('#kickTable').trigger('sorton', [kickTableSortOrder]);
    }
    if ($('#complaintTable').length) {
        $('#complaintTable').trigger('sorton', [complaintTableSortOrder]);
    }
    if ($('#uploadTable').length) {
        $('#uploadTable').trigger('sorton', [uploadTableSortOrder]);
    }
}

// Switches between ID/UID columns in the ban table.
function switchBetweenIDAndUID() {
    var j, rowID, banID, bannedByID, bannedByUID, Ban = XML.getElementsByTagName('Ban'),
        x = document.getElementById('banTable').lastChild.childNodes,
        banTableHeadRow = document.getElementById('banTable').firstChild.firstChild;

    // ID --> UID
    if (document.getElementById('banTable').getAttribute('uid') === 'false') {
        for (j = 0; j < x.length; j++) {
            rowID = x.item(j).getAttribute('id');
            banID = rowID.substring(4, rowID.length);

            if (Ban[banID].getElementsByTagName('BannedByUID')[0].firstChild !== null) {
                BannedByUID = Ban[banID].getElementsByTagName('BannedByUID')[0].firstChild.nodeValue;
            } else {
                BannedByUID = 'No UID';
            }

            $(document.getElementById(rowID).childNodes[1].lastChild).html(Ban[banID].getElementsByTagName('BannedUID')[0].firstChild.nodeValue);
            $(document.getElementById(rowID).childNodes[4].lastChild).html(BannedByUID);

            $(document.getElementById(rowID).childNodes[1]).attr('data-title', 'Banned UID');
            $(document.getElementById(rowID).childNodes[4]).attr('data-title', 'Banned by UID');
        }
        $(banTableHeadRow.childNodes[1]).html('Banned UID');
        $(banTableHeadRow.childNodes[4]).html('Banned by UID');
        $('#banTable').attr('uid', 'true');
    }

    // UID --> ID
    else if (document.getElementById('banTable').getAttribute('uid') === 'true') {
        for (j = 0; j < x.length; j++) {
            rowID = x.item(j).getAttribute('id');
            banID = rowID.substring(4, rowID.length);

            if (document.getElementById(rowID).childNodes[3] != 'Unknown') {
                BannedByID = Ban[banID].getElementsByTagName('BannedByID')[0].firstChild.nodeValue;
            } else {
                BannedByID = 'Unknown';
            }

            $(document.getElementById(rowID).childNodes[1].lastChild).html(Ban[banID].getElementsByTagName('BannedID')[0].firstChild.nodeValue);
            $(document.getElementById(rowID).childNodes[4].lastChild).html(BannedByID);

            $(document.getElementById(rowID).childNodes[1]).attr('data-title', 'Banned ID');
            $(document.getElementById(rowID).childNodes[4]).attr('data-title', 'Banned by ID');
        }
        $(banTableHeadRow.childNodes[1]).html('Banned ID');
        $(banTableHeadRow.childNodes[4]).html('Banned by ID');
        $('#banTable').attr('uid', 'false');
    }
}

// Imports and uses the local storage data for the given table.
function importLocalStorage(table) {
    if (localStorage.getItem(table)) {
        var checkState = localStorage.getItem(table);
        if (localStorage.getItem(table) === '0') {
            checkState = false;
        } else {
            checkState = true;
        }
        $('#' + table + 'Checkbox').prop('checked', checkState);
        if (!$('#' + table + 'Checkbox').is(':checked')) {
            document.getElementById('ts3-' + table).style.display = '';
        }
    } else {
        $('#' + table + 'Checkbox').prop('checked', true);
        localStorage.setItem(table, '1');
    }
}

// Adds a checkbox listener for the given table.
function addTableCheckboxListener(table) {
    $('#' + table + 'Checkbox').click(function() {
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

// executes importLocalStorage() and addTableCheckboxListener() for every table.
function localStorageAndTableCheckboxListener(table) {
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
function UTCDateStringToDate(dateString) {
    var year = dateString.substr(0, 4),
        month = dateString.substr(5, 2),
        day = dateString.substr(8, 2),
        hours = dateString.substr(11, 2),
        minutes = dateString.substr(14, 2),
        seconds = dateString.substr(17, 2);
    return new Date(year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' +0000');
}

// Converts a UTC dateTime string with the format YYYY-MM-DD HH:mm:ss into a localtime string with the same format.
function UTCDateStringToLocaltimeString(dateString) {
    var dateObject = UTCDateStringToDate(dateString),
        month = dateObject.getMonth() + 1,
        day = dateObject.getDate(),
        hours = dateObject.getHours(),
        minutes = dateObject.getMinutes(),
        seconds = dateObject.getSeconds(),
        dateObject_string = dateObject.getFullYear() + '-';

    if (month < 10) {
        dateObject_string += '0';
    }
    dateObject_string += month + '-';
    if (day < 10) {
        dateObject_string += '0';
    }
    dateObject_string += day + ' ';
    if (hours < 10) {
        dateObject_string += '0';
    }
    dateObject_string += hours + ':';
    if (minutes < 10) {
        dateObject_string += '0';
    }
    dateObject_string += minutes + ':';
    if (seconds < 10) {
        dateObject_string += '0';
    }
    dateObject_string += seconds;
    return dateObject_string;
}

// Builds the client table.
function buildClientTable() {
    $('#ts3-clientTable').empty();
    var clientTableControlSection = document.createElement('div');
    var connectionsSortTypeButton = document.createElement('button');
    $(connectionsSortTypeButton).prop('id', 'connectionsSortTypeButton');
    $(clientTableControlSection).prop('class', 'row');
    $(connectionsSortTypeButton).prop('class', 'small-12 medium-8 large-6 columns');
    $(connectionsSortTypeButton).html('Currently sorting connections by the last connect');

    connectionsSortTypeButton.onclick = function() {
        if (ConnectionsSortType) {
            $(connectionsSortTypeButton).html('Currently sorting connections by the first connect');
            ConnectionsSortType = false;
        } else {
            $(connectionsSortTypeButton).html('Currently sorting connections by the last connect');
            ConnectionsSortType = true;
        }
        saveSortOrder();
        $('#clientTable').trigger('updateCache');
        applySortOrder();
    };
    clientTableControlSection.appendChild(connectionsSortTypeButton);

    var collapseAllButton = document.createElement('button');
    $(collapseAllButton).prop('id', 'collapseAllButton');
    $(collapseAllButton).prop('class', 'small-12 medium-4 large-6 columns');
    $(collapseAllButton).html('Collapse expanded lists');

    collapseAllButton.onclick = function() {
        collapseAll();
    };
    clientTableControlSection.appendChild(collapseAllButton);
    document.getElementById('ts3-clientTable').appendChild(clientTableControlSection);

    var Client = XML.getElementsByTagName('Client');
    var clientTable = document.createElement('table');
    var clientHead = document.createElement('thead');
    var clientHeadRow = document.createElement('tr');
    var clientHeadCell_ID = document.createElement('th');
    var clientHeadCell_Nicknames = document.createElement('th');
    var clientHeadCell_Connections = document.createElement('th');
    var clientHeadCell_IPs = document.createElement('th');
    var clientHeadCell_ConnectionCount = document.createElement('th');
    var clientHeadCell_Connected = document.createElement('th');
    var clientHeadCell_Deleted = document.createElement('th');

    $(clientHeadCell_ID).html('ID');
    $(clientHeadCell_Nicknames).html('Nicknames');
    $(clientHeadCell_Connections).html('Connections');
    $(clientHeadCell_IPs).html('IPs');
    $(clientHeadCell_ConnectionCount).html('Connection Count');
    $(clientHeadCell_Connected).html('Connected');
    $(clientHeadCell_Deleted).html('Deleted');

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
            var Nicknames = Client[ID].getElementsByTagName('Nicknames')[0].getElementsByTagName('N');
            var Connections = Client[ID].getElementsByTagName('Connections')[0].getElementsByTagName('C');
            var IPs = Client[ID].getElementsByTagName('IPs')[0].getElementsByTagName('I');
            var Connection_Count = Client[ID].getElementsByTagName('Connection_Count')[0].firstChild.nodeValue;
            var Connected = Client[ID].getElementsByTagName('Connected')[0].firstChild.nodeValue;
            var Deleted = Client[ID].getElementsByTagName('Deleted')[0].firstChild.nodeValue;

            var clientBodyRow = document.createElement('tr');
            var clientBodyCell_ID = document.createElement('td');
            var clientBodyCell_Nicknames = document.createElement('td');
            var clientBodyCell_Connections = document.createElement('td');
            var clientBodyCell_IPs = document.createElement('td');
            var clientBodyCell_ConnectionCount = document.createElement('td');
            var clientBodyCell_Connected = document.createElement('td');
            var clientBodyCell_Deleted = document.createElement('td');

            $(clientBodyRow).prop('id', ID);

            $(clientBodyCell_ID).attr('data-title', 'ID');
            $(clientBodyCell_Nicknames).attr('data-title', 'Nicknames');
            $(clientBodyCell_Connections).attr('data-title', 'Connections');
            $(clientBodyCell_IPs).attr('data-title', 'IPs');
            $(clientBodyCell_ConnectionCount).attr('data-title', 'Connection Count');
            $(clientBodyCell_Connected).attr('data-title', 'Connected');
            $(clientBodyCell_Deleted).attr('data-title', 'Deleted');

            $(clientBodyCell_ID).html(ID);
            clientBodyRow.appendChild(clientBodyCell_ID);

            for (var j = 0; j < Nicknames.length; j++) {
                var divNicknames = document.createElement('div');
                $(divNicknames).html(Nicknames[j].firstChild.nodeValue);
                clientBodyCell_Nicknames.appendChild(divNicknames);
            }
            clientBodyRow.appendChild(clientBodyCell_Nicknames);

            if (Connections.length > 2) {
                var buttonExpandCollapseConnections = document.createElement('button');
                $(buttonExpandCollapseConnections).prop('id', 'connectionsButton_' + ID).html('+ ' + (Connections.length - 2));

                (function(ID) {
                    buttonExpandCollapseConnections.onclick = function() {
                        expandcollapseList('connections', ID);
                    };
                })(ID);

                clientBodyCell_Connections.appendChild(buttonExpandCollapseConnections);
            }

            var divLastConnection = document.createElement('div');
            $(divLastConnection).prop('id', 'connections_' + ID + '_0').html(UTCDateStringToLocaltimeString(Connections[0].firstChild.nodeValue));
            clientBodyCell_Connections.appendChild(divLastConnection);

            if (Connections.length > 1) {
                var divFirstConnection = document.createElement('div');
                $(divFirstConnection).prop('id', 'connections_' + ID + '_' + (Connections.length - 1)).html(UTCDateStringToLocaltimeString(Connections[Connections.length - 1].firstChild.nodeValue));
                clientBodyCell_Connections.appendChild(divFirstConnection);
            }

            clientBodyRow.appendChild(clientBodyCell_Connections);

            if (IPs.length > 1) {
                var buttonExpandCollapseIPs = document.createElement('button');
                $(buttonExpandCollapseIPs).prop('id', 'ipsButton_' + ID).html('+ ' + (IPs.length - 1));

                (function(ID) {
                    buttonExpandCollapseIPs.onclick = function() {
                        expandcollapseList('ips', ID);
                    };
                })(ID);

                clientBodyCell_IPs.appendChild(buttonExpandCollapseIPs);
            }

            var divLastIP = document.createElement('div');
            $(divLastIP).prop('id', 'ips_' + ID + '_0').html(IPs[0].firstChild.nodeValue);
            clientBodyCell_IPs.appendChild(divLastIP);

            clientBodyRow.appendChild(clientBodyCell_IPs);

            $(clientBodyCell_ConnectionCount).html(Connection_Count);
            clientBodyRow.appendChild(clientBodyCell_ConnectionCount);

            if (Connected == 1) {
                $(clientBodyCell_Connected).html('true');
                ConnectedClientsCount++;
            } else {
                $(clientBodyCell_Connected).html('false');
            }
            clientBodyRow.appendChild(clientBodyCell_Connected);

            if (Deleted == 1) {
                $(clientBodyCell_Deleted).html('true');
            } else {
                $(clientBodyCell_Deleted).html('false');
            }
            clientBodyRow.appendChild(clientBodyCell_Deleted);

            clientBody.appendChild(clientBodyRow);
        }
    }
    clientTable.appendChild(clientBody);

    $(clientTable).prop('id', 'clientTable').addClass('ui-table-reflow');
    document.getElementById('ts3-clientTable').appendChild(clientTable);

    addConnectionsParser();
    addIPsParser();
    $('#clientTable').tablesorter({
        headers: {
            2: {
                sorter: 'Connections'
            },
            3: {
                sorter: 'IPs'
            }
        }
    });
    $('#clientTable').trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('clientTable-built', '1');
    document.getElementById('scrollToClientTable').style.display = '';
}

// Builds the ban table.
function buildBanTable() {
    var UIDState;
    if (document.getElementById('banTable') !== null) {
        UIDState = document.getElementById('banTable').getAttribute('uid');
        $('#ts3-banTable').empty();
    } else {
        UIDState = false;
    }

    var switchBetweenIDandUIDButton = document.createElement('button');
    $(switchBetweenIDandUIDButton).prop('id', 'switchBetweenIDandUIDButton').html('Switch between IDs and UIDs');
    switchBetweenIDandUIDButton.onclick = function() {
        switchBetweenIDAndUID();
    };
    document.getElementById('ts3-banTable').appendChild(switchBetweenIDandUIDButton);

    var Ban = XML.getElementsByTagName('Ban');
    var banTable = document.createElement('table');
    var banHead = document.createElement('thead');
    var banHeadRow = document.createElement('tr');
    var banHeadCell_BanDateTime = document.createElement('th');
    var banHeadCell_BannedID = document.createElement('th');
    var banHeadCell_BannedNickname = document.createElement('th');
    var banHeadCell_BannedIP = document.createElement('th');
    var banHeadCell_BannedByID = document.createElement('th');
    var banHeadCell_BannedByNickname = document.createElement('th');
    var banHeadCell_BanReason = document.createElement('th');
    var banHeadCell_Bantime = document.createElement('th');

    $(banHeadCell_BanDateTime).html('Date and Time');
    $(banHeadCell_BannedID).html('Banned ID');
    $(banHeadCell_BannedNickname).html('Banned Nickname');
    $(banHeadCell_BannedIP).html('Banned IP');
    $(banHeadCell_BannedByID).html('Banned by ID');
    $(banHeadCell_BannedByNickname).html('Banned by Nickname');
    $(banHeadCell_BanReason).html('Reason');
    $(banHeadCell_Bantime).html('Bantime');

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
        var BanDateTime = Ban[i].getElementsByTagName('BanDateTime')[0].firstChild.nodeValue;
        var BannedID = Ban[i].getElementsByTagName('BannedID')[0].firstChild.nodeValue;
        var BannedNickname = Ban[i].getElementsByTagName('BannedNickname')[0].firstChild.nodeValue;
        var BannedIP = Ban[i].getElementsByTagName('BannedIP')[0].firstChild.nodeValue;
        var BannedByID;
        if (BannedIP != 'Unknown') {
            BannedByID = Ban[i].getElementsByTagName('BannedByID')[0].firstChild.nodeValue;
        } else {
            BannedByID = 'Unknown';
        }
        var BannedByNickname = Ban[i].getElementsByTagName('BannedByNickname')[0].firstChild.nodeValue;
        var BanReason;
        if (Ban[i].getElementsByTagName('BanReason')[0].firstChild !== null) {
            BanReason = Ban[i].getElementsByTagName('BanReason')[0].firstChild.nodeValue;
        } else {
            BanReason = 'No Reason given';
        }
        var Bantime = Ban[i].getElementsByTagName('Bantime')[0].firstChild.nodeValue;

        var banBodyRow = document.createElement('tr');
        $(banBodyRow).prop('id', 'ban_' + i);

        var banBodyCell_BanDateTime = document.createElement('td');
        var banBodyCell_BannedID = document.createElement('td');
        var banBodyCell_BannedNickname = document.createElement('td');
        var banBodyCell_BannedIP = document.createElement('td');
        var banBodyCell_BannedByID = document.createElement('td');
        var banBodyCell_BannedByNickname = document.createElement('td');
        var banBodyCell_BanReason = document.createElement('td');
        var banBodyCell_Bantime = document.createElement('td');

        $(banBodyCell_BanDateTime).attr('data-title', 'Date and Time');
        $(banBodyCell_BannedID).attr('data-title', 'Banned ID');
        $(banBodyCell_BannedNickname).attr('data-title', 'Banned Nickname');
        $(banBodyCell_BannedIP).attr('data-title', 'Banned IP');
        $(banBodyCell_BannedByID).attr('data-title', 'Banned by ID');
        $(banBodyCell_BannedByNickname).attr('data-title', 'Banned by Nickname');
        $(banBodyCell_BanReason).attr('data-title', 'Reason');
        $(banBodyCell_Bantime).attr('data-title', 'Bantime');

        var UTCBanDateTime = moment(UTCDateStringToDate(BanDateTime));
        var banBodyCell_BanDateTime_Div = document.createElement('div');
        $(banBodyCell_BanDateTime_Div).html(UTCBanDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCBanDateTime.fromNow() + ')');
        banBodyCell_BanDateTime.appendChild(banBodyCell_BanDateTime_Div);
        banBodyRow.appendChild(banBodyCell_BanDateTime);

        var banBodyCell_BannedID_Div = document.createElement('div');
        $(banBodyCell_BannedID_Div).html(BannedID);
        banBodyCell_BannedID.appendChild(banBodyCell_BannedID_Div);
        banBodyRow.appendChild(banBodyCell_BannedID);

        var banBodyCell_BannedNickname_Div = document.createElement('div');
        $(banBodyCell_BannedNickname_Div).html(BannedNickname);
        banBodyCell_BannedNickname.appendChild(banBodyCell_BannedNickname_Div);
        banBodyRow.appendChild(banBodyCell_BannedNickname);

        $(banBodyCell_BannedIP).html(BannedIP);
        banBodyRow.appendChild(banBodyCell_BannedIP);

        var banBodyCell_BannedByID_Div = document.createElement('div');
        $(banBodyCell_BannedByID_Div).html(BannedByID);
        banBodyCell_BannedByID.appendChild(banBodyCell_BannedByID_Div);
        banBodyRow.appendChild(banBodyCell_BannedByID);

        var banBodyCell_BannedByNickname_Div = document.createElement('div');
        $(banBodyCell_BannedByNickname_Div).html(BannedByNickname);
        banBodyCell_BannedByNickname.appendChild(banBodyCell_BannedByNickname_Div);
        banBodyRow.appendChild(banBodyCell_BannedByNickname);

        var banBodyCell_BanReason_Div = document.createElement('div');
        $(banBodyCell_BanReason_Div).html(BanReason);
        banBodyCell_BanReason.appendChild(banBodyCell_BanReason_Div);
        banBodyRow.appendChild(banBodyCell_BanReason);

        $(banBodyCell_Bantime).html(Bantime);
        banBodyRow.appendChild(banBodyCell_Bantime);

        banBody.appendChild(banBodyRow);
    }
    banTable.appendChild(banBody);

    $(banTable).prop('id', 'banTable').addClass('ui-table-reflow').attr('uid', false);
    document.getElementById('ts3-banTable').appendChild(banTable);

    if (UIDState == 'true') {
        switchBetweenIDAndUID();
    }

    addIgnoreMomentParser();
    $('#banTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#banTable').trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('banTable-built', '1');
    document.getElementById('scrollToBanTable').style.display = '';
}

// Builds the kick table.
function buildKickTable() {
    $('#ts3-kickTable').empty();
    var Kick = XML.getElementsByTagName('Kick');
    var kickTable = document.createElement('table');
    var kickHead = document.createElement('thead');
    var kickHeadRow = document.createElement('tr');
    var kickHeadCell_KickDateTime = document.createElement('th');
    var kickHeadCell_KickedID = document.createElement('th');
    var kickHeadCell_KickedNickname = document.createElement('th');
    var kickHeadCell_KickedByNickname = document.createElement('th');
    var kickHeadCell_KickedByUID = document.createElement('th');
    var kickHeadCell_KickReason = document.createElement('th');

    $(kickHeadCell_KickDateTime).html('Date and Time');
    $(kickHeadCell_KickedID).html('Kicked Client ID');
    $(kickHeadCell_KickedNickname).html('Kicked Client Nickname');
    $(kickHeadCell_KickedByNickname).html('Kicked by Nickname');
    $(kickHeadCell_KickedByUID).html('Kicked by UID');
    $(kickHeadCell_KickReason).html('Reason');

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
        var KickDateTime = Kick[i].getElementsByTagName('KickDateTime')[0].firstChild.nodeValue;
        var KickedID = Kick[i].getElementsByTagName('KickedID')[0].firstChild.nodeValue;
        var KickedNickname = Kick[i].getElementsByTagName('KickedNickname')[0].firstChild.nodeValue;
        var KickedByNickname = Kick[i].getElementsByTagName('KickedByNickname')[0].firstChild.nodeValue;
        var KickedByUID = Kick[i].getElementsByTagName('KickedByUID')[0].firstChild.nodeValue;
        var KickReason;
        if (Kick[i].getElementsByTagName('KickReason')[0].firstChild !== null) {
            KickReason = Kick[i].getElementsByTagName('KickReason')[0].firstChild.nodeValue;
        } else {
            KickReason = 'No Reason given';
        }

        var kickBodyRow = document.createElement('tr');
        var kickBodyCell_DateTime = document.createElement('td');
        var kickBodyCell_KickedID = document.createElement('td');
        var kickBodyCell_KickedNickname = document.createElement('td');
        var kickBodyCell_KickedByNickname = document.createElement('td');
        var kickBodyCell_KickedByUID = document.createElement('td');
        var kickBodyCell_KickReason = document.createElement('td');

        $(kickBodyCell_DateTime).attr('data-title', 'Date and Time');
        $(kickBodyCell_KickedID).attr('data-title', 'Kicked ID');
        $(kickBodyCell_KickedNickname).attr('data-title', 'Kicked Nickname');
        $(kickBodyCell_KickedByNickname).attr('data-title', 'Kicked by Nickname');
        $(kickBodyCell_KickedByUID).attr('data-title', 'Kicked by UID');
        $(kickBodyCell_KickReason).attr('data-title', 'Reason');

        var UTCKickDateTime = moment(UTCDateStringToDate(KickDateTime));
        var kickBodyCell_DateTime_Div = document.createElement('div');
        $(kickBodyCell_DateTime_Div).html(UTCKickDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCKickDateTime.fromNow() + ')');
        kickBodyCell_DateTime.appendChild(kickBodyCell_DateTime_Div);
        kickBodyRow.appendChild(kickBodyCell_DateTime);

        $(kickBodyCell_KickedID).html(KickedID);
        kickBodyRow.appendChild(kickBodyCell_KickedID);

        var kickBodyCell_KickedNickname_Div = document.createElement('div');
        $(kickBodyCell_KickedNickname_Div).html(KickedNickname);
        kickBodyCell_KickedNickname.appendChild(kickBodyCell_KickedNickname_Div);
        kickBodyRow.appendChild(kickBodyCell_KickedNickname);

        var kickBodyCell_KickedByNickname_Div = document.createElement('div');
        $(kickBodyCell_KickedByNickname_Div).html(KickedByNickname);
        kickBodyCell_KickedByNickname.appendChild(kickBodyCell_KickedByNickname_Div);
        kickBodyRow.appendChild(kickBodyCell_KickedByNickname);

        var kickBodyCell_KickedByUID_Div = document.createElement('div');
        $(kickBodyCell_KickedByUID_Div).html(KickedByUID);
        kickBodyCell_KickedByUID.appendChild(kickBodyCell_KickedByUID_Div);
        kickBodyRow.appendChild(kickBodyCell_KickedByUID);

        var kickBodyCell_KickReason_Div = document.createElement('div');
        $(kickBodyCell_KickReason_Div).html(KickReason);
        kickBodyCell_KickReason.appendChild(kickBodyCell_KickReason_Div);
        kickBodyRow.appendChild(kickBodyCell_KickReason);

        kickBody.appendChild(kickBodyRow);
    }
    kickTable.appendChild(kickBody);

    $(kickTable).prop('id', 'kickTable').addClass('ui-table-reflow');
    document.getElementById('ts3-kickTable').appendChild(kickTable);

    addIgnoreMomentParser();
    $('#kickTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#kickTable').trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('kickTable-built', '1');
    document.getElementById('scrollToKickTable').style.display = '';
}

// Builds the complaint table.
function buildComplaintTable() {
    $('#ts3-complaintTable').empty();
    var Complaint = XML.getElementsByTagName('Complaint');
    var complaintTable = document.createElement('table');
    var complaintHead = document.createElement('thead');
    var complaintHeadRow = document.createElement('tr');
    var complaintHeadCell_ComplaintDateTime = document.createElement('th');
    var complaintHeadCell_ComplaintAboutID = document.createElement('th');
    var complaintHeadCell_ComplaintAboutNickname = document.createElement('th');
    var complaintHeadCell_ComplaintReason = document.createElement('th');
    var complaintHeadCell_ComplaintByID = document.createElement('th');
    var complaintHeadCell_ComplaintByNickname = document.createElement('th');

    $(complaintHeadCell_ComplaintDateTime).html('Date and Time');
    $(complaintHeadCell_ComplaintAboutID).html('About ID');
    $(complaintHeadCell_ComplaintAboutNickname).html('About Nickname');
    $(complaintHeadCell_ComplaintReason).html('Reason');
    $(complaintHeadCell_ComplaintByID).html('By ID');
    $(complaintHeadCell_ComplaintByNickname).html('By Nickname');

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
        var ComplaintDateTime = Complaint[i].getElementsByTagName('ComplaintDateTime')[0].firstChild.nodeValue;
        var ComplaintAboutID = Complaint[i].getElementsByTagName('ComplaintAboutID')[0].firstChild.nodeValue;
        var ComplaintAboutNickname = Complaint[i].getElementsByTagName('ComplaintAboutNickname')[0].firstChild.nodeValue;
        var ComplaintReason = Complaint[i].getElementsByTagName('ComplaintReason')[0].firstChild.nodeValue;
        var ComplaintByID = Complaint[i].getElementsByTagName('ComplaintByID')[0].firstChild.nodeValue;
        var ComplaintByNickname = Complaint[i].getElementsByTagName('ComplaintByNickname')[0].firstChild.nodeValue;

        var complaintBodyRow = document.createElement('tr');
        var complaintBodyCell_ComplaintDateTime = document.createElement('td');
        var complaintBodyCell_ComplaintAboutID = document.createElement('td');
        var complaintBodyCell_ComplaintAboutNickname = document.createElement('td');
        var complaintBodyCell_ComplaintReason = document.createElement('td');
        var complaintBodyCell_ComplaintByID = document.createElement('td');
        var complaintBodyCell_ComplaintByNickname = document.createElement('td');

        $(complaintBodyCell_ComplaintDateTime).attr('data-title', 'Date and Time');
        $(complaintBodyCell_ComplaintAboutID).attr('data-title', 'About ID');
        $(complaintBodyCell_ComplaintAboutNickname).attr('data-title', 'About Nickname');
        $(complaintBodyCell_ComplaintReason).attr('data-title', 'Reason');
        $(complaintBodyCell_ComplaintByID).attr('data-title', 'By ID');
        $(complaintBodyCell_ComplaintByNickname).attr('data-title', 'By Nickname');

        var UTCComplaintDateTime = moment(UTCDateStringToDate(ComplaintDateTime));
        var complaintBodyCell_ComplaintDateTime_Div = document.createElement('div');
        $(complaintBodyCell_ComplaintDateTime_Div).html(UTCComplaintDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCComplaintDateTime.fromNow() + ')');
        complaintBodyCell_ComplaintDateTime.appendChild(complaintBodyCell_ComplaintDateTime_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintDateTime);

        $(complaintBodyCell_ComplaintAboutID).html(ComplaintAboutID);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintAboutID);

        var complaintBodyCell_ComplaintAboutNickname_Div = document.createElement('div');
        $(complaintBodyCell_ComplaintAboutNickname_Div).html(ComplaintAboutNickname);
        complaintBodyCell_ComplaintAboutNickname.appendChild(complaintBodyCell_ComplaintAboutNickname_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintAboutNickname);

        var complaintBodyCell_ComplaintReason_Div = document.createElement('div');
        $(complaintBodyCell_ComplaintReason_Div).html(ComplaintReason);
        complaintBodyCell_ComplaintReason.appendChild(complaintBodyCell_ComplaintReason_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintReason);

        $(complaintBodyCell_ComplaintByID).html(ComplaintByID);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintByID);

        var complaintBodyCell_ComplaintByNickname_Div = document.createElement('div');
        $(complaintBodyCell_ComplaintByNickname_Div).html(ComplaintByNickname);
        complaintBodyCell_ComplaintByNickname.appendChild(complaintBodyCell_ComplaintByNickname_Div);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintByNickname);

        complaintBody.appendChild(complaintBodyRow);
    }
    complaintTable.appendChild(complaintBody);

    $(complaintTable).prop('id', 'complaintTable').addClass('ui-table-reflow');
    document.getElementById('ts3-complaintTable').appendChild(complaintTable);

    addIgnoreMomentParser();
    $('#complaintTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#complaintTable').trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('complaintTable-built', '1');
    document.getElementById('scrollToComplaintTable').style.display = '';
}

// Builds the upload table.
function buildUploadTable() {
    $('#ts3-uploadTable').empty();
    var File = XML.getElementsByTagName('File');
    var uploadTable = document.createElement('table');
    var uploadHead = document.createElement('thead');
    var uploadHeadRow = document.createElement('tr');
    var uploadHeadCell_UploadDateTime = document.createElement('th');
    var uploadHeadCell_ChannelID = document.createElement('th');
    var uploadHeadCell_Filename = document.createElement('th');
    var uploadHeadCell_UploadedByID = document.createElement('th');
    var uploadHeadCell_UploadedByNickname = document.createElement('th');

    $(uploadHeadCell_UploadDateTime).html('Date and Time');
    $(uploadHeadCell_ChannelID).html('Channel ID');
    $(uploadHeadCell_Filename).html('Filename');
    $(uploadHeadCell_UploadedByID).html('Uploaded by ID');
    $(uploadHeadCell_UploadedByNickname).html('Uploaded by Nickname');

    uploadHeadRow.appendChild(uploadHeadCell_UploadDateTime);
    uploadHeadRow.appendChild(uploadHeadCell_ChannelID);
    uploadHeadRow.appendChild(uploadHeadCell_Filename);
    uploadHeadRow.appendChild(uploadHeadCell_UploadedByID);
    uploadHeadRow.appendChild(uploadHeadCell_UploadedByNickname);

    uploadHead.appendChild(uploadHeadRow);
    uploadTable.appendChild(uploadHead);

    var uploadBody = document.createElement('tbody');

    for (var i = 0; i < File.length; i++) {
        var UploadDateTime = File[i].getElementsByTagName('UploadDateTime')[0].firstChild.nodeValue;
        var ChannelID = File[i].getElementsByTagName('ChannelID')[0].firstChild.nodeValue;
        var Filename = File[i].getElementsByTagName('Filename')[0].firstChild.nodeValue;
        var UploadedByID = File[i].getElementsByTagName('UploadedByID')[0].firstChild.nodeValue;
        var UploadedByNickname = File[i].getElementsByTagName('UploadedByNickname')[0].firstChild.nodeValue;

        var uploadBodyRow = document.createElement('tr');
        var uploadBodyCell_UploadDateTime = document.createElement('td');
        var uploadBodyCell_ChannelID = document.createElement('td');
        var uploadBodyCell_Filename = document.createElement('td');
        var uploadBodyCell_UploadedByID = document.createElement('td');
        var uploadBodyCell_UploadedByNickname = document.createElement('td');

        $(uploadBodyCell_UploadDateTime).attr('data-title', 'Date and Time');
        $(uploadBodyCell_ChannelID).attr('data-title', 'Channel ID');
        $(uploadBodyCell_Filename).attr('data-title', 'Filename');
        $(uploadBodyCell_UploadedByID).attr('data-title', 'Uploaded by ID');
        $(uploadBodyCell_UploadedByNickname).attr('data-title', 'Uploaded by Nickname');

        var UTCUploadDateTime = moment(UTCDateStringToDate(UploadDateTime));
        var uploadBodyCell_UploadDateTime_Div = document.createElement('div');
        $(uploadBodyCell_UploadDateTime_Div).html(UTCUploadDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCUploadDateTime.fromNow() + ')');
        uploadBodyCell_UploadDateTime.appendChild(uploadBodyCell_UploadDateTime_Div);
        uploadBodyRow.appendChild(uploadBodyCell_UploadDateTime);

        $(uploadBodyCell_ChannelID).html(ChannelID);
        uploadBodyRow.appendChild(uploadBodyCell_ChannelID);

        var uploadBodyCell_Filename_Div = document.createElement('div');
        $(uploadBodyCell_Filename_Div).html(Filename);
        uploadBodyCell_Filename.appendChild(uploadBodyCell_Filename_Div);
        uploadBodyRow.appendChild(uploadBodyCell_Filename);

        $(uploadBodyCell_UploadedByID).html(UploadedByID);
        uploadBodyRow.appendChild(uploadBodyCell_UploadedByID);

        var uploadBodyCell_UploadedByNickname_Div = document.createElement('div');
        $(uploadBodyCell_UploadedByNickname_Div).html(UploadedByNickname);
        uploadBodyCell_UploadedByNickname.appendChild(uploadBodyCell_UploadedByNickname_Div);
        uploadBodyRow.appendChild(uploadBodyCell_UploadedByNickname);

        uploadBody.appendChild(uploadBodyRow);
    }
    uploadTable.appendChild(uploadBody);

    $(uploadTable).prop('id', 'uploadTable').addClass('ui-table-reflow');
    document.getElementById('ts3-uploadTable').appendChild(uploadTable);

    addIgnoreMomentParser();
    $('#uploadTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#uploadTable').trigger('applyWidgetId', ['stickyHeaders']);
    sessionStorage.setItem('uploadTable-built', '1');
    document.getElementById('scrollToUploadTable').style.display = '';
}

// Builds the tables using the XML.
function buildTables() {
    nanobar.go(50);
    $.ajax({
        url: 'output.xml',
        cache: false,
        error: function() {
            if (rebuildError) {
                alert('Rebuilding failed!');
            } else {
                rebuildError = true;
                rebuildXML();
            }
        },
        success: function(tempXML) {
            rebuildError = false;
            XML = tempXML;
            ConnectedClientsCount = 0;

            if (localStorage.getItem('clientTable') != '0') {
                buildClientTable();
            } else {
                sessionStorage.setItem('clientTable-built', '0');
            }
            if (localStorage.getItem('banTable') != '0') {
                buildBanTable();
            } else {
                sessionStorage.setItem('banTable-built', '0');
            }
            if (localStorage.getItem('kickTable') != '0') {
                buildKickTable();
            } else {
                sessionStorage.setItem('kickTable-built', '0');
            }
            if (localStorage.getItem('complaintTable') != '0') {
                buildComplaintTable();
            } else {
                sessionStorage.setItem('complaintTable-built', '0');
            }
            if (localStorage.getItem('uploadTable') != '0') {
                buildUploadTable();
            } else {
                sessionStorage.setItem('uploadTable-built', '0');
            }
            applySortOrder();

            var Attributes = XML.getElementsByTagName('Attributes')[0];
            var CreationTimestampLocaltime = Attributes.getElementsByTagName('CreationTimestamp_Localtime')[0].firstChild.nodeValue;
            var CreationTimestampUTC = Attributes.getElementsByTagName('CreationTimestamp_UTC')[0].firstChild.nodeValue;

            $('#creationTimestamp_localtime').html(CreationTimestampLocaltime);
            $('#creationTimestamp_utc').html(CreationTimestampUTC);
            $('#creationTimestamp_moment').html(moment(CreationTimestampUTC + ' +0000', 'DD.MM.YYYY HH:mm:ss Z').fromNow());

            clearInterval(momentInterval);
            momentInterval = setInterval(function() {
                $('#creationTimestamp_moment').html(moment(CreationTimestampUTC + ' +0000', 'DD.MM.YYYY HH:mm:ss Z').fromNow());
            }, 1000);

            if (!$('#clientTable').length || document.getElementById('ts3-clientTable').style.display == 'none') {
                var Client = XML.getElementsByTagName('Client');
                for (var i = 0; i < Client.length; i++) {
                    if (Client[i].getElementsByTagName('ID')[0].firstChild.nodeValue == i) {
                        if (Client[i].getElementsByTagName('Connected')[0].firstChild.nodeValue == 1) {
                            ConnectedClientsCount++;
                        }
                    }
                }
            }
            $('#connectedClientsCount').html('Connected clients: ' + ConnectedClientsCount);

            if (Attributes.getElementsByTagName('SKIPLOCKFILE')[0].firstChild.nodeValue == 'true') {
                alert('Alert: The debug variable SKIPLOCKFILE was set to true on the last XML creation. Please recompile the program with this variable set to false and rebuild the XML afterwards to prevent this alert to show up again.');
            }

            document.getElementById('rebuildXMLButton').disabled = false;
            document.getElementById('buildNewXMLButton').disabled = false;
            nanobar.go(100);
        }
    });
}

// Builds the control section.
function buildControlSection() {
    var controlSection = document.createElement('div');
    var tableSelectionSection = document.createElement('div');
    var clientTableCheckboxSection = document.createElement('div');
    var banTableCheckboxSection = document.createElement('div');
    var kickTableCheckboxSection = document.createElement('div');
    var complaintTableCheckboxSection = document.createElement('div');
    var uploadTableCheckboxSection = document.createElement('div');
    var clientTableCheckbox = document.createElement('input');
    var banTableCheckbox = document.createElement('input');
    var kickTableCheckbox = document.createElement('input');
    var complaintTableCheckbox = document.createElement('input');
    var uploadTableCheckbox = document.createElement('input');
    var clientTableCheckboxLabel = document.createElement('label');
    var banTableCheckboxLabel = document.createElement('label');
    var kickTableCheckboxLabel = document.createElement('label');
    var complaintTableCheckboxLabel = document.createElement('label');
    var uploadTableCheckboxLabel = document.createElement('label');

    $(controlSection).prop('id', 'controlSection').prop('class', 'row');
    $(tableSelectionSection).prop('id', 'tableSelectionSection').prop('class', 'columns row');
    $(clientTableCheckboxSection).prop('class', 'small-12 medium-12 large-6 columns');
    $(banTableCheckboxSection).prop('class', 'small-12 medium-6 large-6 columns');
    $(kickTableCheckboxSection).prop('class', 'small-12 medium-6 large-4 columns');
    $(complaintTableCheckboxSection).prop('class', 'small-12 medium-6 large-4 columns');
    $(uploadTableCheckboxSection).prop('class', 'small-12 medium-6 large-4 columns');
    $(clientTableCheckbox).prop('id', 'clientTableCheckbox').prop('type', 'checkbox');
    $(banTableCheckbox).prop('id', 'banTableCheckbox').prop('type', 'checkbox');
    $(kickTableCheckbox).prop('id', 'kickTableCheckbox').prop('type', 'checkbox');
    $(complaintTableCheckbox).prop('id', 'complaintTableCheckbox').prop('type', 'checkbox');
    $(uploadTableCheckbox).prop('id', 'uploadTableCheckbox').prop('type', 'checkbox');
    $(clientTableCheckboxLabel).prop('for', 'clientTableCheckbox').html('Client table');
    $(banTableCheckboxLabel).prop('for', 'banTableCheckbox').html('Ban table');
    $(kickTableCheckboxLabel).prop('for', 'kickTableCheckbox').html('Kick table');
    $(complaintTableCheckboxLabel).prop('for', 'complaintTableCheckbox').html('Complaint table');
    $(uploadTableCheckboxLabel).prop('for', 'uploadTableCheckbox').html('Upload table');

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

    var creationTimestampSection = document.createElement('div');
    var creationTimestampTable = document.createElement('table');
    var ctTHead = document.createElement('thead');
    var ctTHeadRow = document.createElement('tr');
    var ctTHead_localtime = document.createElement('th');
    var ctTHead_utc = document.createElement('th');
    var ctTHead_moment = document.createElement('th');
    var ctTBody = document.createElement('tbody');
    var ctTBodyRow = document.createElement('tr');
    var ctT_localtime = document.createElement('td');
    var ctT_utc = document.createElement('td');
    var ctT_moment = document.createElement('td');
    var connectedClientsCount = document.createElement('div');

    $(creationTimestampSection).prop('id', 'creationTimestampSection').prop('class', 'small-12 medium-8 large-8 columns').html('Creation DateTime of the current XML');
    $(creationTimestampTable).prop('id', 'creationTimestampTable');
    $(ctTHead_localtime).html('Server localtime');
    $(ctTHead_utc).html('UTC');
    $(ctTHead_moment).html('moment.js');
    $(ctT_localtime).prop('id', 'creationTimestamp_localtime').html('Analyzing...');
    $(ctT_utc).prop('id', 'creationTimestamp_utc').html('Analyzing...');
    $(ctT_moment).prop('id', 'creationTimestamp_moment').html('Analyzing...');
    $(connectedClientsCount).prop('id', 'connectedClientsCount').html('Analyzing data...');

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

    var rebuildSection = document.createElement('div');
    var rebuildXMLButton = document.createElement('button');
    var buildNewXMLButton = document.createElement('button');

    $(rebuildSection).prop('id', 'rebuildSection').prop('class', 'small-12 medium-4 large-4 columns');
    $(rebuildXMLButton).prop('id', 'rebuildXMLButton').prop('disabled', 'true').html('Update current XML');
    $(buildNewXMLButton).prop('id', 'buildNewXMLButton').prop('disabled', 'true').html('Generate new XML');

    rebuildXMLButton.onclick = function() {
        rebuildXML();
    };
    buildNewXMLButton.onclick = function() {
        buildNewXML();
    };

    rebuildSection.appendChild(rebuildXMLButton);
    rebuildSection.appendChild(buildNewXMLButton);

    var navbar = document.createElement('div');
    var scrollBackToTopButton = document.createElement('button');
    var scrollToClientTable = document.createElement('button');
    var scrollToBanTable = document.createElement('button');
    var scrollToKickTable = document.createElement('button');
    var scrollToComplaintTable = document.createElement('button');
    var scrollToUploadTable = document.createElement('button');

    scrollToClientTable.style.display = 'none';
    scrollToBanTable.style.display = 'none';
    scrollToKickTable.style.display = 'none';
    scrollToComplaintTable.style.display = 'none';
    scrollToUploadTable.style.display = 'none';

    $(navbar).prop('id', 'navbar');
    $(scrollBackToTopButton).html('Top');
    $(scrollToClientTable).prop('id', 'scrollToClientTable').html('Clients');
    $(scrollToBanTable).prop('id', 'scrollToBanTable').html('Bans');
    $(scrollToKickTable).prop('id', 'scrollToKickTable').html('Kicks');
    $(scrollToComplaintTable).prop('id', 'scrollToComplaintTable').html('Complaints');
    $(scrollToUploadTable).prop('id', 'scrollToUploadTable').html('Uploads');

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

$(document).ready(function() {
    $(document).foundation();
    if ($('#ts3-control').length) {
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
