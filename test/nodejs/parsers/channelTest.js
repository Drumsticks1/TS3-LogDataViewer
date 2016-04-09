// channelTest.js : Tests for parsing of Channel events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var channelParser = require("../../../nodejs/parsers/channel.js");

// Todo: Add additional tests

describe('channelParser', function () {
  describe('parseChannelCreation', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseChannelCreation("channel 'new channel'(id:7) created by 'admin'(id:2)"),
        {
          channelID: 7,
          channelName: "new channel"
        });
    });
  });

  describe('parseChannelEdit', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseChannelEdit("channel 'new channel'(id:7) edited by 'admin'(id:2)"),
        {
          channelID: 7,
          channelName: "new channel"
        });
    });
  });

  describe('parseSubChannelCreation', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseSubChannelCreation("channel 'new sub channel'(id:8) created as sub channel of 'new channel'(id:7) by 'admin'(id:2)"),
        {
          channelID: 8,
          channelName: "new sub channel"
        });
    });
  });

  describe('parseChannelDeletion', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseChannelDeletion("channel 'new sub channel'(id:8) deleted by 'admin'(id:2)"),
        {
          channelID: 8,
          channelName: "new sub channel"
        });
    });
  });
});
