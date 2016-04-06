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
        '2016-04-06 01:23:45',
        Parser.parseDateTime("2016-04-06 01:23:45.123456|INFO    |VirtualServer |  1| some log message")
      );
    });
  });

  describe('parseLogPattern', function () {
    describe('invalid log format', function () {
      it('should return -1', function () {
        assert.equal(
          -1,
          Parser.parseLogPattern("2016-04-06 00:00:00.000000|INFO|VirtualServer|1|listening on 0.0.0.0:9987")
        );
      });
    });

    describe('log format before ts3Server v3.0.12.0', function () {
      it('should return 0', function () {
        assert.equal(
          0,
          Parser.parseLogPattern("2016-04-06 00:00:00.000000|INFO    |VirtualServer |  1| listening on 0.0.0.0:9987")
        );
      });
    });

    describe('log format since ts3Server v3.0.12.0', function () {
      it('should return 1', function () {
        assert.equal(
          1,
          Parser.parseLogPattern("2016-04-06 00:00:00.000000|INFO    |VirtualServer |1  |listening on 0.0.0.0:9987")
        );
      });
    });
  });
});

// Todo: Add tests for the parseLogData function.