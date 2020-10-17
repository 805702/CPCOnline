import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';


class PasswordForm extends Component {
    state={
        invalidPassword:false,
        readable:false
    }

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
                    setTimeout(() => {
                        /*
                            write your request to the server submitting phone
                            and password
                        */
                       let phone = this.props.location.pathname.split('_')
                       phone = phone[phone.length-1]
                       console.log(phone, values.password)

                       this.props.history.push('/home')
                    setSubmitting(false);
                  }, 400);
                }}
              >
                {({ errors, touched }) => (
                  <Form className="component-form">
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
                      <button type="submit">Next</button>
                    </span>
                  </Form>
                )}
            </Formik>

        )
    }
}

export default withRouter(PasswordForm)