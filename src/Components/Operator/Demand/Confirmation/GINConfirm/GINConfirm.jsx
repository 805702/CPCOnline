import React, { Component } from 'react'
import { Field, Form, Formik } from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup'
import BarLoader from 'react-bar-loader';
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import ComponentMould from '../../../../../Global/ComponentMould/ComponentMould'
import './GINConfirm.css'
import 'react-toastify/dist/ReactToastify.css';
import parseJwt from '../../../../../utils/parseJwt'



function NotifyOperationFailed(message){return toast.error(message)}

function GINConfirmExams(props){
    return(
        props.th?<div className="GINConfirm-hdr">
            <i className="exam-info">No</i>
            <i className="exam-info">Name</i>
        </div>:
        <div className="GINConfirm-row">
            <i className="exam-info">{props.No}</i>
            <i className="exam-info">{props.exam}</i>
        </div>
    )
}

class GINConfirm extends Component {
    state={

    }

    componentDidMount(){
        let SIN = this.props.SIN
        fetch('http://localhost:4000/api/demand/SINData',{
            body:JSON.stringify({SIN}),
            headers:{'Content-Type':'application/json'},
            method:'post'
        }).then(data=>data.json())
        .then(result=>{
            this.props.dispatch({type:'LOAD_REQUEST_EXAM', payload:result.requestExams})
            this.props.dispatch({type:'LOAD_PATIENT', payload:result.patient[0]})
            this.props.dispatch({type:'LOAD_MED_P', payload:result.medP[0]})
        })
        .catch(err=>console.log(err))
        //fetch data using the SIN provided in props
    }

    render(){
        return (
            <ComponentMould>
                <div className='GINConfirm-holder'>
                    <span className="GINConfirm-page-hdr">
                        <i className="fa fa-arrow-left" onClick={this.props.onBack} />
                        <i className="GINConfirm-req-number"><i className="iden-info-label">Demand number:</i> {`SYS - ${this.props.SIN.slice(0,4)} - ${this.props.SIN.slice(4,8)}`}</i>
                    </span>
                    <div className="GINConfirm-identification">
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>First name:</i> {this.props.patient.firstNameUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Last name:</i> {this.props.patient.lastNameUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Date of birth:</i> {this.props.patient.dateOfBirthUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Gender:</i> {this.props.patient.genderUser.toUpperCase()}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Phone:</i> {`${this.props.patient.phoneUser.toString().slice(0,3)} - ${this.props.patient.phoneUser.toString().slice(3,6)} - ${this.props.patient.phoneUser.toString().slice(6,9)}`}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Doctor:</i> {`${this.props.medP.title} ${this.props.medP.name}`}</i>
                    </div>
                    <div className="GINConfirm-exams">
                        <GINConfirmExams th={true} />
                        <Scrollbars style={{'height':'20vh'}} >
                            {this.props.requestExams.map((anExam, index)=>{
                                return <GINConfirmExams key={index} th={false} No={index+1} exam={anExam.nameExamination} />
                            })}
                        </Scrollbars>
                    </div>
                    <div className="GINConfirm-exams-confirm">
                        <Formik
                            initialValues={{
                            GIN: ''
                            }}
                            validationSchema={Yup.object({
                            GIN: Yup.string().matches(/^[0-9]{8}$/,'Invalid GLIMS number'),
                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                const GIN = values.GIN
                                const SIN = this.props.SIN
                                let token = localStorage.getItem('userToken')
                                if(!(token===null || parseJwt(token).phoneUser==='')){
                                    const phoneUser = parseJwt(token).phoneUser
                                    fetch('http://localhost:4000/api/demand/confirmDemand',{
                                        body:JSON.stringify({GIN, SIN, phoneUser}),
                                        headers:{'Content-Type':'application/json'},
                                        method:'post'
                                    }).then(data=>data.json())
                                    .then(result=>{
                                        setSubmitting(false)
                                        if(result.err)NotifyOperationFailed(result.err.toString())
                                        else {
                                            this.props.dispatch({type:'REMOVE_MEDICAL_EXAM_DEMAND', payload:SIN})
                                            this.props.onBack()
                                        }
                                    })
                                    .catch(err=>{
                                        NotifyOperationFailed(err.toString())
                                    })
                                }else NotifyOperationFailed('Invalid user')
                            }}
                        >
                            {({ errors, touched, isSubmitting}) => (
                            <Form className="component-form no-margin-form GINConfirm-form">
                                {isSubmitting?<BarLoader color="#0D9D0A" height="5" />:null}
                                <span className="guidan" id="cancel-last-span">
                                <label htmlFor="name">GLIMS number</label>
                                {touched.GIN && errors.GIN ? (
                                    <i className="error">{errors.GIN}</i>
                                ) : null}
                                </span>
                                <Field name="GIN" type="text" />
                                <button className='upload-GIN-btn' type='submit' disabled={isSubmitting}>Confirm</button>
                                <ToastContainer />
                            </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </ComponentMould>
        )
    }
}

const mapStateToProps=state=>{
    return{
        patient: state.Patient.patient,
        requestExams: state.RequestExams.requestExams,
        medP: state.MedP.medP
    }
}

export default connect(mapStateToProps)(GINConfirm)
