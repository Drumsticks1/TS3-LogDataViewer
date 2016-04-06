// uploadTest.js : Tests for parsing of Upload events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var uploadParser = require('../../../nodejs/parsers/upload.js');

describe('uploadParser', function () {
  describe('parseUpload', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        uploadParser.parseUpload("file upload to (id:10), '/testFile.txt' by client 'testClient'(id:99)"),
        {
          channelID: 10,
          filename: '/testFile.txt',
          uploadedByNickname: 'testClient',
          uploadedByID: 99
        });
    });
  });

  describe('parseUploadDeletion', function () {
    describe('unix, log format before ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual(
          uploadParser.parseUploadDeletion("file deleted from (id:10), 'files/virtualserver_1/channel_10//testFile.txt' by client 'testClient'(id:99)"),
          {
            channelID: 10,
            filename: '/testFile.txt',
            deletedByNickname: 'testClient',
            deletedByID: 99
          });
      });
    });

    describe('windows, log format before ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual(
          uploadParser.parseUploadDeletion("file deleted from (id:10), 'files\virtualserver_1\channel_10\/testFile.txt' by client 'testClient'(id:99)"),
          {
            channelID: 10,
            filename: '/testFile.txt',
            deletedByNickname: 'testClient',
            deletedByID: 99
          });
      });
    });
  });
});

// Todo: Add tests for upload deletions with the log format since ts3Server v3.0.12.x when the logging of upload deletions is fixed and if the log message is affected.*/