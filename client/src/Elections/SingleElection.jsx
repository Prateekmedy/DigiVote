import React, { Component } from 'react'
import AadhaarData from '../Verification/AdhaarData'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CandiateCard from '../Elections/CandidateCard';
import '../index.css'
import { Modal } from '@material-ui/core';
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
            UpdateAlertInterval : null,
            UpdateCRInterval : null,
            loaderStart : false,
            isCardClicked : false
        }
    }
    

    componentWillMount = () => {

        this.setState({ loaderStart : true })
        const UpdateVotingInterval = setInterval(this.updateVotingTime, 5000)

        const UpdateResultInterval = setInterval(this.updateResultDate, 5000)

        const UpdateCRInterval = setInterval(this.updateCRTime, 5000)

        // const UpdateAlertInterval = setInterval(this.updateAlertMsg, 180000) //this interval should run only in voting time period
            // this.setState({
            //     UpdateAlertInterval
            // })
            // console.log("voting interval")
        

        this.setState({
            UpdateVotingInterval,
            UpdateResultInterval,
            UpdateCRInterval,
            loaderStart : false,
            // UpdateAlertInterval
        })
    }

    checkCandidates = async() => {

        this.setState({ loaderStart : true })
        
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
                candidateCount : length - 1 ,
                loaderStart : false,
                isCardClicked : true
            })
            

        }

        
    }

    goToVote = async() => {
        this.setState({ loaderStart : true })
        console.log("move to Voting Home")
        const {contract} = this.props.userObject

        let TotalVoters = 0
        await contract.methods.aadhaarCount(this.props.electionHash[this.props.index]).call()
        .then(res => TotalVoters = res)
        .catch(console.error)
        console.log(TotalVoters)

        //condition for checking that all thr voter are voted or not 
        if(TotalVoters < this.props.item.TotalVoters){

            let selectedElection = {
                electionHash : this.props.electionHash[this.props.index],
                election     : this.props.item,
                candidates   : this.state.showCandidates
            }

            this.setState({ loaderStart : false })
            this.props.updateHomeState(3, selectedElection)

        }else{

            this.setState({ loaderStart : false })
            console.log("Total Voter count exceeds")
            alert("All Voters are already Voted!")

        }
        
        
    }

    openResult = async() => {

        this.setState({ loaderStart : true })

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

        this.setState({ loaderStart : false })
        this.props.updateHomeState(4, selectedElection)
    }

    openPreReport = async() => {

        this.setState({ loaderStart : true })

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
        this.setState({ loaderStart : false })
        this.props.updateHomeState(5, selectedElection)
    }

    openPostReport = async() => {

        this.setState({ loaderStart : true })

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
        this.setState({ loaderStart : false })
        this.props.updateHomeState(6, selectedElection)
    }

    //interval function for setting the voting time as per election time constraint
    updateVotingTime = () => {

        console.log("Voting Interval is running")

        const ElectionStartDateNTime = new Date(this.props.item.electionStartDateNTime)
        const ElectionEndDateNTime = new Date(this.props.item.electionEndDateNTime)

        if(new Date() >= ElectionEndDateNTime){
            clearInterval(this.state.UpdateVotingInterval)
            this.props.updateLiveElections(this.props.item ,0)
            this.setState({
                isVotingTime : false,
                isVotingOver : true
            })
        }
     
        if((new Date() >= ElectionStartDateNTime) && (new Date() <= ElectionEndDateNTime)){
            this.props.updateLiveElections(this.props.item ,1)
            this.setState({
                isVotingTime : true,
                isVotingOver : false
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
            this.props.updateOtherElections(this.props.item, 1)
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

    //interval function for diplaying the CAndidate Regidtration of the election
    updateCRTime = () => {

        console.log("Candidate Interval is running")

        const RegistrationStartDateNTime = new Date(this.props.item.ICRD)
        const RegistrationEndDateNTime = new Date(this.props.item.FCRD)

        if(new Date() >= RegistrationEndDateNTime){
            clearInterval(this.state.UpdateCRInterval)
            this.props.updateCRElections(this.props.item ,0)
            // this.setState({
            //     isVotingTime : false,
            //     isVotingOver : true
            // })
        }
     
        if((new Date() >= RegistrationStartDateNTime) && (new Date() <= RegistrationEndDateNTime)){
            this.props.updateCRElections(this.props.item ,1)
            // this.setState({
            //     isVotingTime : true
            // })
        }else{
            // this.setState({
            //     isVotingTime : false
            // })
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.state.UpdateVotingInterval)
        clearInterval(this.state.UpdateResultInterval)
        clearInterval(this.state.UpdateCRInterval)
        clearInterval(this.state.UpdateAlertInterval)
    }

    //interval function for sending the alert msg at the time of voting period
    updateAlertMsg = async() => {


        if(this.state.isVotingTime){
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
            console.log(votedAadhaar)
            console.log("Alert the voters")
        }else{
            console.log("VOting time is over")
        }

        
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
        console.log( " Voting time of "+ item.typeOfElection + " is : "+this.state.isVotingTime)
        console.log( " Result time of "+ item.typeOfElection + " is : "+this.state.isResultTime)
        console.log( " Voting Over of "+ item.typeOfElection + " is : "+this.state.isVotingOver)

        let show = {
            display : "block",
            margin : "5px"
        }

        let hide = {
            display : "none",
            margin : "5px"
        }
        //console.log(this.state.showCandidates)
        return(
                <div className="electionCardDiv" onClick={this.checkCandidates}>
                    <Typography variant="h4" className="ToE" gutterBottom>
                        {item.typeOfElection}
                    </Typography>
                    <Typography variant="subtitle1" className="constituency" gutterBottom>
                        {item.constituency}
                    </Typography>
                    <Typography variant="subtitle2" className="organizer" gutterBottom>
                        <em>ORGANIZER    : </em>{item.organizer}
                    </Typography>
                    <Typography variant="subtitle2" className="ESD" gutterBottom>
                        <em>VOTING START : </em>{item.electionStartDateNTime.substring(0, 24)}
                    </Typography>
                    <Typography variant="subtitle2" className="EED" gutterBottom>
                        <em>VOTING END   : </em>{item.electionEndDateNTime.substring(0, 24)}
                    </Typography>
                    <Typography variant="subtitle2" className="RD" gutterBottom>
                        <em>RESULT DATE  : </em>{item.resultDate.substring(0, 24)}
                    </Typography>
                    <Typography variant="subtitle2" className="TV" gutterBottom>
                        <em>TOTAL VOTERS : </em>{item.TotalVoters}
                    </Typography>
                    <Grid 
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                            <Button 
                                variant="outlined" 
                                color="primary"
                                className="ElectionBtn"
                                style={(this.state.isResultTime && this.state.isVotingOver) ? show : hide } //hide it after debugging
                                onClick={this.openPostReport}
                            >Post Analysis</Button>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                className="ElectionBtn"
                                style={this.state.isResultTime ? show : hide }
                                onClick={this.openResult}
                            >Result</Button>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                className="ElectionBtn"
                                style={this.state.isVotingOver ? hide : show }
                                onClick={this.openPreReport}
                            >Pre Analysis</Button>
                    </Grid>
                    <Grid container 
                        direction="row"
                        justify="center"
                        alignItems="center" >
                        <Modal
                            aria-labelledby="Candidate Card"
                            aria-describedby="Candidate Card"
                            open={this.state.isCardClicked}
                            onClose={() => this.setState({ isCardClicked : false })}
                            className="ElectionRequestForm"
                        >
                            <CandiateCard
                                item={item}
                                showCandidates={this.state.showCandidates}
                                isShow={this.state.isShow}
                                candidateCount={this.state.candidateCount}
                                isVotingTime={this.state.isVotingTime}
                                goToVote={this.goToVote}
                            />
                        </Modal>
                    </Grid>
                </div>     
        )
    }
}