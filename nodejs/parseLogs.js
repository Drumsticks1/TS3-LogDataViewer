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
        lastUIDBanRule = "", lastIPBanRule = "", bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, bantime,
        kickedByNickname, kickedByUID, kickReason,
        complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID,
        channelID, filename, uploadedByNickname, uploadedByID,
        deletedByNickname, deletedByID,

        BanListID, KickListID, ComplaintListID, UploadListID, ID,
        ID_StartPos, ID_EndPos, Nickname_StartPos, IP_StartPos, ID_Length, Nickname_Length, IP_Length,
        ServerGroupName_StartPos, ServerGroupName_EndPos, ServerGroupName_Length,
        bannedByNickname_StartPos, bannedByNickname_EndPos, bannedByUID_StartPos, bannedByUID_EndPos, banReason_StartPos, banReason_EndPos, bannedIP_StartPos, bannedUID_StartPos, bannedByID_StartPos,
        bantime_StartPos, bantime_EndPos, bannedByNickname_Length, bannedByUID_Length, banReason_Length, bantime_Length, bannedUID_Length, bannedIP_Length, bannedByID_Length,
        kickReason_StartPos, kickedByNickname_StartPos, kickedByNickname_EndPos, kickedByUID_StartPos, kickedByUID_EndPos, kickReason_Length, kickedByNickname_Length, kickedByUID_Length,
        complaintAboutNickname_StartPos, complaintAboutNickname_EndPos, complaintAboutID_StartPos, complaintReason_StartPos, complaintReason_EndPos, complaintAboutID_EndPos,
        complaintByNickname_StartPos, complaintByNickname_EndPos, complaintByID_StartPos, complaintByID_EndPos,
        complaintAboutNickname_Length, complaintAboutID_Length, complaintReason_Length, complaintByNickname_Length, complaintByID_Length,
        channelID_StartPos, channelID_EndPos, filename_StartPos, filename_EndPos, uploadedByNickname_StartPos, uploadedByNickname_EndPos, uploadedByID_StartPos, uploadedByID_EndPos,
        channelID_Length, filename_Length, uploadedByNickname_Length, uploadedByID_Length, deletedByNickname_StartPos, deletedByNickname_EndPos, deletedByID_StartPos, deletedByID_EndPos,
        deletedByNickname_Length, deletedByID_Length,

        banMatch, kickMatch;

    if (BanList.length > 0) BanListID = BanList.length;
    else BanListID = 0;

    if (KickList.length > 0) KickListID = KickList.length;
    else KickListID = 0;

    if (ComplaintList.length > 0) ComplaintListID = ComplaintList.length;
    else ComplaintListID = 0;

    if (UploadList.length > 0) UploadListID = UploadList.length;
    else UploadListID = 0;

    // Todo: fix deletions of the parsedLogs which occur sometimes.
    // Find problem with Logs adding before this!
    if (Constants.bufferData) {
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
            if(parsedLogs[parsedLogs.length] == Logs[Logs.lastChild]){

            }
            outputHandler.output("Logs parsed for the last program run were deleted or the log order changed - skipping use of old XML...");
            parsedLogs.length = 0;
        }
    }

    outputHandler.output("Parsing new logs...");
    for (i = 0; i < Logs.length; i++) {
        if (!Logs[i].empty) {
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
                    ID_Length = IP_StartPos - ID_StartPos - 7;
                    Nickname_Length = ID_StartPos - Nickname_StartPos - 5;
                    IP_Length = buffer_logline.length - IP_StartPos - 6; // - 6 for ignoring the port.

                    DateTime = buffer_logline.substr(0, 19);
                    Nickname = buffer_logline.substr(Nickname_StartPos, Nickname_Length);
                    ID = Number(buffer_logline.substr(ID_StartPos, ID_Length));
                    IP = buffer_logline.substr(IP_StartPos, IP_Length);

                    if (ClientList.length < ID + 1)
                        ClientList.resizeFill(ID + 1, "Client");
                    if (ClientList[ID].getID() != ID) ClientList[ID].addID(ID);

                    ClientList[ID].addNickname(Nickname);

                    if (Constants.bufferData) {
                        if (!checkFunctions.isDuplicateDateTime(ID, DateTime)) {
                            ClientList[ID].addDateTime(DateTime);
                        }
                    }
                    else ClientList[ID].addDateTime(DateTime);

                    ClientList[ID].addIP(IP);

                    if (i + 1 == Logs.length) {
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

                    ID_Length = ID_EndPos - ID_StartPos;
                    Nickname_Length = ID_StartPos - Nickname_StartPos - 5;

                    DateTime = buffer_logline.substr(0, 19);
                    Nickname = buffer_logline.substr(Nickname_StartPos, Nickname_Length);
                    ID = Number(buffer_logline.substr(ID_StartPos, ID_Length));

                    if (ClientList.length < ID + 1) {
                        ClientList.resizeFill(ID + 1, "Client");
                        ClientList[ID].addID(ID);
                    }

                    if (ClientList[ID].getNicknameCount() == 0 || ClientList[ID].getUniqueNickname(0) != Nickname) {
                        ClientList[ID].addNickname(Nickname);
                    }

                    if (i + 1 == Logs.length) {
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
                            bantime_StartPos = banReason_EndPos + 9;
                        }
                        else {
                            banReason_EndPos = banReason_StartPos;
                            bantime_StartPos = banReason_EndPos + 8;
                        }

                        bantime_EndPos = buffer_logline.length - 1;

                        bannedByNickname_Length = bannedByNickname_EndPos - bannedByNickname_StartPos;
                        banReason_Length = banReason_EndPos - banReason_StartPos;
                        bantime_Length = bantime_EndPos - bantime_StartPos;

                        bannedByNickname = buffer_logline.substr(bannedByNickname_StartPos, bannedByNickname_Length);
                        banReason = buffer_logline.substr(banReason_StartPos, banReason_Length);
                        bantime = buffer_logline.substr(bantime_StartPos, bantime_Length);

                        if (validUID) {
                            bannedByUID_Length = bannedByUID_EndPos - bannedByUID_StartPos;
                            bannedByUID = buffer_logline.substr(bannedByUID_StartPos, bannedByUID_Length);
                        }
                        else bannedByUID = "No UID";

                        if (lastUIDBanRule.length != 0 && lastIPBanRule.length != 0) {
                            if (checkFunctions.isMatchingBanRules(bannedByNickname, banReason, bantime, lastUIDBanRule, lastIPBanRule)) {
                                bannedUID_StartPos = lastUIDBanRule.indexOf("' cluid='") + 9;
                                bannedUID_Length = lastUIDBanRule.lastIndexOf("' bantime=") - bannedUID_StartPos;
                                bannedIP_StartPos = lastIPBanRule.indexOf("' ip='") + 6;
                                bannedIP_Length = lastIPBanRule.lastIndexOf("' bantime=") - bannedIP_StartPos;
                                bannedByID_StartPos = lastIPBanRule.lastIndexOf("'(id:") + 5;
                                bannedByID_Length = lastIPBanRule.length - bannedByID_StartPos - 1;

                                bannedUID = lastUIDBanRule.substr(bannedUID_StartPos, bannedUID_Length);
                                bannedIP = lastIPBanRule.substr(bannedIP_StartPos, bannedIP_Length);
                                bannedByID = lastIPBanRule.substr(bannedByID_StartPos, bannedByID_Length);
                            }
                            else {
                                bannedUID = bannedIP = "Unknown";
                                bannedByID = "0";
                            }
                        }

                        if (!checkFunctions.isDuplicateBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, Number(bannedByID), bannedByUID, banReason, Number(bantime))) {
                            BanList.resizeFill(BanListID + 1, "Ban");
                            BanList[BanListID].addBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, Number(bannedByID), bannedByUID, banReason, Number(bantime));
                            BanListID++;
                        }
                    }

                    // Kicks
                    else if (kickMatch) {
                        if (buffer_logline.lastIndexOf(" reasonmsg=") != -1) {
                            kickReason_StartPos = buffer_logline.lastIndexOf(" reasonmsg=") + 11;
                            kickReason_Length = buffer_logline.length - kickReason_StartPos - 1;
                            kickReason = buffer_logline.substr(kickReason_StartPos, kickReason_Length);
                        }
                        else kickReason = "";

                        kickedByNickname_StartPos = buffer_logline.lastIndexOf(" invokername=") + 13;
                        kickedByNickname_EndPos = buffer_logline.lastIndexOf(" invokeruid=");
                        kickedByNickname_Length = kickedByNickname_EndPos - kickedByNickname_StartPos;
                        kickedByUID_StartPos = kickedByNickname_EndPos + 12;
                        if (buffer_logline.indexOf("invokeruid=serveradmin") == -1) {
                            kickedByUID_EndPos = buffer_logline.indexOf("=", kickedByUID_StartPos) + 1;
                        }
                        else kickedByUID_EndPos = buffer_logline.indexOf("reasonmsg") - 1;
                        kickedByUID_Length = kickedByUID_EndPos - kickedByUID_StartPos;

                        kickedByNickname = buffer_logline.substr(kickedByNickname_StartPos, kickedByNickname_Length);
                        kickedByUID = buffer_logline.substr(kickedByUID_StartPos, kickedByUID_Length);

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

                    // Todo: Check if fixed.
                    if (ServerGroupName_StartPos == 27) {
                        ServerGroupName_StartPos = buffer_logline.indexOf(") was removed from servergroup '") + 32;
                    }

                    ServerGroupName_EndPos = buffer_logline.lastIndexOf("'(id:", buffer_logline.lastIndexOf(") by client '"));
                    ServerGroupName_Length = ServerGroupName_EndPos - ServerGroupName_StartPos;

                    ID_StartPos = ServerGroupName_EndPos + 5;
                    ID_EndPos = buffer_logline.indexOf(")", ID_StartPos);

                    ID_Length = ID_EndPos - ID_StartPos;

                    DateTime = buffer_logline.substr(0, 19);
                    ID = Number(buffer_logline.substr(ID_StartPos, ID_Length));
                    ServerGroupName = buffer_logline.substr(ServerGroupName_StartPos, ServerGroupName_Length);

                    var clientID = Number(buffer_logline.substr(67, buffer_logline.indexOf(") was ") - 67));

                    if (ServerGroupList.length < ID + 1) {
                        ServerGroupList.resizeFill(ID + 1, "ServerGroup");
                    }

                    if (ServerGroupList[ID].getID() == 0) {
                        ServerGroupList[ID].addServerGroupInformation(ID, ServerGroupName, "Unknown");
                    }

                    // Todo: Add client to list if not already existing?
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

                    complaintAboutNickname_Length = complaintAboutNickname_EndPos - complaintAboutNickname_StartPos;
                    complaintAboutID_Length = complaintAboutID_EndPos - complaintAboutID_StartPos;
                    complaintReason_Length = complaintReason_EndPos - complaintReason_StartPos;
                    complaintByNickname_Length = complaintByNickname_EndPos - complaintByNickname_StartPos;
                    complaintByID_Length = complaintByID_EndPos - complaintByID_StartPos;

                    DateTime = buffer_logline.substr(0, 19);
                    complaintAboutNickname = buffer_logline.substr(complaintAboutNickname_StartPos, complaintAboutNickname_Length);
                    complaintAboutID = buffer_logline.substr(complaintAboutID_StartPos, complaintAboutID_Length);
                    complaintReason = buffer_logline.substr(complaintReason_StartPos, complaintReason_Length);
                    complaintByNickname = buffer_logline.substr(complaintByNickname_StartPos, complaintByNickname_Length);
                    complaintByID = buffer_logline.substr(complaintByID_StartPos, complaintByID_Length);

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

                    channelID_Length = channelID_EndPos - channelID_StartPos;
                    filename_Length = filename_EndPos - filename_StartPos;
                    uploadedByNickname_Length = uploadedByNickname_EndPos - uploadedByNickname_StartPos;
                    uploadedByID_Length = uploadedByID_EndPos - uploadedByID_StartPos;

                    DateTime = buffer_logline.substr(0, 19);
                    channelID = buffer_logline.substr(channelID_StartPos, channelID_Length);
                    filename = buffer_logline.substr(filename_StartPos, filename_Length);
                    uploadedByNickname = buffer_logline.substr(uploadedByNickname_StartPos, uploadedByNickname_Length);
                    uploadedByID = buffer_logline.substr(uploadedByID_StartPos, uploadedByID_Length);

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
                        ID_Length = ID_EndPos - ID_StartPos;
                        ID = Number(buffer_logline.substr(ID_StartPos, ID_Length));
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

                    channelID_Length = channelID_EndPos - channelID_StartPos;
                    filename_Length = filename_EndPos - filename_StartPos;
                    deletedByNickname_Length = deletedByNickname_EndPos - deletedByNickname_StartPos;
                    deletedByID_Length = deletedByID_EndPos - deletedByID_StartPos;

                    channelID = buffer_logline.substr(channelID_StartPos, channelID_Length);
                    filename = buffer_logline.substr(filename_StartPos, filename_Length);
                    deletedByNickname = buffer_logline.substr(deletedByNickname_StartPos, deletedByNickname_Length);
                    deletedByID = buffer_logline.substr(deletedByID_StartPos, deletedByID_Length);

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
                        ServerGroupName_Length = ServerGroupName_EndPos - ServerGroupName_StartPos;
                        eventType = 2;
                    }
                    else if (buffer_logline.indexOf(") was copied by '") != -1) {
                        ID_StartPos = buffer_logline.lastIndexOf("'(id:") + 5;
                        ID_EndPos = buffer_logline.length - 1;
                        ServerGroupName_StartPos = buffer_logline.indexOf(") to '") + 6;
                        ServerGroupName_Length = ID_StartPos - 5 - ServerGroupName_StartPos;
                        eventType = 3;
                    }

                    if (eventType != -1) {
                        if (eventType == 0 || eventType == 1) {
                            ServerGroupName_StartPos = buffer_logline.indexOf("| servergroup '") + 15;
                            ServerGroupName_Length = ID_StartPos - 5 - ServerGroupName_StartPos;
                        }

                        ID_Length = ID_EndPos - ID_StartPos;

                        DateTime = buffer_logline.substr(0, 19);
                        ID = Number(buffer_logline.substr(ID_StartPos, ID_Length));
                        ServerGroupName = buffer_logline.substr(ServerGroupName_StartPos, ServerGroupName_Length);

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
