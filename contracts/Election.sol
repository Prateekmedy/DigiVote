pragma solidity ^0.5.0;

contract Election{

    mapping (address => string) public OrganizerCredentials;
    mapping (address => string) public OrganizerPersonal;
    uint OrganizerCount = 0;

    function setOrganizerCredentials(address _add,string memory _hash) public {
        OrganizerCredentials[_add] = _hash;
        OrganizerCount++;
    }

    function setOrganizerPersonal(address _add,string memory _hash) public {
        OrganizerPersonal[_add] = _hash;
    }

    function getOrganizerCredentials(address _add) public view returns(string memory){
        return OrganizerCredentials[_add];
    }

    function getOrganizerPersonal(address _add) public view returns(string memory){
        return OrganizerPersonal[_add];
    }
}