// js/modules/serverInteractions.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

/**
 * Module containing functions that are related to interactions with the server.
 */
ts3ldv.serverInteractions = (function (module) {

    /**
     * The time that has to pass between two builds (is set server-side).
     * @type {number}
     */
    var timeBetweenBuilds = -1;

    /**
     * True if there is currently a build request in progress, false otherwise.
     * @type {boolean}
     */
    var buildRequestInProgress = false;

    /**
     * Contains the value that Date.now().valueOf() returned when the last build request was sent.
     * @type {number}
     */
    var lastBuildRequestTimestamp = -1;

    /**
     * Updates the stored timeBetweenBuilds variable if necessary.
     *
     * @param {object} response response object of a request.
     */
    function updateTimeBetweenBuilds(response) {
        if (timeBetweenBuilds !== response.timeBetweenRequests)
            timeBetweenBuilds = response.timeBetweenRequests;
    }

    /**
     * Sends a request for building the JSON to the server.
     *
     * @param {boolean} clearBuffer if true: clears the buffer before building the json.
     */
    module.requestJsonBuild = function (clearBuffer) {
        /* Requests are only sent if the time span between the last two requests is bigger than timeBetweenRequests and
         there is no request in progress. Invalid requests are only sent when the remote timeBetweenRequests is unknown
         or has increased since the last request */
        if (!buildRequestInProgress &&
            (lastBuildRequestTimestamp === -1 || timeBetweenBuilds === -1 ||
            Date.now().valueOf() - lastBuildRequestTimestamp > timeBetweenBuilds)) {

            buildRequestInProgress = true;
            lastBuildRequestTimestamp = Date.now().valueOf();

            $.get("./express/buildJSON", {"clearBuffer": clearBuffer}, function (res) {
                if (res.success) {
                    updateTimeBetweenBuilds(res);

                    if (res.newJSON)
                        if (res.fetchLogsError)
                            addCallout("An error occurred while fetching the log files, please check the ts3-ldv.log for more information.", "alert fetchLogsErrorCallout");
                        else
                            ts3ldv.tables.build();
                    else
                        addCallout("No new information!", "secondary noNewInformationCallout", 2500);
                }
                else {
                    updateTimeBetweenBuilds(res);

                    var timeUntilNextBuild = (timeBetweenBuilds - res.timeDifference);
                    addCallout("Next JSON build request allowed in " + timeUntilNextBuild + " ms!\n(This message will disappear when the next request is allowed)", "warning nextRequestCallout", timeUntilNextBuild);
                }
                buildRequestInProgress = false;
            });
            return;
        }

        if (buildRequestInProgress)
            addCallout("A JSON build request has already been sent!", "warning buildRequestInProgressCallout", 1500);
        else {
            var timeUntilNextBuild = timeBetweenBuilds - (Date.now().valueOf() - lastBuildRequestTimestamp);
            addCallout("Next JSON build request allowed in " + timeUntilNextBuild + " ms!\n(This message will disappear when the next request is allowed)", "warning nextRequestCallout", timeUntilNextBuild);
        }

        document.getElementById("buildJSONButton").disabled = document.getElementById("buildJSONWithoutBufferButton").disabled = false;
        nanobar.go(100);
    };

    return module;
}(ts3ldv.serverInteractions || {}));
