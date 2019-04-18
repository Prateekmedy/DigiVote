import React, { Component } from 'react'
import VerifyVoter from './VerifyVoter'
import VotingArena from './VotingArena'
import { ipfsSender } from '../ipfsStore';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
//import {ipfsSender} from '../ipfsStore'
//import {accountCreator} from '../utils/AccountCreater'

export default class Voter extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            voterVerified : false,
            AadhaarObject : null,
            AadhaarHash : null,
            loaderStart : false
        }
    }

    //function for creating random password
    passwordGenrator = () => {
        return Math.random().toString(36).slice(-8)
    }

    //update funciton for status of verification of Voter
    updateVoterVerification = async() => {
        this.setState({ loaderStart : true })

        //genrating the random password
        let password = this.passwordGenrator()

        //calling for creating the account for voter
        await this.props.accountCreator(password)

        //genrate IPFS hash for the Voters's Aadhaar card details
        let AadhaarHash = await ipfsSender(this.state.AadhaarObject)

        console.log(this.props.acc)
        console.log(AadhaarHash)

        //unlock the account fortransaction
        this.props.userObject.web3.eth.personal.unlockAccount(this.props.acc, password, 600)
        .then(console.log("Voter Account Unlock!"))

        //store the Voter credentails into contract
        await this.props.userObject.contract.methods.addVoterAccount(AadhaarHash, this.props.acc, password).send({from: this.props.acc,gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });


        this.setState({
            voterVerified : true,
            AadhaarHash,
            loaderStart : false
        })
        
    }


    updateAadhaarData = async(AadhaarObject) => {

        this.setState({
            AadhaarObject //, AadhaarHash 
        })

    }

    render(){
        console.log("Voter Home")
        return(
            <div>
                <Fade
                    in={this.state.loaderStart === true}
                    unmountOnExit
                >
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className="loaderDiv1"
                    >
                        <CircularProgress className="loader"/>
                    </Grid>
                </Fade>
                {this.state.voterVerified 
                    ? <VotingArena 
                        userObject={this.props.userObject}
                        AadhaarHash={this.state.AadhaarHash}
                        AadhaarObject={this.state.AadhaarObject}
                        selectedElection={this.props.selectedElection}
                        updateResetAll={this.props.updateResetAll}
                        /> 
                    : <VerifyVoter 
                        userObject={this.props.userObject}
                        selectedElection={this.props.selectedElection}
                        AadhaarObject={this.state.AadhaarObject}
                        updateAadhaarData={this.updateAadhaarData}
                        updateVoterVerification={this.updateVoterVerification}
                        updateHomeState={this.props.updateHomeState}
                        />
                }
            </div>
            
        )
    }
    
}