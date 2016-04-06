// kickTest.js : Tests for parsing of Kick events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var kickParser = require("../../../nodejs/parsers/kick.js");

describe('kickParser', function () {
  describe('parseKick', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        kickParser.parseKick(
          "client disconnected 'TestClient'(id:15) reason 'invokerid=2 invokername=admin invokeruid=OIqF4sKapFgSlTeIZOL5U7x2Yq4= reasonmsg=It's just a test'", {
            Nickname: [21, 31],
            clientId: [36, 38]
          }),
        {
          kickReason: "It's just a test",
          kickedByNickname: "admin",
          kickedByUID: "OIqF4sKapFgSlTeIZOL5U7x2Yq4="
        });
    });
  });
});

// Todo: Add additional tests