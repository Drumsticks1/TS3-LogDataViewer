// miscFunctions.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const globalVariables = require("./globalVariables.js");

var programStartDate;

module.exports = {
  /**
   * Sets the programStartDate to the current date.
   */
  setProgramStartDate: function () {
    programStartDate = new Date();
  },

  /**
   * Returns the difference between the programStartDate and the current date.
   * @returns {number} the program runtime in ms.
   */
  getProgramRuntime: function () {
    return new Date() - programStartDate.getTime();
  },

  /**
   * Returns the current time as utc string with the format "dd.mm.yyyy hh:mm:ss".
   * @returns {string} utc date string with the format "dd.mm.yyyy hh:mm:ss".
   */
  getCurrentUTC: function () {
    return dateToUTCString(new Date());
  },

  /**
   * Returns an object containing a localtime and a utc string of the current dateTime.
   * @returns {{local: string, utc: string}}
   */
  getCurrentTimestamps: function () {
    var currentDate = new Date();
    return {
      "local": dateToString(currentDate),
      "utc": dateToUTCString(currentDate)
    };
  },

  /**
   * Clears the arrays storing the parsed information.
   * Don't reset the ignoredLogs array here!
   */
  clearGlobalArrays: function () {
    globalVariables.ClientList.length = globalVariables.ServerGroupList.length =
      globalVariables.BanList.length = globalVariables.KickList.length =
        globalVariables.ComplaintList.length = globalVariables.UploadList.length =
          globalVariables.Logs.length = 0;
  },

  /**
   * Resets the connectedState variable of all Clients.
   */
  resetConnectedStates: function () {
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
