// channel.js :
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

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
  parseChannelCreation: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.channelCreation)]});
  },

  parseChannelEdit: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.channelEdit)]});
  },

  parseSubChannelCreation: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.subChannelCreation)]});
  },

  parseChannelDeletion: function (logLine) {
    return parseChannelModification(logLine,
      {channelID: [0, logLine.indexOf(match.channelDeletion)]});
  }
};