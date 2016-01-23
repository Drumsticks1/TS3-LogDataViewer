// miscFunctions.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var currentDate;

/**
 * Resizes the array to the request length by appending the filling objects to the array.
 * @param length - requested length
 * @param object - filling objects.
 */
Array.prototype.resizeFill = function(length, object) {
    for (var i = this.length; i < length; i++) {
        this.push(object);
    }
};

module.exports = {
    updateCurrentDate: function(){
        currentDate = new Date;
    },

    // Returns the current UTC time as string with the format "dd.mm.yyyy hh:mm:ss".
    getCurrentUTC: function() {
        var t = currentDate;
        return dateToString(new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(),
            t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()));
    },

    // Returns the current local time as string with the format "dd.mm.yyyy hh:mm:ss".
    getCurrentLocaltime: function() {
        return dateToString(currentDate);
    }
};

// Returns the given date object as string with the format "dd.mm.yyyy hh:mm:ss".
    function dateToString(t) {
    var year = t.getFullYear(), month = t.getMonth() + 1, day = t.getDate(), hours = t.getHours(), minutes = t.getMinutes(), seconds = t.getSeconds();

    var t_string = "";
    if (day < 10) {
        t_string += "0";
    }
    t_string += day + ".";
    if (month < 10) {
        t_string += "0";
    }
    t_string += month + "." + year + " ";
    if (hours < 10) {
        t_string += "0";
    }
    t_string += hours + ":";
    if (minutes < 10) {
        t_string += "0";
    }
    t_string += minutes + ":";
    if (seconds < 10) {
        t_string += "0";
    }
    t_string += seconds;
    return t_string;
}