// app.js : Sets up the app.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const express = require("express"),
  app = express(),
  helmet = require("helmet"),
  data = require("./data.js"),
  getConf = require("./configuration.js"),
  log = require("./log.js"),
  miscFunctions = require("./misc-functions.js"),
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
    const clearBuffer = String(req.query.clearBuffer) === "true";
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
    log.debug(module, "The last request was " + timeDifference + " ms ago but timeBetweenRequests is set to " + data.timeBetweenRequests + " ms.");
    response.timeDifference = timeDifference;
  }

  res.send(response);
  res.end();
});