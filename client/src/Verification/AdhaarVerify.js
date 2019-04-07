import React, { Component } from 'react';
import AadhaarData from './AdhaarData'

export default class AadhaarVerify extends Component {

    constructor(props){
        super(props)
        this.state = {
            Aadhaar : ""
        }
    }

    verifyIt = async(event) => {

        event.preventDefault()

        let found = false
        
    
        if(this.state.Aadhaar.length === 12){

            let votedAadhaarArray = []
            let isAadhaarVoted = undefined
            let length = 0

            console.log(this.props.selectedElection.electionHash)
            await this.props.userObject.contract.methods.aadhaarCount(this.props.selectedElection.electionHash).call()
            .then(res => length = res)
            .catch(console.error)

            console.log(length)

            for(let i=0;i<length;i++){

                let result =""

                await this.props.userObject.contract.methods.checkAadhaar(this.props.selectedElection.electionHash, i).call()
                .then(res => result = res)
                .catch(console.error)

                votedAadhaarArray.push(result)
            }

            isAadhaarVoted = votedAadhaarArray.find((aadhaar) => {
                return aadhaar === this.state.Aadhaar
            })            
            //console.log(isAadhaarVoted)

            if(isAadhaarVoted !== undefined){

                alert("You are already did the Voting for this Election")
                console.log("Already Voted with this Aadhaar Card")
                this.props.updateHomeState(0, null)

            }else{

                console.log(AadhaarData.AadhaarCards.length)
                for(let i = 0; i < AadhaarData.AadhaarCards.length; i++){

                    if(AadhaarData.AadhaarCards[i].Aadhaar_Id === this.state.Aadhaar){
    
                        if(AadhaarData.AadhaarCards[i].e_Kyc.Poa.state === this.props.selectedElection.election.constituency){
                            
                            let {Aadhaar_Id} = AadhaarData.AadhaarCards[i]
                            let {name, mobile, dob, gender} = AadhaarData.AadhaarCards[i].e_Kyc.Poi
                            let {house, street, landmark, state, dist, pc} = AadhaarData.AadhaarCards[i].e_Kyc.Poa
                            let {voterID} = AadhaarData.AadhaarCards[i].e_Kyc.Seeds
                
                            //console.log(AadhaarData.AadhaarCards[i].e_Kyc)
    
                            found = true
                            let AadhaarObject = {
                                Aadhaar     : Aadhaar_Id,
                                Name        : name,
                                DoB         : dob,
                                Gender      : gender,
                                Mobile      : mobile,
                                Address     : house+street+landmark,
                                State       : state,
                                Constituency: dist,
                                Pincode     : pc,
                                VoterId     : voterID
                            }
                            
                            //console.log(AadhaarObject)
                            this.props.updateAadhaarData(AadhaarObject)  
                            this.props.updateOtpWidgetUnlock()
    
                        }else{
                            alert("This Election is not Oragnize in your Constituency")
                            console.log("This Election is not Oragnize in your Constituency")
                            this.props.updateHomeState(0, null)
                            break
                        }
                        
                        break
                    }
                    
                }
            }

            

        }else{
            console.log("Enter the correct 12 digit Aadhar Card")
        }
        
        
        
        if(!found){
            console.log("Aadhaar Card not found")
            return false
        }

    }   
    
    updateAadhaar = (evt) => {
        this.setState({
            Aadhaar : evt.target.value
        })
    }


    render(){
        return(
            <div>
                <form onSubmit={this.verifyIt}>
                <input type="text"  value={this.state.Aadhaar} onChange={evt => this.updateAadhaar(evt)}/>
                    <input type="submit" value="Verify" />
                </form>
            </div>
        )
    }

 }
