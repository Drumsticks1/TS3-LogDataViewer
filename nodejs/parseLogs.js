// parseLogs.js : Parsing of the logs.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  checkFunctions = require("./checkFunctions.js"),
  globalVariables = require("./globalVariables.js"),
  log = require("./log.js"),
  Ban = require("./Ban.js"),
  Channel = require("./Channel.js"),
  Client = require("./Client.js"),
  Complaint = require("./Complaint.js"),
  Kick = require("./Kick.js"),
  ServerGroup = require("./ServerGroup.js"),
  Upload = require("./Upload.js");

var Logs = globalVariables.Logs,
  ClientList = globalVariables.ClientList,
  ServerGroupList = globalVariables.ServerGroupList,
  BanList = globalVariables.BanList,
  KickList = globalVariables.KickList,
  ComplaintList = globalVariables.ComplaintList,
  UploadList = globalVariables.UploadList,
  ChannelList = globalVariables.ChannelList;

// Object containing matching patterns for parsing.
var match = {
  // Set in parseLogs in order to use the latest globalVariables.virtualServer value.
  "VirtualServer": [],
  "VirtualServerBase": [],

  // VirtualServer
  "banRule": "ban added reason='",
  "complaint": "complaint added for client '",
  "serverGroupEvent": "servergroup '",
  "deleteUser1": "client '",
  "queryClientConnect": "query client connected '",

  // VirtualServerBase
  "connect": "client connected '",
  "disconnect": "client disconnected '",
  "channel": "channel '",

  // v3.0.11.4 and before : VirtualServer
  // since v3.0.12.0      : VirtualServerBase
  "upload": "file upload to ",
  "uploadDeletion": "file deleted from",

  // Additional patterns
  "serverGroupAssignment": ") was added to servergroup '",
  "serverGroupRemoval": ") was removed from servergroup '",
  "deleteUser2": ") got deleted by client '",
  "channelCreation": ") created by '",
  "subChannelCreation": ") created as sub channel of '",
  "channelEdit": ") edited by '",
  "channelDeletion": ") deleted by '"
};

var currentLine, boundaries, logPattern;

/**
 * Returns  the end pos of the match + 1
 * @param {string} searchString
 * @returns {number} the end pos of the match + 1
 */
String.prototype.indexOfEndPlusOne = function (searchString) {
  var indexOf = this.indexOf(searchString);
  return indexOf == -1 ? -1 : indexOf + searchString.length;
};

/**
 * Returns a substring of the current currentLine that contains the information matching the given boundaries identifier.
 * @param {string} boundariesIdentifier
 * @returns {string} parsed information, substring of the current currentLine.
 */
function getSubstring(boundariesIdentifier) {
  return currentLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
}

/**
 * Parses the logs.
 */
exports.parseLogs = function () {
  log.info("Starting log parsing.");

  /**
   * Patterns and their ts3server versions (ordered as below):
   * - v3.0.11.4 and before
   * - since v3.0.12.0
   */
  match.VirtualServer = [
    "|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| ",
    "|INFO    |VirtualServer |" + globalVariables.virtualServer + "  |"
  ];
  match.VirtualServerBase = [
    "|INFO    |VirtualServerBase|  " + globalVariables.virtualServer + "| ",
    "|INFO    |VirtualServerBase|" + globalVariables.virtualServer + "  |"
  ];

  var lastUIDBanRule = "", lastIPBanRule = "", isBan, isKick, isLastLog;

  boundaries = {
    // General
    "DateTime": [0, 19],
    "clientId": [0, 0], "Nickname": [0, 0], "IP": [0, 0],

    // Ban
    "bannedUID": [0, 0], "bannedIP": [0, 0], "bannedByID": [0, 0], "bannedByNickname": [0, 0],
    "bannedByUID": [0, 0], "banReason": [0, 0], "banTime": [0, 0],

    // Kick
    "kickReason": [0, 0], "kickedByNickname": [0, 0], "kickedByUID": [0, 0],

    // ServerGroup
    "ServerGroupID": [0, 0], "ServerGroupName": [0, 0],

    // Complaint
    "complaintAboutNickname": [0, 0], "complaintAboutID": [0, 0], "complaintReason": [0, 0],
    "complaintByNickname": [0, 0], "complaintByID": [0, 0],

    // Upload
    "channelID": [0, 0], "filename": [0, 0], "uploadedByNickname": [0, 0], "uploadedByID": [0, 0],
    "channelName": [0, 0]
  };

  log.debug("Parsing new logs.");
  for (var i = 0; i < Logs.length; i++) {
    if (!Logs[i].parsed && !Logs[i].ignored) {
      if (i + 1 == Logs.length)
        isLastLog = true;

      var logfileData = fs.readFileSync(globalVariables.logDirectory + Logs[i].logName, "utf8");

      currentLine = logfileData.substring(0, logfileData.indexOf("\n"));

      if (currentLine.indexOf("|INFO    |VirtualServer |  " + globalVariables.virtualServer + "| listening on") != -1)
        logPattern = 0;
      else if (currentLine.indexOf("|INFO    |VirtualServer |" + globalVariables.virtualServer + "  |listening on") != -1)
        logPattern = 1;
      // Todo: Add option for unknown log pattern!

      while (logfileData.length > 0) {
        currentLine = logfileData.substring(0, logfileData.indexOf("\n"));
        logfileData = logfileData.substring(currentLine.length + 1);

        var lineSeverType = 0,
          beginOfParsingBlock = currentLine.indexOfEndPlusOne(match.VirtualServer[logPattern]),
          checkIfUpload = false;

        if (beginOfParsingBlock == -1) {
          lineSeverType = 1;
          beginOfParsingBlock = currentLine.indexOfEndPlusOne(match.VirtualServerBase[logPattern])
        }

        // Skip parsing for lines that aren't relevant.
        if (beginOfParsingBlock == -1)
          continue;

        switch (lineSeverType) {
          // VirtualSever
          case 0:
            // Client assignments to and client removals from a server group
            if (currentLine.indexOf(match.serverGroupAssignment) != -1 || currentLine.indexOf(match.serverGroupRemoval) != -1) {
              if (currentLine.indexOf(match.serverGroupAssignment) != -1)
                boundaries.ServerGroupName[0] = currentLine.indexOf(") was added to servergroup '") + 28;
              else
                boundaries.ServerGroupName[0] = currentLine.indexOf(") was removed from servergroup '") + 32;

              boundaries.ServerGroupName[1] = currentLine.lastIndexOf("'(id:", currentLine.lastIndexOf(") by client '"));
              boundaries.ServerGroupID[0] = boundaries.ServerGroupName[1] + 5;
              boundaries.ServerGroupID[1] = currentLine.indexOf(")", boundaries.ServerGroupName[0]);
              boundaries.clientId = [
                currentLine.indexOf("client (id:") + 11,
                currentLine.indexOf(") was ")];

              DateTime = getSubstring("DateTime");
              clientId = Number(getSubstring("clientId"));

              var ServerGroupID = Number(getSubstring("ServerGroupID")),
                ServerGroupName = getSubstring("ServerGroupName");

              var serverGroupObject = ServerGroup.getServerGroupByServerGroupId(ServerGroupList, ServerGroupID);

              if (serverGroupObject === null)
                ServerGroup.addServerGroup(ServerGroupList, ServerGroupID, "Unknown", ServerGroupName);

              Client.fillArrayWithDummyClients(ClientList, clientId);

              if (currentLine.indexOf(match.serverGroupAssignment) != -1) {
                if (!checkFunctions.isDuplicateServerGroup(clientId, ServerGroupID))
                  ClientList[clientId].addServerGroup(ServerGroupID, DateTime);
              }
              else
                ClientList[clientId].removeServerGroupByID(ServerGroupID);
            }

            // Query client connects
            else if (currentLine.indexOf(match.queryClientConnect) != -1) {
              boundaries.Nickname = [
                currentLine.indexOf("query client connected '") + 24,
                currentLine.lastIndexOf("'(id:") - 6]; // -6 for ignoring the port.

              boundaries.clientId = [
                boundaries.Nickname[1] + 11,
                currentLine.length - 1];

              boundaries.IP = [
                currentLine.lastIndexOf(" from ") + 6,
                boundaries.Nickname[1]];

              DateTime = getSubstring("DateTime");
              clientId = Number(getSubstring("clientId"));

              Client.fillArrayWithDummyClients(ClientList, clientId);

              if (ClientList[clientId].clientId == -1)
                ClientList[clientId].updateClientId(clientId);

              ClientList[clientId].addNickname(getSubstring("Nickname"));

              if (globalVariables.bufferData) {
                if (!checkFunctions.isDuplicateConnection(clientId, DateTime))
                  ClientList[clientId].addConnection(DateTime);
              }
              else ClientList[clientId].addConnection(DateTime);

              ClientList[clientId].addIP(getSubstring("IP"));
            }

            // Ban Rules
            // Currently only used for rules of 'direct' (= right click on client and "ban client") bans.
            else if (currentLine.indexOf(match.banRule) == beginOfParsingBlock) {
              if (currentLine.indexOf("' cluid='") != -1 && currentLine.indexOf("' ip='") == -1)
                lastUIDBanRule = currentLine;
              else if (currentLine.indexOf("' ip='") != -1 && currentLine.indexOf("' cluid='") == -1)
                lastIPBanRule = currentLine;
            }

            // Complaints
            else if (currentLine.indexOf(match.complaint) == beginOfParsingBlock) {
              boundaries.complaintAboutNickname = [
                currentLine.indexOf("complaint added for client '") + 28,
                currentLine.indexOf("'(id:")];

              boundaries.complaintAboutID = [
                boundaries.complaintAboutNickname[1] + 5,
                currentLine.indexOf(") reason '")];

              boundaries.complaintReason = [
                boundaries.complaintAboutID[1] + 10,
                currentLine.lastIndexOf("' by client '")];

              boundaries.complaintByNickname = [
                boundaries.complaintReason[1] + 13,
                currentLine.lastIndexOf("'(id:")];

              boundaries.complaintByID = [
                boundaries.complaintByNickname[1] + 5,
                currentLine.length - 1];

              DateTime = getSubstring("DateTime");
              var complaintAboutNickname = getSubstring("complaintAboutNickname"),
                complaintAboutID = Number(getSubstring("complaintAboutID")),
                complaintReason = getSubstring("complaintReason"),
                complaintByNickname = getSubstring("complaintByNickname"),
                complaintByID = Number(getSubstring("complaintByID"));

              if (!checkFunctions.isDuplicateComplaint(DateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID))
                Complaint.addComplaint(ComplaintList, DateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID);
            }

            // Client Deletions
            else if (currentLine.indexOf(match.deleteUser1) == beginOfParsingBlock) {
              if (currentLine.indexOf(match.deleteUser2) != -1) {
                boundaries.clientId[0] = currentLine.lastIndexOf(") got deleted by client '");
                boundaries.clientId[1] = currentLine.lastIndexOf("'(id:", boundaries.clientId[0]) + 5;

                ClientList[Number(getSubstring("clientId"))].deleteClient();
              }
            }

            // Servergroup additions, deletions, renaming and copying
            else if (currentLine.indexOf(match.serverGroupEvent) == beginOfParsingBlock) {
              // 0 --> added
              // 1 --> deleted
              // 2 --> renamed
              // 3 --> copied // just like "added"
              var eventTypeS = -1;

              boundaries.ServerGroupID[0] = currentLine.indexOf("'(id:") + 5;

              if (currentLine.indexOf(") was added by '") != -1) {
                boundaries.ServerGroupID[1] = currentLine.indexOf(") was added by '");
                eventTypeS = 0;
              }
              else if (currentLine.indexOf(") was deleted by '") != -1) {
                boundaries.ServerGroupID[1] = currentLine.indexOf(") was deleted by '");
                eventTypeS = 1;
              }
              else if (currentLine.indexOf(") was renamed to '") != -1) {
                boundaries.ServerGroupID[1] = currentLine.indexOf(") was renamed to '");
                boundaries.ServerGroupName = [
                  currentLine.indexOf(") was renamed to '") + 18,
                  currentLine.lastIndexOf("' by '", currentLine.length - 1)];

                eventTypeS = 2;
              }
              else if (currentLine.indexOf(") was copied by '") != -1) {
                boundaries.ServerGroupID = [
                  currentLine.lastIndexOf("'(id:") + 5,
                  currentLine.length - 1];

                boundaries.ServerGroupName = [
                  currentLine.indexOf(") to '") + 6,
                  boundaries.ServerGroupID[0] - 5];

                eventTypeS = 3;
              }

              if (eventTypeS != -1) {
                if (eventTypeS == 0 || eventTypeS == 1) {
                  boundaries.ServerGroupName = [
                    currentLine.indexOf("servergroup '") + 13,
                    boundaries.ServerGroupID[0] - 5];
                }

                DateTime = getSubstring("DateTime");
                ServerGroupID = Number(getSubstring("ServerGroupID"));
                ServerGroupName = getSubstring("ServerGroupName");

                if (eventTypeS == 1 || eventTypeS == 2) {
                  if (ServerGroup.getServerGroupByServerGroupId(ServerGroupList, ServerGroupID) === null)
                    ServerGroup.addServerGroup(ServerGroupList, ServerGroupID, "Unknown", ServerGroupName);
                }

                switch (eventTypeS) {
                  case 0:
                  case 3:
                    ServerGroup.addServerGroup(ServerGroupList, ServerGroupID, DateTime, ServerGroupName);
                    break;

                  case 1:
                    ServerGroup.getServerGroupByServerGroupId(ServerGroupList, ServerGroupID).deleteServerGroup();
                    break;

                  case 2:
                    ServerGroup.getServerGroupByServerGroupId(ServerGroupList, ServerGroupID).renameServerGroup(ServerGroupName);
                }
              }
            }
            else checkIfUpload = true;

            break;

          // VirtualServerBase
          case 1:
            // Connects
            if (currentLine.indexOf(match.connect) == beginOfParsingBlock) {
              boundaries.IP = [
                currentLine.lastIndexOf(" ") + 1,
                currentLine.length - 6]; // -6 for ignoring the port.

              boundaries.Nickname = [
                currentLine.indexOf("client connected '") + 18,
                currentLine.lastIndexOf("'(id:")];

              boundaries.clientId = [
                boundaries.Nickname[1] + 5,
                boundaries.IP[0] - 7];

              var DateTime = getSubstring("DateTime"),
                clientId = Number(getSubstring("clientId"));

              Client.fillArrayWithDummyClients(ClientList, clientId);

              if (ClientList[clientId].clientId == -1)
                ClientList[clientId].updateClientId(clientId);

              ClientList[clientId].addNickname(getSubstring("Nickname"));

              if (globalVariables.bufferData) {
                if (!checkFunctions.isDuplicateConnection(clientId, DateTime))
                  ClientList[clientId].addConnection(DateTime);
              }
              else ClientList[clientId].addConnection(DateTime);

              ClientList[clientId].addIP(getSubstring("IP"));

              if (isLastLog)
                ClientList[clientId].connect();
            }

            // Disconnects (including kicks and bans)
            else if (currentLine.indexOf(match.disconnect) == beginOfParsingBlock) {
              isBan = isKick = false;

              boundaries.Nickname = [
                currentLine.indexOf("client disconnected '") + 21,
                currentLine.lastIndexOf("'(id:")];

              boundaries.clientId[0] = boundaries.Nickname[1] + 5;

              if (currentLine.lastIndexOf(") reason 'reasonmsg") == -1) {
                boundaries.clientId[1] = currentLine.lastIndexOf(") reason 'invokerid=");

                if (currentLine.lastIndexOf(" bantime=") == -1)
                  isKick = true;
                else
                  isBan = true;
              } else
                boundaries.clientId[1] = currentLine.lastIndexOf(") reason 'reasonmsg");

              DateTime = getSubstring("DateTime");
              clientId = Number(getSubstring("clientId"));

              var Nickname = getSubstring("Nickname");

              if (ClientList.length < clientId + 1) {
                Client.fillArrayWithDummyClients(ClientList, clientId);
                ClientList[clientId].updateClientId(clientId);
              }

              if (ClientList[clientId].getNicknameCount() == 0 || ClientList[clientId].getNicknameByID(0) != Nickname)
                ClientList[clientId].addNickname(Nickname);

              if (isLastLog)
                ClientList[clientId].disconnect();

              // Bans
              if (isBan) {
                var validUID = true;
                boundaries.bannedByNickname[0] = currentLine.indexOf(" invokername=", boundaries.clientId[1]) + 13;

                if (currentLine.indexOf("invokeruid=") != -1) {
                  boundaries.bannedByNickname[1] = currentLine.indexOf(" invokeruid=", boundaries.bannedByNickname[0]);
                  boundaries.bannedByUID = [
                    boundaries.bannedByNickname[1] + 12,
                    currentLine.indexOf(" reasonmsg", boundaries.bannedByNickname[1])];
                }
                else {
                  boundaries.bannedByNickname[1] = boundaries.bannedByUID[1] = currentLine.indexOf(" reasonmsg");
                  validUID = false;
                }

                boundaries.banReason[0] = boundaries.bannedByUID[1] + 11;
                if (currentLine.indexOf("reasonmsg=") != -1) {
                  boundaries.banReason[1] = currentLine.indexOf(" bantime=", boundaries.bannedByUID[1]);
                  boundaries.banTime[0] = boundaries.banReason[1] + 9;
                }
                else {
                  boundaries.banReason[1] = boundaries.banReason[0];
                  boundaries.banTime[0] = boundaries.banReason[1] + 8;
                }

                boundaries.banTime[1] = currentLine.length - 1;

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

                clientId = Number(clientId);
                bannedByID = Number(bannedByID);

                if (!checkFunctions.isDuplicateBan(DateTime, clientId, Nickname, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, banTime))
                  Ban.addBan(BanList, DateTime, clientId, Nickname, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, banTime);
              }

              // Kicks
              else if (isKick) {
                var kickedByNickname, kickedByUID, kickReason = "";

                if (currentLine.lastIndexOf(" reasonmsg=") != -1) {
                  boundaries.kickReason = [
                    currentLine.lastIndexOf(" reasonmsg=") + 11,
                    currentLine.length - 1
                  ];

                  kickReason = getSubstring("kickReason");
                }

                boundaries.kickedByNickname = [
                  currentLine.lastIndexOf(" invokername=") + 13,
                  currentLine.lastIndexOf(" invokeruid=")
                ];

                boundaries.kickedByUID[0] = boundaries.kickedByNickname[1] + 12;

                if (currentLine.indexOf("invokeruid=serveradmin") == -1)
                  boundaries.kickedByUID[1] = currentLine.indexOf("=", boundaries.kickedByUID[0]) + 1;
                else
                  boundaries.kickedByUID[1] = currentLine.indexOf("reasonmsg") - 1;

                kickedByNickname = getSubstring("kickedByNickname");
                kickedByUID = getSubstring("kickedByUID");

                if (!checkFunctions.isDuplicateKick(DateTime, clientId, Nickname, kickedByNickname, kickedByUID, kickReason))
                  Kick.addKick(KickList, DateTime, clientId, Nickname, kickedByNickname, kickedByUID, kickReason);
              }
            }

            // Channel additions, edits or deletions.
            else if (currentLine.indexOf(match.channel) == beginOfParsingBlock) {
              // 0 --> added
              // 1 --> edited
              // 2 --> edited undefined --> added
              // 3 --> deleted
              var eventTypeC = -1;

              if (currentLine.indexOf(match.channelEdit) != -1) {
                boundaries.channelID[1] = currentLine.indexOf(match.channelEdit);
                eventTypeC = 1;
              }
              else if (currentLine.indexOf(match.channelCreation) != -1) {
                boundaries.channelID[1] = currentLine.indexOf(match.channelCreation);
                eventTypeC = 0;
              }
              else if (currentLine.indexOf(match.subChannelCreation) != -1) {
                boundaries.channelID[1] = currentLine.indexOf(match.subChannelCreation);
                eventTypeC = 0;
              }
              else if (currentLine.indexOf(match.channelDeletion) != -1) {
                boundaries.channelID[1] = currentLine.indexOf(match.channelDeletion);
                eventTypeC = 3;
              }

              if (eventTypeC != -1) {
                boundaries.channelID[0] = currentLine.indexOf("'(id:") + 5;

                boundaries.channelName = [
                  currentLine.indexOf("channel '") + 9,
                  boundaries.channelID[0] - 5];

                DateTime = getSubstring("DateTime");
                var channelID = Number(getSubstring("channelID")),
                  channelName = getSubstring("channelName");

                var channelObject = Channel.getChannelByChannelId(ChannelList, channelID);

                if (eventTypeC == 1 && channelObject === null)
                  eventTypeC = 2;

                switch (eventTypeC) {
                  case 2:
                    DateTime = "Unknown";
                  // Intended fallthrough
                  case 0:
                    if (Channel.getChannelByChannelId(ChannelList, channelID) === null)
                      Channel.addChannel(ChannelList, channelID, DateTime, channelName);
                    break;

                  case 1:
                    channelObject.renameChannel(channelName);
                    break;

                  case 3:
                    channelObject.deleteChannel();
                }
              }
            }
            else checkIfUpload = true;
        }

        // Upload / file system events
        // VirtualServer for version 3.0.11.4 and before
        // VirtualServerBase since version 3.0.12.0
        if (checkIfUpload) {
          // Uploads
          if (currentLine.indexOf(match.upload) == beginOfParsingBlock) {
            boundaries.channelID = [
              currentLine.indexOf("file upload to (id:") + 19,
              currentLine.indexOf(")")];

            boundaries.filename = [
              boundaries.channelID[1] + 4,
              currentLine.lastIndexOf("' by client '")];

            boundaries.uploadedByNickname = [
              boundaries.filename[1] + 13,
              currentLine.lastIndexOf("'(id:")];

            boundaries.uploadedByID = [
              boundaries.uploadedByNickname[1] + 5,
              currentLine.length - 1];

            DateTime = getSubstring("DateTime");
            channelID = Number(getSubstring("channelID"));

            if (Channel.getChannelByChannelId(ChannelList, channelID) === null)
              Channel.addChannel(ChannelList, channelID, "Unknown", "Unknown");

            var filename = getSubstring("filename"),
              uploadedByNickname = getSubstring("uploadedByNickname"),
              uploadedByID = Number(getSubstring("uploadedByID"));

            if (!checkFunctions.isDuplicateUpload(DateTime, channelID, filename, uploadedByID, uploadedByNickname))
              Upload.addUpload(UploadList, DateTime, channelID, filename, uploadedByID, uploadedByNickname);
          }

          // Upload Deletions
          else if (currentLine.indexOf(match.uploadDeletion) == beginOfParsingBlock) {
            boundaries.channelID = [
              currentLine.indexOf("file deleted from (id:") + 22,
              currentLine.indexOf(")")];

            boundaries.filename = [
              boundaries.channelID[1] + 4,
              currentLine.lastIndexOf("' by client '")];

            boundaries.deletedByNickname = [
              boundaries.filename[1] + 13,
              currentLine.lastIndexOf("'(id:")];

            boundaries.deletedByID = [
              boundaries.deletedByNickname[1] + 5,
              currentLine.length - 1];

            Upload.addDeletedBy(
              Number(getSubstring("channelID")),
              getSubstring("filename"),
              Number(getSubstring("deletedByID")),
              getSubstring("deletedByNickname"));
          }
        }
      }

      Logs[i].parsed = true;
    }
  }
};