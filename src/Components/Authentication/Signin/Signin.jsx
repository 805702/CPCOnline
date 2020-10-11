import React from 'react'
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup'

import ComponentMould from '../../../Global/ComponentMould/ComponentMould.jsx';
import Block from '../../../Global/Block/Block.jsx';
import './Signin.css'

/**
 * Has the validation schema for the cameroonian phone number without country code
 * after the phone number validation, the form can be submitted.
 * using <tt>Formik</tt> to do the form
 * install <tt>formik</tt> on <tt>npm i formik --save</tt>
 * using <tt>yup</tt> for form validation
 * install <tt>yup</tt> on <tt>npm i yup --save</tt>
 * @returns {JSX} Signin form
 */
export function SigninForm() {
    return (
        <Formik
            initialValues={{ login: "" }}

            validationSchema={Yup.object({
                login: Yup.string()
                .matches(/^((6[5-9])|(2[2-3]))[0-9]{7}$/, 'Invalid phone')
                .required('required')
            })}

            onSubmit={(values, { setSubmitting })=>{
                setTimeout(()=>{
                    alert('submitted form')
                    setSubmitting(false);
                }, 400)
            }}
        >
            {({errors, touched})=>(
                <Form className='component-form'>
                    <span className='guidan'>
                        <label htmlFor='login'>Phone</label>
                        {touched.login && errors.login?
                        <i className='error'>{errors.login}</i>:null}
                    </span>
                    <Field name='login' type='text' />
                    <i className='ex-message'>
                        <i>Example: </i>
                        <b>657140183</b>
                    </i>
                    <span className='action-btns'>
                        <i>New here?</i>
                        <button type='submit'>Next</button>
                    </span>
                </Form>
            )}
        </Formik>
    )
}

export default function Signin() {
    return (
    <ComponentMould>
      <Block pageName='Welcome' message="Welcome to CPCOnline" />
      <SigninForm />
    </ComponentMould>
    )
}
