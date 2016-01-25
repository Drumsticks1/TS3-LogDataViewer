// globalVariables.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

const Constants = require("./Constants.js");

var ignoredLogs = [],
    Logs = [],
    parsedLogs = [],
    ClientList = [],
    ServerGroupList = [],
    BanList = [],
    KickList = [],
    ComplaintList = [],
    UploadList = [],
    virtualServer = Constants.DEFAULTVIRTUALSERVER,
    logDirectory = LOGDIRECTORY = Constants.DEFAULTLOGDIRECTORY;

module.exports = {
    ignoredLogs: ignoredLogs,
    Logs: Logs,
    parsedLogs: parsedLogs,
    ClientList: ClientList,
    ServerGroupList: ServerGroupList,
    BanList: BanList,
    KickList: KickList,
    ComplaintList: ComplaintList,
    UploadList: UploadList,
    virtualServer: virtualServer,
    logDirectory: logDirectory
};