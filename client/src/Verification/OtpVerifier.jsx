import React, { Component } from 'react';
import VoterIDVerify from '../Verification/VoterIDVerify'
import {otpSender, otpVerifier} from '../utils/OtpGenrator'


export default class OtpVerifier extends Component {

    constructor(props){
      super(props)
      this.state = {
        lastFourDigit : "",
        OTP : "",
        isOtpSended : false,
        otpVerify : true  // change it to false when you want to use OTP fucntionality
      }
    }

    sendIt = async(event) => {

        event.preventDefault();

        //checking the entered phone number is valid or not with fetched data
        if(this.state.lastFourDigit === this.props.AadhaarObject.Mobile.substring(6,10)){

          console.log("sending")

          
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
            
        }else{
          console.log("Please enter the correct last four digit of your Phone number")
        }

    }


    verifyOtp = async() => {

      //Promise for verify the entered OTP 
      await otpVerifier(this.props.AadhaarObject.Mobile, this.state.OTP)
      .then(data => {
        console.log(data)
        this.setState({
          otpVerify : true
        })
      })
      .catch(console.error)
    
    }


    voterIdVerified = () => {
      this.props.updateVoterVerification()
    }


    //update the entered last4digit with the entered 4digit
    updatelastFourDigit(evt){
      this.setState({
        lastFourDigit : evt.target.value
      });
    }


    //update the OTP entered by the voter
    updateOTP(evt){               
      this.setState({
        OTP : evt.target.value
      });
    }


  render() {

    let hide = {
        display : 'none'
    } 

    let show = {
        display : 'block'
    }

    console.log(this.props.AadhaarObject)
    return (
      <div>
        {
          this.state.otpVerify
            ? <VoterIDVerify 
                voterIdVerified={this.voterIdVerified}
                voterId={this.props.AadhaarObject.VoterId}
                />
            : <div>
                <form onSubmit={this.sendIt} className={this.state.isOtpSended ? hide : show}>
                  <p>Enter the last 4 Digit of your mobile number ********{this.props.AadhaarObject.Mobile.substring(8,10)}</p>
                  <input type="text"  value={this.state.lastFourDigit} onChange={evt => this.updatelastFourDigit(evt)}/>
                  <input type="submit" value="Send OTP"/>
                </form>
                <form onSubmit={this.verifyOtp} className={this.state.isOtpSended ? show : hide}>
                  <input type="text" value={this.state.OTP} onChange={evt => this.updateOTP(evt)}/>
                  <input type="submit" value="Verify OTP" />
                </form>
              </div>
        }     
      </div>
    );
  }
}
