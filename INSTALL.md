# INSTALL.md
Author: Drumsticks
<br>
GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

This install instructions are intended for linux distributions (you need to write your own init script for the
ts3-ldv service if your linux distribution doesn't use systemd).

Experienced users may also install it on other operating systems (nodejs should run on most of them).

## Table of Contents

- <a href="#Dependencies">Dependencies</a>
- <a href="#Preparation">Preparation</a>
- <a href="#Installation">Installation</a>
- <a href="#Web Server Configuration">Web Server Configuration</a>
- <a href="#Usage">Usage</a>
- <a href="#Optional & Recommended">Optional & Recommended</a>
    - <a href="#Systemd">Systemd</a>
    - <a href="#Logrotate">Logrotate</b>

## <a name="Dependencies">Dependencies</a>

- Dependencies:
    - [Node.js](https://nodejs.org/)
    - [nginx](https://nginx.org/) or another web server, instructions given here are limited to nginx but you can surely
    create an equivalent configuration if you are familiar with another web server
- Soft dependencies:
    - [git](https://git-scm.com/) (for cloning the repository, you could also download it from https://github.com/Drumsticks1/TS3-LogDataViewer.git)

## <a name="Preparation">Preparation</a>

You will require:
- an user & group that is running your web server and has access to the files that can be accessed online
      (e.g. <code>www-data</code>)
- an user that is running the ts3-ldv app (e.g. <code>ts3-ldv</code>) and has read access to the logs of your
      teamspeak3 server (e.g. <code>/home/teamspeak/teamspeak3-server_linux_amd64/logs/</code>) (could be achieved by
      adding the <code>ts3-ldv</code> user to a group that is running the teamspeak3 server and has access to the logs).
      <br>
      You will also have to open a shell as this user for the installation.

Example creation of the <code>ts3-ldv</code> user without a home directory and as member of the <code>teamspeak</code>
group that has access to the logs:

    useradd -M --no-user-group -g teamspeak ts3-ldv

Files that are served by your (nginx) web server are stored in a directory on your server that can be read by the
<code>www-data</code> user & group. This directory will be referred to as <code>/var/www/www.your-domain.com</code>
in the instructions below.

## <a name="Installation">Installation</a>

Create the ts3-ldv directory in <code>/var/www/www.your-domain.com</code>:
<br>
<i>(To prevent mix-ups with the <code>ts3-ldv</code> user and the directory it will be named <code>ts3-ldv-dir</code>,
you can of course rename it)</i>

    cd /var/www/www.your-domain.com
    sudo mkdir ts3-ldv-dir

Make <code>ts3-ldv</code> (needs write access) the owner user and <code>www-data</code> (needs read access) the owner
group of the <code>ts3-ldv-dir</code>:

    sudo chown ts3-ldv:www-data ts3-ldv-dir

From here on you should switch to the <code>ts3-ldv</code> user in order to not run into permission issues:

    sudo su --shell=/bin/bash ts3-ldv

Clone the latest release version into the created directory (replace vx.x.x with the latest release version):

    git clone https://github.com/Drumsticks1/TS3-LogDataViewer.git vx.x.x ts3-ldv-dir

<br>
<b>If you didn't already switch to the ts3-ldv user: you should not install the npm dependencies as root because this
may result in malicious code from rogue dependencies being executed as root!</b>
<br>
<br>

Enter the <code>ts3-ldv-dir</code> directory and install the package dependencies:

    cd ts3-ldv-dir

##### Explanation of the npm install options
- <code>--no-cache</code>: installing the package without using the npm cache because otherwise npm would try to create
                           a cache directory in the <code>ts3-ldv</code> home directory that is not existing and would
                           cause permission errors.

    <b>NOTE:</b> Using the <code>--no-cache</code> option creates a directory named 'false' in the install directory,
    you can delete the directory or just ignore it (if nginx is configured as explained below that is no problem).

- <code>--production</code>: only install the production dependencies and ignore devDependencies from the package.json.

<br>

    npm install --no-cache --production

Copy the default configuration to the local folder and modify it according to your installation (see README.md for more
information about the settings):

    cp conf/default-conf.json local/conf.json
    nano local/conf.json

After that you can exit the <code>ts3-ldv</code> shell:

    exit

## <a name="Web Server Configuration">Web Server Configuration</a>

Configure the web server so that only authorized clients have access to specific files (assuming you already have a
working nginx configuration):

Insert the following directives into the nginx configuration file of the domain (you will have to update directory name
and port if you modified them in your ts3-ldv configuration):

    location /ts3-ldv-dir {
        # If you .htpasswd lies in a directory that can be accessed by the web server you should ensure that you prevent
        # read access to .htpasswd files in your nginx configuration!
        auth_basic "Authentication required!";
        auth_basic_user_file /path/to/your/auth/file/.htpasswd;

        # Deny access to all files not explicitly whitelisted below
        location /ts3-ldv-dir {
            deny all;
        }

        # Override the 'deny all' directive for files that should be accessible for clients
        #
        # Long version of the regex below (nginx wants a one line regex):
        # /ts3-ldv-dir/(
        #     css/(
        #         foundation|
        #         style).css|
        #     img/favicon.png|
        #     js/(
        #         ts3ldv|
        #         modules/(
        #             controlSection/(
        #                 tableSelection)|
        #         tables/(
        #             ban|
        #             client|
        #             complaint|
        #             kick|
        #             upload)|
        #         controlSection|
        #         event|
        #         navBar|
        #         serverInteractions|
        #         storage|
        #         tables|
        #         time|
        #         ui).js)|
        #     index.html|
        #     local/output.json|
        #     node_modules/(
        #         jquery/dist/jquery|
        #         tablesorter/dist/js/(
        #             jquery.tablesorter.combined|
        #             extras/jquery.tablesorter.pager)|
        #         moment/min/moment|
        #         nanobar/nanobar|
        #         foundation-sites/dist/js/foundation).min.js)
        #
        location ~ /ts3-ldv-dir/(css/(foundation|style).css|img/favicon.png|js/(ts3ldv|modules/(controlSection/(tableSelection)|tables/(ban|client|complaint|kick|upload)|controlSection|event|navBar|serverInteractions|storage|tables|time|ui).js)|index.html|local/output.json|node_modules/(jquery/dist/jquery|tablesorter/dist/js/(jquery.tablesorter.combined|extras/jquery.tablesorter.pager)|moment/min/moment|nanobar/nanobar|foundation-sites/dist/js/foundation).min.js) {

        }

        # Passing the buildJSON request to the server.
        # The port has to be the same as in your configuration.
        location /ts3-ldv-dir/express/buildJSON {
            proxy_pass http://127.0.0.1:3000/buildJSON;
        }
    }

<b>IMPORTANT</b>:
<br>
Regarding the auth_basic directives in the configuration: They are used for restricting the access to the web interface
by adding an username & password login. See https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html for more
information. (You should really check if this is working properly: otherwise everybody can access the interface!)

## <a name="Usage">Usage</a>

You should now be able to start the server-side app (for testing the installation):

    sudo su --shell=/bin/bash ts3-ldv
    cd /var/www/www.your-domain.com/ts3-ldv-dir/nodejs
    node app.js

If your configuration is working correctly you can now access the interface in your browser (recheck that the access is
restricted!).

<b>Important note:</b> You will have to directly navigate to <code>www.your-domain.com/ts3-ldv-dir/index.html</code> as
a result of the whitelisting in the nginx configuration. Navigating to <code>www.your-domain.com/ts3-ldv-dir/</code>
should not work if your nginx configuration is working as intended and only allows access to the whitelisted files.

After testing the installation you will probably want to abort running the app in the <code>ts3-ldv</code> shell
(CTRL + C) and create a service script that automatically runs the app as the <code>ts3-ldv</code> user in the background.
<br>
If you are using a distribution with systemd as system manager you can use the example systemd service script in the
optional section below, otherwise you will have to create an equivalent service script for the service manager of your
distribution.

In case of problems it might be helpful to take a look at the program log files.
If the program fails to start, does not work properly or you run into any other issues, a look at the program log might
be helpful, also ensure that you configured the paths correctly.

## <a name="Optional & Recommended">Optional & Recommended</a>
#### <a name="Systemd">Systemd</a>

See <code>conf/ts3-ldv.service</code> for an example configuration of a systemd service script.

#### <a name="Logrotate">Logrotate</a>

See <code>conf/ts3-ldv.logrotate</code> for an example configuration.
<br>
You only need this if you care about the ts3-ldv logs.
