// uploadTest.js : Tests for parsing of Uploads.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var uploadParser = require('../../../nodejs/parsers/upload.js');

describe('Upload', function () {
  describe('parseUpload', function () {
    describe('log format before ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual({
          channelID: 10,
          filename: '/testFile.txt',
          uploadedByNickname: 'testClient',
          uploadedByID: 99
        }, uploadParser.parseUpload("2016-05-04 00:00:00.000000|INFO    |VirtualServer |  1| file upload to (id:10), '/testFile.txt' by client 'testClient'(id:99)"));
      });
    });

    describe('log format since ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual({
          channelID: 10,
          filename: '/testFile.txt',
          uploadedByNickname: 'testClient',
          uploadedByID: 99
        }, uploadParser.parseUpload("2016-05-04 00:00:00.000000|INFO    |VirtualServerBase|1  |file upload to (id:10), '/testFile.txt' by client 'testClient'(id:99)"));
      });
    });
  });

  describe('parseUploadDeletion', function () {
    describe('unix, log format before ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual({
          channelID: 10,
          filename: '/testFile.txt',
          deletedByNickname: 'testClient',
          deletedByID: 99
        }, uploadParser.parseUploadDeletion("2016-05-04 00:00:00.000000|INFO    |VirtualServer |  1| file deleted from (id:10), 'files/virtualserver_1/channel_10//testFile.txt' by client 'testClient'(id:99)"));
      });
    });

    describe('windows, log format before ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual({
          channelID: 10,
          filename: '/testFile.txt',
          deletedByNickname: 'testClient',
          deletedByID: 99
        }, uploadParser.parseUploadDeletion("2016-05-04 00:00:00.000000|INFO    |VirtualServer |  1| file deleted from (id:10), 'files\virtualserver_1\channel_10\/testFile.txt' by client 'testClient'(id:99)"));
      });
    });
  });
});

// Todo: Add tests for upload deletions with the log format since ts3Server v3.0.12.x when the logging of upload deletions is fixed.*/