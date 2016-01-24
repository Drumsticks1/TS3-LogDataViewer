// miscFunctions.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const Client = require("./Client.js"),
    ServerGroup = require("./ServerGroup.js"),
    Ban = require("./Ban.js"),
    Kick = require("./Kick.js"),
    Complaint = require("./Complaint.js"),
    Upload = require("./Upload.js");

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
        }
        this.push(pushObject);
    }
};

module.exports = {
    updateCurrentDate: function() {
        currentDate = new Date;
    },

    getProgramRuntime: function(programStart){
        this.updateCurrentDate();
        return currentDate.getTime() - programStart.getTime();
    },

    // Returns the current UTC time as string with the format "dd.mm.yyyy hh:mm:ss".
    getCurrentUTC: function() {
        var t = currentDate;
        return dateToString(new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(),
            t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getMilliseconds()));
    },

    // Returns the current local time as string with the format "dd.mm.yyyy hh:mm:ss".
    getCurrentLocaltime: function() {
        return dateToString(currentDate);
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
 * Returns the t as string with the format "dd.mm.yyyy hh:mm:ss".
 * @param {Date} t
 * @returns {string}
 */
function dateToString(t) {
    return toDoubleDigit(t.getDate()) + "." + toDoubleDigit(t.getMonth()) + "." + t.getFullYear() + " " +
        toDoubleDigit(t.getHours()) + ":" + toDoubleDigit(t.getMinutes()) + ":" + toDoubleDigit(t.getSeconds());
}