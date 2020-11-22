import React, { Component } from 'react'

import Block from "../../../Global/Block/Block";
import ComponentMould from "../../../Global/ComponentMould/ComponentMould";
import StyleReceipt from "../Results/StyleReceipt/StyleReceipt";
import { ToastContainer, toast } from "react-toastify";

import StyleDemands from "../Results/StyleDemands/StyleDemands";
import parseJwt from "../../../utils/parseJwt";
import { connect } from 'react-redux';

class AwaitConfirmation extends Component {
    state={
        SIN:'', searchValue:''
    }

    componentDidMount(){
        //load data for the route of awaiting confirmation and the user data here
        let userToken = localStorage.getItem("userToken");
        fetch("http://localhost:4000/api/auth/validateToken", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: userToken }),
        })
        .then((data) => data.json())
        .then((result) => {
            if (!result.err) {
                this.props.dispatch({type:'LOAD_USER', payload:result.theUser})
                this.props.dispatch({type:'LOAD_IS_AUTHENTICATED', payload:true})

                if(result.theUser.roleUser !=='visitor'){
                    fetch('http://localhost:4000/api/demand/awaitingConfirmation',{
                        method:'post',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({idUser: parseJwt(userToken).idUser})
                    }).then(data=>data.json())
                    .then(result=>{
                        if(!result.err) {
                            this.props.dispatch({type:'LOAD_DEMAND_HAS_EXAM_JOIN', payload:result.demandHasExamJoin})
                            this.props.dispatch({type:'LOAD_MED_EXAM_RESULT', payload:result.medExamResult})
                        }
                        else if (result.err.toString() === "TypeError: Failed to fetch") this.notifyErrorMessage( "Verify that your internet connection is active" );
                        else this.notifyErrorMessage(result.err.toString())
                    })
                    .catch((err) => {
                        if (err.toString() === "TypeError: Failed to fetch") {
                            this.notifyErrorMessage("Verify that your internet connection is active");
                        } else if(err.toString()==='Failed to authenticate token') this.notifyErrorMessage('User not authenticated')
                        else this.notifyErrorMessage(err.toString());
                    });
                }
            } else if (result.err.toString() === "TypeError: Failed to fetch") {
                this.notifyErrorMessage(
                "Verify that your internet connection is active"
                );
            } else if(result.err.toString()==='Failed to authenticate token') this.notifyErrorMessage('User not authenticated')
            else this.notifyErrorMessage(result.err.toString());
        })
        .catch((err) => {
            if (err.toString() === "TypeError: Failed to fetch") {
                this.notifyErrorMessage("Verify that your internet connection is active");
            } else if(err.toString()==='Failed to authenticate token') this.notifyErrorMessage('User not authenticated')
            else this.notifyErrorMessage(err.toString());
        });
    }

    notifyErrorMessage = (message) => toast.error(message);

    demandClick=(key)=>{
        this.setState({SIN:key})
    }

    handleSearchChange=e=>{
        this.setState({searchValue:e.target.value})
    }

    handleBackBtn=()=>{
        this.setState({SIN:''})
    }

    render() {
        return (
            <ComponentMould>
                <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
                <div className="result-body">
                    {this.state.SIN!=='' && !isNaN(this.state.SIN) ?
                        <StyleReceipt receipt={false} GIN={this.state.SIN} handleBackBtn={this.handleBackBtn} callingComponent ='confirmation' />
                        :
                        <React.Fragment>
                            <input type='text' placeholder='Search demand id...' onChange={this.handleSearchChange} className='result-search' />
                            <StyleDemands callingComponent='confirmation' searchValue={this.state.searchValue} demandClick={this.demandClick} />
                        </React.Fragment>
                    }
                    <ToastContainer />
                </div>
            </ComponentMould>
        )
    }
}

const mapStateToProps=state=>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated
    }
}

export default connect(mapStateToProps)(AwaitConfirmation)