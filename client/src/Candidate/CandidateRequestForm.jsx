import React, {Component} from 'react';
import { ipfsSender, ipfsFetcher } from '../ipfsStore';


export default class CandidateRequestForm extends Component{

    constructor(props){
        super(props)
        this.state = {
            isAgree : false,
            inputPlace : null,
            RequestHash : null
        }
    }

     updateInputValue(evt) {
        
        if(evt.target.name === 'place'){
            this.setState({
                inputPlace: evt.target.value
            })
        }
        if(evt.target.name === 'agree'){
            this.setState({
                isAgree: evt.target.checked
            })
        }

    }

    sendRequest = async(event) => {
        event.preventDefault();
        console.log("request sended")

        const {contract} = this.props.userObject;

        const RequestData = {
            electionHash : this.props.electionHash,
            candidateHash : this.props.candidateHash,
            time : new Date(),
            status:'Open',
            place : this.state.inputPlace
        }

        let RequestHash = await ipfsSender(RequestData)
        this.setState({RequestHash})

        await contract.methods.setRequest(this.props.username, this.state.RequestHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
        .then((receipt) => {
          console.log(receipt)
          alert("Thank You for Sending Request")

          this.props.back();
          
        })
        .catch((error) => {
          console.log(error)
        });

        

    }

    render(){
        return (
            <div>
                <div>
                    <h3>Selected Election</h3>
                    <p>{this.props.electionHash}</p>
                </div>
                <div>
                    <h3>Selected Candidate</h3>
                    <p>{this.props.candidateHash}</p>
                </div>
                <div>
                    <form onSubmit={this.sendRequest}>
                        <label htmlFor='place'>Place</label>
                        <input name='place' onChange={evt => this.updateInputValue(evt)}/>
                        <br />
                        <label htmlFor='agree'>Agree</label>
                        <input type='checkbox' name='agree' onChange={evt => this.updateInputValue(evt)}/>
                        {
                            this.state.isAgree &&  <input type="submit" value="Send"/>
                        }       
                    </form>
                </div>
            </div>
        )
    }
}