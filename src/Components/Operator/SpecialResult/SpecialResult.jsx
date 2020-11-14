import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import BarLoader from "react-bar-loader";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import parseJwt from "../../../utils/parseJwt";
import './SpecialResult.css'
import { Document, Page } from "react-pdf";

function NotifyOperationFailed(message) {
  return toast.error(message);
}

function NotifyOperationSuccess(message) {
  return toast.success(message);
}

function showURL(file){
  let blot = new Blob([file],{type:'application/pdf'})
  let ur = URL.createObjectURL(blot)
  return ur
}

function SpecialResult(props){
    return(
      <div className="upload-block special-req-holder">
        <label className="upload-block-header">{'Special request'}</label>
        <Formik
          initialValues={{
            upload: null,
            phoneUser: '',
            GIN:'',
          }}
          validationSchema={Yup.object({
            GIN: Yup.string()
                .matches(/^[0-9]{8}$/, 'Invalid GIN')
                .required('required'),
            phoneUser: Yup.string()
                .matches(/^((6[5-9])|(2[2-3]))[0-9]{7}$/, 'Invalid phone')
                .required('required')
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              const theToken = localStorage.getItem("userToken");
              if(theToken!==null){
                fetch("http://localhost:4000/api/auth/validateToken", {
                  method: "post",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token: theToken }),
                })
                .then((data) => data.json())
                .then((result) => {
                  if (!result.err) {
                    props.dispatch({ type: "LOAD_USER", payload: result.theUser });
                    props.dispatch({type: "LOAD_IS_AUTHENTICATED",payload: true,});
                    const userId = parseJwt(theToken).idUser;
                    let wanted = ['operator','admin']
                    if (wanted.includes(result.theUser.roleUser) && !isNaN(Number(userId))) {
                      if(values.upload !== null && values.upload!==undefined){
                        let formData = new FormData();
                        formData.append(`uploadFile`, values.upload);
                        formData.append('GIN', values.GIN)
                        formData.append('phonePatient', values.phoneUser)
                        formData.append('idUploader', userId)
                        fetch('http://localhost:4000/api/result/specialResults',{
                          method:'post',
                          body:formData
                        }).then(data=>data.json())
                        .then(specialResult=>{
                          if(!specialResult.err){
                            document.getElementById('special-form').reset()
                            NotifyOperationSuccess('Successfully uploaded result for patient')
                          }
                          else if(specialResult.err.toString()==='This GIN already Exist') NotifyOperationFailed('This GLIMS number already Exists')
                          else if (specialResult.err.toString() === "TypeError: Failed to fetch") NotifyOperationFailed( "Verify that your internet connection is active" );
                          setSubmitting(false)
                        })
                        .catch((err) => {
                          if (err.toString() === "TypeError: Failed to fetch") NotifyOperationFailed( "Verify that your internet connection is active" );
                          else if(err.toString()==='This GIN already Exist') NotifyOperationFailed('This GLIMS number already Exists')
                          else this.notifyErrorMessage(err.toString());
                          setSubmitting(false)
                        });

                      }else {
                        NotifyOperationFailed('Load a file to upload')
                        setSubmitting(false)
                      }
                    }else {
                      NotifyOperationFailed(`${props.user.roleUser.toUpperCase()} cannot do this action`)
                      setSubmitting(false)
                    }
                  }else if (result.err.toString() === "TypeError: Failed to fetch") 
                  NotifyOperationFailed( "Verify that your internet connection is active" );
                  else if (result.err.toString() === "Failed to authenticate token") NotifyOperationFailed("User not authenticated");
                  else NotifyOperationFailed(result.err.toString());
                  setSubmitting(false)
                })
                .catch((err) => {
                  if (err.toString() === "TypeError: Failed to fetch") NotifyOperationFailed( "Verify that your internet connection is active" );
                  else if (err.toString() === "Failed to authenticate token") NotifyOperationFailed("User not authenticated");
                  else NotifyOperationFailed(err.toString());
                  setSubmitting(false)
                });
              }
            }, 1);
          }}
        >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form className="component-form no-margin-form" id='special-form'>
            {isSubmitting? <BarLoader color="#0D9D0A" height="5" /> : null}
            <span className="guidan">
                <label htmlFor="postpone">Patient phone</label>
                {touched.phoneUser && errors.phoneUser ? (
                  <i className="error">{errors.phoneUser}</i>
                ) : null}
            </span>
            <Field name='phoneUser' type='text' />
            <i className='ex-message'>
                <i>Example: </i>
                <b>657140183</b>
            </i>

            <span className="guidan">
                <label htmlFor="postpone">GLIMS Number</label>
                {touched.GIN && errors.GIN ? (
                  <i className="error">{errors.GIN}</i>
                ) : null}
            </span>
            <Field name='GIN' type='text' />
            <i className='ex-message'>
                <i>Example: </i>
                <b>20208965</b>
            </i>

            <span className="guidan">
            <label htmlFor="postpone">Upload File</label>
            {touched.upload && errors.upload ? (
                <i className="error">{errors.upload}</i>
            ) : null}
            </span>
            <span className="upload-file-tag">
            <label htmlFor="upload-result-input" className='upload-label no-file' >Choose file</label>
            {values.upload!==null && values.upload!==undefined?<label className="upload-text" >{values.upload.name}</label> :null }
            </span>

            <input type='file'
            name="upload"
            accept="application/pdf"
            id='upload-result-input'
            hidden={true}
            onChange={(e) => setFieldValue("upload", e.target.files[0])}
            />
            
            {values.upload!==null && values.upload!== undefined?
            <iframe
              src={showURL(values.upload)}
              className='pdf-iframe'
            />
            :null
            }

            <button type="submit" className='upload-results-sumbit' disabled={isSubmitting}>Submit</button>
            <ToastContainer />
          </Form>
        )}
        </Formik>
      </div>
    )
}

const mapStateToProps=state=>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(SpecialResult)