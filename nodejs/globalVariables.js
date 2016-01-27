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
    programLogfile = Constants.programLogfile,
    virtualServer = Constants.defaultVirtualServer,
    logDirectory = Constants.defaultLogDirectory,
    bufferData = Constants.bufferData,
    usedPort = Constants.usedPort;

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
    programLogfile: programLogfile,
    virtualServer: virtualServer,
    logDirectory: logDirectory,
    bufferData: bufferData,
    usedPort: usedPort
};