// app.js : Sets up the app.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const express = require("express"),
  app = express(),
  helmet = require("helmet"),
  globalVariables = require("./globalVariables.js"),
  getConf = require("./getConf.js"),
  log = require("./log.js"),
  miscFunctions = require("./miscFunctions.js"),
  buildJSON = require("./buildJSON.js");

var lastBuild = 0;

log.info("Program startup");

// Fetch the config file and import the settings on program startup.
getConf.getConf();

// Improves security by setting various HTTP headers.
app.use(helmet());

app.listen(globalVariables.usedPort, 'localhost', function () {
  log.info("TS3-LDV is listening on localhost:" + globalVariables.usedPort + "\n");
});

app.get("/buildJSON", function (req, res) {
  var timeDifference = Date.now().valueOf() - lastBuild,
    response = {
      "success": false,
      "fetchLogsError": false,
      "newJSON": false,
      "timeBetweenRequests": globalVariables.timeBetweenRequests,
      "timeDifference": -1
    };

  if (timeDifference > globalVariables.timeBetweenRequests) {
    var clearBuffer = String(req.query.clearBuffer) == "true";
    if (clearBuffer)
      miscFunctions.clearGlobalArrays();

    lastBuild = Date.now().valueOf();
    switch (buildJSON.buildJSON(clearBuffer)) {
      case 0:
        response.fetchLogsError = true;
        break;

      case 1:
        response.success = true;
        response.newJSON = true;
        break;

      case 2:
        response.success = true;
        break;
    }
  } else {
    log.debug("The last request was " + timeDifference + " ms ago but timeBetweenRequests is set to " + globalVariables.timeBetweenRequests + " ms.");
    response.timeDifference = timeDifference;
  }

  res.send(response);
  res.end();
});