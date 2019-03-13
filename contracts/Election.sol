pragma solidity ^0.5.0;

contract Election{

    mapping (string => string) OrganizerCredentials;
    mapping (string => string) OrganizerPersonal;
    string[] Usernames;

    function setOrganizerCredentials(string memory _username, string memory _hash) public {
        OrganizerCredentials[_username] = _hash;
        Usernames.push(_username);
    }

    function setOrganizerPersonal(string memory _username, string memory _hash) public {
        OrganizerPersonal[_username] = _hash;
    }

    function getOrganizerCredentials(string memory _username) public view returns(string memory){
        return OrganizerCredentials[_username];
    }

    function getOrganizerPersonal(string memory _username) public view returns(string memory){
        return OrganizerPersonal[_username];
    }

    function getOrganizersCount() public view returns(uint){
        return Usernames.length;
    }

    function findOrganizer(string memory _username) public view returns(bool){
        for(uint i = 0; i <= Usernames.length - 1; i++){
            if(keccak256(abi.encodePacked(Usernames[i])) == keccak256(abi.encodePacked(_username)))   return true;
            else return false;
        }
    }
}