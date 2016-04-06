// ParserTest.js : Tests for Parser.js.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

'use strict';

var assert = require('assert');
var Parser = require('../../nodejs/Parser.js');

describe('Parser', function () {
  describe('parseDateTime', function () {
    it('should return the Timestamp at the beginning of the log line without milliseconds', function () {
      assert.equal(
        '2013-13-01 01:23:45',
        Parser.parseDateTime("2013-13-01 01:23:45.123456|INFO    |VirtualServer |  1| file deleted from (id:10), 'files\virtualserver_1\channel_10\/testFile.txt' by client 'testClient'(id:99)")
      );
    });
  });
});

// Todo: Add tests for the parseLogData function.