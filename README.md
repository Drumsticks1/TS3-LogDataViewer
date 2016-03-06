TS3-LogDataViewer is an easy to deploy application that gathers information from the logs of a ts3 server and displays them in an interface that is accessible via the web browser.
The interface shows detailed information about the clients and their activity on your TeamSpeak3 server.

## How it works
It contains two parts:
- server-side: a nodejs application that parses the logs of the TS3 server, stores the information and creates a JSON for further use.
- client-side*: an one-page-application that can be accessed via browser and displays the information in multiple tables that can easily be interacted with.

(* the files are on the server but are accessed and used in the client-side interface)

## [Demo](https://drumsticks1.github.io/TS3-LogDataViewer/demo/)
This demo is set up with gh-pages and shows the design as well as some features of the latest release version.
<br>
As no code can be executed on the GitHub server, this isn't a demo for the server-side part.
<br>
The [used JSON](https://drumsticks1.github.io/TS3-LogDataViewer/demo/output.json) was created by the nodejs application
out of [this log](https://drumsticks1.github.io/TS3-LogDataViewer/demo/test.log).

#### Teamspeak 3 server settings
It is recommended to **enable all logging options** in the server options.
Otherwise some parts of the application may not be available or further features will only work with new data.

## Server operating systems
I privately run it on a debian jessie distribution running nginx.
<br>
That's why I can only provide a template for nginx configuration settings as well as a systemd service script and not configurations for other webservers.
<br>

If you use something else than nginx: make sure that you know what you are doing and restrict the access to your ts3-ldv folder!<br>

The program may also run on other operating systems that have nodejs installed but it is only tested with linux!

## Installation
The installation is recommended via npm and needs a few additional small steps of configuration.
<br>
You can find the in-depth installation instructions in the file named `Install Instructions`, it also contains a section for the nginx configuration.

## Features
Would be too much to write down here.
<br>
Check it out yourself, start with the [demo](https://drumsticks1.github.io/TS3-LogDataViewer/demo/)!

## Configuration settings (server-side)
The following options can currently be specified in conf.json:

| setting           | description                                             | value type       | default value                                         |
|-------------------|---------------------------------------------------------|------------------|-------------------------------------------------------|
| programLogfile    | Path to which the ts3-ldv log is written to             | string           | "/var/log/ts3-ldv/ts3-ldv.log"                        |
| logDirectory      | Path to the log directory of the ts3 server             | string           | "/home/teamspeak/teamspeak3-server_linux-amd64/logs/" |
| virtualServer     | Virtual server that's logs are to be parsed             | number           | 1                                                     |
| bufferData        | Whether data is buffered between builds *(much faster)* | boolean          | true                                                  |
| timeBetweenBuilds | Minimum time allowed between requests                   | number           | 2000                                                  |
| usedPort          | The port on which the ts3-ldv app is running            | number           | 3000                                                  |
| ignoredLogs       | Array containing log names that are excluded            | array of strings | []                                                    |

## Support
If there are any problems, improvement suggestions or feature requests feel free to open an Issue on GitHub.
