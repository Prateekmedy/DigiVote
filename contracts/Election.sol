pragma solidity ^0.5.0;

contract Election{

    //-------------------------Credentails Area--------------------------------------

    //Organizer mapping of Credentials and Personal Information
    mapping (string => string) OrganizerCredentials;
    mapping (string => string) OrganizerPersonal;
    string[] OrganizerUsername;

    //Candidate mapping of Credentials and Personal Information
    mapping (string => string) CandidateCredentials;
    mapping (string => string) CandidatePersonal;
    string[] CandidateUsername;

    //------------------------Organizer's  Elections Area------------------------------

    //struct for contain number of Elections in place
    struct ElectionHash{
        string hash;
    } 

    //mapping for map the Oragnizer's mutliple Election to thier address
    mapping (address => ElectionHash[]) OrganizerElections;
    string[] public Elections;

    //------------------------ Candidate's Nomination Requests -----------------------------

    //mapping for candidate request for particular election
    struct RequestHash{
        string username;
        string electionHash;
        string time;
        string place;
        string status;
    }

    //mapping (Candidateusername => RequestHash)
    mapping (string => RequestHash[]) CandidateRequests;
    
    //Array of Request struct
    RequestHash[] public ElectionRequests;

    //------------------------ Election's Candidate Area -------------------------------

    struct CandidateOfElection{
        string username;
    }

    mapping (string => CandidateOfElection[]) SelectedCandidates;

    //-------------------- Functions Area ------------------------------------------

    //********************************** function for Organizers *******************

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

    //*********************************** function for Elections ***************************************
    
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

    //******************************* functions for Candidates **************************

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

    //********************************************* function for Election Requests *************************

    function setRequest(string memory _username, string memory _electionHash, string memory _time, string memory _place, string memory _status) public {
        CandidateRequests[_username].push(RequestHash(_username, _electionHash, _time, _place, _status));
        ElectionRequests.push(RequestHash(_username, _electionHash, _time, _place, _status));
    }

    function getRequest(string memory _username, uint _index) public view returns(string memory, string memory, string memory, string memory, string memory){
        return (
                    CandidateRequests[_username][_index].username, 
                    CandidateRequests[_username][_index].electionHash, 
                    CandidateRequests[_username][_index].time, 
                    CandidateRequests[_username][_index].place, 
                    CandidateRequests[_username][_index].status
                );
    }

    function candidateRequestsCount(string memory _username) public view returns(uint){
        return CandidateRequests[_username].length;
    }

    function getAllRequest(uint _index) public view returns(string memory, string memory, string memory, string memory, string memory){
        return (
                    ElectionRequests[_index].username, 
                    ElectionRequests[_index].electionHash, 
                    ElectionRequests[_index].time, 
                    ElectionRequests[_index].place, 
                    ElectionRequests[_index].status
                );
    }

    function requestsCount() public view returns(uint){
        return ElectionRequests.length;
    } 

    function updateRequestStatus(uint _allRequestIndex, uint _candidateRequestIndex, string memory _username, string memory _status) public {
        ElectionRequests[_allRequestIndex].status = _status;
        CandidateRequests[_username][_candidateRequestIndex].status = _status;
    }

    //**************************** function for selected Candidate of Election ***********************

    function addCandidate(string memory _electionHash, string memory _username) public {
        SelectedCandidates[_electionHash].push(CandidateOfElection(_username));
    }

    function countElectionCandidates(string memory _electionHash) public view returns(uint){
       return SelectedCandidates[_electionHash].length;
    }

    function getSelectedCandidates(string memory _electionHash, uint _index) public view returns(string memory){
       return SelectedCandidates[_electionHash][_index].username;
    }
}