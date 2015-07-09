// Ban.cpp : Methods of the Ban class.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

// DEV: Postponed
/* Notes for the implemention of ban parsing:
	Occurance in the logs:
		Ban message (bannedUID) for banReason, bannedUID, bantime, bannedByID, bannedByNickname
		Ban message (bannedIP) for banReason, bannedIP, bantime, bannedByID, bannedByNickname
		(Only if banned client was connected when banned !) Disconnect message for bannedID, bannedNicknamed, bannedByUID, bannedByNickname, banReason, bantime
		
		Match the messages using the given data (bannedIP, short gap between DateTimes, bannedByNickname, banReason, bantime).

		2015-06-30 16:13:57.454512|INFO    |VirtualServer |  1| ban added reason='Test' cluid='xxxxxxxxxxxxxxxxxxxxxxxxxxx=' bantime=600 by client 'Drumsticks'(id:2)
		2015-06-30 16:13:57.456512|INFO    |VirtualServer |  1| ban added reason='Test' ip='127.0.0.1' bantime=600 by client 'Drumsticks'(id:2)
		2015-06-30 16:13:57.456512|INFO    |VirtualServerBase|  1| client disconnected 'Drumsticks-Test'(id:4) reason 'invokerid=3 invokername=Drumsticks invokeruid=xxxxxxxxxxxxxxxxxxxxxxxxxxx= reasonmsg=Test bantime=600'

		Special Cases:
			Server shutdown after ban and before expiration / deletion:
				- Ban expires while server is down: --> expiration is shown in next log.
						
			Change of bans
			Custom bans instead of banning a specific client via right-click menu or client list.
*/