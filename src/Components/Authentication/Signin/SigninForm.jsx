import React from 'react';
import { withRouter } from 'react-router-dom';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import BarLoader from 'react-bar-loader';
import 'react-toastify/dist/ReactToastify.css';

function notifyErrorMessage(message){return toast.error(message)}


/**
 * Has the validation schema for the cameroonian phone number without country code
 * after the phone number validation, the form can be submitted.
 * using <tt>Formik</tt> to do the form
 * install <tt>formik</tt> on <tt>npm i formik --save</tt>
 * using <tt>yup</tt> for form validation
 * install <tt>yup</tt> on <tt>npm i yup --save</tt>
 * @returns {JSX} Signin form
 */
function SigninForm(props) {
    return (
        <Formik
            initialValues={{ login: "" }}

            validationSchema={Yup.object({
                login: Yup.string()
                .matches(/^((6[5-9])|(2[2-3]))[0-9]{7}$/, 'Invalid phone')
                .required('required')
            })}

            onSubmit={(values, { setSubmitting })=>{
                //do your request here and based on the reponse send to
                //the appropriate page.
                fetch('http://localhost:4000/api/auth/loginPhone', {
                    method:'post',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify({phone:values.login})
                })
                .then(data=>data.json())
                .then(result=>{
                    props.history.push(`/login/${result.method}_${values.login}`)
                    setSubmitting(false);
                })
                .catch(err=>{
                    if(err.toString()==="TypeError: Failed to fetch"){
                        notifyErrorMessage("Verify that your internet connection is active")
                    }else notifyErrorMessage(err.toString())
                    setSubmitting(false);
                })
            }}
        >
            {({errors, touched, isSubmitting})=>(
                <Form className='component-form'>
                    {isSubmitting?<BarLoader color="#0D9D0A" height="2" />:null}
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
                        <button type='submit' disabled={isSubmitting} >Next</button>
                    </span>
                    <ToastContainer />
                </Form>
            )}
        </Formik>
    )
}

export default withRouter(SigninForm)