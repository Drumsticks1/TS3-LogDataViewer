// checkFunctions.js: Control Functions.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
const globalArrays = require("./globalArrays.js");

var ClientList = globalArrays.ClientList,
    BanList = globalArrays.BanList,
    KickList = globalArrays.KickList,
    ComplaintList = globalArrays.ComplaintList,
    UploadList = globalArrays.UploadList,
    Logs = globalArrays.Logs,
    ignoredLogs = globalArrays.ignoredLogs,
    parsedLogs = globalArrays.parsedLogs;

module.exports = {
    /**
     * Checks if a ServerGroup is already existing in the Client ServerListID vector.
     * @param {number} clientID
     * @param {number} serverID
     * @returns {boolean}
     */
    isDuplicateServerGroup: function(clientID, serverID) {
        for (var i = 0; i < ClientList[clientID].getServerGroupIDCount(); i++) {
            if (ClientList[clientID].getUniqueServerGroupID(i) == serverID) {
                return true;
            }
        }
        return false;
    },

    /**
     * Checks if a DateTime is already existing for the current client.
     * @param {number} ID
     * @param {string} DateTime
     * @returns {boolean}
     */
    isDuplicateDateTime: function(ID, DateTime) {
        for (var i = 0; i < ClientList[ID].getDateTimeCount(); i++) {
            if (ClientList[ID].getUniqueDateTime(i) == DateTime) {
                return true;
            }
        }
        return false;
    },

    /**
     * Checks if the log is existing in the ignoredLogs array.
     * @param {string} log
     * @returns {boolean}
     */
    isIgnoredLog: function(log) {
        for (var i = 0; i < ignoredLogs.length; i++) {
            if (log == ignoredLogs[i])
                return true;
        }
        return false;
    },

    /**
     * Checks if a log is already existing in the parsedLogs list.
     * @param {string} log
     * @returns {boolean}
     */
    isDuplicateLog: function(log) {
        for (var i = 0; i < parsedLogs.length; i++) {
            if (log == parsedLogs[i]) return true;
        }
        return false;
    },

    /**
     * Checks if the order of Logs and ParsedLogs is matching.
     * @returns {boolean}
     */
    isMatchingLogOrder: function() {
        for (var i = 0; i < parsedLogs.length; i++) {
            if (i < Logs.length) {
                if (parsedLogs[i] != Logs[i]) {
                    return false;
                }
            }
            else return false;
        }
        return true;
    },

    /**
     * Checks if the two ban rules are matching with a ban disconnect.
     * @param {string} bannedByNickname
     * @param {string} banReason
     * @param {number} bantime
     * @param {string} lastUIDBanRule
     * @param {string} lastIPBanRule
     * @returns {boolean}
     */
    isMatchingBanRules: function(bannedByNickname, banReason, bantime, lastUIDBanRule, lastIPBanRule) {
        var UID = lastUIDBanRule, IP = lastIPBanRule;
        if (bannedByNickname == "Server") {
            bannedByNickname = "server";
        }

        if (UID.indexOf(" by client '" + bannedByNickname + "'(") != -1 && IP.indexOf(" by client '" + bannedByNickname + "'(") != -1) {
            if (UID.indexOf("| ban added reason='" + banReason + "' cluid='") != -1 && IP.indexOf("| ban added reason='" + banReason + "' ip='") != -1) {
                if (UID.indexOf("bantime=" + bantime + " ") != -1 && IP.indexOf("bantime=" + bantime + " ") != -1) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Checks if a ban is already existing in the BanList.
     * @param {string} banDateTime
     * @param {number} bannedID
     * @param {string} bannedNickname
     * @param {string} bannedUID
     * @param {string} bannedIP
     * @param {string} bannedByNickname
     * @param {number} bannedByID
     * @param {string} bannedByUID
     * @param {string} banReason
     * @param {number} bantime
     * @returns {boolean}
     */
    isDuplicateBan: function(banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, bantime) {
        for (var i = 0; i < BanList.length; i++) {
            if (BanList[i].getBanDateTime() == banDateTime && BanList[i].getBannedID() == bannedID && BanList[i].getBannedNickname() == bannedNickname &&
                BanList[i].getBannedUID() == bannedUID && BanList[i].getBannedIP() == bannedIP && BanList[i].getBannedByID() == bannedByID &&
                BanList[i].getBannedByNickname() == bannedByNickname && BanList[i].getBannedByUID() == bannedByUID && BanList[i].getBanReason() == banReason &&
                BanList[i].getBantime() == bantime) return true;
        }
        return false;
    },

    /**
     * Checks if a kick is already existing in the KickList.
     * @param {string} kickDateTime
     * @param {number} kickedID
     * @param {string} kickedNickname
     * @param {string} kickedByNickname
     * @param {string} kickedByUID
     * @param {string} kickReason
     * @returns {boolean}
     */
    isDuplicateKick: function(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason) {
        for (var i = 0; i < KickList.length; i++) {
            if (KickList[i].getKickDateTime() == kickDateTime && KickList[i].getKickedID() == kickedID && KickList[i].getKickedNickname() == kickedNickname &&
                KickList[i].getKickedByNickname() == kickedByNickname && KickList[i].getKickedByUID() == kickedByUID && KickList[i].getKickReason() == kickReason) return true;
        }
        return false;
    },

    /**
     * Checks if a complaint is already existing in the ComplaintList
     * @param {string} complaintDateTime
     * @param {string} complaintAboutNickname
     * @param {number} complaintAboutID
     * @param {string} complaintReason
     * @param {string} complaintByNickname
     * @param {number} complaintByID
     * @returns {boolean}
     */
    isDuplicateComplaint: function(complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID) {
        for (var i = 0; i < ComplaintList.length; i++) {
            if (ComplaintList[i].getComplaintDateTime() == complaintDateTime && ComplaintList[i].getComplaintAboutNickname() == complaintAboutNickname &&
                ComplaintList[i].getComplaintAboutID() == complaintAboutID && ComplaintList[i].getComplaintReason() == complaintReason &&
                ComplaintList[i].getComplaintByNickname() == complaintByNickname && ComplaintList[i].getComplaintByID() == complaintByID) return true;
        }
        return false;
    },

    /**
     * Checks if an upload is already existing in the UploadList.
     * @param {string} uploadDateTime
     * @param {number} channelID
     * @param {string} filename
     * @param {string} uploadedByNickname
     * @param {number} uploadedByID
     * @returns {boolean}
     */
    isDuplicateUpload: function(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID) {
        for (var i = 0; i < UploadList.length; i++) {
            if (UploadList[i].getUploadDateTime() == uploadDateTime && UploadList[i].getChannelID() == channelID && UploadList[i].getFilename() == filename &&
                UploadList[i].getUploadedByNickname() == uploadedByNickname && UploadList[i].getUploadedByID() == uploadedByID) return true;
        }
        return false;
    }
};