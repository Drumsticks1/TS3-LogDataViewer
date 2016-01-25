// createXML.cpp : Creation of the XML.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
 Constants = require("./Constants.js"),
 globalVariables = require("./globalVariables.js"),
 miscFunctions = require("./miscFunctions.js"),
 outputHandler = require("./outputHandler.js"),
 builder = require('xmlbuilder');

var parsedLogs =  globalVariables.parsedLogs,
 ClientList = globalVariables.ClientList,
 ServerGroupList = globalVariables.ServerGroupList,
 BanList = globalVariables.BanList,
 KickList = globalVariables.KickList,
 ComplaintList = globalVariables.ComplaintList,
 UploadList = globalVariables.UploadList;

// Creates a XML for storing the data extracted from the logs.
exports.createXML = function() {
    outputHandler.output("Preparing XML-Creation...");

    var Data = builder.create("Data",{version: '1.0', encoding: 'UTF-8'});

    var AttributesNode = Data.ele("Attributes");
    AttributesNode.ele("Generated").text("by TS3-LogDataViewer");
    AttributesNode.ele("VirtualServer").text(globalVariables.virtualServer);

    miscFunctions.updateCurrentDate();
    AttributesNode.ele("CreationTimestamp_Localtime").txt(miscFunctions.getCurrentLocaltime());
    AttributesNode.ele("CreationTimestamp_UTC").txt(miscFunctions.getCurrentUTC());
    AttributesNode.ele("DEBUGGINGXML").txt(Constants.DEBUGGINGXML);

    var ParsedLogs = Data.ele("ParsedLogs");
    for (var i = 0; i < parsedLogs.length; i++) {
        ParsedLogs.ele("P").txt(parsedLogs[i]);
    }

    for (i = 0; i < ClientList.length; i++) {
        var ClientNode = Data.ele("Client");
        if (ClientList[i].getID() != 0) {
            ClientNode.ele("ID").txt(ClientList[i].getID());

            var Nicknames = ClientNode.ele("Nicknames");
            for (var j = 0; j < ClientList[i].getNicknameCount(); j++) {
                Nicknames.ele("N").txt(ClientList[i].getUniqueNickname(j));
            }

            var Connections = ClientNode.ele("Connections");
            for (j = 0; j < ClientList[i].getDateTimeCount(); j++) {
                Connections.ele("C").txt(ClientList[i].getUniqueDateTime(j));
            }

            var IPs = ClientNode.ele("IPs");
            for (j = 0; j < ClientList[i].getIPCount(); j++) {
                IPs.ele("I").txt(ClientList[i].getUniqueIP(j));
            }

            if (ClientList[i].getConnectedState()) {
                ClientNode.ele("Connected").txt(1);
            }

            if (ClientList[i].isDeleted()) {
                ClientNode.ele("Deleted").txt(1);
            }

            var ServerGroupIDs = ClientNode.ele("ServerGroupIDs");
            for (j = 0; j < ClientList[i].getServerGroupIDCount(); j++) {
                ServerGroupIDs.ele("S").txt(ClientList[i].getUniqueServerGroupID(j));
            }

            var ServerGroupAssignmentDateTimes = ClientNode.ele("ServerGroupAssignmentDateTimes");
            for (j = 0; j < ClientList[i].getServerGroupAssignmentDateTimeCount(); j++) {
                ServerGroupAssignmentDateTimes.ele("A").txt(ClientList[i].getUniqueServerGroupAssignmentDateTime(j));
            }
        }
        else ClientNode.ele("ID").txt("-1");
    }

    for (i = 0; i < ServerGroupList.length; i++) {
        var ServerGroupNode = Data.ele("ServerGroup");
        if (ServerGroupList[i].getID() != 0) {
            ServerGroupNode.ele("ID").txt(ServerGroupList[i].getID());
            ServerGroupNode.ele("ServerGroupName").txt(ServerGroupList[i].getServerGroupName());
            ServerGroupNode.ele("CreationDateTime").txt(ServerGroupList[i].getCreationDateTime());
            if (ServerGroupList[i].isDeleted()) {
                ServerGroupNode.ele("Deleted").txt(1);
            }
        }
        else ServerGroupNode.ele("ID").txt("-1");
    }

    for (i = 0; i < BanList.length; i++) {
        var BanNode = Data.ele("Ban");
        BanNode.ele("DateTime").txt(BanList[i].getBanDateTime());
        BanNode.ele("ID").txt(BanList[i].getBannedID());
        BanNode.ele("Nickname").txt(BanList[i].getBannedNickname());
        BanNode.ele("UID").txt(BanList[i].getBannedUID());
        BanNode.ele("IP").txt(BanList[i].getBannedIP());
        BanNode.ele("ByNickname").txt(BanList[i].getBannedByNickname());
        BanNode.ele("ByID").txt(BanList[i].getBannedByID());
        BanNode.ele("ByUID").txt(BanList[i].getBannedByUID());
        BanNode.ele("Reason").txt(BanList[i].getBanReason());
        BanNode.ele("Bantime").txt(BanList[i].getBantime());
    }

    for (i = 0; i < KickList.length; i++) {
        var KickNode = Data.ele("Kick");
        KickNode.ele("DateTime").txt(KickList[i].getKickDateTime());
        KickNode.ele("ID").txt(KickList[i].getKickedID());
        KickNode.ele("Nickname").txt(KickList[i].getKickedNickname());
        KickNode.ele("ByNickname").txt(KickList[i].getKickedByNickname());
        KickNode.ele("ByUID").txt(KickList[i].getKickedByUID());
        KickNode.ele("Reason").txt(KickList[i].getKickReason());
    }

    for (i = 0; i < ComplaintList.length; i++) {
        var ComplaintNode = Data.ele("Complaint");
        ComplaintNode.ele("DateTime").txt(ComplaintList[i].getComplaintDateTime());
        ComplaintNode.ele("AboutNickname").txt(ComplaintList[i].getComplaintAboutNickname());
        ComplaintNode.ele("AboutID").txt(ComplaintList[i].getComplaintAboutID());
        ComplaintNode.ele("Reason").txt(ComplaintList[i].getComplaintReason());
        ComplaintNode.ele("ByNickname").txt(ComplaintList[i].getComplaintByNickname());
        ComplaintNode.ele("ByID").txt(ComplaintList[i].getComplaintByID());
    }

    for (i = 0; i < UploadList.length; i++) {
        var UploadNode = Data.ele("Upload");
        UploadNode.ele("DateTime").txt(UploadList[i].getUploadDateTime());
        UploadNode.ele("ChannelID").txt(UploadList[i].getChannelID());
        UploadNode.ele("Filename").txt(UploadList[i].getFilename());
        UploadNode.ele("UplByNickname").txt(UploadList[i].getUploadedByNickname());
        UploadNode.ele("UplByID").txt(UploadList[i].getUploadedByID());
        if (UploadList[i].getDeletedByID() != undefined) {
            UploadNode.ele("DelByNickname").txt(UploadList[i].getDeletedByNickname());
            UploadNode.ele("DelByID").txt(UploadList[i].getDeletedByID());
        }
    }

    var xmlOptions = {encoding: 'utf-8'};
    if (Constants.DEBUGGINGXML) {
        outputHandler.output("DEBUGGINXML is set to true --> larger XML for debugging");
        xmlOptions = {
            encoding: 'utf-8',
            pretty: true,
            indent: '  ',
            newline: '\n'
        }
    }

    outputHandler.output("Creating XML...");
    var xmlString = Data.end(xmlOptions);

    try{
        fs.writeFileSync(Constants.XMLFILE, xmlString, 'utf8');
    }
    catch(error){
        outputHandler.output("An error occurred while creating the XML:\n" + error.message);
    }

    outputHandler.output("XML Creation completed.");
};