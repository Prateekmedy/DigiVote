pragma solidity ^0.5.0;

contract Election{

    mapping (string => string) OrganizerCredentials;
    mapping (string => string) OrganizerPersonal;
    string[] OrganizerUsername;
    mapping (string => string) CandidateCredentials;
    mapping (string => string) CandidatePersonal;
    string[] CandidateUsername;

    struct ElectionHash{
        string hash;
    } 
    mapping (address => ElectionHash[]) OrganizerElection;

    function setOrganizerCredentials(string memory _username, string memory _hash) public {
        OrganizerCredentials[_username] = _hash;
        OrganizerUsername.push(_username);
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
        return OrganizerUsername.length;
    }

    function findOrganizer(string memory _username) public view returns(bool){
        for(uint i = 0; i <= OrganizerUsername.length - 1; i++){
            if(keccak256(abi.encodePacked(OrganizerUsername[i])) == keccak256(abi.encodePacked(_username)))   return true;
            else return false;
        }
    }

    function addElection(address _add, string memory _hash) public returns(bool){
        for(uint i = 0; i < OrganizerElection[_add].length ; i++){
            if(keccak256(abi.encodePacked(_hash)) == keccak256(abi.encodePacked(OrganizerElection[_add][i].hash))) return false;
        }
        OrganizerElection[_add].push(ElectionHash(_hash));
        return true;
    }
    
    function getElection(address _add, uint _index) public view returns(string memory){
        return OrganizerElection[_add][_index].hash;
    }

    function electionCount(address _add) public view returns(uint){
        return OrganizerElection[_add].length;
    } 

    //functions for Candidates

    function setCandidateCredentials(string memory _username, string memory _hash) public {
        CandidateCredentials[_username] = _hash;
        CandidateUsername.push(_username);
    }

    function setCandidatePersonal(string memory _username, string memory _hash) public {
        CandidatePersonal[_username] = _hash;
    }

    function getCandidateCredentials(string memory _username) public view returns(string memory){
        return CandidateCredentials[_username];
    }

    function getCandidatePersonal(string memory _username) public view returns(string memory){
        return CandidatePersonal[_username];
    }

    function getCandidatesCount() public view returns(uint){
        return CandidateUsername.length;
    }

    function findCandidate(string memory _username) public view returns(bool){
        for(uint i = 0; i <= CandidateUsername.length - 1; i++){
            if(keccak256(abi.encodePacked(CandidateUsername[i])) == keccak256(abi.encodePacked(_username)))   return true;
            else return false;
        }
    }
}