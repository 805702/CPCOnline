import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import BarLoader from 'react-bar-loader';
import 'react-toastify/dist/ReactToastify.css';


class PasswordForm extends Component {
    state={
        invalidPassword:false,
        readable:false
    }
  notifyErrorMessage=(message)=>toast.error(message)
  notifyCodeSent=()=>toast.success('A new code has been sent')

    handleEye=()=>{
        this.setState({readable:!this.state.readable},()=>{
            if (this.state.readable) document.getElementById('pass-input').setAttribute('type','text')
            else document.getElementById('pass-input').setAttribute('type','password')
            document.getElementById("pass-input").focus();
        })
    }

    
    render() {
        return (
            <Formik
                initialValues={{ password: "" }}
                validationSchema={Yup.object({
                  password: Yup.string().required("required"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  /*
                      write your request to the server submitting phone
                      and password
                  */
                  let phone = this.props.location.pathname.split('_')
                  phone = phone[phone.length-1]

                  fetch('http://localhost:4000/api/auth/login', {
                    method:'post',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify({
                      phone:phone,
                      pwd:values.password,
                      method:'password'
                    })
                  })
                  .then(data=>data.json())
                  .then(result=>{
                    if(result.err==='Invalid Password') {
                      this.setState({invalidPassword:true},()=>{
                        this.notifyErrorMessage("Invalid Password")
                      })
                    }
                    else{
                      localStorage.setItem("userToken",result.token)
                      //redirect to the right home page
                      if(result.role==='admin') {
                        this.props.history.push('/adminHome')
                      }else if(result.role==='operator'){
                        this.props.history.push('/operatorHome')
                      }else if(result.role==='commFi'){
                        this.props.history.push('/commFiHome')
                      }else if(result.role==='partner'){
                        this.props.history.push('/partnerHome')
                      }
                      else {
                        this.props.history.push('/')
                      }
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
                {({ errors, touched, isSubmitting}) => (
                  <Form className="component-form">
                    {isSubmitting?<BarLoader color="#0D9D0A" height="5" />:null}
                    <span className="guidan">
                      <label htmlFor="password">Password</label>
                      {touched.password && errors.password ? (
                        <i className="error">{errors.password}</i>
                      ) : null}
                    </span>
                    <span
                      className="password-input"
                      onClick={() =>
                        document.getElementById("pass-input").focus()
                      }
                    >
                      <Field name="password" type="password" id="pass-input" />
                      {this.state.readable ? (
                        <i className="fa fa-eye" onClick={this.handleEye} />
                      ) : (
                        <i
                          className="fa fa-eye-slash"
                          onClick={this.handleEye}
                        />
                      )}
                    </span>
                    {this.state.invalidPassword ? (
                      <span className="inv-pass-block">
                        <i className="fa fa-exclamation-circle" />
                        <i className="invalid-password">
                          Wrong password. Try again
                        </i>
                      </span>
                    ) : null}
                    <span className="action-btns">
                      <i className="fa fa-arrow-left">Back</i>
                      <button type="submit" disabled={isSubmitting} >Next</button>
                    </span>
                    <ToastContainer />
                  </Form>
                )}
            </Formik>

        )
    }
}

export default withRouter(PasswordForm)