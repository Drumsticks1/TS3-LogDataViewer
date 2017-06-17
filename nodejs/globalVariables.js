// globalVariables.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

const Constants = require("./Constants.js");

const ignoredLogs = [],
  Logs = [],
  ClientList = [],
  ServerGroupList = [],
  BanList = [],
  KickList = [],
  ComplaintList = [],
  UploadList = [],
  ChannelList = [],
  programLogfile = Constants.programLogfile,
  virtualServer = Constants.virtualServer,
  TS3LogDirectory = Constants.TS3LogDirectory,
  bufferData = Constants.bufferData,
  timeBetweenRequests = Constants.timeBetweenRequests,
  disableLastModificationCheck = Constants.disableLastModificationCheck,
  usedPort = Constants.usedPort,
  logLevel = Constants.logLevel,
  lastModificationOfTheLastLog = 0;

module.exports = {
  ignoredLogs: ignoredLogs,
  Logs: Logs,
  ClientList: ClientList,
  ServerGroupList: ServerGroupList,
  BanList: BanList,
  KickList: KickList,
  ComplaintList: ComplaintList,
  UploadList: UploadList,
  ChannelList: ChannelList,
  programLogfile: programLogfile,
  virtualServer: virtualServer,
  TS3LogDirectory: TS3LogDirectory,
  bufferData: bufferData,
  timeBetweenRequests: timeBetweenRequests,
  disableLastModificationCheck: disableLastModificationCheck,
  usedPort: usedPort,
  logLevel: logLevel,
  lastModificationOfTheLastLog: lastModificationOfTheLastLog
};