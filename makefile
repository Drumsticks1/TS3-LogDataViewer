# Makefile for TS3_EnhancedClientList
# Author : Drumsticks1
# GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

CC = /usr/bin/g++
CFLAGS = -Wall -g -std=c++11 -DNDEBUG
# You may need to modify the following two lines according to your system.
IDIR = -I/usr/boost_1_59_0 -I/usr/pugixml-1.6
LDFLAGS = -L/usr/boost_1_59_0/stage/lib -lboost_system -lboost_filesystem -lboost_program_options -static

FILES = Ban.cpp Ban.h checkFunctions.cpp checkFunctions.h Client.cpp Client.h Complaint.cpp Complaint.h Constants.h createXML.cpp createXML.h customStreams.h fetchLogs.cpp fetchLogs.h Kick.cpp Kick.h parseLogs.cpp parseLogs.h parseXML.cpp parseXML.h timeFunctions.cpp timeFunctions.h TS3_EnhancedClientList.cpp Upload.cpp Upload.h

TS3_EnhancedClientList: $(FILES)
		$(CC) $(CFLAGS) $(IDIR) -o TS3_EnhancedClientList $(FILES) $(LDFLAGS)
