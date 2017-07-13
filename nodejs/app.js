// app.js : Sets up the app.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const express = require("express"),
  app = express(),
  helmet = require("helmet"),
  constants = require("./constants"),
  data = require("./data.js"),
  getConf = require("./configuration.js"),
  log = require("./log.js"),
  buildJSON = require("./build-json.js");

let lastBuild = 0;

log.info(module, "Program Startup");

// Fetch the config file and import the settings on program startup.
getConf.getConf();

// Improves security by setting various HTTP headers.
app.use(helmet());

app.listen(data.usedPort, 'localhost', function () {
  log.info(module, "Listening on localhost:" + data.usedPort);
});

app.get("/buildJSON", function (req, res) {
  const timeDifference = Date.now().valueOf() - lastBuild,
    response = {
      "success": false,
      "fetchLogsError": false,
      "newJSON": false,
      "timeBetweenRequests": data.timeBetweenRequests,
      "timeDifference": -1
    };

  if (timeDifference > data.timeBetweenRequests) {
    lastBuild = Date.now().valueOf();
    switch (buildJSON(String(req.query.clearBuffer) === "true")) {
      case constants.tokens.build_json.ERROR_LOG_FETCHING:
        response.fetchLogsError = true;
        break;

      case constants.tokens.build_json.SUCCESS:
        response.success = true;
        response.newJSON = true;
        break;

      case constants.tokens.build_json.NOT_NECESSARY:
        response.success = true;
        break;
    }
  } else {
    log.debug(module, "The last request was " + timeDifference + " ms ago but timeBetweenRequests is set to " + data.timeBetweenRequests + " ms.");
    response.timeDifference = timeDifference;
  }

  res.send(response);
  res.end();
});