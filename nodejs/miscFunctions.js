// miscFunctions.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const globalVariables = require("./globalVariables.js"),
    Client = require("./Client.js"),
    ServerGroup = require("./ServerGroup.js"),
    Ban = require("./Ban.js"),
    Kick = require("./Kick.js"),
    Complaint = require("./Complaint.js"),
    Upload = require("./Upload.js"),
    Channel = require("./Channel.js");

var programStartDate;

/**
 * Resize the array to the request length by appending the filling objects to the array.
 * @param length - requested length
 * @param objectName - name of the filling object class:
 *        "Client", "ServerGroup", "Ban", "Kick", "Complaint", "Upload"
 */
Array.prototype.resizeFill = function(length, objectName) {
    for (var i = this.length; i < length; i++) {
        var pushObject;
        switch (objectName) {
            case "Client":
                pushObject = new Client.Client();
                break;
            case "ServerGroup":
                pushObject = new ServerGroup.ServerGroup();
                break;
            case "Ban":
                pushObject = new Ban.Ban();
                break;
            case "Kick":
                pushObject = new Kick.Kick();
                break;
            case "Complaint":
                pushObject = new Complaint.Complaint();
                break;
            case "Upload":
                pushObject = new Upload.Upload();
                break;
            case "Channel":
                pushObject = new Channel.Channel();
        }
        this.push(pushObject);
    }
};

module.exports = {
    /**
     * Sets the programStartDate to the current date.
     */
    setProgramStartDate: function() {
        programStartDate = new Date();
    },

    /**
     * Returns the difference between the programStartDate and the current date.
     * @returns {number} the program runtime in ms.
     */
    getProgramRuntime: function() {
        return new Date() - programStartDate.getTime();
    },

    /**
     * Returns the current time as utc string with the format "dd.mm.yyyy hh:mm:ss".
     * @returns {string} utc date string with the format "dd.mm.yyyy hh:mm:ss".
     */
    getCurrentUTC: function() {
        return dateToUTCString(new Date());
    },

    /**
     * Returns an object containing a localtime and a utc string of the current dateTime.
     * @returns {{local: string, utc: string}}
     */
    getCurrentTimestamps: function() {
        var currentDate = new Date();
        return {
            "local": dateToString(currentDate),
            "utc": dateToUTCString(currentDate)
        };
    },
    
    /**
     * Clears the arrays storing the parsed information.
     */
    clearGlobalArrays: function() {
        globalVariables.ClientList.length = globalVariables.ServerGroupList.length =
            globalVariables.BanList.length = globalVariables.KickList.length =
                globalVariables.ComplaintList.length = globalVariables.UploadList.length =
                    globalVariables.ignoredLogs.length = globalVariables.Logs.length =
                        globalVariables.parsedLogs.length = 0;
    },

    /**
     * Resets the connectedState variable of all Clients.
     */
    resetConnectedStates: function() {
        for (var i = 0; i < globalVariables.ClientList.length; i++) {
            globalVariables.ClientList[i].resetConnectedState();
        }
    }
};

/**
 * Returns x as double digit string.
 * @param {number} x - given number.
 * @returns {string} double digit string.
 */
function toDoubleDigit(x) {
    var y = String(x);
    if (x < 10) y = "0" + String(x);
    return y;
}

/**
 * Returns the a Date t as string with the format "dd.mm.yyyy hh:mm:ss".
 * @param {Date} t the Date.
 * @returns {string} string with the format "dd.mm.yyyy hh:mm:ss".
 */
function dateToString(t) {
    return toDoubleDigit(t.getDate()) + "." + toDoubleDigit(t.getMonth() + 1) + "." + t.getFullYear() + " " +
        toDoubleDigit(t.getHours()) + ":" + toDoubleDigit(t.getMinutes()) + ":" + toDoubleDigit(t.getSeconds());
}

/**
 * Returns the a Date t as utc string with the format "dd.mm.yyyy hh:mm:ss".
 * @param {Date} t the Date.
 * @returns {string} utc string with the format "dd.mm.yyyy hh:mm:ss".
 */
function dateToUTCString(t) {
    return dateToString(new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(),
        t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getMilliseconds()));
}
