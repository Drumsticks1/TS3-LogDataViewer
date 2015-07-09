// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

<?php
		// Created EnhancedClientList directory - please modify the path according to your system.
		$ECLDIRECTORY = "/var/www/EnhancedClientList";
		
		if(file_exists("$ECLDIRECTORY/output.xml")){	
			exec("rm $ECLDIRECTORY/output.xml");
		}
    ?>