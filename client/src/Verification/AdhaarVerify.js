import React, { Component } from 'react';
import AadhaarData from './AdhaarData'

export default class AadhaarVerify extends Component {

    constructor(props){
        super(props)
        this.state = {
            Aadhaar : ""
        }
    }

    verifyIt =(event) => {

        event.preventDefault()
        //console.log(AadhaarData.AadhaarCards[0].Aadhaar_Id)
        let found = false
    
        if(this.state.Aadhaar.length === 12){

            for(let i=0; i<AadhaarData.AadhaarCards.length;i++){

                if(AadhaarData.AadhaarCards[i].Aadhaar_Id === this.state.Aadhaar){
                    //do further verification
        
                    console.log(AadhaarData.AadhaarCards[i].e_Kyc)
                    found = true
                    let Aadhaar  = AadhaarData.AadhaarCards[i].Aadhaar_Id,
                        mobile  = AadhaarData.AadhaarCards[i].e_Kyc.Poi.mobile,
                        voterId = AadhaarData.AadhaarCards[i].e_Kyc.Seeds.VoterID

                    this.props.updateAadhaarData(Aadhaar, mobile, voterId)  
                    this.props.updateOtpWidgetUnlock()

                    break
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
