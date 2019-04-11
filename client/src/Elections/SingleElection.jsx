import React, { Component } from 'react'
import AadhaarData from '../Verification/AdhaarData'
const SendOtp = require('sendotp')


export default class SingleElection extends Component{
    
    constructor(props){
        super(props)
        this.state = {    
            showCandidates : null,
            isShow : false,
            candidateCount : 0,
            isVotingTime : false,
            UpdateVotingInterval : null,
            isVotingOver : false,
            isResultTime : false,
            UpdateResultInterval : null,
            UpdateAlertInterval : null
        }
    }

    componentWillMount = () => {
        const UpdateVotingInterval = setInterval(this.updateVotingTime, 5000)

        const UpdateResultInterval = setInterval(this.updateResultDate, 5000)

        // if(this.state.isVotingTime){
        //     const UpdateAlertInterval = setInterval(this.updateAlertMsg, 5000) //this interval should run only in voting time period
        //     this.setState({
        //         UpdateAlertInterval
        //     })
        // }

        this.setState({
            UpdateVotingInterval,
            UpdateResultInterval
        })
    }

    checkCandidates = async() => {
        
        if(this.state.isShow){
            this.setState({
                isShow : false
            })
        }else{

            const {contract} = this.props.userObject
            let length = 0
            let showCandidates=[];

            await contract.methods.countElectionCandidates(this.props.electionHash[this.props.index]).call()
            .then(res => length = res)
            .catch(console.error)
            
            if((length - 1)  != 0){
                //console.log("yaha aaraha hai kya")
                for(let i=0; i< length; i++){

                    let result = "";
                    await contract.methods.getSelectedCandidates(this.props.electionHash[this.props.index], i).call()
                    .then(res => result = res)
                    .catch(console.error)
                   
                    showCandidates.push(result)
                }
                //console.log(showCandidates[0])

            }else{
                showCandidates = [["Candidates are not Nominated yet", 0]]
                //console.log("ye aana chahiye")
                
            }
        
            this.setState({
                showCandidates,
                isShow : true,
                candidateCount : length - 1 
            })
            

        }

        
    }

    goToVote = async() => {
        console.log("move to Voting Home")
        const {contract} = this.props.userObject

        let TotalVoters = 0
        await contract.methods.aadhaarCount(this.props.electionHash[this.props.index]).call()
        .then(res => TotalVoters = res)
        .catch(console.error)


        //condition for checking that all thr voter are voted or not 
        if(TotalVoters < this.props.item.TotalVoters){

            let selectedElection = {
                electionHash : this.props.electionHash[this.props.index],
                election     : this.props.item,
                candidates   : this.state.showCandidates
            }

            this.props.updateHomeState(3, selectedElection)

        }else{

            console.log("Total Voter count exceeds")
            alert("All Voters are already Voted!")

        }
        
        
    }

    openResult = async() => {

        const {contract} = this.props.userObject
        let length = 0
        let showCandidates=[];

        await contract.methods.countElectionCandidates(this.props.electionHash[this.props.index]).call()
        .then(res => length = res)
        .catch(console.error)
        

        if(length != 0){
            for(let i=0; i< length; i++){

                let result = "";
                await contract.methods.getSelectedCandidates(this.props.electionHash[this.props.index], i).call()
                .then(res => result = res)
                .catch(console.error)

                showCandidates.push(result)
            }
        }else{
            showCandidates = "Candidates are not Nominated yet"
        }

        let selectedElection = {
            electionHash : this.props.electionHash[this.props.index],
            election     : this.props.item,
            candidates   : showCandidates
        }

        this.props.updateHomeState(4, selectedElection)
    }

    openPreReport = async() => {

        const {contract} = this.props.userObject
        let length = 0
        let showCandidates=[];

        await contract.methods.countElectionCandidates(this.props.electionHash[this.props.index]).call()
        .then(res => length = res)
        .catch(console.error)
        
        if(length != 0){
            for(let i=0; i< length; i++){

                let result = "";
                await contract.methods.getSelectedCandidates(this.props.electionHash[this.props.index], i).call()
                .then(res => result = res)
                .catch(console.error)

                showCandidates.push(result)
            }

        }else{
            showCandidates = "Candidates are not Nominated yet"
        }


        let selectedElection = {
            electionHash : this.props.electionHash[this.props.index],
            election     : this.props.item,
            candidates   : showCandidates
        }

        //console.log(selectedElection.candidates[0])
        this.props.updateHomeState(5, selectedElection)
    }

    openPostReport = async() => {

        const {contract} = this.props.userObject
        let length = 0
        let showCandidates=[];

        await contract.methods.countElectionCandidates(this.props.electionHash[this.props.index]).call()
        .then(res => length = res)
        .catch(console.error)
        
        if(length != 0){
            for(let i=0; i< length; i++){

                let result = "";
                await contract.methods.getSelectedCandidates(this.props.electionHash[this.props.index], i).call()
                .then(res => result = res)
                .catch(console.error)

                showCandidates.push(result)
            }

        }else{
            showCandidates = "Candidates are not Nominated yet"
        }


        let selectedElection = {
            electionHash : this.props.electionHash[this.props.index],
            election     : this.props.item,
            candidates   : showCandidates
        }

        //console.log(selectedElection.candidates[0])
        this.props.updateHomeState(6, selectedElection)
    }

    //interval function for setting the voting time as per election time constraint
    updateVotingTime = () => {

        console.log("Voting Interval is running")

        const ElectionStartDateNTime = new Date(this.props.item.electionStartDateNTime)
        const ElectionEndDateNTime = new Date(this.props.item.electionEndDateNTime)

        if(new Date() >= ElectionEndDateNTime){
            clearInterval(this.state.UpdateVotingInterval)
            this.setState({
                isVotingTime : false,
                isVotingOver : true
            })
        }
     
        if((new Date() >= ElectionStartDateNTime) && (new Date() <= ElectionEndDateNTime)){
            this.setState({
                isVotingTime : true
            })
        }else{
            this.setState({
                isVotingTime : false
            })
        }
    }

    //interval function for diplaying the Result of the election
    updateResultDate = () => {

        console.log("Result Interval is running")

        const ResultDate = new Date(this.props.item.resultDate)

        if(new Date() >= ResultDate){
            this.setState({
                isResultTime : true
            })
            clearInterval(this.state.UpdateResultInterval)
        }else{
            this.setState({
                isResultTime : false
            })
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.state.UpdateVotingInterval)
        clearInterval(this.state.UpdateResultInterval)
    }

    //interval function for sending the alert msg at the time of voting period
    updateAlertMsg = async() => {

        console.log(AadhaarData)  
        const {contract} = this.props.userObject
        let length = 0,
            votedAadhaar = [], //array of aadhaar that voted already in this election
            nonVotedAadhaar = [] //array of aadhaar that not voted in this election yet

        await contract.methods.aadhaarCount(this.props.electionHash[this.props.index]).call()
        .then(res => length = res)
        .catch(console.log)
        
        for(let i=0; i< length; i++){
            let aadhaar;

            await contract.methods.checkAadhaar(this.props.electionHash[this.props.index], i).call()
            .then(res => aadhaar = res)
            .catch(console.log)

            votedAadhaar.push(aadhaar)
        }

        
        AadhaarData.AadhaarCards.forEach((aadhaar1) => {
            let count = 0

            votedAadhaar.forEach((aadhaar2) => {
                if(aadhaar1.Aadhaar_Id == aadhaar2){
                    count++
                }
            })

            if(count == 0){
                nonVotedAadhaar.push(aadhaar1)
            }
        })

        nonVotedAadhaar.forEach((aadhaar) => {
            this.alertVoter(aadhaar.Aadhaar_Id.substring(6,12), aadhaar.e_Kyc.Poi.mobile)
            .then(console.log)
            .catch(console.error)
        })

        console.log(nonVotedAadhaar)
    }

    //alert function for send the alert msg to the voter
    alertVoter = (Aadhaar, mobile) => {

        const sendOtp = new SendOtp('269401AbIEOvkX5c9a54d1', 'Hii, ******{{otp}} Go & Vote, Only few Hours are remaining in Election Voting'); 
        return new Promise((resolve, reject) => {

            sendOtp.send("91" + mobile, "DigiVote", Aadhaar, (error, data) => {
            
                if(data.type === "success") resolve(data)
        
                if(error) reject(error)  
        
              });
    
        })
    }

    render(){
        const {item} = this.props;
        //console.log(this.state.showCandidates)
        return(
                <div className="electionCardDiv" style={{ border: '2px solid #000'}}>
                    <h2>{item.typeOfElection}</h2>
                    <h3>{item.organizer}</h3>
                    <h4>{item.constituency}</h4>
                    <h4>{item.electionStartDateNTime}</h4>
                    <h4>{item.electionEndDateNTime}</h4>
                    <h4>{item.resultDate}</h4>
                    <h4>{item.ICRD}</h4>
                    <h4>{item.FCRD}</h4>
                    <button className={this.state.isResultTime ? "show" : "hide"} onClick={this.openPostReport}>Post Report</button>
                    <button className={this.state.isVotingOver ? "show" : "hide"} onClick={this.openPreReport}>Pre Report</button>
                    <button className={this.state.isResultTime ? "show" : "hide"} onClick={this.openResult}>Result</button>
                    <button onClick={this.checkCandidates}>{this.state.isShow ? "Hide Candidate" : "Show Candidate"}</button>
                    <div>
                        {(this.state.showCandidates && this.state.isShow) 
                            && this.state.showCandidates.map((candidate, index) => 
                                <div key={index}>
                                    {candidate[0]}
                                </div>
                                )
                        }
                        <button className={(parseInt(this.state.candidateCount) && this.state.isShow && this.state.isVotingTime) ? "show" : "hide"} onClick={this.goToVote}>Vote</button>                    
                    </div>
                </div>     
        )
    }
}