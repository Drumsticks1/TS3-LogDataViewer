// app.js : Sets up the app.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const express = require("express"),
    app = express(),
    compression = require('compression'),
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
if (!getConf.getConf()) {
    getConf.resetToDefaultConfiguration();
}

// Todo: check options.
app.use(compression());

// Improves security by setting various HTTP headers.
app.use(helmet());

app.get("/buildJSON", function(req, res) {
    var timeDifference = Date.now().valueOf() - lastBuild,
        response = {"success": true};

    if (timeDifference > globalVariables.timeBetweenBuilds) {
        if (String(req.query.clearBuffer) == "true")
            miscFunctions.clearGlobalArrays();

        buildJSON.buildJSON();
        lastBuild = Date.now().valueOf();
    } else {
        outputHandler.output("\nThe last rebuild was " + timeDifference + " ms ago but timeBetweenRebuilds is set to " + globalVariables.timeBetweenRebuilds + " ms.");
        response = {
            "success": false,
            "timeBetweenBuilds": globalVariables.timeBetweenBuilds,
            "timeDifference": timeDifference
        };
    }

    res.send(response);
    res.end();
});

app.listen(globalVariables.usedPort, function() {
    outputHandler.output("\nTS3-LDV listening on port " + globalVariables.usedPort + "\n");
});