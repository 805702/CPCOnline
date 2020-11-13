import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import BarLoader from "react-bar-loader";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./MedPersonnel.css";

function notifyNoExam() {
  return toast.error("No images for your demand");
}

function notificationToast(message){
  return toast.error(message)
}

function MedPersonnel(props) {
  return (
    <Formik
      initialValues={{
        name: props.medPersonnel.name,
        title: props.medPersonnel.title,
        submiting:false
      }}
      validationSchema={Yup.object({
        name: Yup.string().min(3, "At least 3 letters"),
        title: Yup.string().matches(/^(Dr)$|^(Pr)$/, "Invalid title"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          props.onNext("next", values);
          setSubmitting(false);
        }, 1);
      }}
    >
      {({ errors, touched, values, setFieldValue,}) => (
        <Form className="component-form no-margin-form">
          {values.submiting ? <BarLoader color="#0D9D0A" height="5" /> : null}
          <span className="guidan">
            <label htmlFor="title">Title</label>
            {touched.title && errors.title ? (
              <i className="error">{errors.title}</i>
            ) : null}
          </span>
          <select
            name="title"
            value={values.title}
            onChange={(e) => setFieldValue("title", e.target.value)}
            style={{ display: "block" }}
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
            <button
              type="button"
              className="btn-cancel"
              onClick={() => props.onNext("back", values)}
            >
              <i className="fa fa-arrow-left">Back</i>
            </button>
            {props.entryMethod === "text" ? (
              <button type="submit" className="btn-nxt">
                Next
              </button>
            ) : (
              <button
                type="button"
                className="btn-nxt"
                onClick={() => {
                  setFieldValue('submiting', true)
                  console.log(values.submiting)
                  if (props.images.length > 0) {
                    let formData = new FormData();
                    props.images.forEach((image) =>
                      formData.append(`file`, image.image)
                    );
                    const idenKeys = [
                      "dob",
                      "email",
                      "fname",
                      "gender",
                      "lname",
                      "phone",
                    ];
                    const medPKeys = ["title", "name"];
                    idenKeys.forEach((_) =>
                      formData.append(_, props.identification[_])
                    );
                    medPKeys.forEach((_) => formData.append(_, values[_]));
                    formData.append("entryMethod", props.entryMethod);
                    fetch("http://localhost:4000/api/demand/imageDemand", {
                      method: "post",
                      body: formData,
                    })
                      .then((data) => data.json())
                      .then((result) => {
                        if (result.SIN) {
                          let data = {
                            SIN: `SYS - ${result.SIN.slice(
                              0,
                              4
                            )} - ${result.SIN.slice(4, 8)}`,
                            status: true,
                          };
                          props.onNext("next", data);
                        } else {
                          notificationToast(
                            "Could not submit your demand! please try again"
                          );
                          // props.onNext('next', {status:false})
                        }
                        setFieldValue('submiting', false)
                      })
                      .catch((err) => {
                        setFieldValue('submiting', false)
                        console.log(err)
                      });
                      //make your api call here for the images
                      // props.onNext('next', false, true)
                    } else notifyNoExam();
                }}
              >
                Submit demand
              </button>
            )}
          </div>
          <ToastContainer />
        </Form>
      )}
    </Formik>
  );
}

export default MedPersonnel;
