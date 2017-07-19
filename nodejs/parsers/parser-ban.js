// parsers/parser-ban.js : Parsing of Ban events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const checkFunctions = require("../check-functions.js"),
  miscFunctions = require('../misc-functions.js');
var Ban = require("../classes/ban.js");
var data = require("../data.js");

module.exports = {

  parseBan: function (message, dateTime, disconnectRes, lastBanRuleUID, lastBanRuleIP) {
    let res = this.parseMessageBan(message, disconnectRes.boundaries, lastBanRuleUID, lastBanRuleIP);

    if (!checkFunctions.isDuplicateBan(dateTime, disconnectRes.clientId, disconnectRes.Nickname, res.bannedUID, res.bannedIP, res.bannedByID, res.bannedByNickname, res.bannedByUID, res.banReason, res.banTime))
      Ban.addBan(data.BanList, dateTime, disconnectRes.clientId, disconnectRes.Nickname, res.bannedUID, res.bannedIP, res.bannedByID, res.bannedByNickname, res.bannedByUID, res.banReason, res.banTime);
  },

  /**
   * Parses the Ban data from the given message.
   * Requires the boundaries object from the previous client.parseMessageClientDisconnect call.
   * @param {string} message
   * @param {object} boundaries boundaries object from the previous client.parseMessageClientDisconnect call.
   * @param {string} lastUIDBanRule
   * @param {string} lastIPBanRule
   * @returns {{bannedUID: string, bannedIP: string, bannedByID: number, bannedByNickname: string, bannedByUID: string, banReason: string, banTime: number}} the extracted data.
   */
  parseMessageBan: function (message, boundaries, lastUIDBanRule, lastIPBanRule) {
    let validUID = true;

    boundaries.bannedByNickname = [message.indexOf(" invokername=", boundaries.clientId[1]) + 13, 0];

    if (message.includes("invokeruid=")) {
      boundaries.bannedByNickname[1] = message.indexOf(" invokeruid=", boundaries.bannedByNickname[0]);
      boundaries.bannedByUID = [
        boundaries.bannedByNickname[1] + 12,
        message.indexOf(" reasonmsg", boundaries.bannedByNickname[1])];
    }
    else {
      boundaries.bannedByNickname[1] = message.indexOf(" reasonmsg");
      boundaries.bannedByUID = [0, message.indexOf(" reasonmsg")];
      validUID = false;
    }

    boundaries.banReason = [boundaries.bannedByUID[1] + 11, 0];
    if (message.includes("reasonmsg=")) {
      boundaries.banReason[1] = message.indexOf(" bantime=", boundaries.bannedByUID[1]);
      boundaries.banTime = [boundaries.banReason[1] + 9, 0];
    }
    else {
      boundaries.banReason[1] = boundaries.banReason[0];
      boundaries.banTime = [boundaries.banReason[1] + 8, 0];
    }

    boundaries.banTime[1] = message.length - 1;

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    const bannedByNickname = getSubstring("bannedByNickname"),
      banReason = getSubstring("banReason"),
      banTime = Number(getSubstring("banTime"));
    let bannedByUID = validUID ? getSubstring("bannedByUID") : "No UID",
      bannedUID, bannedIP, bannedByID;

    if (lastUIDBanRule.length !== 0 && lastIPBanRule.length !== 0) {
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

        bannedUID = lastUIDBanRule.slice(boundaries.bannedUID[0], boundaries.bannedUID[1]);
        bannedIP = lastIPBanRule.slice(boundaries.bannedIP[0], boundaries.bannedIP[1]);
        bannedByID = Number(lastIPBanRule.slice(boundaries.bannedByID[0], boundaries.bannedByID[1]));
      }
      else {
        bannedUID = bannedIP = "Unknown";
        bannedByID = 0;
      }
    }

    return {
      bannedUID: bannedUID,
      bannedIP: bannedIP,
      bannedByID: Number(bannedByID),
      bannedByNickname: bannedByNickname,
      bannedByUID: bannedByUID,
      banReason: banReason,
      banTime: banTime
    };
  }
};
