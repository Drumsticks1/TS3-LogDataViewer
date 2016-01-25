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

// Todo: Maybe add option for setting the LogDirectory and the VirtualServer via call or via conf file.
app.get("/teamspeak/express/rebuildXML", function(req, res) {
    index.rebuildXML();
    res.end();
});

// Todo: Really delete XML / Rename the call.
app.get("/teamspeak/express/deleteXML", function(req, res) {
    miscFunctions.clearGlobalArrays();
    res.end();
});

app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
});