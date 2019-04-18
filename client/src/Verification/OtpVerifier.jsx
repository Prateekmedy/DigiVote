import React, { Component } from 'react';
import VoterIDVerify from '../Verification/VoterIDVerify'
import {otpSender, otpVerifier} from '../utils/OtpGenrator'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


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
            : <Grid 
                  container 
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className="testClass"
              >
                  <Paper 
                      elevation={2}
                      className="OTPCard"
                  >
                  <Grid 
                      container 
                      direction="row"
                      justify="center"
                      alignItems="center"
                  >
                      <Grid item xs={12}>
                      <Typography variant="h4" gutterBottom>Verify Authentication</Typography>
                      </Grid>
                      <Grid container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                        {
                          !this.state.isOtpSended
                            ? <Grid container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                              >
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Enter the last 4 Digit of your mobile number ********{this.props.AadhaarObject.Mobile.substring(8,10)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                      required
                                      name="LastFourDigit"
                                      id="LastFourDigit"
                                      label="LastFourDigit"
                                      value={this.state.lastFourDigit}
                                      onChange={evt => this.updatelastFourDigit(evt)}
                                      margin="normal"
                                      type="number"
                                  />
                                  </Grid>
                                  <Grid item xs={12}>
                                  <Button 
                                      variant="contained" 
                                      color="primary"
                                      style={{
                                      marginTop : "30px",
                                      margin:"5px"
                                      }} 
                                      onClick={this.sendIt}  
                                  >Send OTP</Button>
                                </Grid>
                              </Grid>
                            : <Grid container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                              >
                                <Grid item xs={12}>
                                  <Typography variant="subtitle" gutterBottom>
                                    Enter the OTP
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                      required
                                      name="OTP"
                                      id="OTP"
                                      label="OTP"
                                      value={this.state.OTP}
                                      onChange={evt => this.updateOTP(evt)}
                                      margin="normal"
                                      type="number"
                                  />
                                  </Grid>
                                  <Grid item xs={12}>
                                  <Button 
                                      variant="contained" 
                                      color="primary"
                                      style={{
                                      marginTop : "30px",
                                      margin:"5px"
                                      }} 
                                      onClick={this.verifyOtp}  
                                  >Verify OTP</Button>
                                </Grid>
                              </Grid>
                        }
                      </Grid>
                      </Grid>
                  </Paper>
              </Grid>
        }     
      </div>
    );
  }
}
