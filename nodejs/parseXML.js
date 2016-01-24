// parseXML.js : Parsing of the XML.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

// Todo: switch to a faster library!

const fs = require('fs'),
    main = require("./main.js"),
    Constants = require("./Constants.js"),
    globalArrays = require("./globalArrays.js"),
    miscFunctions = require("./miscFunctions.js"),
    outputHandler = require("./outputHandler.js"),
    xmldoc = require('xmldoc');

var parsedLogs = globalArrays.parsedLogs,
    ClientList = globalArrays.ClientList,
    ServerGroupList = globalArrays.ServerGroupList,
    BanList = globalArrays.BanList,
    KickList = globalArrays.KickList,
    ComplaintList = globalArrays.ComplaintList,
    UploadList = globalArrays.UploadList;

exports.parseXML = function() {
    try {
        var XMLStats = fs.statSync(Constants.XMLFILE);
        if (XMLStats.isFile()) {
            outputHandler.output("Parsing old XML...");

            try {
                var x = new Date();
                var XML = new xmldoc.XmlDocument(fs.readFileSync(Constants.XMLFILE));
                miscFunctions.updateCurrentDate();
                console.log(miscFunctions.getProgramRuntime(x));

                var ID, BanListID = 0, KickListID = 0, ComplaintListID = 0, UploadListID = 0, bannedID, bannedByID, bantime, kickedID, complaintAboutID, complaintByID, channelID, uploadedByID, deletedByID,
                    banDateTime, bannedNickname, bannedIP, bannedUID, bannedByNickname, bannedByUID, banReason,
                    kickDateTime, kickedNickname, kickedByNickname, kickedByUID, kickReason,
                    complaintDateTime, complaintAboutNickname, complaintReason, complaintByNickname,
                    uploadDateTime, filename, uploadedByNickname, deletedByNickname;

                var AttributesNode = XML.childNamed("Attributes");

                if (AttributesNode.childNamed("VirtualServer").val != String(main.VIRTUALSERVER)) {
                    outputHandler.output("The last XML was created for another virtual server - skipping use of XML...");
                    return false;
                }

                var ParsedLogNodes = XML.childNamed("ParsedLogs").children;
                for (var i = 0; i < ParsedLogNodes.length; i++) {
                    parsedLogs.push(ParsedLogNodes[i].val);
                }

                var ClientNodes = XML.childrenNamed("Client");
                for (i = 0; i < ClientNodes.length; i++) {
                    if (ClientNodes[i].childNamed("ID").val != "-1") {
                        ID = Number(ClientNodes[i].childNamed("ID").val);
                        ClientList.resizeFill(ID + 1, "Client");
                        ClientList[ID].addID(ID);

                        var Nicknames = ClientNodes[i].childrenNamed("Nicknames")[0].children;
                        for (var j = 0; j < Nicknames.length; j++) {
                            ClientList[ID].addNicknameReverse(Nicknames[j].val);
                        }

                        var Connections = ClientNodes[i].childrenNamed("Connections")[0].children;
                        for (j = 0; j < Connections.length; j++) {
                            ClientList[ID].addDateTimeReverse(Connections[j].val);
                        }

                        var IPs = ClientNodes[i].childrenNamed("IPs")[0].children;
                        for (j = 0; j < IPs.length; j++) {
                            ClientList[ID].addIPReverse(IPs[j].val);
                        }

                        if (ClientNodes[i].childNamed("Deleted") != undefined) {
                            ClientList[ID].deleteClient();
                        }

                        var bufferServerGroupIDs = [],
                            bufferServerGroupAssignmentDateTimes = [];

                        var ServerGroupIDs = ClientNodes[i].childrenNamed("ServerGroupIDs")[0].children;
                        for (j = 0; j < ServerGroupIDs.length; j++) {
                            bufferServerGroupIDs.push(Number(ServerGroupIDs[j].val));
                        }

                        var ServerGroupAssignmentDateTimes = ClientNodes[i].childrenNamed("ServerGroupAssignmentDateTimes")[0].children;
                        for (j = 0; j < ServerGroupAssignmentDateTimes.length; j++) {
                            bufferServerGroupAssignmentDateTimes.push(ServerGroupAssignmentDateTimes[j].val);
                        }

                        for (j = 0; j < bufferServerGroupIDs.length; j++) {
                            ClientList[ID].addServerGroup(bufferServerGroupIDs[j], bufferServerGroupAssignmentDateTimes[j]);
                        }
                    }
                }

                var ServerGroupNodes = XML.childrenNamed("ServerGroup");
                for (i = 0; i < ServerGroupNodes.length; i++) {
                    if (ServerGroupNodes[i].childNamed("ID").val != "-1") {
                        ID = Number(ServerGroupNodes[i].childNamed("ID").val);
                        ServerGroupList.resizeFill(ID + 1, "ServerGroup");
                        ServerGroupList[ID].addServerGroupInformation(ID, ServerGroupNodes[i].childNamed("ServerGroupName").val,
                            ServerGroupNodes[i].childNamed("CreationDateTime").val);

                        if (ServerGroupNodes[i].childNamed("Deleted") != undefined) {
                            ServerGroupList[ID].deleteServerGroup();
                        }
                    }
                }

                var BanNodes = XML.childrenNamed("Ban");
                for (i = 0; i < BanNodes.length; i++) {
                    banDateTime = BanNodes[i].childNamed("DateTime").val;
                    bannedID = Number(BanNodes[i].childNamed("ID").val);
                    bannedNickname = BanNodes[i].childNamed("Nickname").val;
                    bannedUID = BanNodes[i].childNamed("UID").val;
                    bannedIP = BanNodes[i].childNamed("IP").val;
                    bannedByNickname = BanNodes[i].childNamed("ByNickname").val;
                    bannedByID = Number(BanNodes[i].childNamed("ByID").val);
                    bannedByUID = BanNodes[i].childNamed("ByUID").val;
                    banReason = BanNodes[i].childNamed("Reason").val;
                    bantime = Number(BanNodes[i].childNamed("Bantime").val);

                    BanList.resizeFill(BanListID + 1, "Ban");
                    BanList[BanListID].addBan(banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, bantime);
                    BanListID++;
                }
                var KickNodes = XML.childrenNamed("Kick");
                for (i = 0; i < KickNodes.length; i++) {
                    kickDateTime = KickNodes[i].childNamed("DateTime").val;
                    kickedID = Number(KickNodes[i].childNamed("ID").val);
                    kickedNickname = KickNodes[i].childNamed("Nickname").val;
                    kickedByNickname = KickNodes[i].childNamed("ByNickname").val;
                    kickedByUID = KickNodes[i].childNamed("ByUID").val;
                    kickReason = KickNodes[i].childNamed("Reason").val;

                    KickList.resizeFill(KickListID + 1, "Kick");
                    KickList[KickListID].addKick(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason);
                    KickListID++;
                }

                var ComplaintNodes = XML.childrenNamed("Complaint");
                for (i = 0; i < ComplaintNodes.length; i++) {
                    complaintDateTime = ComplaintNodes[i].childNamed("DateTime").val;
                    complaintAboutNickname = ComplaintNodes[i].childNamed("AboutNickname").val;
                    complaintAboutID = Number(ComplaintNodes[i].childNamed("AboutID").val);
                    complaintReason = ComplaintNodes[i].childNamed("Reason").val;
                    complaintByNickname = ComplaintNodes[i].childNamed("ByNickname").val;
                    complaintByID = Number(ComplaintNodes[i].childNamed("ByID").val);

                    ComplaintList.resizeFill(ComplaintListID + 1, "Complaint");
                    ComplaintList[ComplaintListID].addComplaint(complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID);
                    ComplaintListID++;
                }

                var UploadNodes = XML.childrenNamed("Upload");
                for (i = 0; i < UploadNodes.length; i++) {
                    uploadDateTime = UploadNodes[i].childNamed("DateTime").val;
                    channelID = Number(UploadNodes[i].childNamed("ChannelID").val);
                    filename = UploadNodes[i].childNamed("Filename").val;
                    uploadedByNickname = UploadNodes[i].childNamed("UplByNickname").val;
                    uploadedByID = Number(UploadNodes[i].childNamed("UplByID").val);

                    UploadList.resizeFill(UploadListID + 1, "Upload");

                    if (UploadNodes[i].childNamed("DelByID") != undefined) {
                        deletedByNickname = UploadNodes[i].childNamed("DelByNickname").val;
                        deletedByID = Number(UploadNodes[i].childNamed("DelByID").val);
                        UploadList[UploadListID].addUpload(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID, deletedByNickname, deletedByID);
                    }
                    else UploadList[UploadListID].addUpload(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID);
                    UploadListID++;
                }

                return true;
            } catch (error) {
                outputHandler.output("An error occurred while parsing the XML:\n" + error.message);
                ClientList = [];
                ServerGroupList = [];
                BanList = [];
                KickList = [];
                ComplaintList = [];
                UploadList = [];
                return false;
            }

        } else {
            outputHandler.output(Constants.XMLFILE + " seems not to be a file...");
            return false;
        }
    }
    catch (error) {
        outputHandler.output("An error occurred while fetching the XML:\n" + (error.message));
        return false;
    }
};