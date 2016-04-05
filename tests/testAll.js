// testAll.js: Runs all tests.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var QUnit = require("qunit");

// Parser
QUnit.run({
  code: "../nodejs/Parser.js",
  tests: "nodejs/ParserTest.js"
});

QUnit.run({
  code: "../nodejs/parsers/complaint.js",
  tests: "nodejs/parsers/complaintTest.js"
});

QUnit.run({
  code: "../nodejs/parsers/upload.js",
  tests: "nodejs/parsers/uploadTest.js"
});