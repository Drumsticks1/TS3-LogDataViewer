// app.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const index = require("./index.js"),
    express = require("express"),
    compression = require('compression'),
    helmet = require('helmet'),
    miscFunctions = require("./miscFunctions.js"),
    app = express();

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

app.listen(3000, function() {
    console.log("TS3-LDV listening on port 3000");
});