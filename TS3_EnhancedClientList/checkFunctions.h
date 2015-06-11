// checkFunctions.h

// Checks if an ID is already existing.
bool IDAlreadyExisting(unsigned int ID, unsigned int &FoundID);

// Checks if a DateTime is already existing for the current user.
bool IsDuplicateDateTime(unsigned int ID, string DateTime);

// Checks if a Nickname is already existing for the current User.
bool IsDuplicateNickname(unsigned int ID, string Nickname);

// Checks if an IP is already existing for the current User.
bool IsDuplicateIP(unsigned int ID, string IP);