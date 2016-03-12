// app.js : Sets up the app.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const express = require("express"),
    app = express(),
    helmet = require('helmet'),
    globalVariables = require("./globalVariables.js"),
    getConf = require("./getConf.js"),
    outputHandler = require("./outputHandler.js"),
    miscFunctions = require("./miscFunctions.js"),
    buildJSON = require("./buildJSON.js");

var lastBuild = 0;

outputHandler.updateWriteStream();
miscFunctions.updateCurrentDate();
outputHandler.output("\nProgram startup\n");
outputHandler.output(miscFunctions.getCurrentUTC() + " (UTC)\n" + miscFunctions.getCurrentLocaltime() + " (Local time)\n");

// Fetch the config file and import the settings on program startup.
if (!getConf.getConf())
    getConf.resetToDefaultConfiguration();

// Improves security by setting various HTTP headers.
app.use(helmet());

app.get("/buildJSON", function(req, res) {
    var timeDifference = Date.now().valueOf() - lastBuild,
        response = {
            "success": true,
            "fetchLogsError": false,
            "newJSON": true,
            "timeBetweenBuilds": globalVariables.timeBetweenBuilds,
            "timeDifference": -1
        };

    if (timeDifference > globalVariables.timeBetweenBuilds) {
        var clearBuffer = String(req.query.clearBuffer) == "true";
        if (clearBuffer)
            miscFunctions.clearGlobalArrays();

        switch (buildJSON.buildJSON(clearBuffer)) {
            case 0:
                response.success = false;
                response.fetchLogsError = true;
                break;

            case 1:
                lastBuild = Date.now().valueOf();
                break;

            case 2:
                response.newJSON = false;
                break;
        }
    } else {
        outputHandler.output("\nThe last rebuild was " + timeDifference + " ms ago but timeBetweenBuilds is set to " + globalVariables.timeBetweenBuilds + " ms.");
        response.success = false;
        response.timeDifference = timeDifference;
    }

    res.send(response);
    res.end();
});

app.listen(globalVariables.usedPort, function() {
    outputHandler.output("\nTS3-LDV listening on port " + globalVariables.usedPort + "\n");
});