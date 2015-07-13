// TS3_EnhancedClientList.js
// Author: Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

// Global Variables
var ConnectedClientsCount, momentInterval;

// Including the Open Sans font.
WebFontConfig = {
    google: { families: [ 'Open+Sans::latin' ] }
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

// Including the style.css.
$('head').append('<link rel="stylesheet" href="./style/style.css" type="text/css" />');

// Including javascripts via jquery.
$.getScript("jquery.tablesorter.min.js", function(){});
$.getScript("jquery.tablesorter.widgets.js", function(){});
$.getScript("moment.min.js", function(){});

// Rebuilds the XML and calls buildTable() when the XML creation has finished.
function rebuildXML() {
    if (document.getElementById("rebuildxmlbutton") !== null) {
        $(window.loadingSpinner).show();
        document.getElementById("rebuildxmlbutton").disabled = true;
        document.getElementById("buildnewxmlbutton").disabled = true;
    }
    $.get("rebuildXML.php", function () { buildTables(); });
    return false;
}

// Deletes the current XML and builds a new one after.
function buildNewXML() {
    $.get("deleteXML.php", function () { rebuildXML(); });
    return false;
}

// Expands or collapses the List, depending on its current state.
function expandcollapseList(List, ID){
    var Row, ListUpper;
    if (List == "ips") {
        Row = 3;
        ListUpper = "IPs";
    }
    else {
        Row = 2;
        ListUpper = "Connections";
    }

    var currentDiv = List + "_" + ID + "_2";
    if(document.getElementById(currentDiv).firstChild === null || document.getElementById(currentDiv).firstChild.nodeValue === ""){
        expandList(List, ID);
    }
    else{
        collapseList(List, ID);
    }
}

// Expands the current list.
function expandList(List, ID) {
    var Row, ListUpper;
    if (List == "ips") {
        Row = 3;
        ListUpper = "IPs";
    }
    else {
        Row = 2;
        ListUpper = "Connections";
    }

    var x = document.getElementById(ID).childNodes[Row];
    var ListContent = xmlhttp.responseXML.documentElement.getElementsByTagName("User")[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper);
    for (var j = 0; j < x.childNodes.length - 1; j++) {
        var currentDiv = List + "_" + ID + "_" + j;
        if (document.getElementById(currentDiv) !== null && document.getElementById(currentDiv).firstChild !== null) {
            document.getElementById(currentDiv).firstChild.nodeValue = ListContent[j].firstChild.nodeValue;
        }
        else {
            var newChild = document.createTextNode(ListContent[j].firstChild.nodeValue);
            document.getElementById(currentDiv).appendChild(newChild);
        }
    }
}

// Collapses the current list.
function collapseList(List, ID) {
    var Row, ListUpper;
    if (List == "ips") {
        Row = 3;
        ListUpper = "IPs";
    }
    else {
        Row = 2;
        ListUpper = "Connections";
    }

    if (document.getElementById(ID) !== null) {
        var x = document.getElementById(ID).childNodes[Row];
        var ListContent = xmlhttp.responseXML.documentElement.getElementsByTagName("User")[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper);
        var currentDiv = List + "_" + ID + "_1";
        document.getElementById(currentDiv).firstChild.nodeValue = ListContent[ListContent.length - 1].firstChild.nodeValue;
        for (var j = 2; j < x.childNodes.length - 1; j++) {
            currentDiv = List + "_" + ID + "_" + j;
            document.getElementById(currentDiv).firstChild.nodeValue = "";
        }
    }
}

//
function addIgnoreMomentParser(){
    $.tablesorter.addParser({
        id: 'ignoreMoment',
        is: function(s, table, cell, $cell) {
            return false;
        },
        format: function(s, table, cell, cellIndex) {
            var $cell = $(cell);

            if (cellIndex === 0) return s;
        },
        parsed: false,
        type: 'text'
    });
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
        $sticky = $("#clientTable")[0].config.widgetOptions.$sticky;
        sHeight = $sticky.height() || 0;
        window.scrollBy(0, -sHeight);
    }
}

// Builds and shows the client table.
function buildClientTable() {
    $('#showclienttable').empty();
    var User = xmlhttp.responseXML.documentElement.getElementsByTagName("User");

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

    $(userHeadCell_ID).html("ID");
    $(userHeadCell_Nicknames).html("Nicknames");
    $(userHeadCell_Connections).html("Connections");
    $(userHeadCell_IPs).html("IPs");
    $(userHeadCell_ConnectionCount).html("Connection Count");
    $(userHeadCell_Connected).html("Connected");
    $(userHeadCell_Deleted).html("Deleted");

    userHeadRow.appendChild(userHeadCell_ID);
    userHeadRow.appendChild(userHeadCell_Nicknames);
    userHeadRow.appendChild(userHeadCell_Connections);
    userHeadRow.appendChild(userHeadCell_IPs);
    userHeadRow.appendChild(userHeadCell_ConnectionCount);
    userHeadRow.appendChild(userHeadCell_Connected);
    userHeadRow.appendChild(userHeadCell_Deleted);

    $(userHeadRow).prop('class', 'tablesorter-stickyHeader');
    userHead.appendChild(userHeadRow);
    userTable.appendChild(userHead);

    var userBody = document.createElement('tbody');

    for (var i = 0; i < User.length; i++) {

        var ID = User[i].getElementsByTagName("ID")[0].firstChild.nodeValue;
        if (ID == i) {
            var Nicknames = User[ID].getElementsByTagName("Nicknames")[0].getElementsByTagName("Nicknames");
            var Connections = User[ID].getElementsByTagName("Connections")[0].getElementsByTagName("Connections");
            var IPs = User[ID].getElementsByTagName("IPs")[0].getElementsByTagName("IPs");
            var Connection_Count = User[ID].getElementsByTagName("Connection_Count")[0].firstChild.nodeValue;
            var Connected = User[ID].getElementsByTagName("Connected")[0].firstChild.nodeValue;
            var Deleted = User[ID].getElementsByTagName("Deleted")[0].firstChild.nodeValue;

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
                $(buttonExpandCollapseConnections).html('+ / -');

                (function (ID) {
                    buttonExpandCollapseConnections.onclick = function () {
                        expandcollapseList('connections', ID);
                    };
                })(ID);

                userBodyCell_Connections.appendChild(buttonExpandCollapseConnections);
            } 
			
            var divConnections = document.createElement('div');
            $(divConnections).html(Connections[0].firstChild.nodeValue);
            $(divConnections).prop('id', 'connections_' + ID + '_0');
            userBodyCell_Connections.appendChild(divConnections);
            if (Connections.length > 1) {
                divConnections = document.createElement('div');
                $(divConnections).html(Connections[Connections.length - 1].firstChild.nodeValue);
                $(divConnections).prop('id', 'connections_' + ID + '_1');
                userBodyCell_Connections.appendChild(divConnections);
            }
            if (Connections.length > 2) {
                for (j = 2; j < Connections.length; j++) {
                    divConnections = document.createElement('div');
                    $(divConnections).prop('id', 'connections_' + ID + '_' + j);
                    userBodyCell_Connections.appendChild(divConnections);
                }
            }
            userBodyRow.appendChild(userBodyCell_Connections);

            if (IPs.length > 2) {
                var divExpandCollapseIPs = document.createElement('div');
                $(divExpandCollapseIPs).prop('id','divExpandCollapseIPs');

                var buttonExpandCollapseIPs = document.createElement('button');
                $(buttonExpandCollapseIPs).html('+ / -');
                $(buttonExpandCollapseIPs).prop('text-align','center');

                (function (ID) {
                    buttonExpandCollapseIPs.onclick = function () {
                        expandcollapseList('ips', ID);
                    };
                })(ID);

                divExpandCollapseIPs.appendChild(buttonExpandCollapseIPs);
                userBodyCell_IPs.appendChild(divExpandCollapseIPs);
            }
            var divIPs = document.createElement('div');
            $(divIPs).html(IPs[0].firstChild.nodeValue);
            $(divIPs).prop('id', 'ips_' + ID + '_0');
            userBodyCell_IPs.appendChild(divIPs);
            if (IPs.length > 1) {
                divIPs = document.createElement('div');
                $(divIPs).html(IPs[IPs.length - 1].firstChild.nodeValue);
                $(divIPs).prop('id', 'ips_' + ID + '_1');
                userBodyCell_IPs.appendChild(divIPs);
            }
            if (IPs.length > 2) {
                for (j = 2; j < IPs.length; j++) {
                    divIPs = document.createElement('div');
                    $(divIPs).prop('id', 'ips_' + ID + '_' + j);
                    userBodyCell_IPs.appendChild(divIPs);
                }
            }

            userBodyRow.appendChild(userBodyCell_IPs);

            $(userBodyCell_ConnectionCount).html(Connection_Count);
            userBodyRow.appendChild(userBodyCell_ConnectionCount);

            if (Connected == 1) {
                $(userBodyCell_Connected).html("true");
                ConnectedClientsCount++;
            }
            else $(userBodyCell_Connected).html("false");
            userBodyRow.appendChild(userBodyCell_Connected);

            $(userBodyCell_Deleted).html(Deleted);
            userBodyRow.appendChild(userBodyCell_Deleted);

            userBody.appendChild(userBodyRow);
        }
    }

    userTable.appendChild(userBody);

    $(userTable).prop('id', 'clientTable');
    $(userTable).prop('class', 'tablesorter');
    $('#showclienttable').append(userTable);

    if (document.getElementById("scrolltoclienttable") === null) {
        scrolltoclienttable = document.createElement('button');
        $(scrolltoclienttable).prop('id', 'scrolltoclienttable');
        $(scrolltoclienttable).html('Scroll to client table');
        scrolltoclienttable.onclick = function () { scrollToDiv('showclienttable'); };
        document.getElementById('navbar').appendChild(scrolltoclienttable);
    }
	
    $("#clientTable").tablesorter({
        widgets: ['stickyHeaders'],
        sortList: [[0,2]]
    });
}

// Builds and shows the kick table.
function buildKickTable() {
    $('#showkicktable').empty();
    var Kick = xmlhttp.responseXML.documentElement.getElementsByTagName("Kick");

    var kickTable = document.createElement('table');
    var kickHead = document.createElement('thead');
    var kickHeadRow = document.createElement('tr');
    var kickHeadCell_DateTime = document.createElement('th');
    var kickHeadCell_KickedID = document.createElement('th');
    var kickHeadCell_KickedNickname = document.createElement('th');
    var kickHeadCell_KickedByNickname = document.createElement('th');
    var kickHeadCell_KickedByUID = document.createElement('th');
    var kickHeadCell_KickReason = document.createElement('th');

    $(kickHeadCell_DateTime).html("Date and Time");
    $(kickHeadCell_KickedID).html("Kicked User (ID)");
    $(kickHeadCell_KickedNickname).html("Kicked User (Nickname)");
    $(kickHeadCell_KickedByNickname).html("Kicked by (Nickname)");
    $(kickHeadCell_KickedByUID).html("Kicked by (UID)");
    $(kickHeadCell_KickReason).html("Reason");

    kickHeadRow.appendChild(kickHeadCell_DateTime);
    kickHeadRow.appendChild(kickHeadCell_KickedID);
    kickHeadRow.appendChild(kickHeadCell_KickedNickname);
    kickHeadRow.appendChild(kickHeadCell_KickedByNickname);
    kickHeadRow.appendChild(kickHeadCell_KickedByUID);
    kickHeadRow.appendChild(kickHeadCell_KickReason);

    kickHead.appendChild(kickHeadRow);
    kickTable.appendChild(kickHead);

    var kickBody = document.createElement('tbody');

    for (var i = 0; i < Kick.length; i++) {
        var KickDateTime = Kick[i].getElementsByTagName("KickDateTime")[0].firstChild.nodeValue;
        var KickedID = Kick[i].getElementsByTagName("KickedID")[0].firstChild.nodeValue;
        var KickedNickname = Kick[i].getElementsByTagName("KickedNickname")[0].firstChild.nodeValue;
        var KickedByNickname = Kick[i].getElementsByTagName("KickedByNickname")[0].firstChild.nodeValue;
        var KickedByUID = Kick[i].getElementsByTagName("KickedByUID")[0].firstChild.nodeValue;
        var KickReason;
        if (Kick[i].getElementsByTagName("KickReason")[0].firstChild !== null) {
            KickReason = Kick[i].getElementsByTagName("KickReason")[0].firstChild.nodeValue;
        }
        else KickReason = "No Reason given";

        var kickBodyRow = document.createElement('tr');
        var kickBodyCell_DateTime = document.createElement('td');
        var kickBodyCell_KickedID = document.createElement('td');
        var kickBodyCell_KickedNickname = document.createElement('td');
        var kickBodyCell_KickedByNickname = document.createElement('td');
        var kickBodyCell_KickedByUID = document.createElement('td');
        var kickBodyCell_KickReason = document.createElement('td');
		
        $(kickBodyCell_DateTime).html(KickDateTime + '<br />(about ' + moment(KickDateTime).fromNow() + ')');
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
    $('#showkicktable').append(kickTable);

    if (document.getElementById("scrolltokicktable") === null) {
        scrolltokicktable = document.createElement('button');
        $(scrolltokicktable).prop('id', 'scrolltokicktable');
        $(scrolltokicktable).html('Scroll to kick table');
        scrolltokicktable.onclick = function () { scrollToDiv('showkicktable'); };
        document.getElementById('navbar').appendChild(scrolltokicktable);
    }
	
    addIgnoreMomentParser();
    $("#kickTable").tablesorter({
        widgets: ['stickyHeaders'],
        sortList: [[0,1]],
        headers: {
            0 : { sorter: 'ignoreMoment' }
        }
    });
}

// Builds and shows the upload table.
function buildUploadTable() {
    $('#showuploadtable').empty();
    var File = xmlhttp.responseXML.documentElement.getElementsByTagName("File");

    var uploadTable = document.createElement('table');
    var uploadHead = document.createElement('thead');
    var uploadHeadRow = document.createElement('tr');
    var uploadHeadCell_UploadDateTime = document.createElement('th');
    var uploadHeadCell_ChannelID = document.createElement('th');
    var uploadHeadCell_Filename = document.createElement('th');
    var uploadHeadCell_uploadedByNickname = document.createElement('th');
    var uploadHeadCell_uploadedByID = document.createElement('th');

    $(uploadHeadCell_UploadDateTime).html("Upload DateTime");
    $(uploadHeadCell_ChannelID).html("Channel ID");
    $(uploadHeadCell_Filename).html("Filename");
    $(uploadHeadCell_uploadedByNickname).html("Uploaded By (Nickname)");
    $(uploadHeadCell_uploadedByID).html("Uploaded By (ID)");

    uploadHeadRow.appendChild(uploadHeadCell_UploadDateTime);
    uploadHeadRow.appendChild(uploadHeadCell_ChannelID);
    uploadHeadRow.appendChild(uploadHeadCell_Filename);
    uploadHeadRow.appendChild(uploadHeadCell_uploadedByNickname);
    uploadHeadRow.appendChild(uploadHeadCell_uploadedByID);

    uploadHead.appendChild(uploadHeadRow);
    uploadTable.appendChild(uploadHead);

    var uploadBody = document.createElement('tbody');

    for (var i = 0; i < File.length; i++) {
        var UploadDateTime = File[i].getElementsByTagName("UploadDateTime")[0].firstChild.nodeValue;
        var ChannelID = File[i].getElementsByTagName("ChannelID")[0].firstChild.nodeValue;
        var Filename = File[i].getElementsByTagName("Filename")[0].firstChild.nodeValue;
        var UploadedByNickname = File[i].getElementsByTagName("UploadedByNickname")[0].firstChild.nodeValue;
        var UploadedByID = File[i].getElementsByTagName("UploadedByID")[0].firstChild.nodeValue;

        var uploadBodyRow = document.createElement('tr');
        var uploadBodyCell_UploadDateTime = document.createElement('td');
        var uploadBodyCell_ChannelID = document.createElement('td');
        var uploadBodyCell_Filename = document.createElement('td');
        var uploadBodyCell_uploadedByNickname = document.createElement('td');
        var uploadBodyCell_uploadedByID = document.createElement('td');

        $(uploadBodyCell_UploadDateTime).html(UploadDateTime +  '<br />(about ' + moment(UploadDateTime).fromNow() + ')');
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
    $('#showuploadtable').append(uploadTable);

    if (document.getElementById("scrolltouploadtable") === null) {
        scrolltouploadtable = document.createElement('button');
        $(scrolltouploadtable).prop('id', 'scrolltouploadtable');
        $(scrolltouploadtable).html('Scroll to upload table');
        scrolltouploadtable.onclick = function () { scrollToDiv('showuploadtable'); };
        document.getElementById('navbar').appendChild(scrolltouploadtable);
    }
	
    addIgnoreMomentParser();
    $("#uploadTable").tablesorter({
        widgets: ['stickyHeaders'],
        sortList: [[0,1]],
        headers: {
            0 : { sorter: 'ignoreMoment' }
        }
	});
}

// Builds the table using the XML.
function buildTables() {
    var ActiveXObject;
    if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
    else { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            ConnectedClientsCount = 0;
            if (document.getElementById('showclienttable') !== null) { buildClientTable(); }
            if (document.getElementById('showkicktable') !== null) { buildKickTable(); }
            if (document.getElementById('showuploadtable') !== null) { buildUploadTable(); }

            var Attributes = xmlhttp.responseXML.documentElement.getElementsByTagName("Attributes")[0];
            document.getElementById('creationtimestamp_localtime').innerHTML = Attributes.getElementsByTagName("CreationTimestamp_Localtime")[0].firstChild.nodeValue + " (server local time)";
            document.getElementById('creationtimestamp_utc').innerHTML = Attributes.getElementsByTagName("CreationTimestamp_UTC")[0].firstChild.nodeValue + " (UTC)";
			
			clearInterval(momentInterval);
            momentInterval = setInterval(function(){
                document.getElementById('creationtimestamp_moment').innerHTML = "Which was about " + moment(Attributes.getElementsByTagName("CreationTimestamp_Localtime")[0].firstChild.nodeValue,"DD.MM.YYYY HH:mm:ss").fromNow() + ".";
            }, 1000);

            document.getElementById('connectedclientscount').innerHTML = "Current Connected Clients: " + ConnectedClientsCount;

            document.getElementById("rebuildxmlbutton").disabled = false;
            document.getElementById("buildnewxmlbutton").disabled = false;
            $(window.loadingSpinner).hide();
        }
    };
    xmlhttp.open("GET", "output.xml", true);
    xmlhttp.send();
}

var control = "<div class=loading_spinner></div><button id=rebuildxmlbutton onclick=rebuildXML() disabled=true>Rebuild XML and Reload Tables</button>";
control += "<button id=buildnewxmlbutton onclick=buildNewXML() disabled=true>Delete old output.xml and generate a new one only from the logs</button> (When switching to another logdirectory)";
control += "<br /><br />The XML file was created on:";
control += "<div id=creationtimestamp_localtime>Analyzing data ...  </div>";
control += "<div id=creationtimestamp_utc>Analyzing data ...  </div>";
control += "<div id=creationtimestamp_moment>Analyzing data ...  </div><br />";
control += "<div id=connectedclientscount>Current Connected Clients: Analyzing data ...</div>";
control += "Enter an ID and push the button to scroll to the row containing this ID and its information: ";
control += "<input type='number' id='idselection' />";
control += "<button onclick=scrollToClientTableRow(document.getElementById('idselection').value)>Scroll</button><br />";
control += "<div id=navbar><button onclick=scrollTo(0,0)>Scroll back to top</button></div>";

buildTables();

$(document).ready(function () {
    $(".ts3-control").html(control);
    $(".ts3-clienttable").html("<div id='showclienttable'></div><br />");
    $(".ts3-kicktable").html("<div id='showkicktable'></div><br />");
    $(".ts3-uploadtable").html("<div id='showuploadtable'></div><br />");

    var loadingSpinner = new Image();
    loadingSpinner.src = "style/gif-load.gif";
    $(loadingSpinner).hide();
    $('.loading_spinner').append(loadingSpinner);
    window.loadingSpinner = loadingSpinner;
});