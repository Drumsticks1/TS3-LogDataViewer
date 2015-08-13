# Makefile for TS3_EnhancedClientList
# Author : Drumsticks1
# Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

CC = /usr/bin/g++
CFLAGS = -Wall -g -std=c++11
# You may need to modify the following line according to your system.
IDIR = -I/usr/boost_1_58_0/ -I/usr/pugixml-1.6/
LDFLAGS = -lboost_system -lboost_filesystem -lboost_program_options

FILES = Ban.cpp Ban.h checkFunctions.cpp checkFunctions.h Constants.h createXML.cpp createXML.h fetchLogs.cpp fetchLogs.h File.cpp File.h Kick.cpp Kick.h parseLogs.cpp parseLogs.h parseXML.cpp parseXML.h TS3_EnhancedClientList.cpp User.cpp User.h

TS3_EnhancedClientList: $(FILES)
		$(CC) $(CFLAGS) $(IDIR) -o TS3_EnhancedClientList $(FILES) $(LDFLAGS)
