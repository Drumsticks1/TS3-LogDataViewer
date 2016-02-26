// app.js : Sets up the app.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const express = require("express"),
    app = express(),
    compression = require('compression'),
    helmet = require('helmet'),
    globalVariables = require("./globalVariables.js"),
    getConfig = require("./getConfig.js"),
    outputHandler = require("./outputHandler.js"),
    miscFunctions = require("./miscFunctions.js"),
    rebuildJSON = require("./rebuildJSON.js");

var lastRebuild = 0;

outputHandler.updateWriteStream();
miscFunctions.updateCurrentDate();
outputHandler.output("\nProgram startup\n");
outputHandler.output(miscFunctions.getCurrentUTC() + " (UTC)\n" + miscFunctions.getCurrentLocaltime() + " (Local time)\n");

// Fetch the config file and import the settings on program startup.
if (!getConfig.getConfig()) {
    getConfig.resetToDefaultConfiguration();
}

// Todo: check options.
app.use(compression());

// Improves security by setting various HTTP headers.
app.use(helmet());

app.get("/teamspeak/express/rebuildJSON", function(req, res) {
    var timeDifference = Date.now().valueOf() - lastRebuild,
        response = {"success": true};

    if (timeDifference > globalVariables.timeBetweenRebuilds) {
        rebuildJSON.rebuildJSON();
        lastRebuild = Date.now().valueOf();
    } else {
        outputHandler.output("\nThe last rebuild was " + timeDifference + " ms ago but timeBetweenRebuilds is set to " + globalVariables.timeBetweenRebuilds + " ms.");
        response = {
            "success": false,
            "timeBetweenRebuilds": globalVariables.timeBetweenRebuilds,
            "timeDifference": timeDifference
        };
    }

    res.send(response);
    res.end();
});

app.get("/teamspeak/express/deleteJSON", function(req, res) {
    miscFunctions.clearGlobalArrays();
    res.end();
});

app.listen(globalVariables.usedPort, function() {
    outputHandler.output("\nTS3-LDV listening on port " + globalVariables.usedPort + "\n");
});