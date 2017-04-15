// js/modules/event.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions that are related to events and their handling.
 */
ts3ldv.event = (function (module) {

    /**
     * Array containing all objects that have event listeners added by the addOnClickEventListener function attached to them.
     * Required for deletion of all those event listeners with the removeOnClickEventListeners function.
     * @type {Array}
     */
    var eventListeners = [];

    /**
     * Adds the onclick event listener to the object and adds the object to the eventListeners array.
     *
     * @param {object} object - the given object
     * @param {function} event - the given event.
     */
    module.addOnClickEventListener = function (object, event) {
        object.onclick = event;
        eventListeners.push(object);
    };

    /**
     * Destroys all onclick event listeners that are attached to objects that are listed in the eventListeners array.
     */
    module.removeOnClickEventListeners = function() {
        for (var i = eventListeners.length - 1; i >= 0; i--) {
            eventListeners[i].onclick = null;
            eventListeners.pop();
        }
    };

    return module;
}(ts3ldv.event || {}));
