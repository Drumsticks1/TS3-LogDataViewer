// TS3_EnhancedClientList.js
// Author: Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

// Global Variables
var ConnectedClientsCount;

// Rebuilds the XML and calls buildTable() when the XML creation has finished.
function rebuildXML() {
    $.get("rebuildXML.php", function () { buildTables() });
    return false;
}

// Deletes the current XML and builds a new one after.
function buildNewXML() {
    $.get("deleteXML.php", function () { rebuildXML() });
    return false;
}

// Expands the current list.
function expandList(List, ID) {
    var newChild, currentDiv, Row, ListUpper;
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
    for (var j = 0; j < x.childNodes.length - 1 ; j++) {
        currentDiv = List + "_" + ID + "_" + j;
        if (document.getElementById(currentDiv).firstChild != null) {
            document.getElementById(currentDiv).firstChild.nodeValue = ListContent[j].firstChild.nodeValue;
        }
        else {
            newChild = document.createTextNode(ListContent[j].firstChild.nodeValue);
            document.getElementById(currentDiv).appendChild(newChild);
        }
    }
}

// Collapses the current list.
function collapseList(List, ID) {
    var currentDiv, Row, ListUpper;
    if (List == "ips") {
        Row = 3;
        ListUpper = "IPs";
    }
    else {
        Row = 2;
        ListUpper = "Connections";
    }

    if (document.getElementById(ID) != null) {
        var x = document.getElementById(ID).childNodes[Row];
        var ListContent = xmlhttp.responseXML.documentElement.getElementsByTagName("User")[ID].getElementsByTagName(ListUpper)[0].getElementsByTagName(ListUpper);
        currentDiv = List + "_" + ID + "_1";
        document.getElementById(currentDiv).firstChild.nodeValue = ListContent[ListContent.length - 1].firstChild.nodeValue;
        for (var j = 2; j < x.childNodes.length - 1 ; j++) {
            currentDiv = List + "_" + ID + "_" + j;
            document.getElementById(currentDiv).firstChild.nodeValue = "";
        }
    }
}

// Scroll to the given Row.
function scrollToDiv(Row_ID) {
    if (document.getElementById(Row_ID) != null) {
        document.getElementById(Row_ID).scrollIntoView();
    }
}

// Builds and shows the client table.
function buildClientTable() {
    clientTable = "<table id='clienttable' class='tablesorter'><thead><tr><th>ID</th><th>Nicknames</th><th>Connections</th><th>IPs</th><th>Connection Count</th><th>Connected</th><th>Deleted (still buggy)</th></tr></thead><tbody>";
    User = xmlhttp.responseXML.documentElement.getElementsByTagName("User");
    for (i = 0; i < User.length; i++) {
        ID = User[i].getElementsByTagName("ID")[0].firstChild.nodeValue;
        if (ID != -1) {
            Nicknames = User[i].getElementsByTagName("Nicknames")[0].getElementsByTagName("Nicknames");
            Connections = User[i].getElementsByTagName("Connections")[0].getElementsByTagName("Connections");
            IPs = User[i].getElementsByTagName("IPs")[0].getElementsByTagName("IPs");
            Connection_Count = User[i].getElementsByTagName("Connection_Count")[0].firstChild.nodeValue;
            Connected = User[i].getElementsByTagName("Connected")[0].firstChild.nodeValue;
            Deleted = User[i].getElementsByTagName("Deleted")[0].firstChild.nodeValue;

            clientTable += "<tr id=" + i + "><td>" + ID + "</td><td>";

            for (j = 0; j < Nicknames.length; j++) {
                clientTable += "<div>" + Nicknames[j].firstChild.nodeValue + "</div>";
            }

            clientTable += "</td><td>";
            if (Connections.length > 2) {
                clientTable += '<center><button onclick="expandList(&apos;connections&apos;,&apos;' + ID + '&apos;)">+</button>';
                clientTable += '<button onclick="collapseList(&apos;connections&apos;,&apos;' + ID + '&apos;)">-</button></center>';
            }
            clientTable += '<div id=connections_' + ID + '_0>' + Connections[0].firstChild.nodeValue + '</div>';
            if (Connections.length > 1) clientTable += '<div id=connections_' + ID + '_1>' + Connections[Connections.length - 1].firstChild.nodeValue + '</div>';
            if (Connections.length > 2) {
                for (j = 2; j < Connections.length; j++) {
                    clientTable += '<div id=connections_' + ID + '_' + j + '></div>';
                }
            }

            clientTable += "</td><td>";
            if (IPs.length > 2) {
                clientTable += '<center><button onclick="expandList(&apos;ips&apos;,&apos;' + ID + '&apos;)">+</button>';
                clientTable += '<button onclick="collapseList(&apos;ips&apos;,&apos;' + ID + '&apos;)">-</button></center>';
            }
            clientTable += '<div id=ips_' + ID + '_0>' + IPs[0].firstChild.nodeValue + '</div>';
            if (IPs.length > 1) clientTable += '<div id=ips_' + ID + '_1>' + IPs[IPs.length - 1].firstChild.nodeValue + '</div>';
            if (IPs.length > 2) {
                for (j = 2; j < IPs.length; j++) {
                    clientTable += '<div id=ips_' + ID + '_' + j + '></div>';
                }
            }

            clientTable += "</td><td>" + Connection_Count + "</td><td>";

            if (Connected == 1) {
                clientTable += "true";
                ConnectedClientsCount++;
            }
            else clientTable += "false";

            clientTable += "</td><td>" + Deleted + "</td></tr>";
        }
    }
    clientTable += "</tbody></table>";
	document.getElementById('scrolltoclienttable').innerHTML = "<br /><button onclick=scrollToDiv('showclienttable')>Scroll to client table</button>";
    document.getElementById('showclienttable').innerHTML = clientTable;
    $("#clienttable").tablesorter();
}

// Builds and shows the kick table.
function buildKickTable() {
    kickTable = "<table id='kicktable' class='tablesorter'><thead><tr><th>Date and Time</th><th>Kicked User (ID)</th><th>Kicked User (Nickname)</th><th>Kicked by (Nickname)</th><th>Kicked by (UID)</th><th>Reason</th></tr></thead><tbody>";
    Kick = xmlhttp.responseXML.documentElement.getElementsByTagName("Kick");
    for (i = 0; i < Kick.length; i++) {
        KickDateTime = Kick[i].getElementsByTagName("KickDateTime")[0].firstChild.nodeValue;
        KickedID = Kick[i].getElementsByTagName("KickedID")[0].firstChild.nodeValue;
        KickedNickname = Kick[i].getElementsByTagName("KickedNickname")[0].firstChild.nodeValue;
        KickedByNickname = Kick[i].getElementsByTagName("KickedByNickname")[0].firstChild.nodeValue;
        KickedByUID = Kick[i].getElementsByTagName("KickedByUID")[0].firstChild.nodeValue;
        if (Kick[i].getElementsByTagName("KickReason")[0].firstChild != null) {
            KickReason = Kick[i].getElementsByTagName("KickReason")[0].firstChild.nodeValue;
        }
        else KickReason = "No Reason given";

        kickTable += "<tr><td>" + KickDateTime + "</td><td>" + KickedID + "</td><td>" + KickedNickname + "</td><td>" + KickedByNickname + "</td><td>" + KickedByUID + "</td><td>" + KickReason + "</td></tr>";
    }
    kickTable += "</tbody></table>";
	document.getElementById('scrolltokicktable').innerHTML = "<br /><button onclick=scrollToDiv('showkicktable')>Scroll to kick table</button>";
    document.getElementById("showkicktable").innerHTML = kickTable;
    $("#kicktable").tablesorter();
}

// Builds and shows the upload table.
function buildUploadTable() {
    uploadTable = "<table id='uploadtable' class='tablesorter'><thead><tr><th>Upload DateTime</th><th>Channel ID</th><th>Filename</th><th>Uploaded By (Nickname)</th><th>Uploaded By (ID)</tr></thead><tbody>";
    File = xmlhttp.responseXML.documentElement.getElementsByTagName("File");
    for (i = 0; i < File.length; i++) {
            UploadDateTime = File[i].getElementsByTagName("UploadDateTime")[0].firstChild.nodeValue;
            ChannelID = File[i].getElementsByTagName("ChannelID")[0].firstChild.nodeValue;
            Filename = File[i].getElementsByTagName("Filename")[0].firstChild.nodeValue;
            UploadedByNickname = File[i].getElementsByTagName("UploadedByNickname")[0].firstChild.nodeValue;
            UploadedByID = File[i].getElementsByTagName("UploadedByID")[0].firstChild.nodeValue;

			uploadTable += "<tr><td>" + UploadDateTime + "</td><td>" + ChannelID + "</td><td>" + Filename + "</td><td>" + UploadedByNickname + "</td><td>" + UploadedByID + "</td></tr>";
    }
    uploadTable += "</tbody></table>";
    document.getElementById('scrolltouploadtable').innerHTML = "<br /><button onclick=scrollToDiv('showuploadtable')>Scroll to upload table</button>";
	document.getElementById('showuploadtable').innerHTML = uploadTable;
    $("#uploadtable").tablesorter();
}

// Builds the table using the XML.
function buildTables() {
    if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
    else { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            ConnectedClientsCount = 0;
            if (document.getElementById('showclienttable') != null){buildClientTable();}
			if (document.getElementById('showkicktable') != null) {buildKickTable();}
			if (document.getElementById('showuploadtable') != null) {buildUploadTable();}
			
			Attributes = xmlhttp.responseXML.documentElement.getElementsByTagName("Attributes")[0];
            document.getElementById('creationtimestamp_localtime').innerHTML = Attributes.getElementsByTagName("CreationTimestamp_Localtime")[0].firstChild.nodeValue + "   (server local time)";
            document.getElementById('creationtimestamp_utc').innerHTML = Attributes.getElementsByTagName("CreationTimestamp_UTC")[0].firstChild.nodeValue + "   (UTC)";
			document.getElementById('connectedclientscount').innerHTML = "Current Connected Clients: " + ConnectedClientsCount;
        }
    }
    xmlhttp.open("GET", "output.xml", true);
    xmlhttp.send();
}

control = "<button onclick='rebuildXML()'>Rebuild XML and Reload Tables</button><br />";
control += "<button onclick='buildNewXML()'>Delete old output.xml and generate a new one only from the logs</button> (When switching to another logdirectory)";
control += "<br /><br />XML file was created on:";
control += "<div id='creationtimestamp_localtime'>Analyzing data ...  </div>";
control += "<div id='creationtimestamp_utc'>Analyzing data ...  </div><br />";
control += "<div id='connectedclientscount'>Current Connected Clients: Analyzing data ...</div><br />";
control += "Enter an ID and push the button to scroll to the row containing this ID and its information:";
control += "<input type='number' id='idselection' />";
control += "<button onclick=scrollToDiv(document.getElementById('idselection').value)>Scroll</button><br />";
control += "<button id=btt onclick=scrollTo(0,0)>&#8613; Scroll back to top &#8613;</button>";
control += "<div id=scrollToDivControl><div id=scrolltoclienttable></div><div id=scrolltokicktable></div><div id=scrolltouploadtable></div></div><br />";

rebuildXML();

$(document).ready(function () {
    $(".ts3-control").html(control);
    $(".ts3-clienttable").html("<div id='showclienttable'></div><br />");
    $(".ts3-kicktable").html("<div id='showkicktable'></div><br />");
	$(".ts3-uploadtable").html("<div id='showuploadtable'></div><br />");
});
