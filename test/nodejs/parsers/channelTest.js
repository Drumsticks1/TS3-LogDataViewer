// channelTest.js : Tests for parsing of Channel events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const assert = require('assert');
const channelParser = require("../../../nodejs/parsers/parser-channel.js");

// Todo: Add additional tests

describe('channelParser', function () {
  describe('parseMessageChannelCreation', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseMessageChannelCreation("channel 'new channel'(id:7) created by 'admin'(id:2)"),
        {
          channelID: 7,
          channelName: "new channel"
        });
    });
  });

  describe('parseMessageChannelEdit', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseMessageChannelEdit("channel 'new channel'(id:7) edited by 'admin'(id:2)"),
        {
          channelID: 7,
          channelName: "new channel"
        });
    });
  });

  describe('parseMessageSubChannelCreation', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseMessageSubChannelCreation("channel 'new sub channel'(id:8) created as sub channel of 'new channel'(id:7) by 'admin'(id:2)"),
        {
          channelID: 8,
          channelName: "new sub channel"
        });
    });
  });

  describe('parseMessageChannelDeletion', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        channelParser.parseMessageChannelDeletion("channel 'new sub channel'(id:8) deleted by 'admin'(id:2)"),
        {
          channelID: 8,
          channelName: "new sub channel"
        });
    });
  });
});
