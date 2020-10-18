import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './MedPersonnel.css'



function notifyNoExam(){return toast.error('No images for your demand')}

function submitDemand(images, identification, entryMethod, values){
    if(images.length>0){
        let returnList={
            images:images,
            identification:identification,
            entryMethod: entryMethod,
            medPersonnel:values
        }
        console.log(returnList)
        //write code to upload user data here.
    }else notifyNoExam()
}

function MedPersonnel(props) {
    return (
      <Formik
        initialValues={{
          name: props.medPersonnel.name,
          title: props.medPersonnel.title,
        }}
        validationSchema={Yup.object({
          name: Yup.string().min(3,"At least 3 letters"),
          title: Yup.string().matches(/^(Dr)$|^(Pr)$/,'Invalid title'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            props.onNext('next', values)
            setSubmitting(false);
          }, 1);
        }}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="component-form no-margin-form">
            <span className="guidan">
              <label htmlFor="title">Title</label>
              {touched.title && errors.title ? (
                <i className="error">{errors.title}</i>
              ) : null}
            </span>
            <select
                name="title"
                value={values.title}
                onChange={(e)=>setFieldValue('title',e.target.value)}
                style={{ display: 'block' }}
            >
                <option value="" label="Select a title" />
                <option value="Dr" label="Dr" />
                <option value="Pr" label="Pr" />
            </select>
            <span className="guidan" id="cancel-last-span">
              <label htmlFor="name">Name</label>
              {touched.name && errors.name ? (
                <i className="error">{errors.name}</i>
              ) : null}
            </span>
            <Field name="name" type="text" />

            <div className="idnt-btns">
                <button type='button' className='btn-cancel' onClick={()=>props.onNext('back',values)} >
                  <i className='fa fa-arrow-left'>Back</i></button>
                {props.entryMethod==='text'?<button type='submit' className='btn-nxt'>Next</button>
                :<button
                    type='button'
                    className='btn-nxt'
                    onClick={()=>submitDemand(props.images, props.identification, props.entryMethod, values)}
                    >Submit demand</button>}
            </div>
                <ToastContainer />
          </Form>
        )}
      </Formik>
    );
}

export default MedPersonnel