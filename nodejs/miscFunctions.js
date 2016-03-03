// miscFunctions.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const globalVariables = require("./globalVariables.js");

const Client = require("./Client.js"),
    ServerGroup = require("./ServerGroup.js"),
    Ban = require("./Ban.js"),
    Kick = require("./Kick.js"),
    Complaint = require("./Complaint.js"),
    Upload = require("./Upload.js"),
    Channel = require("./Channel.js");

var currentDate;

/**
 * Resizes the array to the request length by appending the filling objects to the array.
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
     * Updates the currentDate to the current date.
     */
    updateCurrentDate: function() {
        currentDate = new Date();
    },

    /**
     * Returns the difference between the stored currentDate and the received date.
     * @param programStart the received date.
     * @returns {number} the difference between the dates in ms.
     */
    getProgramRuntime: function(programStart) {
        this.updateCurrentDate();
        return currentDate.getTime() - programStart.getTime();
    },

    /**
     * Returns the current UTC time as string with the format "dd.mm.yyyy hh:mm:ss".
     * @returns {string} date string with the format "dd.mm.yyyy hh:mm:ss".
     */
    getCurrentUTC: function() {
        var t = currentDate;
        return dateToString(new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(),
            t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getMilliseconds()));
    },

    /**
     * Returns the local time as string with the format "dd.mm.yyyy hh:mm:ss".
     * @returns {string} date string with the format "dd.mm.yyyy hh:mm:ss".
     */
    getCurrentLocaltime: function() {
        return dateToString(currentDate);
    },

    // Todo: maybe move to a resetFunctions js.
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
