// parseLogs.js : Parsing of the logs.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    Constants = require("./Constants.js"),
    Upload = require("./Upload.js"),
    checkFunctions = require("./checkFunctions.js"),
    globalVariables = require("./globalVariables.js"),
    miscFunctions = require("./miscFunctions.js"),
    outputHandler = require("./outputHandler.js");

var Logs = globalVariables.Logs,
    parsedLogs = globalVariables.parsedLogs,
    ClientList = globalVariables.ClientList,
    ServerGroupList = globalVariables.ServerGroupList,
    BanList = globalVariables.BanList,
    KickList = globalVariables.KickList,
    ComplaintList = globalVariables.ComplaintList,
    UploadList = globalVariables.UploadList,
    ChannelList = globalVariables.ChannelList;

const match_banRule = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| ban added reason='",
    match_complaint = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| complaint added for client '",
    match_connect = "|INFO    |VirtualServerBase|  " + globalVariables.virtualServer + "| client connected '",
    match_disconnect = "|INFO    |VirtualServerBase|  " + globalVariables.virtualServer + "| client disconnected '",
    match_serverGroupEvent = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| servergroup '",
    match_serverGroupAssignment = ") was added to servergroup '",
    match_serverGroupRemoval = ") was removed from servergroup '",
    match_deleteUser1 = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| client '",
    match_deleteUser2 = ") got deleted by client '",
    match_upload = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| file upload to",
    match_uploadDeletion = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| file deleted from",
    match_channel = "|INFO    |VirtualServerBase|  1| channel '",
    match_channelCreation = ") created by '",
    match_subChannelCreation = ") created as sub channel of '",
    match_channelEdition = ") edited by '",
    match_channelDeletion = ") deleted by '";

var buffer_logline, boundaries;

/**
 * Resets the boundaries object.
 */
function resetBoundaries() {
    boundaries = {
        // General
        "DateTime": [0, 19],
        "ID": [0, 0],
        "Nickname": [0, 0],
        "IP": [0, 0],

        // Ban
        "bannedUID": [0, 0],
        "bannedIP": [0, 0],
        "bannedByID": [0, 0],
        "bannedByNickname": [0, 0],
        "bannedByUID": [0, 0],
        "banReason": [0, 0],
        "banTime": [0, 0],

        // Kick
        "kickReason": [0, 0],
        "kickedByNickname": [0, 0],
        "kickedByUID": [0, 0],

        // ServerGroup
        "ServerGroupID": [0, 0],
        "ServerGroupName": [0, 0],

        // Complaint
        "complaintAboutNickname": [0, 0],
        "complaintAboutID": [0, 0],
        "complaintReason": [0, 0],
        "complaintByNickname": [0, 0],
        "complaintByID": [0, 0],

        // Upload
        "channelID": [0, 0],
        "filename": [0, 0],
        "uploadedByNickname": [0, 0],
        "uploadedByID": [0, 0],
        "channelName": [0, 0]
    };
}

/**
 * Returns a substring of the current buffer_logline that contains the information matching the given boundaries identifier.
 * @param {string} boundariesIdentifier
 * @returns {string} parsed information, substring of the current buffer_logline.
 */
function getSubstring(boundariesIdentifier) {
    return buffer_logline.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
}

/**
 * Parses the logs.
 */
exports.parseLogs = function() {
    var virtualServerLength = String(globalVariables.virtualServer).length;

    var lastUIDBanRule = "", lastIPBanRule = "",
        BanListID, KickListID, ComplaintListID, UploadListID,
        isBan, isKick, isLastLog;

    BanListID = BanList.length;
    KickListID = KickList.length;
    ComplaintListID = ComplaintList.length;
    UploadListID = UploadList.length;

    if (globalVariables.bufferData) {
        if (checkFunctions.isMatchingLogOrder()) {
            outputHandler.output("Comparing new and old logs...");
            for (var i = 0; i < parsedLogs.length; i++) {
                for (var j = 0; j < Logs.length - 1; j++) {
                    if (Logs[j] == parsedLogs[i]) {
                        Logs.splice(j, 1);
                    }
                }
            }
        }
        else {
            outputHandler.output("Logs parsed for the last program run were deleted or the log order changed - skipping use of old data...");
            parsedLogs.length = 0;
        }
    }

    resetBoundaries();

    outputHandler.output("Parsing new logs...");
    for (i = 0; i < Logs.length; i++) {
        if (!Logs[i].empty) {
            if (i + 1 == Logs.length)
                isLastLog = true;

            var logfileData = fs.readFileSync(globalVariables.logDirectory + Logs[i], "utf8");

            while(logfileData.length > 0){
                buffer_logline = logfileData.substring(0, logfileData.indexOf("\n"));

                // Connects
                if (buffer_logline.indexOf(match_connect) != -1) {
                    boundaries.IP = [
                        buffer_logline.lastIndexOf(" ") + 1,
                        buffer_logline.length - 6]; // -6 for ignoring the port.

                    boundaries.Nickname = [
                        virtualServerLength + 76,
                        buffer_logline.lastIndexOf("'(id:")];

                    boundaries.ID = [
                        boundaries.Nickname[1] + 5,
                        boundaries.IP[0] - 7];

                    var DateTime = getSubstring("DateTime"),
                        ID = Number(getSubstring("ID"));

                    if (ClientList.length < ID + 1)
                        ClientList.resizeFill(ID + 1, "Client");

                    if (ClientList[ID].getID() != ID)
                        ClientList[ID].addID(ID);

                    ClientList[ID].addNickname(getSubstring("Nickname"));

                    if (globalVariables.bufferData) {
                        if (!checkFunctions.isDuplicateConnection(ID, DateTime))
                            ClientList[ID].addConnection(DateTime);
                    }
                    else
                        ClientList[ID].addConnection(DateTime);

                    ClientList[ID].addIP(getSubstring("IP"));

                    if (isLastLog)
                        ClientList[ID].connect();
                }

                // Disconnects (including kicks and bans)
                else if (buffer_logline.indexOf(match_disconnect) != -1) {
                    isBan = isKick = false;

                    boundaries.Nickname = [
                        virtualServerLength + 79,
                        buffer_logline.lastIndexOf("'(id:")];

                    boundaries.ID[0] = boundaries.Nickname[1] + 5;

                    if (buffer_logline.lastIndexOf(") reason 'reasonmsg") == -1) {
                        boundaries.ID[1] = buffer_logline.lastIndexOf(") reason 'invokerid=");

                        if (buffer_logline.lastIndexOf(" bantime=") == -1)
                            isKick = true;
                        else
                            isBan = true;
                    } else
                        boundaries.ID[1] = buffer_logline.lastIndexOf(") reason 'reasonmsg");

                    DateTime = getSubstring("DateTime");
                    ID = Number(getSubstring("ID"));

                    var Nickname = getSubstring("Nickname");

                    if (ClientList.length < ID + 1) {
                        ClientList.resizeFill(ID + 1, "Client");
                        ClientList[ID].addID(ID);
                    }

                    if (ClientList[ID].getNicknameCount() == 0 || ClientList[ID].getNicknameByID(0) != Nickname)
                        ClientList[ID].addNickname(Nickname);

                    if (isLastLog)
                        ClientList[ID].disconnect();

                    // Bans
                    if (isBan) {
                        var validUID = true;
                        boundaries.bannedByNickname[0] = buffer_logline.indexOf(" invokername=", boundaries.ID[1]) + 13;

                        if (buffer_logline.indexOf("invokeruid=") != -1) {
                            boundaries.bannedByNickname[1] = buffer_logline.indexOf(" invokeruid=", boundaries.bannedByNickname[0]);
                            boundaries.bannedByUID = [
                                boundaries.bannedByNickname[1] + 12,
                                buffer_logline.indexOf(" reasonmsg", boundaries.bannedByNickname[1])];
                        }
                        else {
                            boundaries.bannedByNickname[1] = boundaries.bannedByUID[1] = buffer_logline.indexOf(" reasonmsg");
                            validUID = false;
                        }

                        boundaries.banReason[0] = boundaries.bannedByUID[1] + 11;
                        if (buffer_logline.indexOf("reasonmsg=") != -1) {
                            boundaries.banReason[1] = buffer_logline.indexOf(" bantime=", boundaries.bannedByUID[1]);
                            boundaries.banTime[0] = boundaries.banReason[1] + 9;
                        }
                        else {
                            boundaries.banReason[1] = boundaries.banReason[0];
                            boundaries.banTime[0] = boundaries.banReason[1] + 8;
                        }

                        boundaries.banTime[1] = buffer_logline.length - 1;

                        var bannedByNickname = getSubstring("bannedByNickname"),
                            banReason = getSubstring("banReason"),
                            banTime = Number(getSubstring("banTime")),
                            bannedByUID, bannedUID, bannedIP, bannedByID;

                        if (validUID)
                            bannedByUID = getSubstring("bannedByUID");
                        else
                            bannedByUID = "No UID";

                        if (lastUIDBanRule.length != 0 && lastIPBanRule.length != 0) {
                            if (checkFunctions.isMatchingBanRules(bannedByNickname, banReason, banTime, lastUIDBanRule, lastIPBanRule)) {
                                boundaries.bannedUID = [
                                    lastUIDBanRule.indexOf("' cluid='") + 9,
                                    lastUIDBanRule.lastIndexOf("' bantime=")];

                                boundaries.bannedIP = [
                                    lastIPBanRule.indexOf("' ip='") + 6,
                                    lastIPBanRule.lastIndexOf("' bantime=")];

                                boundaries.bannedByID = [
                                    lastIPBanRule.lastIndexOf("'(id:") + 5,
                                    lastIPBanRule.length - 1];

                                bannedUID = lastUIDBanRule.substring(boundaries.bannedUID[0], boundaries.bannedUID[1]);
                                bannedIP = lastIPBanRule.substring(boundaries.bannedIP[0], boundaries.bannedIP[1]);
                                bannedByID = lastIPBanRule.substring(boundaries.bannedByID[0], boundaries.bannedByID[1]);
                            }
                            else {
                                bannedUID = bannedIP = "Unknown";
                                bannedByID = "0";
                            }
                        }

                        ID = Number(ID);
                        bannedByID = Number(bannedByID);

                        if (!checkFunctions.isDuplicateBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, banTime)) {
                            BanList.resizeFill(BanListID + 1, "Ban");
                            BanList[BanListID].addBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, banTime);
                            BanListID++;
                        }
                    }

                    // Kicks
                    else if (isKick) {
                        var kickedByNickname, kickedByUID, kickReason = "";

                        if (buffer_logline.lastIndexOf(" reasonmsg=") != -1) {
                            boundaries.kickReason = [
                                buffer_logline.lastIndexOf(" reasonmsg=") + 11,
                                buffer_logline.length - 1
                            ];

                            kickReason = getSubstring("kickReason");
                        }

                        boundaries.kickedByNickname = [
                            buffer_logline.lastIndexOf(" invokername=") + 13,
                            buffer_logline.lastIndexOf(" invokeruid=")
                        ];

                        boundaries.kickedByUID[0] = boundaries.kickedByNickname[1] + 12;

                        if (buffer_logline.indexOf("invokeruid=serveradmin") == -1)
                            boundaries.kickedByUID[1] = buffer_logline.indexOf("=", boundaries.kickedByUID[0]) + 1;
                        else
                            boundaries.kickedByUID[1] = buffer_logline.indexOf("reasonmsg") - 1;

                        kickedByNickname = getSubstring("kickedByNickname");
                        kickedByUID = getSubstring("kickedByUID");

                        if (!checkFunctions.isDuplicateKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason)) {
                            KickList.resizeFill(KickListID + 1, "Kick");
                            KickList[KickListID].addKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason);
                            KickListID++;
                        }
                    }
                }

                // Client assignments to and client removals from a server group
                else if (buffer_logline.indexOf(match_serverGroupAssignment) != -1 || buffer_logline.indexOf(match_serverGroupRemoval) != -1) {
                    boundaries.ServerGroupName[0] = buffer_logline.indexOf(") was added to servergroup '") + 28;

                    if (boundaries.ServerGroupName[0] == 27)
                        boundaries.ServerGroupName[0] = buffer_logline.indexOf(") was removed from servergroup '") + 32;

                    boundaries.ServerGroupName[1] = buffer_logline.lastIndexOf("'(id:", buffer_logline.lastIndexOf(") by client '"));
                    boundaries.ServerGroupID[0] = boundaries.ServerGroupName[1] + 5;
                    boundaries.ServerGroupID[1] = buffer_logline.indexOf(")", boundaries.ServerGroupName[0]);
                    boundaries.ID = [67, buffer_logline.indexOf(") was ")];

                    DateTime = getSubstring("DateTime");
                    ServerGroupID = Number(getSubstring("ServerGroupID"));
                    ServerGroupName = getSubstring("ServerGroupName");
                    ID = Number(getSubstring("ID"));

                    if (ServerGroupList.length < ServerGroupID + 1)
                        ServerGroupList.resizeFill(ServerGroupID + 1, "ServerGroup");

                    if (ServerGroupList[ServerGroupID].getID() == 0)
                        ServerGroupList[ServerGroupID].addServerGroupInformation(ServerGroupID, ServerGroupName, "Unknown");

                    // Currently only reserving the vector buffer to prevent out of bounds exception.
                    if (ClientList.length < ID + 1)
                        ClientList.resizeFill(ID + 1, "Client");

                    if (buffer_logline.indexOf(match_serverGroupAssignment) != -1) {
                        if (!checkFunctions.isDuplicateServerGroup(ID, ServerGroupID))
                            ClientList[ID].addServerGroup(ServerGroupID, DateTime);
                    }
                    // Todo: extra check, may be removed later
                    else if (checkFunctions.isDuplicateServerGroup(ID, ServerGroupID))
                        ClientList[ID].removeServerGroupByID(ServerGroupID);
                }

                // Ban Rules
                // Currently only used for rules of 'direct' (= right click on client and "ban client") bans.
                else if (buffer_logline.indexOf(match_banRule) != -1) {
                    if (buffer_logline.indexOf("' cluid='") != -1 && buffer_logline.indexOf("' ip='") == -1)
                        lastUIDBanRule = buffer_logline;
                    else if (buffer_logline.indexOf("' ip='") != -1 && buffer_logline.indexOf("' cluid='") == -1)
                        lastIPBanRule = buffer_logline;
                }

                // Complaints
                else if (buffer_logline.indexOf(match_complaint) != -1) {
                    boundaries.complaintAboutNickname = [
                        virtualServerLength + 83,
                        buffer_logline.indexOf("'(id:")];

                    boundaries.complaintAboutID = [
                        boundaries.complaintAboutNickname[1] + 5,
                        buffer_logline.indexOf(") reason '")];

                    boundaries.complaintReason = [
                        boundaries.complaintAboutID[1] + 10,
                        buffer_logline.lastIndexOf("' by client '")
                    ];

                    boundaries.complaintByNickname = [
                        boundaries.complaintReason[1] + 13,
                        buffer_logline.lastIndexOf("'(id:")];

                    boundaries.complaintByID = [
                        boundaries.complaintByNickname[1] + 5,
                        buffer_logline.length - 1];

                    DateTime = getSubstring("DateTime");
                    var complaintAboutNickname = getSubstring("complaintAboutNickname"),
                        complaintAboutID = Number(getSubstring("complaintAboutID")),
                        complaintReason = getSubstring("complaintReason"),
                        complaintByNickname = getSubstring("complaintByNickname"),
                        complaintByID = Number(getSubstring("complaintByID"));

                    if (!checkFunctions.isDuplicateComplaint(DateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID)) {
                        ComplaintList.resizeFill(ComplaintListID + 1, "Complaint");
                        ComplaintList[ComplaintListID].addComplaint(DateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID);
                        ComplaintListID++;
                    }
                }

                // Uploads
                else if (buffer_logline.indexOf(match_upload) != -1) {
                    boundaries.channelID = [
                        virtualServerLength + 74,
                        buffer_logline.indexOf(")")];

                    boundaries.filename = [
                        boundaries.channelID[1] + 4,
                        buffer_logline.lastIndexOf("' by client '")];

                    boundaries.uploadedByNickname = [
                        boundaries.filename[1] + 13,
                        buffer_logline.lastIndexOf("'(id:")];

                    boundaries.uploadedByID = [
                        boundaries.uploadedByNickname[1] + 5,
                        buffer_logline.length - 1];

                    DateTime = getSubstring("DateTime");
                    channelID = Number(getSubstring("channelID"));
                    var filename = getSubstring("filename"),
                        uploadedByNickname = getSubstring("uploadedByNickname"),
                        uploadedByID = Number(getSubstring("uploadedByID"));

                    if (!checkFunctions.isDuplicateUpload(DateTime, channelID, filename, uploadedByNickname, uploadedByID)) {
                        UploadList.resizeFill(UploadListID + 1, "Upload");
                        UploadList[UploadListID].addUpload(DateTime, channelID, filename, uploadedByNickname, uploadedByID);
                        UploadListID++;
                    }
                }

                // Client Deletions
                else if (buffer_logline.indexOf(match_deleteUser1) != -1) {
                    if (buffer_logline.indexOf(match_deleteUser2) != -1) {
                        boundaries.ID[0] = buffer_logline.lastIndexOf(") got deleted by client '");
                        boundaries.ID[1] = buffer_logline.lastIndexOf("'(id:", boundaries.ID[0]) + 5;

                        ClientList[Number(getSubstring("ID"))].deleteClient();
                    }
                }

                // Upload Deletions
                else if (buffer_logline.indexOf(match_uploadDeletion) != -1) {
                    boundaries.channelID = [
                        virtualServerLength + 77,
                        buffer_logline.indexOf(")")];

                    boundaries.filename = [
                        boundaries.channelID[1] + 4,
                        buffer_logline.lastIndexOf("' by client '")];

                    boundaries.deletedByNickname = [
                        boundaries.filename[1] + 13,
                        buffer_logline.lastIndexOf("'(id:")];

                    boundaries.deletedByID = [
                        boundaries.deletedByNickname[1] + 5,
                        buffer_logline.length - 1];

                    Upload.addDeletedBy(
                        Number(getSubstring("channelID")),
                        getSubstring("filename"),
                        getSubstring("deletedByNickname"),
                        Number(getSubstring("deletedByID")));
                }

                // Channel additions, edits or deletions.
                else if (buffer_logline.indexOf(match_channel) != -1) {
                    // 0 --> added
                    // 1 --> edited
                    // 2 --> edited undefined --> added
                    // 3 --> deleted
                    var eventTypeC = -1;

                    if (buffer_logline.indexOf(match_channelEdition) != -1) {
                        boundaries.channelID[1] = buffer_logline.indexOf(match_channelEdition);
                        eventTypeC = 1;
                    }
                    else if (buffer_logline.indexOf(match_channelCreation) != -1) {
                        boundaries.channelID[1] = buffer_logline.indexOf(match_channelCreation);
                        eventTypeC = 0;
                    }
                    else if (buffer_logline.indexOf(match_subChannelCreation) != -1) {
                        boundaries.channelID[1] = buffer_logline.indexOf(match_subChannelCreation);
                        eventTypeC = 0;
                    }
                    else if (buffer_logline.indexOf(match_channelDeletion) != -1) {
                        boundaries.channelID[1] = buffer_logline.indexOf(match_channelDeletion);
                        eventTypeC = 3;
                    }

                    if (eventTypeC != -1) {
                        boundaries.channelID[0] = buffer_logline.indexOf("'(id:") + 5;

                        // Todo: check virtual server compatibility!
                        boundaries.channelName = [68, boundaries.channelID[0] - 5];

                        DateTime = getSubstring("DateTime");
                        var channelID = Number(getSubstring("channelID")),
                            channelName = getSubstring("channelName");

                        if (eventTypeC == 1 && !ChannelList[channelID])
                            eventTypeC = 2;

                        if (eventTypeC == 0 || eventTypeC == 2)
                            ChannelList.resizeFill(channelID + 1, "Channel");

                        switch (eventTypeC) {
                            case 2:
                                DateTime = "Unknown";
                            case 0:
                                ChannelList[channelID].addChannel(channelID, DateTime, channelName);
                                break;

                            case 1:
                                ChannelList[channelID].renameChannel(channelName);
                                break;

                            case 3:
                                ChannelList[channelID].deleteChannel();
                        }
                    }
                }

                // Servergroup additions, deletions, renamings and copying
                else if (buffer_logline.indexOf(match_serverGroupEvent) != -1) {
                    // 0 --> added
                    // 1 --> deleted
                    // 2 --> renamed
                    // 3 --> copied // just like "added"
                    var eventTypeS = -1;

                    boundaries.ServerGroupID[0] = buffer_logline.indexOf("'(id:") + 5;

                    if (buffer_logline.indexOf(") was added by '") != -1) {
                        boundaries.ServerGroupID[1] = buffer_logline.indexOf(") was added by '");
                        eventTypeS = 0;
                    }
                    else if (buffer_logline.indexOf(") was deleted by '") != -1) {
                        boundaries.ServerGroupID[1] = buffer_logline.indexOf(") was deleted by '");
                        eventTypeS = 1;
                    }
                    else if (buffer_logline.indexOf(") was renamed to '") != -1) {
                        boundaries.ServerGroupID[1] = buffer_logline.indexOf(") was renamed to '");
                        boundaries.ServerGroupName = [
                            buffer_logline.indexOf(") was renamed to '") + 18,
                            buffer_logline.lastIndexOf("' by '", buffer_logline.length - 1)];

                        eventTypeS = 2;
                    }
                    else if (buffer_logline.indexOf(") was copied by '") != -1) {
                        boundaries.ServerGroupID = [
                            buffer_logline.lastIndexOf("'(id:") + 5,
                            buffer_logline.length - 1];

                        boundaries.ServerGroupName = [
                            buffer_logline.indexOf(") to '") + 6,
                            boundaries.ServerGroupID[0] - 5];

                        eventTypeS = 3;
                    }

                    if (eventTypeS != -1) {
                        if (eventTypeS == 0 || eventTypeS == 1) {
                            boundaries.ServerGroupName = [
                                buffer_logline.indexOf("| servergroup '") + 15,
                                boundaries.ServerGroupID[0] - 5];
                        }

                        DateTime = getSubstring("DateTime");
                        var ServerGroupID = Number(getSubstring("ServerGroupID")),
                            ServerGroupName = getSubstring("ServerGroupName");

                        switch (eventTypeS) {
                            case 0:
                            case 3:
                                ServerGroupList.resizeFill(ServerGroupID + 1, "ServerGroup");
                                ServerGroupList[ServerGroupID].addServerGroupInformation(ServerGroupID, ServerGroupName, DateTime);
                                break;

                            case 1:
                                ServerGroupList[ServerGroupID].deleteServerGroup();
                                break;

                            case 2:
                                ServerGroupList[ServerGroupID].renameServerGroup(ServerGroupName);
                        }
                    }
                }
                logfileData = logfileData.substring(buffer_logline.length + 1);
              //  currentPos += buffer_logline.length + 1;
            }

            if (!checkFunctions.isDuplicateLog(Logs[i])) {
                parsedLogs.push(Logs[i]);
            }
        }
    }
};