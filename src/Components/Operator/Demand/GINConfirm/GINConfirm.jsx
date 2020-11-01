import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import React, { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import ComponentMould from '../../../../Global/ComponentMould/ComponentMould'
import './GINConfirm.css'

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
        //fetch data using the SIN provided in props
    }

    render(){
        return (
            <ComponentMould>
                <div className='GINConfirm-holder'>
                    <span className="GINConfirm-page-hdr">
                        <i className="fa fa-arrow-left" />
                        <i className="GINConfirm-req-number">Demand number: {this.props.SIN}</i>
                    </span>
                    <div className="GINConfirm-identification">
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>First name:</i> {this.props.patient.firstNameUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Last name:</i> {this.props.patient.lastNameUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Date of birth:</i> {this.props.patient.dateOfBirthUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Gender:</i> {this.props.patient.genderUser}</i>
                        <i className="GINConfirm-iden-info"><i className='iden-info-label'>Phone:</i> {this.props.patient.phoneUser}</i>
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
                            setTimeout(() => {
                                //do your update here
                                setSubmitting(false);
                            }, 1);
                            }}
                        >
                            {({ errors, touched, isSubmitting}) => (
                            <Form className="component-form no-margin-form GINConfirm-form">
                                <span className="guidan" id="cancel-last-span">
                                <label htmlFor="name">GLIMS number</label>
                                {touched.GIN && errors.GIN ? (
                                    <i className="error">{errors.GIN}</i>
                                ) : null}
                                </span>
                                <Field name="GIN" type="text" />
                                <button type='submit'>Confirm</button>
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
