import React, { Component } from 'react';
const SendOtp = require('sendotp')
const sendOtp = new SendOtp('269401AbIEOvkX5c9a54d1')

export default class OtpVerifier extends Component {

  constructor(props){
    super(props)
    this.state = {
      lastFourDigit : "",
      OTP : ""
    }
  }

sendIt = async(event) => {

    event.preventDefault();

    //checking the entered phone number is valid or not with fetched data
    if(this.state.lastFourDigit === this.props.mobile.substring(6,10)){
      console.log("sending")

      //set the expiry time for the OTP
      sendOtp.setOtpExpiry('3')

      //function for sending the OTP to the mobile number
      await sendOtp.send(this.state.lastFourDigit, "DigiVote", (error, data) => {
        

        if(data.type === 'success'){
          console.log("OTP Sended")
        }else{
          console.log(data.message)
        }

        console.log(data);

      });
    }else{
      console.log("Please enter the correct last four digit of your Phone number")
    }

}


verifyOtp = async() => {

  //function for verify the entered OTP 
  sendOtp.verify(this.props.mobile, this.state.OTP, function (error, data) {
    console.log(data); 
    if(data.type === 'success'){


      alert("OTP Verified")

      //update the voter verifing status
      this.props.updateVoterVerification()

      console.log('OTP verified successfully')
    } 
    if(data.type === 'error') console.log('OTP verification failed')
  });
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
    return (
      <div>
          <form onSubmit={this.sendIt}>
          <p>Enter the last 4 Digit of your mobile number ********{this.props.mobile.substring(8,10)}</p>
          <input type="text"  value={this.state.lastFourDigit} onChange={evt => this.updatelastFourDigit(evt)}/>
          <input type="submit" value="Send OTP"/>
          </form>
          <input type="text" value={this.state.OTP} onChange={evt => this.updateOTP(evt)}/>
          <button onClick={this.verifyOtp}>Verify</button>
      </div>
    );
  }
}
