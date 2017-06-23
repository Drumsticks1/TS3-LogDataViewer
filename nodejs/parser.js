// parser.js : Main file for controlling the parsing process.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  data = require("./data.js"),
  log = require("./log.js");

const parsers = {
  ban: require("./parsers/parser-ban.js"),
  channel: require("./parsers/parser-channel.js"),
  client: require("./parsers/parser-client.js"),
  complaint: require("./parsers/parser-complaint.js"),
  kick: require("./parsers/parser-kick.js"),
  serverGroup: require("./parsers/parser-server-group.js"),
  upload: require("./parsers/parser-upload.js")
};

// Object containing matching patterns for parsing.
const match = {
  // Set in parseLogs in order to use the latest data.virtualServer value.
  VirtualServer: [],
  VirtualServerBase: [],

  // VirtualServer
  banRule: "ban added reason='",
  complaint: "complaint added for client '",
  serverGroupEvent: "servergroup '",
  deleteClient1: "client '",
  queryClientConnect: "query client connected '",

  // VirtualServerBase
  connect: "client connected '",
  disconnect: "client disconnected '",
  channel: "channel '",

  // v3.0.11.4 and before : VirtualServer
  // since v3.0.12.0      : VirtualServerBase
  upload: "file upload to ",
  uploadDeletion: "file deleted from",

  // TODO: rename serverGroupAssignment/Removal to clientServerGroup...
  // Additional patterns
  serverGroupAssignment: ") was added to servergroup '",
  serverGroupRemoval: ") was removed from servergroup '",
  deleteClient2: ") got deleted by client '",
  channelCreation: ") created by '",
  subChannelCreation: ") created as sub channel of '",
  channelEdit: ") edited by '",
  channelDeletion: ") deleted by '",
  serverGroupCreation: ") was added by '",
  serverGroupDeletion: ") was deleted by '",
  serverGroupRenaming: ") was renamed to '",
  serverGroupCopying: ") was copied by '"
};

/**
 * Parses the logs.
 */
module.exports = {

  /**
   * Calls parseLog for all Logs that are neither parsed nor ignored.
   */
  parseLogs: function () {
    log.debug(module, "Starting log parsing.");

    for (let i = 0; i < data.Logs.length; i++) {
      if (!data.Logs[i].parsed && !data.Logs[i].ignored) {
        this.parseLog(data.TS3LogDirectory + data.Logs[i].logName, i + 1 === data.Logs.length);
        data.Logs[i].parsed = true;
      }
    }
  },

  /**
   * Parses the given logLine and returns its dateTime timestamp.
   * @param {string} logLine
   * @returns {string} dateTime of the logLine.
   */
  parseDateTime: function (logLine) {
    return logLine.slice(0, 19);
  },

  /**
   * Parses the logPattern from the logData of a Log.
   * @param {string} logData
   * @returns {number} The number of the logPattern, returns -1 if the log pattern is unknown or if the Log doesn't contain a valid 'listening on' line.
   */
  parseLogPattern: function (logData) {
    /**
     * Patterns and their ts3server versions (ordered as below):
     * - v3.0.11.4 and before
     * - since v3.0.12.0
     */
    match.VirtualServer = [
      "|INFO    |VirtualServer |  " + data.virtualServer + "| ",
      "|INFO    |VirtualServer |" + data.virtualServer + "  |"
    ];
    match.VirtualServerBase = [
      "|INFO    |VirtualServerBase|  " + data.virtualServer + "| ",
      "|INFO    |VirtualServerBase|" + data.virtualServer + "  |"
    ];

    if (logData.includes(match.VirtualServer[0] + 'listening on'))
      return 0;
    else if (logData.includes(match.VirtualServer[1] + 'listening on'))
      return 1;

    return -1;
  },

  /** The possible server types for log lines (used as enum) */
  serverTypes: {VIRTUAL_SERVER: 0, VIRTUAL_SERVER_BASE: 1},

  // Todo: doc
  lastBanRuleUID: "",
  lastBanRuleIP: "",

  /**
   * Parses the log with the given logPath.
   * Sets the parsed flag of the parsed log to true.
   *
   * Calls this.parseLogLine for each line
   *
   * @param {string} logPath the path to the log
   * @param {boolean} isLastLog true if the log is the last log in the directory, false otherwise
   */
  parseLog: function (logPath, isLastLog) {
    let logData = fs.readFileSync(logPath, "utf8");

    // Replaces HTML entities with their escaped symbols.
    // Prevents HTML entities showing up in the tables when not inserting via innerHTML.
    logData = logData.replace(/&#[0-9]+;/g, function (x) {
      return String.fromCodePoint(Number(x.slice(2, -1)));
    });

    let logPattern = this.parseLogPattern(logData);
    this.lastBanRuleUID = "";
    this.lastBanRuleIP = "";

    // Todo: Add debug message.
    // Skip parsing if the log pattern is unknown.
    if (logPattern === -1)
      return;

    while (logData.length > 0) {
      let lineLength = logData.indexOf("\n");
      let currentLine = logData.slice(0, lineLength);
      logData = logData.slice(lineLength + 1);

      this.parseLogLine(currentLine, logPattern, isLastLog, this.lastBanRuleUID, this.lastBanRuleIP);
    }
  },

  /**
   * Parses the given log line
   *
   * @param line the log line that will be parsed
   * @param logPattern the log pattern of the log line
   * @param isLastLog true if the log is the last log in the directory, false otherwise
   * @param lastBanRuleUID see this.lastBanRuleUID
   * @param lastBanRuleIP see this.lastBanRuleIP
   */
  parseLogLine: function (line, logPattern, isLastLog, lastBanRuleUID, lastBanRuleIP) {
    let serverType, messageOffset;

    // Check if the current log line is logged as "VirtualServer"
    if (line.includes(match.VirtualServer[logPattern])) {
      serverType = this.serverTypes.VIRTUAL_SERVER;
      messageOffset = line.indexOf(match.VirtualServer[logPattern]) + match.VirtualServer[logPattern].length;
    }

    // Check if the current log line is logged as "VirtualServerBase"
    else if (line.includes(match.VirtualServerBase[logPattern])) {
      serverType = this.serverTypes.VIRTUAL_SERVER_BASE;
      messageOffset = line.indexOf(match.VirtualServerBase[logPattern]) + match.VirtualServerBase[logPattern].length;
    }

    // Current log line is neither logged as "VirtualServer" nor "VirtualServerBase"
    // Skipping parsing, line is not relevant
    else return;

    let dateTime = this.parseDateTime(line),
      message = line.slice(messageOffset);

    // VirtualSever
    if (serverType === this.serverTypes.VIRTUAL_SERVER) {

      // Client assignments to a server group
      if (message.includes(match.serverGroupAssignment)) {
        parsers.serverGroup.parseServerGroupAssignment(message, dateTime);
      }

      // Client removals from a server group
      else if (message.includes(match.serverGroupRemoval)) {
        parsers.serverGroup.parseServerGroupRemoval(message);
      }

      // Query client connects
      else if (message.startsWith(match.queryClientConnect)) {
        parsers.client.parseQueryClientConnect(message, dateTime);
      }

      // Todo: move to the ban parser?
      // Ban Rules
      // Currently only used for rules of 'direct' (= right click on client and "ban client") bans.
      else if (message.startsWith(match.banRule)) {
        if (message.includes("' cluid='") && !message.includes("' ip='"))
          this.lastBanRuleUID = message;
        else if (message.includes("' ip='") && !message.includes("' cluid='"))
          this.lastBanRuleIP = message;
      }

      // Complaints
      else if (message.startsWith(match.complaint)) {
        parsers.complaint.parseComplaint(message, dateTime);
      }

      // Client Deletions
      else if (message.startsWith(match.deleteClient1) && (message.includes(match.deleteClient2))) {
        parsers.client.parseClientDeletion(message);
      }

      // Server group creation, deletions, renaming and copying
      else if (message.startsWith(match.serverGroupEvent)) {
        if (message.includes(match.serverGroupCreation)) {
          parsers.serverGroup.parseServerGroupCreation(message, dateTime);
        } else if (message.includes(match.serverGroupDeletion)) {
          parsers.serverGroup.parseServerGroupDeletion(message);
        } else if (message.includes(match.serverGroupRenaming)) {
          parsers.serverGroup.parseServerGroupRenaming(message);
        } else if (message.includes(match.serverGroupCopying)) {
          parsers.serverGroup.parseServerGroupCopying(message, dateTime);
        }
      }

      // Upload / file system events
      // VirtualServer for version 3.0.11.4 and before
      // VirtualServerBase since version 3.0.12.0
      // Uploads
      if (message.startsWith(match.upload)) {
        parsers.upload.parseUpload(message, dateTime);
      }

      // Upload Deletions
      else if (message.startsWith(match.uploadDeletion)) {
        parsers.upload.parseUploadDeletion(message);
      }
    }

    // VirtualServerBase
    else if (serverType === this.serverTypes.VIRTUAL_SERVER_BASE) {
      // Connects
      if (message.startsWith(match.connect)) {
        parsers.client.parseClientConnect(message, dateTime, isLastLog);
      }

      // Disconnects (including kicks and bans)
      else if (message.startsWith(match.disconnect)) {
        let disconnectBoundaries = parsers.client.parseClientDisconnect(message, dateTime, isLastLog);

        if (!message.includes(") reason 'reasonmsg")) {
          // Kicks
          if (!message.includes(" bantime=")) {
            parsers.kick.parseKick(message, dateTime, disconnectBoundaries);
          }
          // Bans
          else {
            parsers.ban.parseBan(message, dateTime, disconnectBoundaries, lastBanRuleUID, lastBanRuleIP);
          }
        }
      }

      // Channel additions, edits or deletions.
      else if (message.startsWith(match.channel)) {
        if (message.includes(match.channelCreation)) {
          parsers.channel.parseChannelCreation(message);
        } else if (message.includes(match.channelEdit)) {
          parsers.channel.parseChannelEdit(message);
        } else if (message.includes(match.subChannelCreation)) {
          parsers.channel.parseSubChannelCreation(message);
        } else if (message.includes(match.channelDeletion)) {
          parsers.channel.parseChannelDeletion(message);
        }
      }

      // Upload / file system events
      // VirtualServer for version 3.0.11.4 and before
      // VirtualServerBase since version 3.0.12.0
      // Uploads
      if (message.startsWith(match.upload)) {
        parsers.upload.parseUpload(message, dateTime);
      }

      // Upload Deletions
      else if (message.startsWith(match.uploadDeletion)) {
        parsers.upload.parseUploadDeletion(message);
      }
    }
  }
};