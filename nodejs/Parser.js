// Parser.js : 
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

var parsers = {
  ban: require("./parsers/ban.js"),
  channel: require("./parsers/channel.js"),
  client: require("./parsers/client.js"),
  complaint: require("./parsers/complaint.js"),
  kick: require("./parsers/kick.js"),
  serverGroup: require("./parsers/serverGroup.js"),
  upload: require("./parsers/upload.js")
};

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
  "deleteClient1": "client '",
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
  "deleteClient2": ") got deleted by client '",
  "channelCreation": ") created by '",
  "subChannelCreation": ") created as sub channel of '",
  "channelEdit": ") edited by '",
  "channelDeletion": ") deleted by '"
};

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
 * Parses the logs.
 */
module.exports = {

  /**
   * Calls parseLog for all Logs that are neither parsed nor ignored.
   * Sets the parsed flag of the parsed Logs to true.
   */
  parseLogs: function () {
    log.info("Starting log parsing.");

    for (var i = 0; i < Logs.length; i++) {
      if (!Logs[i].parsed && !Logs[i].ignored) {
        this.parseLog(Logs[i].logName, i + 1 == Logs.length);
        Logs[i].parsed = true;
      }
    }
  },

  /**
   * Parses the given logLine and returns its dateTime timestamp.
   * @param {string} logLine
   * @returns {string} dateTime of the logLine.
   */
  parseDateTime: function (logLine) {
    return logLine.substring(0, 19);
  },

  /**
   * Parses the Log with the given name.
   * Calls the parsers in the parsers folder.
   * @param {string} logName name of the Log.
   * @param {boolean} isLastLog true if the log is the last (/newest) log.
   */
  parseLog: function (logName, isLastLog) {
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

    var lastUIDBanRule = "", lastIPBanRule = "", logPattern,
      logfileData = fs.readFileSync(globalVariables.logDirectory + logName, "utf8"),
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
              res = parsers.serverGroup.parseServerGroupAssignment(currentLine);
            else
              res = parsers.serverGroup.parseServerGroupRemoval(currentLine);

            var DateTime = this.parseDateTime(currentLine),
              clientId = res.clientId,
              ServerGroupID = res.ServerGroupID;

            var serverGroupObject = ServerGroup.getServerGroupByServerGroupId(ServerGroupList, ServerGroupID);

            if (serverGroupObject === null)
              ServerGroup.addServerGroup(ServerGroupList, ServerGroupID, "Unknown", res.ServerGroupName);

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
            res = parsers.client.parseQueryClientConnect(currentLine);

            DateTime = this.parseDateTime(currentLine);
            clientId = res.clientId;

            Client.fillArrayWithDummyClients(ClientList, clientId);

            if (ClientList[clientId].clientId == -1)
              ClientList[clientId].updateClientId(clientId);

            ClientList[clientId].addNickname(res.Nickname);

            if (globalVariables.bufferData) {
              if (!checkFunctions.isDuplicateConnection(clientId, DateTime))
                ClientList[clientId].addConnection(DateTime);
            }
            else ClientList[clientId].addConnection(DateTime);

            ClientList[clientId].addIP(res.IP);
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
            var res = parsers.complaint.parseComplaint(currentLine);

            DateTime = this.parseDateTime(currentLine);

            // Todo: Modify check functions so that they accept objects, maybe also change the addObject functions.
            if (!checkFunctions.isDuplicateComplaint(DateTime, res.complaintAboutNickname, res.complaintAboutID, res.complaintReason, res.complaintByNickname, res.complaintByID))
              Complaint.addComplaint(ComplaintList, DateTime, res.complaintAboutNickname, res.complaintAboutID, res.complaintReason, res.complaintByNickname, res.complaintByID);
          }

          // Todo: Check functionality
          // Client Deletions
          else if (currentLine.indexOf(match.deleteClient1) == beginOfParsingBlock) {
            // Check if the else if and the if can be combined
            if (currentLine.indexOf(match.deleteClient2) != -1) {
              ClientList[parsers.client.parseClientDeletion(currentLine).clientId].deleteClient();
            }
          }

          // Servergroup additions, deletions, renaming and copying
          else if (currentLine.indexOf(match.serverGroupEvent) == beginOfParsingBlock) {
            // 0 --> added
            // 1 --> deleted
            // 2 --> renamed
            // 3 --> copied // just like "added"
            var eventTypeS = -1;

            // Todo: move the patterns into the match object
            if (currentLine.indexOf(") was added by '") != -1) {
              eventTypeS = 0;
              res = parsers.serverGroup.parseServerGroupCreation(currentLine);
            }
            else if (currentLine.indexOf(") was deleted by '") != -1) {
              eventTypeS = 1;
              res = parsers.serverGroup.parseServerGroupDeletion(currentLine);
            }
            else if (currentLine.indexOf(") was renamed to '") != -1) {
              eventTypeS = 2;
              res = parsers.serverGroup.parseServerGroupRenaming(currentLine);
            }
            else if (currentLine.indexOf(") was copied by '") != -1) {
              eventTypeS = 3;
              res = parsers.serverGroup.parseServerGroupCopying(currentLine);
            }

            // Todo: Check if check is required
            if (eventTypeS != -1) {

              DateTime = this.parseDateTime(currentLine);
              ServerGroupID = res.ServerGroupID;
              var ServerGroupName = res.ServerGroupName;

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
            res = parsers.client.parseClientConnect(currentLine);

            DateTime = this.parseDateTime(currentLine);
            clientId = res.clientId;

            Client.fillArrayWithDummyClients(ClientList, clientId);

            if (ClientList[clientId].clientId == -1)
              ClientList[clientId].updateClientId(clientId);

            ClientList[clientId].addNickname(res.Nickname);

            if (globalVariables.bufferData) {
              if (!checkFunctions.isDuplicateConnection(clientId, DateTime))
                ClientList[clientId].addConnection(DateTime);
            }
            else ClientList[clientId].addConnection(DateTime);

            ClientList[clientId].addIP(res.IP);

            if (isLastLog)
              ClientList[clientId].connect();
          }

          // Disconnects (including kicks and bans)
          else if (currentLine.indexOf(match.disconnect) == beginOfParsingBlock) {
            var isBan = false,
              isKick = false;

            if (currentLine.lastIndexOf(") reason 'reasonmsg") == -1) {
              if (currentLine.lastIndexOf(" bantime=") == -1)
                isKick = true;
              else
                isBan = true;
            }

            res = parsers.client.parseClientDisconnect(currentLine);

            DateTime = this.parseDateTime(currentLine);
            clientId = res.clientId;
            var Nickname = res.Nickname;

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
              res = parsers.ban.parseBan(currentLine, res.boundaries, lastUIDBanRule, lastIPBanRule);

              if (!checkFunctions.isDuplicateBan(DateTime, clientId, Nickname, res.bannedUID, res.bannedIP, res.bannedByID, res.bannedByNickname, res.bannedByUID, res.banReason, res.banTime))
                Ban.addBan(BanList, DateTime, clientId, Nickname, res.bannedUID, res.bannedIP, res.bannedByID, res.bannedByNickname, res.bannedByUID, res.banReason, res.banTime);
            }

            // Kicks
            else if (isKick) {
              res = parsers.kick.parseKick(currentLine, res.boundaries);

              if (!checkFunctions.isDuplicateKick(DateTime, clientId, Nickname, res.kickedByNickname, res.kickedByUID, res.kickReason))
                Kick.addKick(KickList, DateTime, clientId, Nickname, res.kickedByNickname, res.kickedByUID, res.kickReason);
            }
          }

          // Todo: Optimize
          // Channel additions, edits or deletions.
          else if (currentLine.indexOf(match.channel) == beginOfParsingBlock) {
            // 0 --> added
            // 1 --> edited
            // 2 --> edited undefined --> added
            // 3 --> deleted
            var eventTypeC = -1;

            if (currentLine.indexOf(match.channelEdit) != -1) {
              eventTypeC = 1;
              res = parsers.channel.parseChannelEdit(currentLine);
            }
            else if (currentLine.indexOf(match.channelCreation) != -1) {
              eventTypeC = 0;
              res = parsers.channel.parseChannelCreation(currentLine);
            }
            else if (currentLine.indexOf(match.subChannelCreation) != -1) {
              eventTypeC = 0;
              res = parsers.channel.parseSubChannelCreation(currentLine);
            }
            else if (currentLine.indexOf(match.channelDeletion) != -1) {
              eventTypeC = 3;
              res = parsers.channel.parseChannelDeletion(currentLine);
            }

            // Todo: Check if check is required.
            if (eventTypeC != -1) {
              DateTime = this.parseDateTime(currentLine);
              var channelID = res.channelID,
                channelName = res.channelName;

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
          res = parsers.upload.parseUpload(currentLine);
          channelID = res.channelID;

          if (Channel.getChannelByChannelId(ChannelList, channelID) === null)
            Channel.addChannel(ChannelList, channelID, "Unknown", "Unknown");

          if (!checkFunctions.isDuplicateUpload(DateTime, channelID, res.filename, res.uploadedByID, res.uploadedByNickname))
            Upload.addUpload(UploadList, DateTime, channelID, res.filename, res.uploadedByID, res.uploadedByNickname);
        }

        // Upload Deletions
        else if (currentLine.indexOf(match.uploadDeletion) == beginOfParsingBlock) {
          res = parsers.upload.parseUploadDeletion(currentLine);

          Upload.addDeletedBy(res.channelID, res.filename, res.deletedByID, res.deletedByNickname);
        }
      }
    }
  }
};