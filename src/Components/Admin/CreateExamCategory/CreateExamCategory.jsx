import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BarLoader from "react-bar-loader";

import ComponentMould from "../../../Global/ComponentMould/ComponentMould";
import Block from "../../../Global/Block/Block";
import parseJwt from "../../../utils/parseJwt";


class CreateExamCategory extends Component {
    componentDidMount(){
      let userToken = localStorage.getItem("userToken");
      fetch("http://localhost:4000/api/auth/validateToken", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken }),
      })
      .then((data) => data.json())
      .then((result) => {
          if (!result.err) {
            this.props.dispatch({ type: "LOAD_USER", payload: result.theUser, });
            this.props.dispatch({ type: "LOAD_IS_AUTHENTICATED", payload: true, });
          } else if(!result.theUser)this.NotifyOperationFailed('No user found with given credentials')
          else if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
            this.NotifyOperationFailed( "Verify that your internet connection is active" ); 
          } else if ( result.err.toString() === "Failed to authenticate token" ) this.NotifyOperationFailed("User not authenticated");
          else this.NotifyOperationFailed(result.err.toString());
      })
      .catch((err) => {
          if (err.toString() === "TypeError: Failed to fetch") {
          this.NotifyOperationFailed( "Verify that your internet connection is active" );
          } else if (err.toString() === "Failed to authenticate token") this.NotifyOperationFailed("User not authenticated");
          else this.NotifyOperationFailed(err.toString());
      });
    }

    NotifyOperationFailed(message) {
        return toast.error(message);
    }

    NotifyOperationSuccess(message) {
        return toast.success(message);
    }
    render(){
        return (
          <ComponentMould>
            <Block pageName="Create Exam Categories" message={""} />
            <Formik
              initialValues={{
                nameExamCategory: "",
              }}
              validationSchema={Yup.object({
                nameExamCategory: Yup.string().required('Required')
              })}
              onSubmit={(values, { setSubmitting }) => {
                let token = localStorage.getItem('userToken')
                if(this.props.isAuthenticated && this.props.user.roleUser ==='admin' && parseJwt(token).idUser !==undefined){
                    fetch('http://localhost:4000/api/examCategory/createExamCategory',{
                        method:'post',
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({...values, idUser:parseJwt(token).idUser})
                    }).then(data=>data.json())
                    .then(result=>{
                        if(!result.err){
                            this.NotifyOperationSuccess("Exam Category created Successfully")
                            document.getElementById('creation-form').reset()
                        }
                        else if (result.err.toString() === "TypeError: Failed to fetch") this.NotifyOperationFailed( "Verify that your internet connection is active" );
                        else this.NotifyOperationFailed(result.err.toString())
                    })
                    .catch(err=>{
                        if (err.toString() === "TypeError: Failed to fetch") this.NotifyOperationFailed( "Verify that your internet connection is active" );
                        else this.NotifyOperationFailed(err.toString())
                    })
                } else this.NotifyOperationFailed("Could not complete action. Sign in or refresh")
                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="component-form no-margin-form" id='creation-form'>
                  {isSubmitting ? <BarLoader color="#0D9D0A" height="5" /> : null}
                  <span className="guidan">
                    <label htmlFor="nameExamCategory">Name Category</label>
                    {touched.nameExamCategory && errors.nameExamCategory ? (
                      <i className="error">{errors.nameExamCategory}</i>
                    ) : null}
                  </span>
                  <Field name="nameExamCategory" type="text" />
                    <div className="idnt-btns">
                    <button type="submit" className="btn-nxt" disabled={isSubmitting}>
                      Create
                    </button>
                  </div>
                  <ToastContainer />
                </Form>
              )}
            </Formik>
          </ComponentMould>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    user: state.User.user,
    isAuthenticated: state.IsAuthenticated.isAuthenticated,
  };
};

export default connect(mapStateToProps)(CreateExamCategory);
