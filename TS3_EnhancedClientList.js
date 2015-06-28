// TS3_EnhancedClientList.js
// Author: Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

// Rebuilds the XML and calls buildTable() when the XML creation has finished.
function rebuildXML() {
    $.get("rebuildXML.php", function () { buildTable() });
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
    switch (List) {
        case "connections": Row = 2; ListUpper = "Connections"; break;
        case "ips": Row = 3; ListUpper = "IPs"; break;
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
    switch (List) {
        case "connections": Row = 2; ListUpper = "Connections"; break;
        case "ips": Row = 3; ListUpper = "IPs"; break;
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

// Builds the table using the XML.
function buildTable() {
    var ConnectedClientsCount = 0;
    if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
    else { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            output = "<table id='clienttable' class='tablesorter'><thead><tr><th>ID</th><th>Nicknames</th><th>Connections</th><th>IPs</th><th>Connection Count</th><th>Connected</th><th>Deleted (still buggy)</th></tr></thead><tbody>";
            User = xmlhttp.responseXML.documentElement.getElementsByTagName("User");
            UserListLength = User.length;
            for (i = 0; i < UserListLength; i++) {
                ID = User[i].getElementsByTagName("ID")[0].firstChild.nodeValue;
                if (ID != -1) {
                    Nicknames = User[i].getElementsByTagName("Nicknames")[0].getElementsByTagName("Nicknames");
                    Connections = User[i].getElementsByTagName("Connections")[0].getElementsByTagName("Connections");
                    IPs = User[i].getElementsByTagName("IPs")[0].getElementsByTagName("IPs");
                    Connection_Count = User[i].getElementsByTagName("Connection_Count")[0].firstChild.nodeValue;
                    Connected = User[i].getElementsByTagName("Connected")[0].firstChild.nodeValue;
                    Deleted = User[i].getElementsByTagName("Deleted")[0].firstChild.nodeValue;

                    output += "<tr id=" + i + "><td>" + ID + "</td><td>";

                    for (j = 0; j < Nicknames.length; j++) {
                        output += "<div>" + Nicknames[j].firstChild.nodeValue + "</div>";
                    }

                    output += "</td><td>";
                    if (Connections.length > 2) {
                        output += '<center><button onclick="expandList(&apos;connections&apos;,&apos;' + ID + '&apos;)">+</button>';
                        output += '<button onclick="collapseList(&apos;connections&apos;,&apos;' + ID + '&apos;)">-</button></center>';
                    }
                    output += '<div id=connections_' + ID + '_0>' + Connections[0].firstChild.nodeValue + '</div>';
                    if (Connections.length > 1) output += '<div id=connections_' + ID + '_1>' + Connections[Connections.length - 1].firstChild.nodeValue + '</div>';
                    if (Connections.length > 2) {
                        for (j = 2; j < Connections.length; j++) {
                            output += '<div id=connections_' + ID + '_' + j + '></div>';
                        }
                    }

                    output += "</td><td>";
                    if (IPs.length > 2) {
                        output += '<center><button onclick="expandList(&apos;ips&apos;,&apos;' + ID + '&apos;)">+</button>';
                        output += '<button onclick="collapseList(&apos;ips&apos;,&apos;' + ID + '&apos;)">-</button></center>';
                    }
                    output += '<div id=ips_' + ID + '_0>' + IPs[0].firstChild.nodeValue + '</div>';
                    if (IPs.length > 1) output += '<div id=ips_' + ID + '_1>' + IPs[IPs.length - 1].firstChild.nodeValue + '</div>';
                    if (IPs.length > 2) {
                        for (j = 2; j < IPs.length; j++) {
                            output += '<div id=ips_' + ID + '_' + j + '></div>';
                        }
                    }

                    output += "</td><td>" + Connection_Count + "</td><td>";

                    if (Connected == 1) {
                        output += "True";
                        ConnectedClientsCount++;
                    }
                    else output += "False";

                    output += "</td><td>" + Deleted + "</td></tr>";
                }
            }

            output += "</tbody></table>";
            output += "<button id=btt onclick=scrollTo(0,0)>&#8613; Scroll back to top &#8613;</button>";

            output2 = "<table id='kicktable' class='tablesorter'><thead><tr><th>Date and Time</th><th>Kicked User (ID)</th><th>Kicked User (Nickname)</th><th>Kicked by</th><th>Reason</th></tr></thead><tbody>";
            Kick = xmlhttp.responseXML.documentElement.getElementsByTagName("Kick");
            KickListLength = Kick.length;
            for (i = 0; i < KickListLength; i++) {

                KickDateTime = Kick[i].getElementsByTagName("KickDateTime")[0].firstChild.nodeValue;
                KickedID = Kick[i].getElementsByTagName("KickedID")[0].firstChild.nodeValue;
                KickedNickname = Kick[i].getElementsByTagName("KickedNickname")[0].firstChild.nodeValue;
                KickedByNickname = Kick[i].getElementsByTagName("KickedByNickname")[0].firstChild.nodeValue;
                if (Kick[i].getElementsByTagName("KickReason")[0].firstChild != null) {
                    KickReason = Kick[i].getElementsByTagName("KickReason")[0].firstChild.nodeValue;
                }
                else KickReason = "No Reason given";

                output2 += "<tr><td>" + KickDateTime + "</td><td>" + KickedID + "</td><td>" + KickedNickname + "</td><td>" + KickedByNickname + "</td><td>" + KickReason + "</td></tr>";
            }

            output2 += "</tbody></table>";

            var table = document

            Attributes = xmlhttp.responseXML.documentElement.getElementsByTagName("Attributes")[0];

            document.getElementById('showclienttable').innerHTML = output;
            document.getElementById('showkicktable').innerHTML = output2;
            document.getElementById('connectedclientscount').innerHTML = "Current Connected Clients: " + ConnectedClientsCount;
            document.getElementById('creationtimestamp_localtime').innerHTML = Attributes.getElementsByTagName("CreationTimestamp_Localtime")[0].firstChild.nodeValue + "   (server local time)";
            document.getElementById('creationtimestamp_utc').innerHTML = Attributes.getElementsByTagName("CreationTimestamp_UTC")[0].firstChild.nodeValue + "   (UTC)";
            $("#clienttable").tablesorter();
            $("#kicktable").tablesorter();
        }
    }
    xmlhttp.open("GET", "output.xml", true);
    xmlhttp.send();
}

var control = "<button onclick='rebuildXML()'>Rebuild XML and Reload Table</button><br />";
control += "<button onclick='buildNewXML()'>Delete old output.xml and generate a new one only from the logs</button> (When switching to another logdirectory)";
control += "<br /><br />XML file was created on:";
control += "<div id='creationtimestamp_localtime'>Analyzing data ...  </div>";
control += "<div id='creationtimestamp_utc'>Analyzing data ...  </div><br />";
control += "<div id='connectedclientscount'>Current Connected Clients: Analyzing data ...</div><br />";
control += "Enter an ID and push the button to scroll to the row containing this ID and its information:";
control += "<input type='number' id='idselection' />";
control += "<button onclick=scrollToDiv(document.getElementById('idselection').value)>Scroll</button><br /><br />";
control += "<button onclick=scrollToDiv('showkicktable')>Scroll to kick table</button>";

rebuildXML();

$(document).ready(function () {
    $(".ts3-control").html(control);
    $(".ts3-clienttable").html("<div id='showclienttable'></div>");
    $(".ts3-kicktable").html("<div id='showkicktable'></div>");
});
