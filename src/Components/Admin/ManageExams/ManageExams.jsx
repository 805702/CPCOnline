import React, { Component } from 'react'
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import parseJwt from '../../../utils/parseJwt'
import { connect } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import BarLoader from "react-bar-loader";

class ManageExams extends Component {
  state = {
    codeActifExam:null,
  };

  componentDidMount() {
    let userToken = localStorage.getItem("userToken");
    fetch("http://localhost:4000/api/auth/validateToken", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: userToken }),
    })
    .then((data) => data.json())
    .then((result) => {
        if (!result.err) {
            this.props.dispatch({ type: "LOAD_USER", payload: result.theUser, });
            this.props.dispatch({ type: "LOAD_IS_AUTHENTICATED", payload: true, });
            
            if(this.props.isAuthenticated && this.props.user.roleUser==='admin')
            fetch('http://localhost:4000/api/exams/getManageExams',{
                method:'get',
                headers:{'Content-Type':'application/json'}
            }).then(data=>data.json())
            .then(result=>{
                if(!result.err){
                    if(result.exams){
                        this.props.dispatch({type:'LOAD_EXAMS', payload:result.exams})
                    }else this.NotifyOperationFailed("The result of the DB does not hold")
                }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                else this.NotifyOperationFailed(result.err.toString());
            })
            .catch((err) => {
                if (err.toString() === "TypeError: Failed to fetch") {
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                } else this.NotifyOperationFailed(err.toString());
            });

        } else if(!result.theUser)this.NotifyOperationFailed('No user found with given credentials')
        else if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
        this.NotifyOperationFailed( "Verify that your internet connection is active" ); 
        } else if ( result.err.toString() === "Failed to authenticate token" ) this.NotifyOperationFailed("User not authenticated");
        else this.NotifyOperationFailed(result.err.toString());
    })
    .catch((err) => {
        if (err.toString() === "TypeError: Failed to fetch") {
        this.NotifyOperationFailed( "Verify that your internet connection is active" );
        } else if (err.toString() === "Failed to authenticate token") this.NotifyOperationFailed("User not authenticated");
        else this.NotifyOperationFailed(err.toString());
    });
  }

  NotifyOperationFailed(message) {
    return toast.error(message);
  }

  NotifyOperationSuccess(message) {
    return toast.success(message);
  }

  handleExamClick=(codeExam)=>{
    if(this.state.codeActifExam===codeExam)this.setState({codeActifExam:null})
    else this.setState({codeActifExam:codeExam})
  }

  handleDeactivateBtn=(e)=>{
    if(e.target.id==='no')this.setState({activateConfirm:false})
    else this.setState({activateConfirm:false},()=>{
        if(this.state.confirmAction==='reset'){
            let user = this.props.personnel.find(_=>_.phoneUser===this.state.codeActifExam)
            let status = 'inactive'
            if(user !== undefined  && user.statusUser === 'inactive') status='active'
            fetch('http://localhost:4000/api/user/deleteUser',{
                method:'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({phone:this.state.codeActifExam, status})
            }).then(data=>data.json())
            .then(result=>{
                if(!result.err){
                    this.NotifyOperationSuccess('User account was successfully deactivated')
                    if(user !== undefined  && user.statusUser === 'inactive')
                    this.props.dispatch({type:'ACTIVATE_USER', payload:this.state.codeActifExam})
                    else this.props.dispatch({type:'DEACTIVATE_USER', payload:this.state.codeActifExam})
                }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                else this.NotifyOperationFailed(result.err.toString());
            })
            .catch((err) => {
                if (err.toString() === "TypeError: Failed to fetch") {
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                } else this.NotifyOperationFailed(err.toString());
            });
        }else{
            const email = this.props.personnel.find(_=>_.phoneUser===this.state.codeActifExam).emailUser
            fetch('http://localhost:4000/api/user/resetPassword',{
                method:'post',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({ phone:this.state.codeActifExam, email })
            }).then(data=>data.json())
            .then(result=>{
                if(!result.err){
                    this.NotifyOperationSuccess(`User password has been reset a mail has been sent to ${email} with the new password`)
                }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                else this.NotifyOperationFailed(result.err.toString());
            })
            .catch((err) => {
                if (err.toString() === "TypeError: Failed to fetch") {
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                } else this.NotifyOperationFailed(err.toString());
            });
        }
    })
  }

  confirmDeactivateUser=()=>{
    if(this.state.activateConfirm)
    return(
        <div className="deactivate-confirm-block">
            <span className="deactivate-message">
                { `Are you sure you want to ${this.state.confirmAction==='reset'?'deactivate User': 'reset password for user'} with phone ${this.state.codeActifExam} `}
            </span>
            <span className="deactivate-btns">
                <button className='deactivate-no' id='no' onClick={this.handleDeactivateBtn}>NO</button>
                <button className='deactivate-yes' id='yes' onClick={this.handleDeactivateBtn}>YES</button>
            </span>
        </div>
    )
  }

  styleExams=()=>{
    let exams = this.props.examinations.sort((a,b)=>a.status<b.status?
    (a.nameExamCategory<b.nameExamCategory?(a.nameExamination<b.nameExamination?-1:1):1):
    (a.nameExamCategory<b.nameExamCategory?(a.nameExamination<b.nameExamination?-1:1):1))
    return exams.map(theExam=>{
    return(
        this.state.codeActifExam!==theExam.codeExamination?(
            <div className="non-selected-userData" key={theExam.idExamination} onClick={()=>this.handleExamClick(theExam.codeExamination)}>
                <span className="non-slct-usr-data">{theExam.nameExamination}</span>
                <span className="non-slct-usr-data">{theExam.codeExamination}</span>
                <span className="non-slct-usr-data">{theExam.bValue}</span>
                <span className="non-slct-usr-data">{theExam.daysToResult}</span>
                <span className="non-slct-usr-data">
                    {theExam.status==='active'?<input type='checkbox' checked disabled />:<input type='checkbox' checked={false} disabled />}
                </span>
            </div>
        ):(
            <div className="selected-user-data" key={theExam.phoneUser} >
                <Formik
                    initialValues={{
                        nameExamination: theExam.nameExamination,
                        codeExamination: theExam.codeExamination,
                        bValue: theExam.bValue,
                        status:theExam.status==='active'?true:false,
                        daysToResult: theExam.daysToResult
                    }}
                    validationSchema={Yup.object({
                        nameExamination: Yup.string().required('Required'),
                        codeExamination: Yup.string().required('Required'),
                        bValue: Yup.number().required('Required'),
                        status: Yup.bool().required('Required'),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        let token = localStorage.getItem("userToken");
                        if(this.props.isAuthenticated && this.props.user.roleUser ==='admin' && parseJwt(token).idUser !==undefined){
                            let statusExamination = values.status?'active':'inactive'
                            let returnVal = {
                                idUser: parseJwt(token).idUser,
                                idExamination:theExam.idExamination,
                                nameExamination: values.nameExamination!==theExam.nameExamination?values.nameExamination:null,
                                codeExamination: values.codeExamination!==theExam.codeExamination?values.codeExamination:null,
                                bValue: values.bValue!==theExam.bValue?values.bValue:null,
                                statusExamination: statusExamination!==theExam.status?statusExamination:null,
                                daysToResult: values.daysToResult!==theExam.daysToResult?values.daysToResult:null
                            }
                            if(
                                returnVal.bValue!==null || 
                                returnVal.codeExamination!==null ||
                                returnVal.daysToResult!==null ||
                                returnVal.nameExamination!==null ||
                                returnVal.statusExamination!==null
                            ){
                                fetch('http://localhost:4000/api/exams/updateExam',{
                                    method:'post',
                                    headers:{'Content-Type':'application/json'},
                                    body:JSON.stringify({...returnVal})
                                }).then(data=>data.json())
                                .then(result=>{
                                    if(!result.err){
                                        if(result.res){
                                            this.NotifyOperationSuccess("The update was successfull")
                                            this.props.dispatch({type:'UPDATE_EXAM', payload:{...values, status:values.status?'active':'inactive', idExamination:theExam.idExamination, dateCreated:theExam.dateCreated, nameExamCategory:theExam.nameExamCategory}})
                                            this.setState({codeActifExam:null})
                                        }
                                        else {this.NotifyOperationFailed("The db response is not normal")}
                                    }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                                        this.NotifyOperationFailed( "Verify that your internet connection is active" );
                                    else this.NotifyOperationFailed(result.err.toString());
                                })
                                .catch((err) => {
                                    if (err.toString() === "TypeError: Failed to fetch") {
                                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                                    } else if (err.toString() === "Failed to authenticate token") this.NotifyOperationFailed("User not authenticated");
                                    else this.NotifyOperationFailed(err.toString());
                                });

                            }else this.NotifyOperationFailed("You changed nothing")
                        } else this.NotifyOperationFailed("Could not complete action. Sign in or refresh")
                        setSubmitting(false);
                    }}
                >
                {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                    <Form className="component-form no-margin-form" id='creation-form'>
                    {isSubmitting ? <BarLoader color="#0D9D0A" height="5" /> : null}
        
                    <span className="guidan">
                    <label htmlFor="nameExamination">Examination Name</label>
                    {touched.nameExamination && errors.nameExamination ? (
                        <i className="error">{errors.nameExamination}</i>
                    ) : null}
                    </span>
                    <Field name="nameExamination" type="text" />
        
                    <span className="guidan">
                        <label htmlFor="codeExamination">Examination Code</label>
                        {touched.codeExamination && errors.codeExamination ? (
                        <i className="error">{errors.codeExamination}</i>
                        ) : null}
                    </span>
                    <Field name="codeExamination" type="text" />
        
                    <span className="guidan">
                    <label htmlFor="bValue">bValue</label>
                    {touched.bValue && errors.bValue ? (
                        <i className="error">{errors.bValue}</i>
                    ) : null}
                    </span>
                    <Field name="bValue" type="number" min={0} />

                    <span className="guidan">
                    <label htmlFor="daysToResult">Days to Result</label>
                    {touched.daysToResult && errors.daysToResult ? (
                        <i className="error">{errors.daysToResult}</i>
                    ) : null}
                    </span>
                    <Field name="daysToResult" type="number" min={0} />

                    <span className="guidan">
                    <label htmlFor="status">Examination status</label>
                    {touched.status && errors.status ? (
                        <i className="error">{errors.status}</i>
                    ) : null}
                    </span>
                    <Field name="status" type="checkbox" />
                    <div className="idnt-btns">
                    <button type="submit" className="btn-nxt" disabled={isSubmitting}>
                        Update
                    </button>
                    </div>
                    <ToastContainer />
                    </Form>
                )}
                </Formik>

                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Exam Category: </i>
                    <i className='slctd-user-data-value'>{theExam.nameExamCategory}</i>
                </span>

                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Created on: </i>
                    <i className='slctd-user-data-value'>{theExam.dateCreated.split('T')[0]+' '+theExam.dateCreated.split('T')[1].split('.0')[0]}</i>
                </span>
            </div>
        )
    )
    })
  }

  render() {
    const token = localStorage.getItem("userToken");
    return (token !== null && parseJwt(token).idUser !== undefined && this.props.isAuthenticated && this.props.user.roleUser==='admin')?
    (
        <div>
            {this.confirmDeactivateUser()}
            {this.styleExams()}
            <ToastContainer />
        </div>
    )
    :<span>Invalid User Sign in to get acces to this page.</span>
  }
}

const mapStateToProps=state=>{
    return{
        isAuthenticated:state.IsAuthenticated.isAuthenticated,
        user: state.User.user,
        examinations: state.Examination.examinations
    }
}

export default connect(mapStateToProps)(ManageExams)