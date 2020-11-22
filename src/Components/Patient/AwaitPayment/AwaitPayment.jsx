import React, { Component } from 'react'

import Block from "../../../Global/Block/Block";
import ComponentMould from "../../../Global/ComponentMould/ComponentMould";
import { ToastContainer, toast } from "react-toastify";

import parseJwt from "../../../utils/parseJwt";
import { connect } from 'react-redux';
import Validation from '../Validation/Validation';
import './AwaitPayment.css'
import Scrollbars from 'react-custom-scrollbars';

class AwaitConfirmation extends Component {
    state={
        SIN:'', searchValue:''
    }

    handleSearchChange=e=>{
        this.setState({searchValue:e.target.value})
    }


    componentDidMount(){
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
                if(this.props.user.roleUser!=='visitor')
                fetch('http://localhost:4000/api/demand/awaitingPayment',{
                    method:'post',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({idUser: parseJwt(userToken).idUser})
                }).then(data=>data.json())
                .then(result=>{
                    if(!result.err){
                        if(result.patientAwaitingPayment) this.props.dispatch({type:'LOAD_TO_PAY', payload: result.patientAwaitingPayment})
                    }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                        this.NotifyOperationFailed( "Verify that your internet connection is active" );
                    else this.NotifyOperationFailed(result.err.toString());
                })
                .catch((err) => {
                    if (err.toString() === "TypeError: Failed to fetch")
                        this.NotifyOperationFailed( "Verify that your internet connection is active" );
                    else this.NotifyOperationFailed(err.toString());
                });

            } else if (result.err.toString() === "TypeError: Failed to fetch") {
                this.NotifyOperationFailed( "Verify that your internet connection is active" );
            } else if(result.err.toString()==='Failed to authenticate token') this.NotifyOperationFailed('User not authenticated')
            else this.NotifyOperationFailed(result.err.toString());
        })
        .catch((err) => {
            if (err.toString() === "TypeError: Failed to fetch") {
                this.NotifyOperationFailed("Verify that your internet connection is active");
            } else if(err.toString()==='Failed to authenticate token') this.NotifyOperationFailed('User not authenticated')
            else this.NotifyOperationFailed(err.toString());
        });
    }

    NotifyOperationFailed(message) {
        return toast.error(message);
    }

    NotifyOperationSucces(message) {
        return toast.success(message);
    }

    handleSearchChange=e=>{
        this.setState({searchValue:e.target.value})
    }

    handleDemandClick=(SIN)=>{
        if(this.state.SIN===SIN)this.setState({SIN:''})
        else this.setState({SIN})
    }

    handleValidateBtns=(method)=>{
        if(method==='next'){
            fetch('http://localhost:4000/api/demand/completePayment',{
                method:'post',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({SIN:this.state.SIN})
            }).then(data=>data.json())
            .then(result=>{
                if(!result.err){
                    if(result.res){
                        this.props.dispatch({type:'REMOVE_TO_PAY', payload:this.state.SIN})
                        this.setState({SIN:''})
                        this.NotifyOperationSucces("The payment was received successfully")
                    }else this.NotifyOperationFailed("The dbResponse is not normal")
                }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                else this.NotifyOperationFailed(result.err.toString());
            })
            .catch((err) => {
                if (err.toString() === "TypeError: Failed to fetch") {
                    this.NotifyOperationFailed("Verify that your internet connection is active");
                } else if(err.toString()==='Failed to authenticate token') this.NotifyOperationFailed('User not authenticated')
                else this.NotifyOperationFailed(err.toString());
            });
            console.log('pay demand')
        }else{
            this.setState({SIN:''})
        }
    }

    toPayData=()=>{
        // selectedExams: [ {bValue, idExamination, nameExamination} ] information needed to send to validation
        // onNext function
        let SIN = this.state.SIN
        let block = this.props.toPay.filter(_=>_.SIN===SIN)
        const selectedExams = block.map(_=>{
            let retu = {bValue:_.bValue, idExamination:_.idExamination, nameExamination:_.nameExamination}
            return retu
        })
        let identification= {
            dob:this.props.user.dateOfBirthUser, 
            email:this.props.user.emailUser, 
            fname:this.props.user.firstNameUser, 
            gender:this.props.user.genderUser.toUpperCase(), 
            lname:this.props.user.lastNameUser, 
            phone:this.props.user.phoneUser
        }
        let medPersonnel= {name: "", title: "", submiting: false}
        return <Validation
            identification={identification}
            selectedExams={selectedExams}
            medPersonnel={medPersonnel}
            onNext={this.handleNextBtn}
            complete={true}
            onNext={this.handleValidateBtns}
        />
    }

    styleToCompleteDemands = () => {
        const singleSIN = [];
        let sample = this.props.toPay
        
        if(this.state.searchValue !== ''){
            sample = this.props.toPay.filter(_=>
                _.SIN.includes(this.state.searchValue)
            ) 
        }

        sample.forEach((_) => {
        let test = singleSIN.find((__) => __.SIN === _.SIN);
        if (test === undefined)
            singleSIN.push({ SIN: _.SIN, dateCreated: _.dateCreated });
        });

        if(singleSIN.length !== 0){
            return singleSIN.map((aDemand) => {
            return (
                <div className="demand-GIN" key={aDemand.SIN} onClick={()=>this.handleDemandClick(aDemand.SIN)}>
                <div className="demand-GIN-indicator"></div>
                <div className="demand-GIN-data">
                    <span className="demand-GIN-data-group">
                        <i className="demand-GIN-data-label">Demand id:</i>
                        <i className="demand-GIN-data-value">{aDemand.SIN}</i>
                    </span>
                    <span className="demand-GIN-data-group">
                        <i className="demand-GIN-data-label">Demand  date:</i>
                        <i className="demand-GIN-data-value">{new Date(aDemand.dateCreated).toUTCString().split(" G")[0]}</i>
                    </span>
                    <span className="demand-GIN-data-group">
                        <i className="demand-GIN-data-label">Waiting</i>
                        <i className="demand-GIN-data-value">Payment</i>
                    </span>
                </div>
                </div>
            );
            });
        }else{
            return (
                <div className="grouped-demands no-demands">
                <div className="demand-GIN">
                    <div className="demand-GIN-indicator"></div>
                    <div className="demand-GIN-data">
                        <span className="demand-GIN-data-group">
                            {this.props.toPay.length===0?<i className="demand-GIN-data-label">You have no demands awaiting payment</i>
                            :<i className="demand-GIN-data-label">You have no demands that match this demand id</i>}
                        </span>
                    </div>
                </div>
                </div>
            )
        }
    };

    render() {
        return (
            <ComponentMould>
                {this.state.SIN===''?
                <React.Fragment>
                <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
                <div className="result-body">
                    <input type='text' placeholder='Search demand id...' onChange={this.handleSearchChange} className='result-search' />
                    <Scrollbars style={{height:'69.76vh'}}>
                        {this.styleToCompleteDemands()}
                    </Scrollbars>
                </div>
                </React.Fragment>:
                <React.Fragment>
                <Block pageName='Complete Payment' message='Complete your payment' />
                {this.toPayData()}
                </React.Fragment>}
                <ToastContainer />
            </ComponentMould>
        )
    }
}

const mapStateToProps=state=>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        toPay: state.ToPay.toPay,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(AwaitConfirmation)