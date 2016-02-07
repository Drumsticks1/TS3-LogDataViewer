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
    UploadList = globalVariables.UploadList;

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
    match_uploadDeletion = "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| file deleted from";

/**
 * Parses the logs.
 */
exports.parseLogs = function() {
    var virtualServerLength = String(globalVariables.virtualServer).length;

    var DateTime, Nickname, IP,
        ServerGroupName,
        lastUIDBanRule = "", lastIPBanRule = "", bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, banTime,
        kickedByNickname, kickedByUID, kickReason,
        complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID,
        channelID, filename, uploadedByNickname, uploadedByID,
        deletedByNickname, deletedByID,

        BanListID, KickListID, ComplaintListID, UploadListID, ID,
        ID_StartPos, ID_EndPos, Nickname_StartPos, IP_StartPos,
        ServerGroupName_StartPos, ServerGroupName_EndPos,
        bannedByNickname_StartPos, bannedByNickname_EndPos, bannedByUID_StartPos, bannedByUID_EndPos, banReason_StartPos, banReason_EndPos, bannedIP_StartPos, bannedUID_StartPos, bannedByID_StartPos,
        banTime_StartPos, banTime_EndPos,
        kickReason_StartPos, kickReason_EndPos, kickedByNickname_StartPos, kickedByNickname_EndPos, kickedByUID_StartPos, kickedByUID_EndPos,
        complaintAboutNickname_StartPos, complaintAboutNickname_EndPos, complaintAboutID_StartPos, complaintReason_StartPos, complaintReason_EndPos, complaintAboutID_EndPos,
        complaintByNickname_StartPos, complaintByNickname_EndPos, complaintByID_StartPos, complaintByID_EndPos,
        channelID_StartPos, channelID_EndPos, filename_StartPos, filename_EndPos, uploadedByNickname_StartPos, uploadedByNickname_EndPos, uploadedByID_StartPos, uploadedByID_EndPos,
        deletedByNickname_StartPos, deletedByNickname_EndPos, deletedByID_StartPos, deletedByID_EndPos,

        banMatch, kickMatch, lastLog;

    if (BanList.length > 0) BanListID = BanList.length;
    else BanListID = 0;

    if (KickList.length > 0) KickListID = KickList.length;
    else KickListID = 0;

    if (ComplaintList.length > 0) ComplaintListID = ComplaintList.length;
    else ComplaintListID = 0;

    if (UploadList.length > 0) UploadListID = UploadList.length;
    else UploadListID = 0;

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

    outputHandler.output("Parsing new logs...");
    for (i = 0; i < Logs.length; i++) {
        if (!Logs[i].empty) {
            if (i + 1 == Logs.length) {
                lastLog = true;
            }

            var LogFilePath = globalVariables.logDirectory + Logs[i];

            var logfileData = fs.readFileSync(LogFilePath, "utf8");

            var buffer_logline, prevLineEnd = -1, currentLineEnd = logfileData.indexOf("\n");

            // Todo: Check if there is a nicer way for iterating through the file content.
            for (var currentPos = 0; currentPos < logfileData.length;) {
                buffer_logline = logfileData.substring(prevLineEnd + 1, currentLineEnd);

                prevLineEnd = currentLineEnd;
                currentLineEnd = logfileData.indexOf("\n", prevLineEnd + 1);

                // Connects
                if (buffer_logline.indexOf(match_connect) != -1) {
                    IP_StartPos = buffer_logline.lastIndexOf(" ") + 1;
                    Nickname_StartPos = virtualServerLength + 76;
                    ID_StartPos = buffer_logline.lastIndexOf("'(id:") + 5;

                    DateTime = buffer_logline.substr(0, 19);
                    Nickname = buffer_logline.substring(Nickname_StartPos, ID_StartPos - 5);
                    ID = Number(buffer_logline.substring(ID_StartPos, IP_StartPos - 7));
                    IP = buffer_logline.substring(IP_StartPos, buffer_logline.length - 6); // -6 for ignoring the port.

                    if (ClientList.length < ID + 1)
                        ClientList.resizeFill(ID + 1, "Client");
                    if (ClientList[ID].getID() != ID) ClientList[ID].addID(ID);

                    ClientList[ID].addNickname(Nickname);

                    if (globalVariables.bufferData) {
                        if (!checkFunctions.isDuplicateConnection(ID, DateTime)) {
                            ClientList[ID].addConnection(DateTime);
                        }
                    }
                    else ClientList[ID].addConnection(DateTime);

                    ClientList[ID].addIP(IP);

                    if (lastLog) {
                        ClientList[ID].connect();
                    }
                }

                // Disconnects (including kicks and bans)
                else if (buffer_logline.indexOf(match_disconnect) != -1) {
                    banMatch = kickMatch = false;

                    Nickname_StartPos = virtualServerLength + 79;
                    ID_StartPos = buffer_logline.lastIndexOf("'(id:") + 5;

                    if (buffer_logline.lastIndexOf(") reason 'reasonmsg") == -1) {
                        ID_EndPos = buffer_logline.lastIndexOf(") reason 'invokerid=");
                        if (buffer_logline.lastIndexOf(" bantime=") == -1) {
                            kickMatch = true;
                        }
                        else banMatch = true;
                    }
                    else ID_EndPos = buffer_logline.lastIndexOf(") reason 'reasonmsg");

                    DateTime = buffer_logline.substr(0, 19);
                    Nickname = buffer_logline.substring(Nickname_StartPos, ID_StartPos - 5);
                    ID = Number(buffer_logline.substring(ID_StartPos, ID_EndPos));

                    if (ClientList.length < ID + 1) {
                        ClientList.resizeFill(ID + 1, "Client");
                        ClientList[ID].addID(ID);
                    }

                    if (ClientList[ID].getNicknameCount() == 0 || ClientList[ID].getNicknameByID(0) != Nickname) {
                        ClientList[ID].addNickname(Nickname);
                    }

                    if (lastLog) {
                        ClientList[ID].disconnect();
                    }

                    // Bans
                    if (banMatch) {
                        var validUID = true;
                        bannedByNickname_StartPos = buffer_logline.indexOf(" invokername=", ID_EndPos) + 13;

                        if (buffer_logline.indexOf("invokeruid=") != -1) {
                            bannedByNickname_EndPos = buffer_logline.indexOf(" invokeruid=", bannedByNickname_StartPos);
                            bannedByUID_StartPos = bannedByNickname_EndPos + 12;
                            bannedByUID_EndPos = buffer_logline.indexOf(" reasonmsg", bannedByNickname_EndPos);
                        }
                        else {
                            bannedByNickname_EndPos = bannedByUID_EndPos = buffer_logline.indexOf(" reasonmsg");
                            validUID = false;
                        }

                        banReason_StartPos = bannedByUID_EndPos + 11;
                        if (buffer_logline.indexOf("reasonmsg=") != -1) {
                            banReason_EndPos = buffer_logline.indexOf(" bantime=", bannedByUID_EndPos);
                            banTime_StartPos = banReason_EndPos + 9;
                        }
                        else {
                            banReason_EndPos = banReason_StartPos;
                            banTime_StartPos = banReason_EndPos + 8;
                        }

                        banTime_EndPos = buffer_logline.length - 1;

                        bannedByNickname = buffer_logline.substring(bannedByNickname_StartPos, bannedByNickname_EndPos);
                        banReason = buffer_logline.substring(banReason_StartPos, banReason_EndPos);
                        banTime = buffer_logline.substring(banTime_StartPos, banTime_EndPos);

                        if (validUID) {
                            bannedByUID = buffer_logline.substring(bannedByUID_StartPos, bannedByUID_EndPos);
                        }
                        else bannedByUID = "No UID";

                        if (lastUIDBanRule.length != 0 && lastIPBanRule.length != 0) {
                            if (checkFunctions.isMatchingBanRules(bannedByNickname, banReason, banTime, lastUIDBanRule, lastIPBanRule)) {
                                bannedUID_StartPos = lastUIDBanRule.indexOf("' cluid='") + 9;
                                bannedIP_StartPos = lastIPBanRule.indexOf("' ip='") + 6;
                                bannedByID_StartPos = lastIPBanRule.lastIndexOf("'(id:") + 5;

                                bannedUID = lastUIDBanRule.substring(bannedUID_StartPos, lastUIDBanRule.lastIndexOf("' bantime="));
                                bannedIP = lastIPBanRule.substring(bannedIP_StartPos, lastIPBanRule.lastIndexOf("' bantime="));
                                bannedByID = lastIPBanRule.substring(bannedByID_StartPos, lastIPBanRule.length - 1);
                            }
                            else {
                                bannedUID = bannedIP = "Unknown";
                                bannedByID = "0";
                            }
                        }

                        if (!checkFunctions.isDuplicateBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, Number(bannedByID), bannedByUID, banReason, Number(banTime))) {
                            BanList.resizeFill(BanListID + 1, "Ban");
                            BanList[BanListID].addBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, Number(bannedByID), bannedByUID, banReason, Number(banTime));
                            BanListID++;
                        }
                    }

                    // Kicks
                    else if (kickMatch) {
                        if (buffer_logline.lastIndexOf(" reasonmsg=") != -1) {
                            kickReason_StartPos = buffer_logline.lastIndexOf(" reasonmsg=") + 11;
                            kickReason_EndPos = buffer_logline.length - 1;
                            kickReason = buffer_logline.substring(kickReason_StartPos, kickReason_EndPos);
                        }
                        else kickReason = "";

                        kickedByNickname_StartPos = buffer_logline.lastIndexOf(" invokername=") + 13;
                        kickedByNickname_EndPos = buffer_logline.lastIndexOf(" invokeruid=");
                        kickedByUID_StartPos = kickedByNickname_EndPos + 12;
                        if (buffer_logline.indexOf("invokeruid=serveradmin") == -1) {
                            kickedByUID_EndPos = buffer_logline.indexOf("=", kickedByUID_StartPos) + 1;
                        }
                        else kickedByUID_EndPos = buffer_logline.indexOf("reasonmsg") - 1;

                        kickedByNickname = buffer_logline.substring(kickedByNickname_StartPos, kickedByNickname_EndPos);
                        kickedByUID = buffer_logline.substring(kickedByUID_StartPos, kickedByUID_EndPos);

                        if (!checkFunctions.isDuplicateKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason)) {
                            KickList.resizeFill(KickListID + 1, "Kick");
                            KickList[KickListID].addKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason);
                            KickListID++;
                        }
                    }
                }

                // Client assignments to and client removals from a server group
                else if (buffer_logline.indexOf(match_serverGroupAssignment) != -1 || buffer_logline.indexOf(match_serverGroupRemoval) != -1) {
                    ServerGroupName_StartPos = buffer_logline.indexOf(") was added to servergroup '") + 28;

                    if (ServerGroupName_StartPos == 27) {
                        ServerGroupName_StartPos = buffer_logline.indexOf(") was removed from servergroup '") + 32;
                    }

                    ServerGroupName_EndPos = buffer_logline.lastIndexOf("'(id:", buffer_logline.lastIndexOf(") by client '"));

                    ID_StartPos = ServerGroupName_EndPos + 5;
                    ID_EndPos = buffer_logline.indexOf(")", ID_StartPos);

                    DateTime = buffer_logline.substr(0, 19);
                    ID = Number(buffer_logline.substring(ID_StartPos, ID_EndPos));
                    ServerGroupName = buffer_logline.substring(ServerGroupName_StartPos, ServerGroupName_EndPos);

                    var clientID = Number(buffer_logline.substr(67, buffer_logline.indexOf(") was ") - 67));

                    if (ServerGroupList.length < ID + 1) {
                        ServerGroupList.resizeFill(ID + 1, "ServerGroup");
                    }

                    if (ServerGroupList[ID].getID() == 0) {
                        ServerGroupList[ID].addServerGroupInformation(ID, ServerGroupName, "Unknown");
                    }

                    // Currently only reserving the vector buffer to prevent out of bounds exception.
                    if (ClientList.length < clientID + 1)
                        ClientList.resizeFill(clientID + 1, "Client");

                    if (buffer_logline.indexOf(match_serverGroupAssignment) != -1) {
                        if (!checkFunctions.isDuplicateServerGroup(clientID, ID))
                            ClientList[clientID].addServerGroup(ID, DateTime);
                    }
                    // extra check, may be removed later
                    else if (checkFunctions.isDuplicateServerGroup(clientID, ID)) {
                        ClientList[clientID].removeServerGroupByID(ID);
                    }
                }

                // Ban Rules
                // Currently only used for rules of 'direct' (= right click on client and "ban client") bans.
                else if (buffer_logline.indexOf(match_banRule) != -1) {
                    if (buffer_logline.indexOf("' cluid='") != -1 && buffer_logline.indexOf("' ip='") == -1) {
                        lastUIDBanRule = buffer_logline;
                    }
                    else if (buffer_logline.indexOf("' ip='") != -1 && buffer_logline.indexOf("' cluid='") == -1) {
                        lastIPBanRule = buffer_logline;
                    }
                }

                // Complaints
                else if (buffer_logline.indexOf(match_complaint) != -1) {
                    complaintAboutNickname_StartPos = virtualServerLength + 83;
                    complaintAboutNickname_EndPos = buffer_logline.indexOf("'(id:");
                    complaintAboutID_StartPos = complaintAboutNickname_EndPos + 5;
                    complaintAboutID_EndPos = buffer_logline.indexOf(") reason '");
                    complaintReason_StartPos = complaintAboutID_EndPos + 10;
                    complaintReason_EndPos = buffer_logline.lastIndexOf("' by client '");
                    complaintByNickname_StartPos = complaintReason_EndPos + 13;
                    complaintByNickname_EndPos = buffer_logline.lastIndexOf("'(id:");
                    complaintByID_StartPos = complaintByNickname_EndPos + 5;
                    complaintByID_EndPos = buffer_logline.length - 1;

                    DateTime = buffer_logline.substr(0, 19);
                    complaintAboutNickname = buffer_logline.substring(complaintAboutNickname_StartPos, complaintAboutNickname_EndPos);
                    complaintAboutID = buffer_logline.substring(complaintAboutID_StartPos, complaintAboutID_EndPos);
                    complaintReason = buffer_logline.substring(complaintReason_StartPos, complaintReason_EndPos);
                    complaintByNickname = buffer_logline.substring(complaintByNickname_StartPos, complaintByNickname_EndPos);
                    complaintByID = buffer_logline.substring(complaintByID_StartPos, complaintByID_EndPos);

                    if (!checkFunctions.isDuplicateComplaint(DateTime, complaintAboutNickname, Number(complaintAboutID), complaintReason, complaintByNickname, Number(complaintByID))) {
                        ComplaintList.resizeFill(ComplaintListID + 1, "Complaint");
                        ComplaintList[ComplaintListID].addComplaint(DateTime, complaintAboutNickname, Number(complaintAboutID), complaintReason, complaintByNickname, Number(complaintByID));
                        ComplaintListID++;
                    }
                }

                // Uploads
                else if (buffer_logline.indexOf(match_upload) != -1) {
                    channelID_StartPos = virtualServerLength + 74;
                    channelID_EndPos = buffer_logline.indexOf(")");
                    filename_StartPos = channelID_EndPos + 4;
                    filename_EndPos = buffer_logline.lastIndexOf("' by client '");
                    uploadedByNickname_StartPos = filename_EndPos + 13;
                    uploadedByNickname_EndPos = buffer_logline.lastIndexOf("'(id:");
                    uploadedByID_StartPos = uploadedByNickname_EndPos + 5;
                    uploadedByID_EndPos = buffer_logline.length - 1;

                    DateTime = buffer_logline.substr(0, 19);
                    channelID = buffer_logline.substring(channelID_StartPos, channelID_EndPos);
                    filename = buffer_logline.substring(filename_StartPos, filename_EndPos);
                    uploadedByNickname = buffer_logline.substring(uploadedByNickname_StartPos, uploadedByNickname_EndPos);
                    uploadedByID = buffer_logline.substring(uploadedByID_StartPos, uploadedByID_EndPos);

                    if (!checkFunctions.isDuplicateUpload(DateTime, Number(channelID), filename, uploadedByNickname, Number(uploadedByID))) {
                        UploadList.resizeFill(UploadListID + 1, "Upload");
                        UploadList[UploadListID].addUpload(DateTime, Number(channelID), filename, uploadedByNickname, Number(uploadedByID));
                        UploadListID++;
                    }
                }

                // Client Deletions
                else if (buffer_logline.indexOf(match_deleteUser1) != -1) {
                    if (buffer_logline.indexOf(match_deleteUser2) != -1) {
                        ID_EndPos = buffer_logline.lastIndexOf(") got deleted by client '");
                        ID_StartPos = buffer_logline.lastIndexOf("'(id:", ID_EndPos) + 5;

                        ID = Number(buffer_logline.substring(ID_StartPos, ID_EndPos));
                        ClientList[ID].deleteClient();
                    }
                }

                // Upload Deletions
                else if (buffer_logline.indexOf(match_uploadDeletion) != -1) {
                    channelID_StartPos = virtualServerLength + 77;
                    channelID_EndPos = buffer_logline.indexOf(")");
                    filename_StartPos = channelID_EndPos + 4;
                    filename_EndPos = buffer_logline.lastIndexOf("' by client '");
                    deletedByNickname_StartPos = filename_EndPos + 13;
                    deletedByNickname_EndPos = buffer_logline.lastIndexOf("'(id:");
                    deletedByID_StartPos = deletedByNickname_EndPos + 5;
                    deletedByID_EndPos = buffer_logline.length - 1;

                    channelID = buffer_logline.substring(channelID_StartPos, channelID_EndPos);
                    filename = buffer_logline.substring(filename_StartPos, filename_EndPos);
                    deletedByNickname = buffer_logline.substring(deletedByNickname_StartPos, deletedByNickname_EndPos);
                    deletedByID = buffer_logline.substring(deletedByID_StartPos, deletedByID_EndPos);

                    Upload.addDeletedBy(Number(channelID), filename, deletedByNickname, Number(deletedByID));
                }

                // Servergroup additions, deletions, renamings and copying
                else if (buffer_logline.indexOf(match_serverGroupEvent) != -1) {
                    // 0 --> added
                    // 1 --> deleted
                    // 2 --> renamed
                    // 3 --> copied // just like "added"
                    var eventType = -1;

                    ID_StartPos = buffer_logline.indexOf("'(id:") + 5;

                    if (buffer_logline.indexOf(") was added by '") != -1) {
                        ID_EndPos = buffer_logline.indexOf(") was added by '");
                        eventType = 0;
                    }
                    else if (buffer_logline.indexOf(") was deleted by '") != -1) {
                        ID_EndPos = buffer_logline.indexOf(") was deleted by '");
                        eventType = 1;
                    }
                    else if (buffer_logline.indexOf(") was renamed to '") != -1) {
                        ID_EndPos = buffer_logline.indexOf(") was renamed to '");
                        ServerGroupName_StartPos = buffer_logline.indexOf(") was renamed to '") + 18;
                        ServerGroupName_EndPos = buffer_logline.lastIndexOf("' by '", buffer_logline.length - 1);
                        eventType = 2;
                    }
                    else if (buffer_logline.indexOf(") was copied by '") != -1) {
                        ID_StartPos = buffer_logline.lastIndexOf("'(id:") + 5;
                        ID_EndPos = buffer_logline.length - 1;
                        ServerGroupName_StartPos = buffer_logline.indexOf(") to '") + 6;
                        ServerGroupName_EndPos = ID_StartPos - 5;
                        eventType = 3;
                    }

                    if (eventType != -1) {
                        if (eventType == 0 || eventType == 1) {
                            ServerGroupName_StartPos = buffer_logline.indexOf("| servergroup '") + 15;
                            ServerGroupName_EndPos = ID_StartPos - 5;
                        }

                        DateTime = buffer_logline.substr(0, 19);
                        ID = Number(buffer_logline.substring(ID_StartPos, ID_EndPos));
                        ServerGroupName = buffer_logline.substring(ServerGroupName_StartPos, ServerGroupName_EndPos);

                        switch (eventType) {
                            case 0:
                            case 3:
                                ServerGroupList.resizeFill(ID + 1, "ServerGroup");
                                ServerGroupList[ID].addServerGroupInformation(ID, ServerGroupName, DateTime);
                                break;

                            case 1:
                                ServerGroupList[ID].deleteServerGroup();
                                break;

                            case 2:
                                ServerGroupList[ID].renameServerGroup(ServerGroupName);
                                break;
                        }
                    }

                }
                currentPos += buffer_logline.length + 1;
            }

            if (!checkFunctions.isDuplicateLog(Logs[i])) {
                parsedLogs.push(Logs[i]);
            }
        }
    }
};