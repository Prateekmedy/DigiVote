import React, { Component } from 'react';
import {ipfsSender, ipfsFetcher} from '../ipfsStore'
import DateTimePicker from 'react-datetime-picker'
import {$} from 'jquery'

export default class OrganizeElection extends Component {

    constructor(props){
        super(props)
        this.state = {
            ElectionHash : null,
            ElectionData : null,
            ICRD : null,
            FCRD : null,
            RD : null,
            ESD : null,
            EED : null
        }
    }

    createElection = async(event) => {
        console.log("Create it");

        event.preventDefault()

        console.log(this.state)

        const {contract, OrganizerData, back, accounts} = this.props;
       // console.log(OrganizerData)
        const ElectionData = {
            typeOfElection : "Lok Sabha",
            constituency   : "Madhya Pradesh",
            organizer      : "Election Committion",
            electionStartDateNTime   : this.state.ESD.toString(), //"mm-dd-yyyy hh:ii"
            electionEndDateNTime   : this.state.EED.toString(),
            resultDate     : this.state.RD.toString(),
            ICRD           : this.state.ICRD.toString(),
            FCRD           : this.state.FCRD.toString(),
            TotalVoters    : 55
        }
        
        let ElectionHash = await ipfsSender(ElectionData);
        console.log(ElectionHash);
        console.log(ElectionData)

        await contract.methods.addElection(OrganizerData.Address, ElectionHash).send({from: accounts[2],gas:6721975})
        .then((result) => {
          console.log(result)
        })
        .then(console.log)
        .catch((error) => {
          console.log(error)
        });

        //add an NOTA CAndidate into the new election
        await contract.methods.addCandidate(ElectionHash, "NOTA", "anywhere").send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });
    
        await contract.methods.getElection(OrganizerData.Address, 0).call()
        .then(console.log)
        .catch(console.error)

        alert("Thank you for Organize Election")
        back();
    }   

    updateESD = (val) => this.setState({ ESD : val })

    updateEED = (val) => this.setState({ EED : val })
 
    updateRD = (val) => this.setState({ RD : val })

    updateICRD = (val) => this.setState({ ICRD : val })

    updateFCRD = (val) => this.setState({ FCRD : val })

    render(){
        console.log(this.props.OrganizerData)
        console.log(this.state)

        //calling function for activating the time and date picker
        //$(".form_datetime").datetimepicker({format: 'mm-dd-yyyy hh:ii'});

        return (
            <div>
              <form onSubmit={this.createElection}>
                <label>Election Start Date</label>
                <DateTimePicker
                  onChange={this.updateESD}
                  value={this.state.ESD}
                /><br />
                <label>Election End Date</label>
                <DateTimePicker
                  onChange={this.updateEED}
                  value={this.state.EED}
                /><br />
                <label>Result Date</label>
                <DateTimePicker
                  onChange={this.updateRD}
                  value={this.state.RD}
                /><br />
                <label>Registration Starts Date</label>
                <DateTimePicker
                  onChange={this.updateICRD}
                  value={this.state.ICRD}
                /><br />
                <label>Registration Ends Date</label>
                <DateTimePicker
                  onChange={this.updateFCRD}
                  value={this.state.FCRD}
                /><br />
                <input type="submit" value="Create Election"/>
              </form>
                {/* <button onClick={this.createElelction}>Sumit</button> */}
            </div>
        )
    }
}