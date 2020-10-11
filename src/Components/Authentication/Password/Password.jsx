import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ComponentMould from '../../../Global/ComponentMould/ComponentMould.jsx';
import Block from '../../../Global/Block/Block.jsx';
import UserLogin from '../UserLogin/UserLogin.jsx';
import './Password.css'

export class PasswordForm extends Component {
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
                    alert("submitted form");
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

function Password(props) {
  return (
    <ComponentMould>
      <Block pageName='Welcome'>
          <UserLogin login={props.login} />
      </Block>
      <PasswordForm />
    </ComponentMould>
  )
}

export default Password
