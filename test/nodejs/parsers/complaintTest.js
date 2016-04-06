// complaintTest.js : Tests for parsing of Complaints.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var complaintParser = require("../../../nodejs/parsers/complaint.js");

describe('Complaint', function () {
  describe('parseComplaint', function () {

    describe('log format before ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual({
          complaintAboutNickname: 'trolling client',
          complaintAboutID: 666,
          complaintReason: 'trolling',
          complaintByNickname: 'regular client',
          complaintByID: 123
        }, complaintParser.parseComplaint("2016-05-04 00:00:00.000000|INFO    |VirtualServer |  1| complaint added for client 'trolling client'(id:666) reason 'trolling' by client 'regular client'(id:123)"));
      });
    });

    describe('log format since ts3Server v3.0.12.0', function () {
      it('should return the specified object', function () {
        assert.deepEqual({
          complaintAboutNickname: 'trolling client',
          complaintAboutID: 666,
          complaintReason: 'trolling',
          complaintByNickname: 'regular client',
          complaintByID: 123
        }, complaintParser.parseComplaint("2016-05-04 00:00:00.000000|INFO    |VirtualServer |1  |complaint added for client 'trolling client'(id:666) reason 'trolling' by client 'regular client'(id:123)"));
      });
    });
  })
});