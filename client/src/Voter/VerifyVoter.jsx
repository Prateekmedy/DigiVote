import React, { Component } from 'react';
import AadhaarVerify from '../Verification/AdhaarVerify'
import OtpVerifier from '../Verification/OtpVerifier';

export default class VerifyVoter extends Component{
    constructor(props){
        super(props)
        this.state = {
            Aadhaar : "",
            mobile : "",
            voterId : "",
            OtpWidgetUnlock : false
        }
    }

    updateOtpWidgetUnlock = () => {
        this.setState({
            OtpWidgetUnlock : true
        })
    }

    updateAadhaarData = (Aadhaar, mobile, voterId) => {
        this.setState({
            Aadhaar, mobile, voterId
        })
    }

    render(){
        return(
            <div>
                {
                    this.state.OtpWidgetUnlock
                        ? <OtpVerifier 
                            mobile={this.state.mobile}
                            />
                        : <AadhaarVerify 
                            updateOtpWidgetUnlock={this.updateOtpWidgetUnlock}
                            updateAadhaarData={this.updateAadhaarData}
                            />
                }
                
            </div>
        )
    }
} 

