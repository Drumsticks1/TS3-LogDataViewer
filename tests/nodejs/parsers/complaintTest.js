// complaintTest.js : Tests for parsing of Complaints.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var complaintParser = require("../../../nodejs/parsers/complaint.js");

test("Complaint (log format before ts3Server v3.0.12.0)", function () {
  assert.deepEqual(
    complaintParser.parseComplaint("2016-05-04 00:00:00.000000|INFO    |VirtualServer |  1| complaint added for client 'trolling client'(id:666) reason 'trolling' by client 'regular client'(id:123)"),
    {
      complaintAboutNickname: 'trolling client',
      complaintAboutID: 666,
      complaintReason: 'trolling',
      complaintByNickname: 'regular client',
      complaintByID: 123
    });
});

test("Complaint (log format since ts3Server v3.0.12.0)", function () {
  assert.deepEqual(
    complaintParser.parseComplaint("2016-05-04 00:00:00.000000|INFO    |VirtualServer |1  |complaint added for client 'trolling client'(id:666) reason 'trolling' by client 'regular client'(id:123)"),
    {
      complaintAboutNickname: 'trolling client',
      complaintAboutID: 666,
      complaintReason: 'trolling',
      complaintByNickname: 'regular client',
      complaintByID: 123
    });
});