// complaintTest.js : Tests for parsing of Complaints.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var complaintParser = require("../../../nodejs/parsers/complaint.js");

describe('complaintParser', function () {
  describe('parseComplaint', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        complaintParser.parseComplaint("complaint added for client 'trolling client'(id:666) reason 'trolling' by client 'regular client'(id:123)"),
        {
          complaintAboutNickname: 'trolling client',
          complaintAboutID: 666,
          complaintReason: 'trolling',
          complaintByNickname: 'regular client',
          complaintByID: 123
        });
    });
  });
});
