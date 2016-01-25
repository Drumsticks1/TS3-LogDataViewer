// app.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const index = require("./index.js"),
    express = require("express"),
    compression = require('compression'),
    app = express();

// Todo: check options.
app.use(compression());


// Todo: Maybe add option for setting the LogDirectory and the VirtualServer via call or via conf file.
app.get("/rebuildXML", function(req, res) {
    if (index.rebuildXML()) {
        res.write("success");
    } else {
        res.write("failed");
    }

    res.end();
});

app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
});