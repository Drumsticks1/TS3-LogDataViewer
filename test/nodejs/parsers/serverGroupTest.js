// serverGroupTest.js : Tests for parsing of ServerGroup events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const assert = require('assert');
const serverGroupParser = require("../../../nodejs/parsers/parser-server-group.js");

// Todo: Add additional tests

describe('serverGroupParser', function () {
  describe('parseMessageServerGroupCreation', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        serverGroupParser.parseMessageServerGroupCreation("servergroup 'new servergroup'(id:2) was added by 'admin'(id:2)"),
        {
          ServerGroupID: 2,
          ServerGroupName: 'new servergroup'
        });
    });
  });

  describe('parseMessageServerGroupDeletion', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        serverGroupParser.parseMessageServerGroupDeletion("servergroup 'new servergroup'(id:2) was deleted by 'admin'(id:2)"),
        {
          ServerGroupID: 2,
          ServerGroupName: 'new servergroup'
        });
    });
  });

  describe('parseMessageServerGroupRenaming', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        serverGroupParser.parseMessageServerGroupRenaming("servergroup 'new servergroup'(id:2) was renamed to 'old servergroup' by 'admin'(id:2)"),
        {
          ServerGroupID: 2,
          ServerGroupName: 'old servergroup'
        });
    });
  });

  describe('parseMessageServerGroupCopying', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        serverGroupParser.parseMessageServerGroupCopying("servergroup 'old servergroup'(id:2) was copied by 'admin'(id:2) to 'copy of old servergroup'(id:3)"),
        {
          ServerGroupID: 3,
          ServerGroupName: 'copy of old servergroup'
        });
    });
  });
});
