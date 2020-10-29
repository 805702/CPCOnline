import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import BarLoader from 'react-bar-loader';
import parseJwt from '../../../utils/parseJwt'
import { withRouter } from 'react-router-dom';

class CodeForm extends Component {
  state={
      invalidCode:false,
      resendCodeSubmitting:false
  }

  notifyErrorMessage=(message)=>toast.error(message)
  notifyCodeSent=()=>toast.success('A new code has been sent')


  resendCode=()=>{
    let phone = this.props.location.pathname.split('_')
    phone = phone[phone.length-1]

    this.setState({resendCodeSubmitting:true},()=>{
      fetch('http://localhost:4000/api/auth/loginPhone', {
          method:'post',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({
            phone:phone,
          })
      })
      .then(data=>data.json())
      .then(result=>{
        this.setState({resendCodeSubmitting:false},()=>{
            this.notifyCodeSent()
        });
      })
      .catch(err=>{
        this.setState({resendCodeSubmitting:false},()=>{
          if(err.toString()==="TypeError: Failed to fetch"){
            this.notifyErrorMessage("Verify that your internet connection is active")
          }else this.notifyErrorMessage(err.toString())
        });
        console.log(err)
      })
    })

  }
  
  render() {
      return (
      <Formik
          initialValues={{ code: "" }}
          validationSchema={Yup.object({
            code: Yup.string()
              .matches(/^[0-9]{4}$/, "Invalid Code")
              .required("required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
              /*
                  write your request to the server submitting phone
                  and code
              */
              let phone = this.props.location.pathname.split('_')
              phone = phone[phone.length-1]

              fetch('http://localhost:4000/api/auth/login', {
                method:'post',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({
                  phone:phone,
                  pwd:values.code,
                  method:'code'
                })
              })
              .then(data=>data.json())
              .then(result=>{
                if(result.err==='Invalid Code') {
                  this.setState({invalidCode:true},()=>{
                    this.notifyErrorMessage("Invalid Code")
                  })
                }else if(result.err){
                this.setState({invalidCode:true},()=>{
                    this.notifyErrorMessage(result.err)
                  })

                }
                else{
                  console.log(result)
                  localStorage.setItem("userToken",result.token)
                  //redirect to the right home page
                  if(result.role==='patient' || result.role==='visitor') {
                    console.log(parseJwt(result.token))
                    this.props.history.push('/patientHome')
                  }
                //   else {
                //     this.props.history.push('/')
                //   }
                }
                setSubmitting(false);
              })
              .catch(err=>{ 
                if(err.toString()==="TypeError: Failed to fetch"){
                  this.notifyErrorMessage("Verify that your internet connection is active")
                }else this.notifyErrorMessage(err.toString())
                setSubmitting(false);
              })
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="component-form">
              {isSubmitting || this.state.resendCodeSubmitting?<BarLoader color="#0D9D0A" height="5" />:null}
              <span className="guidan">
                <label htmlFor="code">Code</label>
                {touched.code && errors.code ? (
                  <i className="error">{errors.code}</i>
                ) : null}
              </span>
              <span
                className="code-input"
                onClick={() => document.getElementById("pass-input").focus()}
              >
                <i
                  onClick={() =>
                    document.getElementById("pass-input").focus()
                  }
                >
                  SYS-
                </i>
                <Field
                  name="code"
                  type="text"
                  id="pass-input"
                  placeholder="XXXX"
                />
              </span>
              {this.state.invalidCode ? (
                <span className="inv-pass-block">
                  <i className="fa fa-exclamation-circle" />
                  <i className="invalid-password">
                    Wrong Code. Try again or click resend
                  </i>
                </span>
              ) : null}
              <i className='resend-code' onClick={this.resendCode} >Resend Code</i>
              <span className="action-btns">
                <i className="fa fa-arrow-left">Back</i>
                <button type="submit">Next</button>
              </span>
              <ToastContainer />
            </Form>
          )}
      </Formik>
      )
  }
}

export default withRouter(CodeForm)