import React, { Component } from 'react';
import AadhaarVerify from '../Verification/AdhaarVerify'
import OtpVerifier from '../Verification/OtpVerifier';

export default class VerifyVoter extends Component{

    constructor(props){
        super(props)
        this.state = {
            OtpWidgetUnlock : false
        }
    }


    //update function for unlock the OTP widget
    updateOtpWidgetUnlock = () => {
        this.setState({
            OtpWidgetUnlock : true
        }) 
    }

    render(){
        return(
            <div>
                {
                    this.state.OtpWidgetUnlock
                        ? <OtpVerifier 
                            AadhaarObject={this.props.AadhaarObject}
                            updateVoterVerification={this.props.updateVoterVerification}
                            />
                        : <AadhaarVerify 
                            userObject={this.props.userObject}
                            selectedElection={this.props.selectedElection}
                            updateAadhaarData={this.props.updateAadhaarData}
                            updateOtpWidgetUnlock={this.updateOtpWidgetUnlock} 
                            updateHomeState={this.props.updateHomeState} 
                            />
                }
                
            </div>
        )
    }
} 

