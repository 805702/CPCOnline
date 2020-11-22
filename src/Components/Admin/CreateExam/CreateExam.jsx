import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BarLoader from "react-bar-loader";

import ComponentMould from "../../../Global/ComponentMould/ComponentMould";
import Block from "../../../Global/Block/Block";
import parseJwt from "../../../utils/parseJwt";


class CreateExam extends Component {
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

            fetch('http://localhost:4000/api/examCategory/getAllCategories',{
                method:'get',
                headers:{'Content-Type':'application/json'},
            }).then(data=>data.json())
            .then(result=>{
                if(!result.err){
                    this.props.dispatch({type:'LOAD_EXAM_CATEGORY', payload:result.dbRes})
                }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                 this.NotifyOperationFailed( "Verify that your internet connection is active" );
                 else this.NotifyOperationFailed(result.err.toString())
            })
            .catch((err) => {
                if (err.toString() === "TypeError: Failed to fetch") 
                this.NotifyOperationFailed( "Verify that your internet connection is active" );
                else this.NotifyOperationFailed(err.toString());
            });

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
            <Block pageName="Create a new Examination" message={""} />
            <Formik
              initialValues={{
                nameExamination: "",
                codeExamination: "",
                bValue: "",
                daysToResult: "",
                idExamCategory:'',
              }}
              validationSchema={Yup.object({
                nameExamination: Yup.string().required('Required'),
                codeExamination: Yup.string().required('Required'),
                bValue: Yup.number().required('Required'),
                daysToResult: Yup.number().required('Required'),
                idExamCategory: Yup.number().required('Required')
              })}
              onSubmit={(values, { setSubmitting }) => {
                let token = localStorage.getItem("userToken");
                if(this.props.isAuthenticated && this.props.user.roleUser ==='admin' && parseJwt(token).idUser !==undefined){
                    fetch('http://localhost:4000/api/exams/createExam',{
                        method:'post',
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({...values, idUser:parseJwt(token).idUser})
                    }).then(data=>data.json())
                    .then(result=>{
                        if(!result.err){
                            this.NotifyOperationSuccess("User created successfully")
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
              {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                <Form className="component-form no-margin-form" id='creation-form'>
                  {isSubmitting ? <BarLoader color="#0D9D0A" height="5" /> : null}
      
                  <span className="guidan">
                    <label htmlFor="idExamCategory">Examination Category</label>
                    {touched.idExamCategory && errors.idExamCategory ? (
                        <i className="error">{errors.idExamCategory}</i>
                        ) : null}
                  </span>
                  <select
                    name="idExamCategory"
                    value={values.idExamCategory}
                    onChange={(e) => setFieldValue("idExamCategory", Number(e.target.value))}
                    style={{ display: "block" }}
                  >
                    <option value="" label="Choose exam category" />
                    {this.props.examCategory.map(_=>{
                        return <option value={_.idExamCategory} label={_.nameExamCategory} key={_.idExamCategory} />
                    })}
                  </select>

                <span className="guidan">
                <label htmlFor="nameExamination">Examination Name</label>
                {touched.nameExamination && errors.nameExamination ? (
                    <i className="error">{errors.nameExamination}</i>
                ) : null}
                </span>
                <Field name="nameExamination" type="text" />
      
                  <span className="guidan">
                    <label htmlFor="codeExamination">Examination Code</label>
                    {touched.codeExamination && errors.codeExamination ? (
                      <i className="error">{errors.codeExamination}</i>
                    ) : null}
                  </span>
                  <Field name="codeExamination" type="text" />
      
                <span className="guidan">
                <label htmlFor="bValue">bValue</label>
                {touched.bValue && errors.bValue ? (
                    <i className="error">{errors.bValue}</i>
                ) : null}
                </span>
                <Field name="bValue" type="number" min={0} />

                <span className="guidan">
                <label htmlFor="daysToResult">Days to Results</label>
                {touched.daysToResult && errors.daysToResult ? (
                    <i className="error">{errors.daysToResult}</i>
                ) : null}
                </span>
                <Field name="daysToResult" type="number" min={0} />
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
    examCategory: state.ExamCategory.examCategory
  };
};

export default connect(mapStateToProps)(CreateExam);
