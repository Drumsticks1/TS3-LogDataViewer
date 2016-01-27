// app.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const index = require("./index.js"),
    globalVariables = require("./globalVariables.js"),
    getConfig = require("./getConfig.js"),
    outputHandler = require("./outputHandler.js"),
    express = require("express"),
    compression = require('compression'),
    helmet = require('helmet'),
    miscFunctions = require("./miscFunctions.js"),
    app = express();

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
    index.rebuildJSON();
    res.end();
});

app.get("/teamspeak/express/deleteJSON", function(req, res) {
    miscFunctions.clearGlobalArrays();
    res.end();
});

app.listen(globalVariables.usedPort, function() {
    outputHandler.output("\nTS3-LDV listening on port " + globalVariables.usedPort + "\n");
});