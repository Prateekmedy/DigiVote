pragma solidity ^0.5.0;

contract Election{

    //Organizer mapping of Credentials and Personal Information
    mapping (string => string) OrganizerCredentials;
    mapping (string => string) OrganizerPersonal;
    string[] OrganizerUsername;

    //Candidate mapping of Credentials and Personal Information
    mapping (string => string) CandidateCredentials;
    mapping (string => string) CandidatePersonal;
    string[] CandidateUsername;

    //struct for contain number of Elections in place
    struct ElectionHash{
        string hash;
    } 

    //mapping for map the Oragnizer's mutliple Election to thier address
    mapping (address => ElectionHash[]) OrganizerElections;
    string[] public Elections;

    //mapping for candidate request for particular election
    struct RequestHash{
        string hash;
    }
    mapping (string => RequestHash[]) CandidateRequests;
    string[] public ElectionRequests;

    //function for Organizers

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

    //fucntion for Elections
    function addElection(address _add, string memory _hash) public returns(bool){
        for(uint i = 0; i < OrganizerElections[_add].length ; i++){
            if(keccak256(abi.encodePacked(_hash)) == keccak256(abi.encodePacked(OrganizerElections[_add][i].hash))) return false;
        }
        OrganizerElections[_add].push(ElectionHash(_hash));
        Elections.push(_hash);
        return true;
    }
    
    function getElection(address _add, uint _index) public view returns(string memory){
        return OrganizerElections[_add][_index].hash;
    }

    function organizerElectionCount(address _add) public view returns(uint){
        return OrganizerElections[_add].length;
    } 

    function getElections(uint _index) public view returns(string memory){
        return Elections[_index];
    }

    function electionsCount() public view returns(uint){
        return Elections.length;
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

    //function for Election Requests
    function setRequest(string memory _username, string memory _hash) public {
        CandidateRequests[_username].push(RequestHash(_hash));
        ElectionRequests.push(_hash);
    }

    function getRequest(string memory _username, uint _index) public view returns(string memory){
        return CandidateRequests[_username][_index].hash;
    }

    function candidateRequestsCount(string memory _username) public view returns(uint){
        return CandidateRequests[_username].length;
    }

    function getAllRequest(uint _index) public view returns(string memory){
        return ElectionRequests[_index];
    }

    function requestsCount() public view returns(uint){
        return ElectionRequests.length;
    } 
}