// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

<?php
      // directory containing the ts3 logs - please modify the following line according to your system.
      $LOGDIRECTORY = "/home/teamspeak3/teamspeak3-server_linux-amd64/logs/";

      exec("/var/www/EnhancedClientList/TS3_EnhancedClientList $LOGDIRECTORY");
    ?>