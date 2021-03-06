// parsers/parser-channel.js : Parsing of Channel events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../misc-functions.js');
var Channel = require("../classes/channel.js");
var data = require("../data.js");

/**
 * Parses the Channel data from the given logLine.
 * Requires a boundaries object containing the end position for the channelID.
 * @param {string} logLine
 * @param {object} boundaries boundaries object containing the end position for the channelID.
 * @returns {{channelID: number, channelName: string}} the extracted data.
 */
function parseChannelModification(logLine, boundaries) {
  boundaries.channelID[0] = logLine.indexOf("'(id:") + 5;

  boundaries.channelName = [
    logLine.indexOf("channel '") + 9,
    boundaries.channelID[0] - 5];

  const getSubstring = function (boundariesIdentifier) {
    return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
  };

  return {
    channelID: Number(getSubstring("channelID")),
    channelName: getSubstring("channelName")
  };
}

// Todo: use the match object in Parser instead of the local object.
const match = {
  "channelCreation": ") created by '",
  "subChannelCreation": ") created as sub channel of '",
  "channelEdit": ") edited by '",
  "channelDeletion": ") deleted by '"
};

module.exports = {

  parseChannelCreation: function (message) {
    const res = this.parseMessageChannelCreation(message);

    if (Channel.getChannelByChannelId(data.ChannelList, res.channelID) === null) {
      Channel.addChannel(data.ChannelList, res.channelID, "Unknown", res.channelName);
    }
  },

  /**
   * Parses the ChannelCreation data from the given message.
   * @param {string} message
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseMessageChannelCreation: function (message) {
    return parseChannelModification(message, {channelID: [0, message.indexOf(match.channelCreation)]});
  },

  parseChannelEdit: function (message) {
    const res = this.parseMessageChannelEdit(message),
      channelObject = Channel.getChannelByChannelId(data.ChannelList, res.channelID);

    if (channelObject !== null) {
      channelObject.renameChannel(res.channelName);
    } else if (Channel.getChannelByChannelId(data.ChannelList, res.channelID) === null) {
      Channel.addChannel(data.ChannelList, res.channelID, "Unknown", res.channelName);
    }
  },

  /**
   * Parses the ChannelEdit data from the given message.
   * @param {string} message
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseMessageChannelEdit: function (message) {
    return parseChannelModification(message, {channelID: [0, message.indexOf(match.channelEdit)]});
  },

  parseSubChannelCreation: function (message) {
    const res = this.parseMessageSubChannelCreation(message);

    if (Channel.getChannelByChannelId(data.ChannelList, res.channelID) === null) {
      Channel.addChannel(data.ChannelList, res.channelID, "Unknown", res.channelName);
    }
  },

  /**
   * Parses the SubChannelCreation data from the given message.
   * @param {string} message
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseMessageSubChannelCreation: function (message) {
    return parseChannelModification(message,
      {channelID: [0, message.indexOf(match.subChannelCreation)]});
  },

  parseChannelDeletion: function (message) {
    const res = this.parseMessageChannelDeletion(message);

    Channel.getChannelByChannelId(data.ChannelList, res.channelID).deleteChannel()
  },

  /**
   * Parses the ChannelDeletion data from the given message.
   * @param {string} message
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseMessageChannelDeletion: function (message) {
    return parseChannelModification(message,
      {channelID: [0, message.indexOf(match.channelDeletion)]});
  }
};
