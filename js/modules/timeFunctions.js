// js/modules/timeFunctions.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

/**
 * Module containing time related functions.
 */
ts3ldv.timeFunctions = (function (module) {

    /**
     * Returns the number x as double digit string.
     *
     * @param {number} x - given number.
     * @returns {string} - double digit string.
     */
    function toDoubleDigit (x) {
        var y = String(x);
        if (x < 10) y = "0" + y;
        return y;
    }

    /**
     * Converts a UTC dateTime string into a Date object which can be handled by moment.js functions.
     *
     * @param {string} dateString - UTC dateTime string with the format YYYY-MM-DD HH:mm:ss.
     * @returns {Date} - UTC Date object that can be handeled by moment.js functions.
     * @constructor
     */
    module.UTCDateStringToDate = function (dateString) {
        return new Date(Date.UTC(
            Number(dateString.substr(0, 4)),
            Number(dateString.substr(5, 2)) - 1,
            Number(dateString.substr(8, 2)),
            Number(dateString.substr(11, 2)),
            Number(dateString.substr(14, 2)),
            Number(dateString.substr(17, 2))));
    };

    /**
     * Calls UTCDateStringToDate and converts the returned UTC Date object to a Localtime string.
     *
     * @param {string} dateString - UTC dateTime string with the format YYYY-MM-DD HH:mm:ss.
     * @returns {string} - Localtime string.
     * @constructor
     */
    module.UTCDateStringToLocaltimeString = function (dateString) {
        var dateObject = this.UTCDateStringToDate(dateString);
        return dateObject.getFullYear()
            + "-" + toDoubleDigit(dateObject.getMonth() + 1)
            + "-" + toDoubleDigit(dateObject.getDate())
            + " " + toDoubleDigit(dateObject.getHours())
            + ":" + toDoubleDigit(dateObject.getMinutes())
            + ":" + toDoubleDigit(dateObject.getSeconds());
    };

    /**
     * Converts the given dateTime string to a string with the format
     *
     * YYYY-MM-DD HH:mm:ss
     * (about ...... ago)
     *
     * @param {string} dateTime - the given dateTime string.
     * @returns {string} string with the described format.
     */
    module.dateTimeToMomentString = function (dateTime) {
        var dateTimeObject = moment(this.UTCDateStringToDate(dateTime));
        return dateTimeObject.format(timeFormat) + "<br />(about " + dateTimeObject.fromNow() + ")";
    };

    return module;
}(ts3ldv.timeFunctions || {}));

