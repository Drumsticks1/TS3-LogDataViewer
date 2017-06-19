// banTest.js : Tests for parsing of Ban events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const assert = require('assert');
const banParser = require("../../../nodejs/parsers/ban.js");

// Todo: Add additional tests

describe('banParser', function () {
  describe('parseMessageBan', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        banParser.parseMessageBan(
          "client disconnected 'TestClient'(id:15) reason 'invokerid=2 invokername=admin invokeruid=OIqF4sKapFgSlTeIZOL5U7x2Yq4= reasonmsg=It's just a test bantime=10'", {
            Nickname: [21, 31],
            clientId: [36, 38]
          },
          "2016-04-06 00:00:00.000000|INFO    |VirtualServer |  1| ban added reason='It's just a test' cluid='fsyvRep1WQkKnHf/P6tAinSmJ5w=' bantime=10 by client 'admin'(id:2)",
          "2016-04-06 00:00:00.000000|INFO    |VirtualServer |  1| ban added reason='It's just a test' ip='12.345.67.890' bantime=10 by client 'admin'(id:2)"),
        {
          banReason: "It's just a test",
          banTime: 10,
          bannedByID: 2,
          bannedByNickname: "admin",
          bannedByUID: "OIqF4sKapFgSlTeIZOL5U7x2Yq4=",
          bannedIP: "12.345.67.890",
          bannedUID: "fsyvRep1WQkKnHf/P6tAinSmJ5w="
        });
    });
  });
});