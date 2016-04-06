// clientTest.js : Tests for parsing of Client events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var assert = require('assert');
var clientParser = require("../../../nodejs/parsers/client.js");

describe('clientParser', function () {
  describe('parseClientConnect', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        clientParser.parseClientConnect("client connected ''client connected Testclient'(id:0) from localhost'(id:42) from 93.104.116.62:59618"),
        {
          clientId: 42,
          Nickname: "'client connected Testclient'(id:0) from localhost",
          IP: '93.104.116.62'
        });
    });
  });

  describe('parseQueryClientConnect', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        clientParser.parseQueryClientConnect("query client connected 'query client connected 'TestClient from 127.0.0.1:00001'(id:0) from 127.0.0.1:12345'(id:42)"),
        {
          clientId: 42,
          Nickname: "query client connected 'TestClient from 127.0.0.1:00001'(id:0) from 127.0.0.1",
          IP: '127.0.0.1'
        });
    });
  });

  describe('parseClientDisconnect', function () {
    describe('regular disconnect', function () {
      it('should return the specified object', function () {
        assert.deepEqual(
          clientParser.parseClientDisconnect("client disconnected 'TestClient'(id:15) reason 'reasonmsg'"),
          {
            clientId: 15,
            Nickname: 'TestClient',
            boundaries: {
              Nickname: [21, 31],
              clientId: [36, 38]
            }
          });
      });
    });

    describe('ban disconnect', function () {
      it('should return the specified object', function () {
        assert.deepEqual(
          clientParser.parseClientDisconnect("client disconnected 'TestClient'(id:15) reason 'invokerid=2 invokername=admin invokeruid=OIqF4sKapFgSlTeIZOL5U7x2Yq4= reasonmsg=It's just a test bantime=10'"),
          {
            clientId: 15,
            Nickname: 'TestClient',
            boundaries: {
              Nickname: [21, 31],
              clientId: [36, 38]
            }
          });
      });
    });

    describe('kick disconnect', function () {
      it('should return the specified object', function () {
        assert.deepEqual(
          clientParser.parseClientDisconnect("client disconnected 'TestClient'(id:15) reason 'invokerid=2 invokername=admin invokeruid=OIqF4sKapFgSlTeIZOL5U7x2Yq4= reasonmsg=It's just a test'"),
          {
            clientId: 15,
            Nickname: 'TestClient',
            boundaries: {
              Nickname: [21, 31],
              clientId: [36, 38]
            }
          });
      });
    });
  });

  describe('parseClientDeletion', function () {
    it('should return the specified object', function () {
      assert.equal(
        clientParser.parseClientDeletion("client 'abc'(id:1234) got deleted by client 'admin'(id:2)"),
        1234
      );
    });
  });
});
