import React, { Component } from 'react';

export default class SingleCandidate extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedCandidate : ""
        }
    }

    selectIt = () => {
        this.props.updateSelectedCandidate(this.props.candidate)
    }

    

    render(){
        return(
            <div>
                <input type="radio" name="candidate" 
                                   value={this.props.candidate}  
                                   checked={this.props.selectedCandidate === this.props.candidate} 
                                   onChange={this.selectIt} />{this.props.candidate}
                {/* <input name="candidate" type="radio" onClick={() => this.voteIt(this.props.candidate)} value={this.props.candidate} />{this.props.candidate} */}
            </div>
        )
    }
}