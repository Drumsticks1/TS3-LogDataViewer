// clientTest.js : Tests for parsing of Client events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const assert = require('assert');
const clientParser = require("../../../nodejs/parsers/parser-client.js");

describe('clientParser', function () {
  describe('parseMessageClientConnect', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        clientParser.parseMessageClientConnect("client connected ''client connected Testclient'(id:0) from localhost'(id:42) from 127.0.0.1:12345"),
        {
          clientId: 42,
          Nickname: "'client connected Testclient'(id:0) from localhost",
          IP: '127.0.0.1'
        });
    });
  });

  describe('parseMessageQueryClientConnect', function () {
    it('should return the specified object', function () {
      assert.deepEqual(
        clientParser.parseMessageQueryClientConnect("query client connected 'query client connected 'TestClient from 127.0.0.1:00001'(id:0) from 127.0.0.1:12345'(id:42)"),
        {
          clientId: 42,
          Nickname: "query client connected 'TestClient from 127.0.0.1:00001'(id:0) from 127.0.0.1",
          IP: '127.0.0.1'
        });
    });
  });

  describe('parseMessageClientDisconnect', function () {
    describe('regular disconnect', function () {
      it('should return the specified object', function () {
        assert.deepEqual(
          clientParser.parseMessageClientDisconnect("client disconnected 'TestClient'(id:15) reason 'reasonmsg'"),
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
          clientParser.parseMessageClientDisconnect("client disconnected 'TestClient'(id:15) reason 'invokerid=2 invokername=admin invokeruid=OIqF4sKapFgSlTeIZOL5U7x2Yq4= reasonmsg=It's just a test bantime=10'"),
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
          clientParser.parseMessageClientDisconnect("client disconnected 'TestClient'(id:15) reason 'invokerid=2 invokername=admin invokeruid=OIqF4sKapFgSlTeIZOL5U7x2Yq4= reasonmsg=It's just a test'"),
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

  describe('parseMessageClientDeletion', function () {
    it('should return the id of the deleted client (1234)', function () {
      assert.equal(
        clientParser.parseMessageClientDeletion("client 'abc'(id:1234) got deleted by client 'admin'(id:2)"),
        1234
      );
    });
  });
});
