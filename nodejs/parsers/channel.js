// parsers/channel.js : Parsing of Channel events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

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

  function getSubstring(boundariesIdentifier) {
    return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
  }

  return {
    channelID: Number(getSubstring("channelID")),
    channelName: getSubstring("channelName")
  };
}

// Todo: use the match object in Parser instead of the local object.
var match = {
  "channelCreation": ") created by '",
  "subChannelCreation": ") created as sub channel of '",
  "channelEdit": ") edited by '",
  "channelDeletion": ") deleted by '"
};

module.exports = {
  /**
   * Parses the ChannelCreation data from the given logLine.
   * @param {string} logLine
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseChannelCreation: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.channelCreation)]});
  },

  /**
   * Parses the ChannelEdit data from the given logLine.
   * @param {string} logLine
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseChannelEdit: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.channelEdit)]});
  },

  /**
   * Parses the SubChannelCreation data from the given logLine.
   * @param {string} logLine
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseSubChannelCreation: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.subChannelCreation)]});
  },

  /**
   * Parses the ChannelDeletion data from the given logLine.
   * @param {string} logLine
   * @returns {{channelID: number, channelName: string}} the extracted data.
   */
  parseChannelDeletion: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.channelDeletion)]});
  }
};