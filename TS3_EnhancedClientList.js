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
    var i;
    if (List == 'ips') {
        i = 1;
    } else {
        i = 2;
    }
    currentDiv = List + '_' + ID + '_' + i;
    if (document.getElementById(currentDiv) === null || $('#' + currentDiv).is(':hidden') === true) {
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
        ListContent = XML.getElementsByTagName('User')[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper[0]);
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
                $(newDiv).html(moment(ListContent[j].firstChild.nodeValue + '+0000').format('YYYY-MM-DD HH:mm:ss'));
            }

            if (Row == 3) {
                x.appendChild(newDiv);
            } else {
                x.insertBefore(newDiv, x.lastChild);
            }
        } else {
            $('#' + currentDiv).show();
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

    var ListContent = XML.getElementsByTagName('User')[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper[0]);
    $('#' + List + 'Button_' + ID).html('+ ' + (ListContent.length - i));
    $('#' + List + 'Button_' + ID).parent().attr('expanded', false);

    if (document.getElementById(ID) !== null) {
        var x = document.getElementById(ID).childNodes[Row].childNodes;
        for (var j = 1; j < x.length - 2; j++) {
            $('#' + List + '_' + ID + '_' + j).hide();
        }
        if (Row == 3) {
            $('#' + List + '_' + ID + '_' + j).hide();
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

// Scroll to the div with the given ID.
function scrollToDiv(Div_ID) {
    document.getElementById(Div_ID).scrollIntoView();
}

// Scroll to the given Row in the client list.
function scrollToClientTableRow(Row_ID) {
    if (document.getElementById(Row_ID) !== null) {
        scrollToDiv(Row_ID);
        var $sticky, sHeight;
        $sticky = $('#clientTable')[0].config.widgetOptions.$sticky;
        sHeight = $sticky.height() || 0;
        window.scrollBy(0, -sHeight);
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
            var firstConnect;
            var lastConnect = cell.lastChild.innerHTML;
            if (cell.firstChild.localName == 'button') {
                firstConnect = cell.childNodes[1].innerHTML;
            } else {
                firstConnect = cell.firstChild.innerHTML;
            }

            if (ConnectionsSortType) {
                return firstConnect;
            } else {
                return lastConnect;
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

            $(document.getElementById(rowID).childNodes[1]).html(Ban[banID].getElementsByTagName('BannedUID')[0].firstChild.nodeValue);
            $(document.getElementById(rowID).childNodes[5]).html(BannedByUID);
        }
        $(banTableHeadRow.childNodes[1]).html('Banned UID');
        $(banTableHeadRow.childNodes[5]).html('Banned by UID');
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

            $(document.getElementById(rowID).childNodes[1]).html(Ban[banID].getElementsByTagName('BannedID')[0].firstChild.nodeValue);
            $(document.getElementById(rowID).childNodes[5]).html(BannedByID);
        }
        $(banTableHeadRow.childNodes[1]).html('Banned ID');
        $(banTableHeadRow.childNodes[5]).html('Banned by ID');
        $('#banTable').attr('uid', 'false');
    }
}

// Builds the client table.
function buildClientTable() {
    $('#ts3-clientTable').empty();
    var User = XML.getElementsByTagName('User');

    var userTable = document.createElement('table');
    var userHead = document.createElement('thead');
    var userHeadRow = document.createElement('tr');
    var userHeadCell_ID = document.createElement('th');
    var userHeadCell_Nicknames = document.createElement('th');
    var userHeadCell_Connections = document.createElement('th');
    var userHeadCell_IPs = document.createElement('th');
    var userHeadCell_ConnectionCount = document.createElement('th');
    var userHeadCell_Connected = document.createElement('th');
    var userHeadCell_Deleted = document.createElement('th');

    $(userHeadCell_ID).html('ID');
    $(userHeadCell_Nicknames).html('Nicknames');
    $(userHeadCell_Connections).html('Connections');
    $(userHeadCell_IPs).html('IPs');
    $(userHeadCell_ConnectionCount).html('Connection Count');
    $(userHeadCell_Connected).html('Connected');
    $(userHeadCell_Deleted).html('Deleted');

    userHeadRow.appendChild(userHeadCell_ID);
    userHeadRow.appendChild(userHeadCell_Nicknames);
    userHeadRow.appendChild(userHeadCell_Connections);
    userHeadRow.appendChild(userHeadCell_IPs);
    userHeadRow.appendChild(userHeadCell_ConnectionCount);
    userHeadRow.appendChild(userHeadCell_Connected);
    userHeadRow.appendChild(userHeadCell_Deleted);

    userHead.appendChild(userHeadRow);
    userTable.appendChild(userHead);

    var userBody = document.createElement('tbody');

    for (var i = 0; i < User.length; i++) {
        var ID = User[i].getElementsByTagName('ID')[0].firstChild.nodeValue;
        if (ID == i) {
            var Nicknames = User[ID].getElementsByTagName('Nicknames')[0].getElementsByTagName('N');
            var Connections = User[ID].getElementsByTagName('Connections')[0].getElementsByTagName('C');
            var IPs = User[ID].getElementsByTagName('IPs')[0].getElementsByTagName('I');
            var Connection_Count = User[ID].getElementsByTagName('Connection_Count')[0].firstChild.nodeValue;
            var Connected = User[ID].getElementsByTagName('Connected')[0].firstChild.nodeValue;
            var Deleted = User[ID].getElementsByTagName('Deleted')[0].firstChild.nodeValue;

            var userBodyRow = document.createElement('tr');
            var userBodyCell_ID = document.createElement('td');
            var userBodyCell_Nicknames = document.createElement('td');
            var userBodyCell_Connections = document.createElement('td');
            var userBodyCell_IPs = document.createElement('td');
            var userBodyCell_ConnectionCount = document.createElement('td');
            var userBodyCell_Connected = document.createElement('td');
            var userBodyCell_Deleted = document.createElement('td');

            $(userBodyRow).prop('id', ID);

            $(userBodyCell_ID).html(ID);
            userBodyRow.appendChild(userBodyCell_ID);

            for (var j = 0; j < Nicknames.length; j++) {
                var divNicknames = document.createElement('div');
                $(divNicknames).html(Nicknames[j].firstChild.nodeValue);
                userBodyCell_Nicknames.appendChild(divNicknames);
            }
            userBodyRow.appendChild(userBodyCell_Nicknames);

            if (Connections.length > 2) {
                var buttonExpandCollapseConnections = document.createElement('button');
                $(buttonExpandCollapseConnections).prop('id', 'connectionsButton_' + ID);
                $(buttonExpandCollapseConnections).html('+ ' + (Connections.length - 2));

                (function(ID) {
                    buttonExpandCollapseConnections.onclick = function() {
                        expandcollapseList('connections', ID);
                    };
                })(ID);

                userBodyCell_Connections.appendChild(buttonExpandCollapseConnections);
            }

            var divLastConnection = document.createElement('div');
            $(divLastConnection).prop('id', 'connections_' + ID + '_0');
            $(divLastConnection).html(moment(Connections[0].firstChild.nodeValue + '+0000').format('YYYY-MM-DD HH:mm:ss'));
            userBodyCell_Connections.appendChild(divLastConnection);

            if (Connections.length > 1) {
                var divFirstConnection = document.createElement('div');
                $(divFirstConnection).prop('id', 'connections_' + ID + '_' + (Connections.length - 1));
                $(divFirstConnection).html(moment(Connections[Connections.length - 1].firstChild.nodeValue + '+0000').format('YYYY-MM-DD HH:mm:ss'));
                userBodyCell_Connections.appendChild(divFirstConnection);
            }

            userBodyRow.appendChild(userBodyCell_Connections);

            if (IPs.length > 1) {
                var buttonExpandCollapseIPs = document.createElement('button');
                $(buttonExpandCollapseIPs).prop('id', 'ipsButton_' + ID);
                $(buttonExpandCollapseIPs).html('+ ' + (IPs.length - 1));

                (function(ID) {
                    buttonExpandCollapseIPs.onclick = function() {
                        expandcollapseList('ips', ID);
                    };
                })(ID);

                userBodyCell_IPs.appendChild(buttonExpandCollapseIPs);
            }

            var divLastIP = document.createElement('div');
            $(divLastIP).prop('id', 'ips_' + ID + '_0');
            $(divLastIP).html(IPs[0].firstChild.nodeValue);
            userBodyCell_IPs.appendChild(divLastIP);

            userBodyRow.appendChild(userBodyCell_IPs);

            $(userBodyCell_ConnectionCount).html(Connection_Count);
            userBodyRow.appendChild(userBodyCell_ConnectionCount);

            if (Connected == 1) {
                $(userBodyCell_Connected).html('true');
                ConnectedClientsCount++;
            } else {
                $(userBodyCell_Connected).html('false');
            }
            userBodyRow.appendChild(userBodyCell_Connected);

            $(userBodyCell_Deleted).html(Deleted);
            userBodyRow.appendChild(userBodyCell_Deleted);

            userBody.appendChild(userBodyRow);
        }
    }
    userTable.appendChild(userBody);

    $(userTable).prop('id', 'clientTable');
    $(userTable).prop('class', 'tablesorter');
    document.getElementById('ts3-clientTable').appendChild(userTable);

    if (document.getElementById('scrollToClientTable') === null) {
        var scrollToClientTable = document.createElement('button');
        $(scrollToClientTable).prop('id', 'scrollToClientTable');
        $(scrollToClientTable).html('Client table');
        scrollToClientTable.onclick = function() {
            scrollToDiv('clientTable');
        };
        document.getElementById('navbar').appendChild(scrollToClientTable);
    }

    addConnectionsParser();
    addIPsParser();
    $('#clientTable')
        .tablesorter({
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
}

// Builds the ban table.
function buildBanTable() {
    var UID;
    if (document.getElementById('banTable') !== null) {
        UID = document.getElementById('banTable').getAttribute('uid');
        $('#ts3-banTable').empty();
    } else {
        UID = false;
    }

    var Ban = XML.getElementsByTagName('Ban');

    var banTable = document.createElement('table');
    var banHead = document.createElement('thead');
    var banHeadRow = document.createElement('tr');
    var banHeadCell_BanDateTime = document.createElement('th');
    var banHeadCell_BannedID = document.createElement('th');
    var banHeadCell_BannedNickname = document.createElement('th');
    var banHeadCell_BannedIP = document.createElement('th');
    var banHeadCell_BannedByNickname = document.createElement('th');
    var banHeadCell_BannedByID = document.createElement('th');
    var banHeadCell_BanReason = document.createElement('th');
    var banHeadCell_Bantime = document.createElement('th');

    $(banHeadCell_BanDateTime).html('Date and Time');
    $(banHeadCell_BannedID).html('Banned ID');
    $(banHeadCell_BannedNickname).html('Banned Nickname');
    $(banHeadCell_BannedIP).html('Banned IP');
    $(banHeadCell_BannedByNickname).html('Banned by Nickname');
    $(banHeadCell_BannedByID).html('Banned by ID');
    $(banHeadCell_BanReason).html('Reason');
    $(banHeadCell_Bantime).html('Bantime');

    banHeadRow.appendChild(banHeadCell_BanDateTime);
    banHeadRow.appendChild(banHeadCell_BannedID);
    banHeadRow.appendChild(banHeadCell_BannedNickname);
    banHeadRow.appendChild(banHeadCell_BannedIP);
    banHeadRow.appendChild(banHeadCell_BannedByNickname);
    banHeadRow.appendChild(banHeadCell_BannedByID);
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
        var BannedByNickname = Ban[i].getElementsByTagName('BannedByNickname')[0].firstChild.nodeValue;
        var BannedByID;
        if (BannedIP != 'Unknown') {
            BannedByID = Ban[i].getElementsByTagName('BannedByID')[0].firstChild.nodeValue;
        } else {
            BannedByID = 'Unknown';
        }
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
        var banBodyCell_BannedByNickname = document.createElement('td');
        var banBodyCell_BannedByID = document.createElement('td');
        var banBodyCell_BanReason = document.createElement('td');
        var banBodyCell_Bantime = document.createElement('td');

        var UTCBanDateTime = moment(BanDateTime + '+0000');
        $(banBodyCell_BanDateTime).html(UTCBanDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + moment(UTCBanDateTime).fromNow() + ')');
        banBodyRow.appendChild(banBodyCell_BanDateTime);

        $(banBodyCell_BannedID).html(BannedID);
        banBodyRow.appendChild(banBodyCell_BannedID);

        $(banBodyCell_BannedNickname).html(BannedNickname);
        banBodyRow.appendChild(banBodyCell_BannedNickname);

        $(banBodyCell_BannedIP).html(BannedIP);
        banBodyRow.appendChild(banBodyCell_BannedIP);

        $(banBodyCell_BannedByNickname).html(BannedByNickname);
        banBodyRow.appendChild(banBodyCell_BannedByNickname);

        $(banBodyCell_BannedByID).html(BannedByID);
        banBodyRow.appendChild(banBodyCell_BannedByID);

        $(banBodyCell_BanReason).html(BanReason);
        banBodyRow.appendChild(banBodyCell_BanReason);

        $(banBodyCell_Bantime).html(Bantime);
        banBodyRow.appendChild(banBodyCell_Bantime);

        banBody.appendChild(banBodyRow);
    }
    banTable.appendChild(banBody);

    $(banTable).prop('id', 'banTable');
    $(banTable).prop('class', 'tablesorter');
    $(banTable).attr('uid', false);
    document.getElementById('ts3-banTable').appendChild(banTable);

    if (document.getElementById('scrollToBanTable') === null) {
        var scrollToBanTable = document.createElement('button');
        $(scrollToBanTable).prop('id', 'scrollToBanTable');
        $(scrollToBanTable).html('Ban table');
        scrollToBanTable.onclick = function() {
            scrollToDiv('banTable');
        };
        document.getElementById('navbar').appendChild(scrollToBanTable);
    }

    if (UID == 'true') {
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
    $(kickHeadCell_KickedID).html('Kicked User ID');
    $(kickHeadCell_KickedNickname).html('Kicked User Nickname');
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

        var UTCKickDateTime = moment(KickDateTime + '+0000');
        $(kickBodyCell_DateTime).html(UTCKickDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + moment(UTCKickDateTime).fromNow() + ')');
        kickBodyRow.appendChild(kickBodyCell_DateTime);

        $(kickBodyCell_KickedID).html(KickedID);
        kickBodyRow.appendChild(kickBodyCell_KickedID);

        $(kickBodyCell_KickedNickname).html(KickedNickname);
        kickBodyRow.appendChild(kickBodyCell_KickedNickname);

        $(kickBodyCell_KickedByNickname).html(KickedByNickname);
        kickBodyRow.appendChild(kickBodyCell_KickedByNickname);

        $(kickBodyCell_KickedByUID).html(KickedByUID);
        kickBodyRow.appendChild(kickBodyCell_KickedByUID);

        $(kickBodyCell_KickReason).html(KickReason);
        kickBodyRow.appendChild(kickBodyCell_KickReason);

        kickBody.appendChild(kickBodyRow);
    }
    kickTable.appendChild(kickBody);

    $(kickTable).prop('id', 'kickTable');
    $(kickTable).prop('class', 'tablesorter');
    document.getElementById('ts3-kickTable').appendChild(kickTable);

    if (document.getElementById('scrollToKickTable') === null) {
        var scrollToKickTable = document.createElement('button');
        $(scrollToKickTable).prop('id', 'scrollToKickTable');
        $(scrollToKickTable).html('Kick table');
        scrollToKickTable.onclick = function() {
            scrollToDiv('kickTable');
        };
        document.getElementById('navbar').appendChild(scrollToKickTable);
    }

    addIgnoreMomentParser();
    $('#kickTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#kickTable').trigger('applyWidgetId', ['stickyHeaders']);
}

// Builds the complaint table.
function buildComplaintTable() {
    $('#ts3-complaintTable').empty();
    var Complaint = XML.getElementsByTagName('Complaint');

    var complaintTable = document.createElement('table');
    var complaintHead = document.createElement('thead');
    var complaintHeadRow = document.createElement('tr');
    var complaintHeadCell_ComplaintDateTime = document.createElement('th');
    var complaintHeadCell_ComplaintAboutNickname = document.createElement('th');
    var complaintHeadCell_ComplaintAboutID = document.createElement('th');
    var complaintHeadCell_ComplaintReason = document.createElement('th');
    var complaintHeadCell_ComplaintByNickname = document.createElement('th');
    var complaintHeadCell_ComplaintByID = document.createElement('th');

    $(complaintHeadCell_ComplaintDateTime).html('Date and Time');
    $(complaintHeadCell_ComplaintAboutNickname).html('About Nickname');
    $(complaintHeadCell_ComplaintAboutID).html('About ID');
    $(complaintHeadCell_ComplaintReason).html('Reason');
    $(complaintHeadCell_ComplaintByNickname).html('By Nickname');
    $(complaintHeadCell_ComplaintByID).html('By ID');

    complaintHeadRow.appendChild(complaintHeadCell_ComplaintDateTime);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintAboutNickname);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintAboutID);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintReason);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintByNickname);
    complaintHeadRow.appendChild(complaintHeadCell_ComplaintByID);

    complaintHead.appendChild(complaintHeadRow);
    complaintTable.appendChild(complaintHead);

    var complaintBody = document.createElement('tbody');

    for (var i = 0; i < Complaint.length; i++) {
        var ComplaintDateTime = Complaint[i].getElementsByTagName('ComplaintDateTime')[0].firstChild.nodeValue;
        var ComplaintAboutNickname = Complaint[i].getElementsByTagName('ComplaintAboutNickname')[0].firstChild.nodeValue;
        var ComplaintAboutID = Complaint[i].getElementsByTagName('ComplaintAboutID')[0].firstChild.nodeValue;
        var ComplaintReason = Complaint[i].getElementsByTagName('ComplaintReason')[0].firstChild.nodeValue;
        var ComplaintByNickname = Complaint[i].getElementsByTagName('ComplaintByNickname')[0].firstChild.nodeValue;
        var ComplaintByID = Complaint[i].getElementsByTagName('ComplaintByID')[0].firstChild.nodeValue;

        var complaintBodyRow = document.createElement('tr');
        var complaintBodyCell_ComplaintDateTime = document.createElement('td');
        var complaintBodyCell_ComplaintAboutNickname = document.createElement('td');
        var complaintBodyCell_ComplaintAboutID = document.createElement('td');
        var complaintBodyCell_ComplaintReason = document.createElement('td');
        var complaintBodyCell_ComplaintByNickname = document.createElement('td');
        var complaintBodyCell_ComplaintByID = document.createElement('td');

        var UTCComplaintDateTime = moment(ComplaintDateTime + '+0000');
        $(complaintBodyCell_ComplaintDateTime).html(UTCComplaintDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + moment(UTCComplaintDateTime).fromNow() + ')');
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintDateTime);

        $(complaintBodyCell_ComplaintAboutNickname).html(ComplaintAboutNickname);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintAboutNickname);

        $(complaintBodyCell_ComplaintAboutID).html(ComplaintAboutID);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintAboutID);

        $(complaintBodyCell_ComplaintReason).html(ComplaintReason);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintReason);

        $(complaintBodyCell_ComplaintByNickname).html(ComplaintByNickname);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintByNickname);

        $(complaintBodyCell_ComplaintByID).html(ComplaintByID);
        complaintBodyRow.appendChild(complaintBodyCell_ComplaintByID);

        complaintBody.appendChild(complaintBodyRow);
    }
    complaintTable.appendChild(complaintBody);

    $(complaintTable).prop('id', 'complaintTable');
    $(complaintTable).prop('class', 'tablesorter');
    document.getElementById('ts3-complaintTable').appendChild(complaintTable);

    if (document.getElementById('scrollToComplaintTable') === null) {
        var scrollToComplaintTable = document.createElement('button');
        $(scrollToComplaintTable).prop('id', 'scrollToComplaintTable');
        $(scrollToComplaintTable).html('Complaint table');
        scrollToComplaintTable.onclick = function() {
            scrollToDiv('complaintTable');
        };
        document.getElementById('navbar').appendChild(scrollToComplaintTable);
    }

    addIgnoreMomentParser();
    $('#complaintTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#complaintTable').trigger('applyWidgetId', ['stickyHeaders']);
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
    var uploadHeadCell_uploadedByNickname = document.createElement('th');
    var uploadHeadCell_uploadedByID = document.createElement('th');

    $(uploadHeadCell_UploadDateTime).html('Date and Time');
    $(uploadHeadCell_ChannelID).html('Channel ID');
    $(uploadHeadCell_Filename).html('Filename');
    $(uploadHeadCell_uploadedByNickname).html('Uploaded by Nickname');
    $(uploadHeadCell_uploadedByID).html('Uploaded by ID');

    uploadHeadRow.appendChild(uploadHeadCell_UploadDateTime);
    uploadHeadRow.appendChild(uploadHeadCell_ChannelID);
    uploadHeadRow.appendChild(uploadHeadCell_Filename);
    uploadHeadRow.appendChild(uploadHeadCell_uploadedByNickname);
    uploadHeadRow.appendChild(uploadHeadCell_uploadedByID);

    uploadHead.appendChild(uploadHeadRow);
    uploadTable.appendChild(uploadHead);

    var uploadBody = document.createElement('tbody');

    for (var i = 0; i < File.length; i++) {
        var UploadDateTime = File[i].getElementsByTagName('UploadDateTime')[0].firstChild.nodeValue;
        var ChannelID = File[i].getElementsByTagName('ChannelID')[0].firstChild.nodeValue;
        var Filename = File[i].getElementsByTagName('Filename')[0].firstChild.nodeValue;
        var UploadedByNickname = File[i].getElementsByTagName('UploadedByNickname')[0].firstChild.nodeValue;
        var UploadedByID = File[i].getElementsByTagName('UploadedByID')[0].firstChild.nodeValue;

        var uploadBodyRow = document.createElement('tr');
        var uploadBodyCell_UploadDateTime = document.createElement('td');
        var uploadBodyCell_ChannelID = document.createElement('td');
        var uploadBodyCell_Filename = document.createElement('td');
        var uploadBodyCell_uploadedByNickname = document.createElement('td');
        var uploadBodyCell_uploadedByID = document.createElement('td');

        var UTCUploadDateTime = moment(UploadDateTime + '+0000');
        $(uploadBodyCell_UploadDateTime).html(UTCUploadDateTime.format('YYYY-MM-DD HH:mm:ss') + '<br />(about ' + UTCUploadDateTime.fromNow() + ')');
        uploadBodyRow.appendChild(uploadBodyCell_UploadDateTime);

        $(uploadBodyCell_ChannelID).html(ChannelID);
        uploadBodyRow.appendChild(uploadBodyCell_ChannelID);

        $(uploadBodyCell_Filename).html(Filename);
        uploadBodyRow.appendChild(uploadBodyCell_Filename);

        $(uploadBodyCell_uploadedByNickname).html(UploadedByNickname);
        uploadBodyRow.appendChild(uploadBodyCell_uploadedByNickname);

        $(uploadBodyCell_uploadedByID).html(UploadedByID);
        uploadBodyRow.appendChild(uploadBodyCell_uploadedByID);

        uploadBody.appendChild(uploadBodyRow);
    }
    uploadTable.appendChild(uploadBody);

    $(uploadTable).prop('id', 'uploadTable');
    $(uploadTable).prop('class', 'tablesorter');
    document.getElementById('ts3-uploadTable').appendChild(uploadTable);

    if (document.getElementById('scrollToUploadTable') === null) {
        var scrollToUploadTable = document.createElement('button');
        $(scrollToUploadTable).prop('id', 'scrollToUploadTable');
        $(scrollToUploadTable).html('Upload table');
        scrollToUploadTable.onclick = function() {
            scrollToDiv('uploadTable');
        };
        document.getElementById('navbar').appendChild(scrollToUploadTable);
    }

    addIgnoreMomentParser();
    $('#uploadTable').tablesorter({
        headers: {
            0: {
                sorter: 'ignoreMoment'
            }
        }
    });
    $('#uploadTable').trigger('applyWidgetId', ['stickyHeaders']);
}

// Builds the tables using the XML.
function buildTables() {
    nanobar.go(60);
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

            if ($('#ts3-clientTable').length) {
                $('#clientTableControlSection').show();
                buildClientTable();
            }
            if ($('#ts3-banTable').length) {
                buildBanTable();
            }
            if ($('#ts3-kickTable').length) {
                buildKickTable();
            }
            if ($('#ts3-complaintTable').length) {
                buildComplaintTable();
            }
            if ($('#ts3-uploadTable').length) {
                buildUploadTable();
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

            if (!$('#ts3-clientTable').length) {
                for (var i = 0; i < XML.getElementsByTagName('User').length; i++) {
                    if (XML.getElementsByTagName('User')[i].getElementsByTagName('ID')[0].firstChild.nodeValue == i) {
                        if (XML.getElementsByTagName('User')[i].getElementsByTagName('Connected')[0].firstChild.nodeValue == 1) {
                            ConnectedClientsCount++;
                        }
                    }
                }
            }
            $('#connectedClientsCount').html(ConnectedClientsCount);

            if (Attributes.getElementsByTagName('SKIPLOCKFILE')[0].firstChild.nodeValue == 'true') {
                alert('Alert: The debug variable SKIPLOCKFILE was set to true on the last XML creation. Please recompile the program with this variable set to false and rebuild the XML afterwards to prevent this alert to show up again.');
            }

            nanobar.go(100);
            document.getElementById('rebuildXMLButton').disabled = false;
            document.getElementById('buildNewXMLButton').disabled = false;
        }
    });
}

// Builds the control section.
function buildControlSection() {
    var controlSection = document.createElement('div');
    var rebuildSection = document.createElement('div');
    var rebuildXMLButton = document.createElement('button');
    var buildNewXMLButton = document.createElement('button');

    $(controlSection).prop('id', 'controlSection');
    $(rebuildSection).prop('id', 'rebuildSection');
    $(rebuildXMLButton).prop('id', 'rebuildXMLButton');
    $(buildNewXMLButton).prop('id', 'buildNewXMLButton');
    $(rebuildXMLButton).prop('disabled', 'true');
    $(buildNewXMLButton).prop('disabled', 'true');
    $(rebuildXMLButton).html('Rebuild XML and reload tables');
    $(buildNewXMLButton).html('Delete XML and generate a new one');

    rebuildXMLButton.onclick = function() {
        rebuildXML();
    };
    buildNewXMLButton.onclick = function() {
        buildNewXML();
    };

    rebuildSection.appendChild(rebuildXMLButton);
    rebuildSection.appendChild(buildNewXMLButton);

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
    var ctTDescription = document.createElement('div');

    $(creationTimestampSection).prop('id', 'creationTimestampSection');
    $(creationTimestampTable).prop('id', 'creationTimestampTable');
    $(ctT_localtime).prop('id', 'creationTimestamp_localtime');
    $(ctT_utc).prop('id', 'creationTimestamp_utc');
    $(ctT_moment).prop('id', 'creationTimestamp_moment');
    $(creationTimestampSection).html('Creation DateTime of the current XML:');
    $(ctTHead_localtime).html('Server localtime');
    $(ctTHead_utc).html('UTC');
    $(ctTHead_moment).html('moment.js');
    $(ctT_localtime).html('Analyzing...');
    $(ctT_utc).html('Analyzing...');
    $(ctT_moment).html('Analyzing...');
    $(ctTDescription).html('The DateTimes in the tables are displayed in your current timezone.');

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
    creationTimestampSection.appendChild(ctTDescription);

    var clientTableControlSection = document.createElement('div');
    var scrollToClientTableRowSection = document.createElement('div');
    var scrollToCTRInput = document.createElement('input');
    var scrollToCTRButton = document.createElement('button');

    $(clientTableControlSection).prop('id', 'clientTableControlSection');
    $(clientTableControlSection).hide();
    $(scrollToClientTableRowSection).prop('id', 'scrollToClientTableRowSection');
    $(scrollToCTRInput).prop('id', 'IDSelection');
    $(scrollToCTRInput).prop('type', 'number');
    $(scrollToCTRInput).prop('min', '0');
    $(scrollToCTRInput).prop('placeholder', 'Enter an ID');
    $(scrollToCTRButton).html('Scroll to ID in the client list');

    scrollToCTRButton.onclick = function() {
        scrollToClientTableRow(document.getElementById('IDSelection').value);
    };

    scrollToClientTableRowSection.appendChild(scrollToCTRInput);
    scrollToClientTableRowSection.appendChild(scrollToCTRButton);
    clientTableControlSection.appendChild(scrollToClientTableRowSection);

    var collapseAllSection = document.createElement('div');
    var collapseAllButton = document.createElement('button');

    $(collapseAllSection).prop('id', 'collapseAllSection');
    $(collapseAllButton).html('Collapse all expanded lists');

    collapseAllButton.onclick = function() {
        collapseAll();
    };

    collapseAllSection.appendChild(collapseAllButton);
    clientTableControlSection.appendChild(collapseAllSection);

    var sortConnectionsSwitch = document.createElement('div');
    var sortConnectionsSwitchInput = document.createElement('input');
    var sortConnectionsSwitchLabel = document.createElement('label');
    var sortConnectionsSwitchSpanInner = document.createElement('span');
    var sortConnectionsSwitchSpanSwitch = document.createElement('span');

    $(sortConnectionsSwitch).prop('class', 'sortConnectionsSwitch');
    $(sortConnectionsSwitchInput).prop('type', 'checkbox');
    $(sortConnectionsSwitchInput).prop('class', 'sortConnectionsSwitch-checkbox');
    $(sortConnectionsSwitchInput).prop('id', 'sortConnectionsSwitch');
    $(sortConnectionsSwitchInput).prop('checked', true);
    $(sortConnectionsSwitchLabel).prop('class', 'sortConnectionsSwitch-label');
    $(sortConnectionsSwitchLabel).prop('for', 'sortConnectionsSwitch');
    $(sortConnectionsSwitchSpanInner).prop('class', 'sortConnectionsSwitch-inner');
    $(sortConnectionsSwitchSpanSwitch).prop('class', 'sortConnectionsSwitch-switch');

    sortConnectionsSwitchInput.onclick = function() {
        ConnectionsSortType = this.checked;
        saveSortOrder();
        $('#clientTable').trigger('updateCache');
        applySortOrder();
    };

    sortConnectionsSwitch.appendChild(sortConnectionsSwitchInput);
    sortConnectionsSwitchLabel.appendChild(sortConnectionsSwitchSpanInner);
    sortConnectionsSwitchLabel.appendChild(sortConnectionsSwitchSpanSwitch);
    sortConnectionsSwitch.appendChild(sortConnectionsSwitchLabel);
    clientTableControlSection.appendChild(sortConnectionsSwitch);

    var connectedClientsCountSection = document.createElement('div');
    var connectedClientsCount = document.createElement('div');
    $(connectedClientsCountSection).prop('id', 'connectedClientsCountSection');
    $(connectedClientsCount).prop('id', 'connectedClientsCount');
    $(connectedClientsCountSection).html('Connected clients: ');
    $(connectedClientsCount).html('Analyzing data...');

    connectedClientsCountSection.appendChild(connectedClientsCount);

    var navbar = document.createElement('div');
    var scrollBackToTopButton = document.createElement('button');
    var scrollToControlSectionButton = document.createElement('button');

    $(navbar).prop('id', 'navbar');
    $(scrollBackToTopButton).html('Back to top');
    $(scrollToControlSectionButton).html('Control section');

    scrollBackToTopButton.onclick = function() {
        scrollTo(0, 0);
    };
    scrollToControlSectionButton.onclick = function() {
        scrollToDiv('controlSection');
    };

    navbar.appendChild(scrollBackToTopButton);
    navbar.appendChild(scrollToControlSectionButton);

    var switchBetweenIDandUIDSection = document.createElement('div');
    var switchBetweenIDandUIDButton = document.createElement('button');

    $(switchBetweenIDandUIDSection).prop('id', 'switchBetweenIDandUIDSection');
    $(switchBetweenIDandUIDButton).html('Switch between IDs and UIDs in the ban table');

    switchBetweenIDandUIDButton.onclick = function() {
        switchBetweenIDAndUID();
    };

    switchBetweenIDandUIDSection.appendChild(switchBetweenIDandUIDButton);

    controlSection.appendChild(creationTimestampSection);
    controlSection.appendChild(rebuildSection);
    controlSection.appendChild(clientTableControlSection);
    controlSection.appendChild(connectedClientsCountSection);
    controlSection.appendChild(switchBetweenIDandUIDSection);
    controlSection.appendChild(navbar);
    document.getElementById('ts3-control').appendChild(controlSection);
}

$(document).ready(function() {
    if ($('#ts3-control').length) {
        nanobar = new Nanobar({
            bg: 'white',
            id: 'nanobar'
        });

        buildControlSection();
        nanobar.go(25);
        buildTables();
    } else {
        alert('Please include the control section by adding a div with the id "ts3-control" to your html.');
    }
});
