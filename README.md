TS3-LogDataViewer is an easy to deploy application that gathers information from the logs of a ts3 server and displays them in an interface that is accessible via your web browser.
The interface shows detailed information about the clients and their activity on your TeamSpeak3 server.

## Development Activity Update (August 2016)
I am currently not adding features to the project, at least not actively.
<br>
However I will still keep ts3-ldv compatible with new ts3 server updates (as long as there isn't a ts3 server update that completely breaks ts3-ldv) and fix bugs that I find while using ts-ldv as well as bugs that are brought to my attention by issues on the GitHub project page.

## How it works
It contains two parts:
- server-side: a nodejs application that parses the logs of the TS3 server, stores the information and creates a JSON for further use.
- client-side*: an one-page-application that can be accessed via browser and displays the information in multiple tables that can easily be interacted with.

(* the files are on the server but are accessed and used in the client-side interface)

## [Demo](https://drumsticks1.github.io/TS3-LogDataViewer/)
This demo is set up with gh-pages and shows the design as well as some features of the latest release version.
<br>
As no code can be executed on the GitHub server, this isn't a demo for the server-side part.
<br>
The [demo JSON](https://drumsticks1.github.io/TS3-LogDataViewer/output.json) was created by the tool (v2.0.7)
out of [this log](https://drumsticks1.github.io/TS3-LogDataViewer/logs/ts3server_2016-03-11__15_00_44.563532_1.log).

#### Teamspeak 3 server settings
It is recommended to **enable all logging options** in the server options.
Otherwise some parts of the application may not be available or further features will only work with new data.

## Server operating systems
I privately run it on a debian jessie distribution running nginx.
<br>
That's why I can only provide a template for nginx configuration settings (see INSTALL.md) as well as a systemd service script and not configurations for other webservers or init systems.
<br>

If you use something else than nginx: make sure that you know what you are doing and restrict the access to your ts3-ldv folder!<br>

The program may also run on other operating systems that have nodejs installed but it is only tested with linux!

## Installation
The installation is recommended via npm and needs a few additional small steps of configuration.
<br>
[ts3-ldv package on npm](https://www.npmjs.com/package/ts3-ldv)
<br>
You can find the in-depth installation instructions in the INSTALL.md, it also contains a section for the nginx configuration.

## Features
Would be too much to write down here.
<br>
Check it out yourself, start with the [demo](https://drumsticks1.github.io/TS3-LogDataViewer/)!

## Configuration settings (server-side)
The following options can currently be specified in conf.json:

| Setting                      | Description                                      | Type     | Default Value                                         |
|------------------------------|--------------------------------------------------|----------|-------------------------------------------------------|
| programLogfile               | Path to which the ts3-ldv log is written to      | string   | "../local/ts3-ldv.log"                                |
| TS3LogDirectory              | Path to the log directory of the ts3 server      | string   | "/home/teamspeak/teamspeak3-server_linux-amd64/logs/" |
| virtualServer                | Virtual server which logs are to be parsed       | integer  | 1                                                     |
| bufferData                   | Whether parsed data is buffered between builds   | boolean  | true                                                  |
| timeBetweenRequests          | Minimum time allowed between requests to the app | integer  | 2000                                                  |
| usedPort                     | The port on which the ts3-ldv app is running     | integer  | 3000                                                  |
| disableLastModificationCheck | Allows disabling the last modification check (*) | boolean  | false                                                 |
| ignoredLogs                  | Array containing names of logs that are excluded | string[] | []                                                    |

(*) The last modification check prevents a build when the modification date of the last log has not changed since the last request (= no new data was logged).

## Changelog
The changelog for each release version can be found in the file `changelog.md`

## Support
If there are any problems, improvement suggestions or feature requests feel free to open an Issue on GitHub.
