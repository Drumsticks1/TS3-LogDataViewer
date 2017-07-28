// js/modules/ui.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing UI related functions.
 */
(function (parent) {
  const module = parent.ui = parent.ui || {};

  /**
   * Adds a removable callout.
   * If duration is specified the created object fades out after the duration and is removed afterwards.
   *
   * See http://foundation.zurb.com/sites/docs/callout.html
   *
   * @param {string} message
   * @param {string} calloutClass
   * @param {number} [duration]
   * @returns {Element} the created callout div
   */
  module.addCallout = function (message, calloutClass, duration) {
    const calloutsWithTheSameClass = document.getElementsByClassName(calloutClass);

    // TODO: easier and more reliable duplicate detection system, currently uncovered corner case: two existing callouts
    // Prevents duplicate callouts
    if (calloutsWithTheSameClass.length !== 0) {

      // Updates the message of the nextRequestCallout if one is already existing.
      if (calloutClass.includes("nextRequestCallout"))
        calloutsWithTheSameClass[0].innerText = message;

      return calloutsWithTheSameClass[0];
    }

    const callout = document.createElement("div"),
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

