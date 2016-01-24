// main.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    Constants = require("./Constants.js"),
    outputHandler = require("./outputHandler.js"),
    fetchLogs = require("./fetchLogs.js"),
    parseXML = require('./parseXML.js'),
    parseLogs = require("./parseLogs.js"),
    createXML = require("./createXML.js"),
    miscFunctions = require("./miscFunctions.js");

var validXML = false,
    VIRTUALSERVER = Constants.DEFAULTVIRTUALSERVER;

exports.VIRTUALSERVER = VIRTUALSERVER;

/**
 * Main function
 */
function main() {
    var programStart = new Date();

    miscFunctions.updateCurrentDate();

    outputHandler.output("Last program run\n\n" + miscFunctions.getCurrentUTC() + " (UTC)\n" + miscFunctions.getCurrentLocaltime() + " (Local time)\n");
    //exchange async functions with sync functions.
    fs.stat("./lockfile", function(err, stats) {
        if (!err) {
            var currentTime = Date.now().valueOf(),
                lockfileCreation = stats.ctime.valueOf();

            if ((currentTime - lockfileCreation) / 1000 > Constants.LOCKFILEEXPIRATION) {
                outputHandler.output("The lockfile is older than " + Constants.LOCKFILEEXPIRATION + " seconds - removing lockfile...");
                fs.unlink("lockfile");
            }
        }

        fs.access("./lockfile", fs.F_OK, function(err) {
            if (!err && !Constants.SKIPLOCKFILE) {
                outputHandler.output("The program is already running...\nThis program instance will now exit...");
                return 0;
            }
            else if (Constants.SKIPLOCKFILE) {
                outputHandler.output("SKIPLOCKFILE is set to true --> lockfile will be ignored");
            }

            //Todo: Check functionality,  prevent file deletion while the process is running.
            fs.createWriteStream("./lockfile", {autoClose: false});

            var LOGDIRECTORY = Constants.DEFAULTLOGDIRECTORY,
                setLD = false, setVS = false;

            for (var i = 0; i < process.argv.length; i++) {
                if (process.argv[i].indexOf("--logdirectory=") == 0) {
                    LOGDIRECTORY = process.argv[i].substring(15);
                    setLD = true;
                } else if (process.argv[i].indexOf("--virtualserver=") == 0) {
                    VIRTUALSERVER = process.argv[i].substring(16);
                    setVS = true;
                }
            }

            if (!setLD) {
                outputHandler.output("No logdirectory specified - using default path...");
            }

            if (!setVS) {
                outputHandler.output("No virtual server specified - using default value...");
            }


            if (!fetchLogs.fetchLogs(LOGDIRECTORY)) {
                outputHandler.output("The program will now exit...");
                fs.unlink("lockfile");
                return 0;
            }


            outputHandler.output("XML parsing is currently skipped as regular parsing is faster.");
            /*
            if (!parseXML.parseXML()) {
                outputHandler.output("XML isn't valid - skipping XML parsing...");
            }
            else validXML = true;*/

            parseLogs.parseLogs(LOGDIRECTORY, validXML);

            createXML.createXML();

            fs.unlink("lockfile");

            outputHandler.output("Program runtime: " + miscFunctions.getProgramRuntime(programStart) + " ms.");
            return 0;
        });
    });
}

main();