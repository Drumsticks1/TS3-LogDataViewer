// globalVariables.js
// Author : Drumsticks
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
  ChannelList = [],
  programLogfile = Constants.programLogfile,
  virtualServer = Constants.virtualServer,
  logDirectory = Constants.logDirectory,
  bufferData = Constants.bufferData,
  timeBetweenBuilds = Constants.timeBetweenBuilds,
  usedPort = Constants.usedPort,
  logLevel = Constants.logLevel,
  lastModificationOfTheLastLog = 0;

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
  ChannelList: ChannelList,
  programLogfile: programLogfile,
  virtualServer: virtualServer,
  logDirectory: logDirectory,
  bufferData: bufferData,
  timeBetweenBuilds: timeBetweenBuilds,
  usedPort: usedPort,
  logLevel: logLevel,
  lastModificationOfTheLastLog: lastModificationOfTheLastLog
};