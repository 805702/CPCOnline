import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ComponentMould from '../../../Global/ComponentMould/ComponentMould.jsx';
import Block from '../../../Global/Block/Block.jsx';
import UserLogin from '../UserLogin/UserLogin.jsx';
import './Code.css'
import '../Password/Password.css'

export class CodeForm extends Component {
    state={
        invalidCode:false
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
                <i className='resend-code'>Resend Code</i>
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

function Code(props) {
    return (
        <ComponentMould>
            <Block pageName='Welcome'>
                <UserLogin login={props.login} />
            </Block>
            <CodeForm />
        </ComponentMould>
    )
}

export default Code