import React, { Component } from 'react';
import SingleCandidate from './SingleCandidate';
import {otpSender, otpVerifier} from '../utils/OtpGenrator'

export default class VoterArena extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedCandidate : "",
            OTPUnlock : true, //this true value is for debugging, assign true after debugging
            OTP : "",
            otpVerify : true //this true value is for debugging, assign true after debugging
        }
    }

    updateSelectedCandidate = (selectedCandidate) => {
        this.setState({
            selectedCandidate
        })
    }

    voteIt = async() => {
        console.log(this.state.selectedCandidate)

        //sending an OTP to register mobile no.
        //Promise for sending the OTP
         await otpSender(this.props.AadhaarObject.Mobile, "Digivote")
         .then(data => {
           console.log(data)
           console.log("OTP Sended Successfully")
           this.setState({
             isOtpSended : true
           })
         })
         .catch(console.error)
           
         this.setState({
             OTPUnlock : true
         })

    }

    updateOTP(evt){               
        this.setState({
            OTP : evt.target.value
        });
    }

    voteDone = async(event) => {
        event.preventDefault()

        // await otpVerifier(this.props.AadhaarObject.Mobile, this.state.OTP)
        // .then(data => {
        //     console.log(data)
        //     console.log("OTP Verified")
        //     this.setState({
        //     otpVerify : true
        //     })
        // })
        // .catch(console.error)

        if(this.state.otpVerify){

            await this.props.userObject.contract.methods.addVoterToElection(this.props.selectedElection.electionHash, this.props.AadhaarHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
            .then((result) => {
              console.log(result)
              console.log("Voter Added to Election")
            })
            .catch((error) => {
              console.log(error)
            })

            await this.props.userObject.contract.methods.addAadhaar(this.props.selectedElection.electionHash, this.props.AadhaarObject.Aadhaar).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
            .then((result) => {
              console.log(result)
              console.log("VOter Aadhaar added to Election")
            })
            .catch((error) => {
              console.log(error)
            })

            let length=0

            await this.props.userObject.contract.methods.countElectionCandidates(this.props.selectedElection.electionHash).call()
            .then(res => length = res)
            .catch(console.error)

            for(let i=0; i<length; i++){
                
                await this.props.userObject.contract.methods.voteSelectedCandidates(this.props.selectedElection.electionHash, this.state.selectedCandidate, i).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
                .then((result) => {
                console.log(result)
                console.log("VOter voted to the selected Candidate in election")
                })
                .catch((error) => {
                console.log(error)
                })

            }
            
            console.log("Voting Successfully")
            alert("Thank You Voting into the Election :)")
            this.props.updateResetAll()

        }else{
            console.log("OTP is Invalid")
            alert("OTP is Invalid")
        }
    }

    render(){
        console.log("Voter's Arena")
        console.log(this.props.AadhaarObject)
        return(
            <div>
                <h2>Welcome to Elections Arena.</h2>
                <h1>{this.props.selectedElection.election.typeOfElection}</h1>
                <h3>Select the Candidate</h3>
                {
                    this.props.selectedElection.candidates.map((candidate, index) => 
                        <SingleCandidate 
                            key={index} 
                            index={index} 
                            candidate={candidate} 
                            selectedCandidate={this.state.selectedCandidate}
                            updateSelectedCandidate={this.updateSelectedCandidate}
                        />
                    )
                }
                {/* {
                    this.state.OTPUnlock
                        ? <form onSubmit={this.voteDone}>
                            <input type="text" value={this.state.OTP} onChange={evt => this.updateOTP(evt)}/>
                            <input type="submit" value="Verify OTP" />
                        </form>
                        : <button onClick={this.voteIt} >VOTE</button>
                } */}
                <button onClick={this.voteDone}>VoteDo</button>
                
            </div>
        )
    }
}