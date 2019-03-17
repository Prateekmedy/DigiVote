import React, { Component } from 'react';
import {ipfsSender, ipfsFetcher} from '../ipfsStore'

export default class OrganizeElection extends Component {

    constructor(props){
        super(props)
        this.state = {
            ElectionHash : null,
            ElectionData : null
        }
    }

    createElelction = async() => {
        console.log("Create it");

        const {contract, OrganizerData, createHandler} = this.props;
        const ElectionData = {
            typeOfElection : "Lok Sabha",
            constituency : "MP",
            organizer : "Election Committion",
            electionDate : "20/3/19",
            resultDate : "28/3/19",
            ICRD : "17/3/19",
            FCRD : "19/3/19"
        }

        let ElectionHash = await ipfsSender(ElectionData);
        console.log(ElectionHash);
        console.log(contract)

        await contract.methods.addElection(OrganizerData.Address, ElectionHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
        .then((result) => {
          console.log(result)
        })
        .then(console.log)
        .catch((error) => {
          console.log(error)
        });

        // let ElectionData2 = await ipfsFetcher(ElectionHash)
        // console.log(ElectionData2);
    
        await contract.methods.getElection(OrganizerData.Address, 0).call()
        .then(console.log)
        .catch(console.error)

        createHandler();
    }   

    render(){
        console.log(this.props.OrganizerData)
        return (
            <div>
                <button onClick={this.createElelction}>Sumit</button>
            </div>
        )
    }
}