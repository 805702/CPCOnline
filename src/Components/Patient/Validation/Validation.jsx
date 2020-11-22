import * as Yup from 'yup';
import React from 'react';
import { connect } from 'react-redux'
import { Formik, Form, Field } from "formik";
import { Scrollbars } from "react-custom-scrollbars";
import { ToastContainer, toast } from 'react-toastify';
import BarLoader from 'react-bar-loader';


import OM from '../../../assets/OM.svg';
import MOMO from '../../../assets/MOMO.svg';
import EUMO from '../../../assets/EUMO.png';
import './Validation.css'
import 'react-toastify/dist/ReactToastify.css';
import parseJwt from '../../../utils/parseJwt';

function notifyIncompatiblePhoneService(){return toast.error('Phone number does not match paying service. verify and try again')}
function notifyNoExam(){return toast.error('Must select at least an exam')}
function notifyError(message){return toast.error(message)}

function guessPayingService(phone){
    if(/^((6[5-9])|(2[2-3]))[0-9]{7}$/i.test(phone)){
        if (/(^65[5-9]\d{6}$)|(^69\d{7}$)/i.test(phone))return "OM";
        if (/(^65[0-4]\d{6}$)|(^67\d{7}$)|(^68\d{7}$)/
        .test(phone))return "MOMO";
        return "EUMO";
    }else return false
}

function validatePayingService(phone, payingService){
  if(/^((6[5-9])|(2[2-3]))[0-9]{7}$/i.test(phone)){
    if (/(^65[5-9]\d{6}$)|(^69\d{7}$)/i.test(phone) && (payingService==='OM' || payingService==='EUMO'))return true
    else if (/(^65[0-4]\d{6}$)|(^67\d{7}$)|(^68\d{7}$)/i.test(phone) && (payingService==='MOMO' || payingService==='EUMO'))return true
    else if(payingService==='EUMO')return true
    else return false
  }else return false
}

function calcultateTotal(selectedExams, choosenExam){
  let total=0
  let calculationList = []
  selectedExams.map(exam=>{
    if(choosenExam.includes(exam.idExamination)) calculationList.push(exam)
    return null
  })
  calculationList.map(exam=>{
    total += exam.bValue*105
    return null
  })

  return total
}

function initiateChoosenExam(selectedExams){
  let newList=[]
  selectedExams.map(exam=>{
    newList.push(exam.idExamination)
    return null
  })
  return newList
}

/**
 * ValidateDemand that the user is sure of the <tt>demand</tt> they are about to pay for
 * @param {object} props contains the details of the demand
 * these details include identification information, 
 * demanded exams, following medical personnel
 * @returns {JSX} the interface to present this page
 * in addition to this, the interface will permit the user to refine
 * the exam list by choosing the exams they want to do
 * indicate the paying mobile phone
 * and choose the mobile paying service
 */
function Validation(props){
    return (
      <React.Fragment>
        <Formik
          initialValues={{
            payingPhone: props.user.roleUser!=='visitor' && props.user.roleUser !==""?props.user.phoneUser:props.identification.phone,
            payingService: props.user.roleUser!=='visitor' && props.user.roleUser !==""
            ?guessPayingService(props.user.phoneUser):guessPayingService(props.identification.phone)
              ? (props.user.roleUser!=='visitor' && props.user.roleUser !==""
            ?guessPayingService(props.user.phoneUser):guessPayingService(props.identification.phone))
              : "",
              choosenExam:initiateChoosenExam(props.selectedExams)
          }}
          validationSchema={Yup.object({
            payingPhone: Yup.string()
              .matches(/^(6|2)(2|3|[5-9])[0-9]{7}$/, "Invalid phone")
              .required("Required"),
            payingService: Yup.string()
              .matches(/^OM$|^EUMO$|^MOMO$/, "Invalid method")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            if(validatePayingService(values.payingPhone, values.payingService)){
              if(values.choosenExam.length!==0){
                if(!props.complete){
                let returnValues = {
                  choosenExam:values.choosenExam,
                  payingPhone:Number(values.payingPhone),
                  payingService:values.payingService,
                  identification:props.identification,
                  medPersonnel:props.medPersonnel,
                  entryMethod:props.entryMethod,
                  demandAmount: calcultateTotal(props.selectedExams, values.choosenExam)
                }

                fetch('http://localhost:4000/api/demand/textDemand',{
                  method:'post',
                  headers: {'Content-Type': 'application/json'},
                  body:JSON.stringify(returnValues)
                })
                .then(data=>data.json())
                .then(result=>{
                  if(result.SIN){
                    let SIN=result.SIN
                    const userToken = localStorage.getItem('userToken')
                    fetch('http://localhost:4000/api/demand/awaitingConfirmation',{
                      method:'post',
                      headers: {'Content-Type':'application/json'},
                      body:JSON.stringify({idUser:parseJwt(userToken).idUser})
                    }).then(data=>data.json())
                    .then(result=>{
                      if(!result.err) {
                        props.dispatch({type:'LOAD_DEMAND_HAS_EXAM_JOIN', payload:result.demandHasExamJoin})
                        props.dispatch({type:'LOAD_MED_EXAM_RESULT', payload:result.medExamResult})
                        let data = { SIN: SIN, status: true };
                        props.onNext("next", data);
                      }
                      else if (result.err.toString() === "TypeError: Failed to fetch") notifyError( "Verify that your internet connection is active" );
                      else notifyError(result.err.toString())
                    })
                    .catch((err) => {
                        if (err.toString() === "TypeError: Failed to fetch") {
                          notifyError("Verify that your internet connection is active");
                        } else if(err.toString()==='Failed to authenticate token') notifyError('User not authenticated')
                        else notifyError(err.toString());
                    });

                    // let data={SIN:`SYS - ${result.SIN.slice(0,4)} - ${result.SIN.slice(4,8)}`, status:true}
                  }else{
                    notifyError(result.err.toString())
                    props.onNext('next', {status:false})
                  }
                  setSubmitting(false);
                }).catch(err=>{
                  // props.onNext('next', {status:false})
                  notifyError(err.toString())
                  setSubmitting(false);
                })
              }else{
                //complete the demand here
                console.log('complete demand')
              }
              //this is where you do a backend 
              
              //after the api call if the response is good, then you write to the state using the onNext supplied by props
              //the response from the backend will contain the SIN and and status
              //the status is true or false. indicating the state of the demand
              // let data={SIN:'SYS - 085 - 965', status:'true'}
              // props.onNext('next',data)
              }else {
                notifyNoExam()
                setSubmitting(false);
              }
            }else {
              notifyIncompatiblePhoneService()
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, touched, errors, isSubmitting }) => (
            <Form className="component-form no-margin-form">
              {isSubmitting?<BarLoader color="#0D9D0A" height="5" />:null}
              <span className="guidan">
                <label htmlFor="payingPhone">Paying phone</label>
                {touched.payingPhone && errors.payingPhone ? (
                  <i className="error">{errors.payingPhone}</i>
                ) : null}
              </span>
              <Field name="payingPhone" type="text" />
              <i className="ex-message">
                <i>Example:</i>
                <b>657140183</b>
              </i>
              <div className="patient-info">
                <i>
                  Name: {props.identification.fname +" " + props.identification.lname}
                </i>
                <i>Born on: {props.identification.dob}</i>
                <i>
                  Sex:
                  {props.identification.gender === "M" ? " Male" : " Female"}
                </i>
              </div>
                <div className="demanded-exam-info" id="demanded-exam-info-validate">
                  <div className="exm-dmd-tbl-hdr">
                    <input
                      type="checkbox"
                      checked={values.choosenExam.length===props.selectedExams.length}
                      onChange={() =>{
                        if(values.choosenExam.length === props.selectedExams.length){
                          setFieldValue('choosenExam', [])
                        }else {
                          let newList = []
                          props.selectedExams.map(exam=>{
                            newList.push(exam.idExamination)
                            return null
                          })
                          setFieldValue('choosenExam', newList)
                        }
                      }}
                    />
                    <i>Exam name</i>
                    <i>Price</i>
                  </div>
                  <Scrollbars className='demand-scrollbar'>
                      {props.selectedExams.map((exam) => (
                        <div className="exm-dmd-tbl-row" key={exam.idExamination}>
                          <Field
                            type="checkbox"
                            name='choosenExam'
                            value={exam.idExamination}
                            checked={values.choosenExam.includes(exam.idExamination)}
                            onChange={() =>{
                              let newList=[]
                              if(values.choosenExam.includes(exam.idExamination)){
                                newList = values.choosenExam.filter(id=>id!==exam.idExamination)
                              }else{
                                newList = values.choosenExam
                                newList.push(exam.idExamination)
                              }
                              setFieldValue('choosenExam', newList)
                            }}
                          />
                          <i>{exam.nameExamination}</i>
                          <i>{exam.bValue*105} CFA</i>
                        </div>
                      ))}
                  </Scrollbars>
                  <div className="exm-dmd-tbl-total">
                    <i>Total</i>
                    <i>{calcultateTotal(props.selectedExams, values.choosenExam)} CFA</i>
                  </div>
                </div>
              <span className="guidan" id="cancel-guidan-css">
                <label htmlFor="payingService" className='paying-service'>Paying service</label>
                {touched.payingService && errors.payingService ? (
                  <i className="error">{errors.payingService}</i>
                ) : null}
              </span>
              <div className="pyg-svc-radio">
                <div className="radio-group">
                  <Field
                    type="radio"
                    name="payingService"
                    value="MOMO"
                    id="MOMO"
                    checked={values.payingService === "MOMO"}
                    onChange={() => setFieldValue("payingService", "MOMO")}
                  />
                  <label htmlFor="MOMO">
                    <img
                      src={MOMO}
                      alt="MTN mobile money"
                      style={{ height: 50, width: 50 }}
                    />
                  </label>
                </div>
                <div className="radio-group">
                  <Field
                    type="radio"
                    name="payingService"
                    value="OM"
                    id="OM"
                    checked={values.payingService === "OM"}
                    onChange={() => setFieldValue("payingService", "OM")}
                  />
                  <label htmlFor="OM">
                    <img
                      src={OM}
                      alt="Orange money"
                      style={{ height: 50, width: 50 }}
                    />
                  </label>
                </div>
                <div className="radio-group">
                  <Field
                    type="radio"
                    name="payingService"
                    value="EUMO"
                    id="EUMO"
                    checked={values.payingService === "EUMO"}
                    onChange={() => setFieldValue("payingService", "EUMO")}
                  />
                  <label htmlFor="EUMO">
                    <img
                      src={EUMO}
                      alt="EU mobile money"
                      style={{ height: 50, width: 50 }}
                    />
                  </label>
                </div>
              </div>
              <div className="idnt-btns">
                {!props.complete?<button type='button' className="btn-cancel" onClick={()=>window.location.assign('/home')}>Cancel</button>:null}
                <button type='button' className='btn-cancel' onClick={()=>props.onNext('back')} >
                  <i className='fa fa-arrow-left'>Back</i></button>
                {!props.complete?<button type='submit' className="btn-pay">Pay</button>:
                <button type='button' className="btn-pay" onClick={()=>props.onNext('next')}>Pay</button>}
              </div>
              <ToastContainer />
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
}

const mapStateToProps=state=>{
  return{
    user:state.User.user
  }
}

export default connect(mapStateToProps)(Validation)