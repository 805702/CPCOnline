import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import './Identification.css'

function Identification(props) {
    return (
      <Formik
        initialValues={{
          phone: props.identification.phone,
          fname: props.identification.fname,
          lname: props.identification.lname,
          dob: props.identification.dob,
          gender: props.identification.gender,
          email: props.identification.email,
          EndDate:Date.now()
        }}
        validationSchema={Yup.object({
          phone: Yup.string()
            .matches(/^(6|2)(2|3|[5-9])[0-9]{7}$/, "Invalid phone")
            .required("Compulsory field"),
          dob: Yup.date()
          .required("Compulsolry field")
          .max(Yup.ref('EndDate'),'Date of birth must be before today'),
          email: Yup.string().matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Invalid email"
          ),
          fname: Yup.string().required("Compulsory field").min(3,"At least 3 letters"),
          lname: Yup.string().min(3,"At least 3 letters"),
          gender: Yup.string()
            .matches(/^(M)$|^(F)$/, "Invalid gender")
            .required("Compulsory field"),
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
              <label htmlFor="Phone">Phone</label>
              {touched.phone && errors.phone ? (
                <i className="error">{errors.phone}</i>
              ) : null}
            </span>
            <Field name="phone" type="text" />
            <i className="ex-message">
              <i>Example: </i>
              <b>657140183 (cameroonian number)</b>
            </i>

            <span className="guidan">
              <label htmlFor="fname">First name</label>
              {touched.fname && errors.fname ? (
                <i className="error">{errors.fname}</i>
              ) : null}
            </span>
            <Field name="fname" type="text" />

            <span className="guidan">
              <label htmlFor="lname">Last name</label>
              {touched.lname && errors.lname ? (
                <i className="error">{errors.lname}</i>
              ) : null}
            </span>
            <Field name="lname" type="text" />

            <span className="guidan">
              <label htmlFor="dob">Date of birth</label>
              {touched.dob && errors.dob ? (
                <i className="error">{errors.dob}</i>
              ) : null}
            </span>
            <Field name="dob" type="date" className="date-input" />
            <i className="ex-message">
              <i>Format: </i>
              <b>JJ - MM - YYYY</b>
            </i>

            <span className="guidan" id="cancel-last-span">
              <label htmlFor="email">Email</label>
              {touched.email && errors.email ? (
                <i className="error">{errors.email}</i>
              ) : null}
            </span>
            <Field name="email" type="email" />
            <i className="ex-message">
              <i>Example: </i>
              <b>test@test.com</b>
            </i>

            <span className="guidan" id="cancel-last-span">
              <label htmlFor="email">Gender</label>
              {touched.gender && errors.gender ? (
                <i className="error">{errors.gender}</i>
              ) : null}
            </span>
            <div className="gender-radio">
              <div className="radio-group">
                <label htmlFor="M">Male</label>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  id="M"
                  checked={values.gender === "M"}
                  onChange={() => setFieldValue("gender", "M")}
                />
              </div>
              <div className="radio-group">
                <label htmlFor="F">Female</label>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  id="F"
                  checked={values.gender === "F"}
                  onChange={() => setFieldValue("gender", "F")}
                />
              </div>
            </div>
            <div className="idnt-btns">
                <button type='button' className='btn-cancel' onClick={()=>props.onNext('back',values)} >
                  <i className='fa fa-arrow-left'>Back</i></button>
                <button type='submit' className='btn-nxt'>Next</button>
            </div>
          </Form>
        )}
      </Formik>
    );
}

export default Identification