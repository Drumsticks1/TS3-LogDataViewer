// ParserTest.js : Tests for Parser.js.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var Parser = require("../../nodejs/Parser.js");

  test("DateTime parsing", function () {
  assert.equal(
    Parser.parseDateTime("2013-13-01 01:23:45.123456|INFO    |VirtualServer |  1| file deleted from (id:10), 'files\virtualserver_1\channel_10\/testFile.txt' by client 'testClient'(id:99)"),
    "2013-13-01 01:23:45"
  );
});

// Todo: Add tests for the parseLogData function.