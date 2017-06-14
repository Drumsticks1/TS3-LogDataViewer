// js/modules/ui.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing UI related functions.
 */
(function (parent) {
    var module = parent.ui = parent.ui || {};

    /**
     * Adds a removable callout.
     * If duration is specified the created object fades out after the duration and is removed afterwards.
     *
     * TODO add note about foundation-sites
     *
     * @param {string} message
     * @param {string} calloutClass
     * @param {number} [duration]
     * @returns {Element} the created callout div
     */
    module.addCallout = function (message, calloutClass, duration) {
        var calloutsWithTheSameClass = document.getElementsByClassName(calloutClass);

        // Prevents duplicate callouts
        if (calloutsWithTheSameClass.length !== 0) {
            // Updates the message of the nextRequestCallout if one is already existing.
            if (calloutClass.indexOf("nextRequestCallout") !== -1)
                calloutsWithTheSameClass[0].innerText = message;

            return;
        }

        var callout = document.createElement("div"),
            calloutCloseButton = document.createElement("button");

        callout.innerText = message;
        callout.className = "callout " + calloutClass;
        callout.setAttribute("data-closable", "");

        calloutCloseButton.innerHTML = "&#215;";
        calloutCloseButton.className = "close-button";
        calloutCloseButton.setAttribute("data-close", "");

        callout.appendChild(calloutCloseButton);
        document.getElementById("calloutDiv").appendChild(callout);

        if (duration !== undefined) {
            setTimeout(function () {
                $(callout).fadeOut(function () {
                    callout.parentNode.removeChild(callout);
                });
            }, duration)
        }

        return callout;
    };

    return module;
}(ts3ldv || {}));

