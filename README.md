# TS3 Log Data Viewer

### Overview
 - <a href="#introduction">Introduction</a>
 - <a href="#demo">Demo</a>
 - <a href="#project_structure">Project Structure</a>
 - <a href="#feature_overview">Feature Overview</a>
 - <a href="#installation">Installation</a>
 - <a href="#configuration">Configuration</a>
   - <a href="#configuration_server">Server-Side</a>
   - <a href="#configuration_client">Client-Side</a>
 - <a href="#changelog">Changelog</a>
 - <a href="#further_notes">Further Notes</a>


### <a name="introduction">Introduction</a>
TS3-LDV is an application that extracts useful information out of logs created by an TeamSpeak3 server and allows for an easy overview over (logged) information of a TeamSpeak3 server without having to access the SQL database.
<br>
Its capabilities are limited to what is logged, but with the right logging settings applied, much useful data can be extracted.


### <a name="demo">Demo</a>
For an overview of the features and the design of the application there is a [Demo](https://drumsticks1.github.io/TS3-LogDataViewer/) of the latest release version available (set up using gh-pages)
<br>
As no code can be executed on the GitHub server, this isn't a demo for the server-side part of the application.
<br>
The [demo JSON](https://drumsticks1.github.io/TS3-LogDataViewer/output.json) was manually created with the latest release version using [this log](https://drumsticks1.github.io/TS3-LogDataViewer/logs/ts3server_2016-03-11__15_00_44.563532_1.log).


### <a name="project_structure">Project Structure</a>
The application consists of a server-side and a client-side part:

- Server-Side
  - TS3-LDV application
    - Extracts useful information out of the TeamSpeak3 server logs and generates a data file called output.json containing this information
    - Listens on localhost:port (default port: 3000) (using [Express](https://expressjs.com/), hardened security with [Helmet](https://helmetjs.github.io/)) for requests to generate an updated output.json

  - 3rd-party web server (preferably nginx)
    - Serves the files for the client-side application to the client (if configured as described in INSTALL.md it only allows access to specific files and only after user authentication)<br>
    A list of the accessible files can be found in the nginx configuration part of INSTALL.md (see the regex)
    - Forwards the request for generating an updated output.json (that can only be sent by authorized users) from the client to the server-side application

- Client-Side:
  - Single-Page application that can be opened in the browser of your choice
  - Displays the information received from the server and allows multiple features (see <a href="#feature_overview">Feature Overview</a>)
  - Can request the generation of an updated output.json from the server


### <a name="feature_overview">Feature Overview</a>
The information that is parsed out of the logs by the server-side application part is sent to the client and then rendered into multiple tables that can be filtered and sorted (see <a href="#configuration_client">Client-Side Configuration</a>).

There are currently tables for the following categories: bans, clients, complaints, kicks and uploads.
For an overview of the specific columns for each table in the latest release, see the <a href="#demo">Demo</a>.

Note about the Kick Table: only recognizes kicks from the server, not kicks from a channel.
<br>
Note about the Ban Table: currently only recognizes bans that are directly applied to a connected client that is then kicked.


### <a name="installation">Installation</a>
See <code>INSTALL.md</code> for in-depth install instructions.


### <a name="configuration">Configuration</a>
#### <a name="configuration_server">Server-Side</a>
##### TeamSpeak3 Server settings
As the application uses the logs of a TeamSpeak3 server, logging has to be enabled on the TeamSpeak3 server.
It is recommended to **enable all logging options** in the TeamSpeak3 server options, otherwise problems may occur because of missing information.

##### TS3 Log Data Viewer configuration
The configuration uses default values that can be overwritten with customized values in a local configuration file.
<br>
The hard-coded default configuration can be found in the file conf/default-conf.json.
<br>
The customized configuration should be done in the file local/conf.json (this file does not exist unless you copied the default configuration file to local/conf.json as explained in INSTALL.md)

The following options can currently be specified in conf.json:

| Setting                                   | Type                  | Default Value                                                      |
|-------------------------------------------|-----------------------|--------------------------------------------------------------------|
| <code>programLogfile</code>               | <code>string</code>   | <code>"../local/ts3-ldv.log"</code>                                |
| <code>TS3LogDirectory</code>              | <code>string</code>   | <code>"/home/teamspeak/teamspeak3-server_linux-amd64/logs/"</code> |
| <code>virtualServer</code>                | <code>integer</code>  | <code>1</code>                                                     |
| <code>bufferData</code>                   | <code>boolean</code>  | <code>true</code>                                                  |
| <code>timeBetweenRequests</code>          | <code>integer</code>  | <code>2000</code>                                                  |
| <code>usedPort</code>                     | <code>integer</code>  | <code>3000</code>                                                  |
| <code>disableLastModificationCheck</code> | <code>boolean</code>  | <code>false</code>                                                 |
| <code>logLevel</code>                     | <code>integer</code>  | <code>2</code>                                                     |
| <code>ignoredLogs</code>                  | <code>string[]</code> | <code>[]</code>                                                    |

Setting Descriptions:
 - <code>programLogfile</code><br>
 Path (*) to which the TS3-LDV log is written to.

 - <code>TS3LogDirectory</code><br>
 Path (*) of the log directory of the TeamSpeak3 server.

 - <code>virtualServer</code><br>
 Virtual Server index of the TeamSpeak3 server.

 - <code>bufferData</code><br>
 Whether parsed data is buffered between builds or not.<br>
 Buffering increases the memory usage of the application but greatly reduces the build time of the output.json after the initial build as only modified and new logs have to be parsed.

 - <code>timeBetweenRequests</code><br>
 Minimum time between two build-requests to the server-side application.<br>
 Only authenticated clients can send requests but this way you can still restrict the maximum amount of executed builds on the server.

 - <code>usedPort</code><br>
 The port on which the TS3-LDV application is listening via [Express](https://expressjs.com/) (if this value differs from the default value you have to update the port in your nginx configuration as well).

 - <code>disableLastModificationCheck</code><br>
 Allows disabling the last modification check.<br>
 The last modification check prevents a build when the modification date of the last log has not changed since the last request (= no new data was logged).

 - <code>logLevel</code><br>
 The level at which the TS3-LDV application logs information.<br>
 (0: error, 1: warn, 2: info, 3: debug)

 - <code>ignoredLogs</code><br>
 Array containing names of logs that are excluded.<br>
 Can be used to ignore logs after e.g a TeamSpeak3 database reset.

(*) Relative paths are possible, they need to be relative to the nodejs directory (see default value of programLogfile).

#### <a name="configuration_client">Client-Side</a>
 - Most configuration options are automatically stored in the local storage of your browser and will allow persistence (unless clearing the local storage)
 - You can select the tables you want to be generated at the top of the page (by default all tables are activated, click to change the current state)
 - Tables (see https://github.com/Mottie/tablesorter for more information about the tables)
   - Can be sorted easily by clicking the column header cells (holding SHIFT for sorting by multiple columns)
   - Filtering table entries is also possible (not persistent for now)
 - There are also some table-specific options (e.g. switching between IDs and UIDs in the Ban Table) located between the table headings and the tables themselves


### <a name="changelog">Changelog</a>
See <code>changelog.md</code> for the changelog for each release version


### <a name="further_notes">Further Notes</a>
- Feel free to open issues on GitHub when encountering problems, having improvement suggestions or feature requests.

- There is a bug in all TeamSpeak3 server releases since version 3.0.12 (not fixed as of version 3.0.13.6) that the deletion of uploaded files isn't logged.
As a result of this bug, the deletion of files when using this TeamSpeak3 server versions, can't be detected by TS3-LDV.
