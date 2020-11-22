import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BarLoader from "react-bar-loader";

// import "./Identification.css";
// import parseJwt from "../../../../utils/parseJwt";
import { Link } from "react-router-dom";
import ComponentMould from "../../Global/ComponentMould/ComponentMould";
import Block from "../../Global/Block/Block";
import parseJwt from "../../utils/parseJwt";


class CreateUser extends Component {
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
            <Block pageName="Create a new User" message={""} />
            <Formik
              initialValues={{
                phone: "",
                fname: "",
                lname: "",
                dob: "",
                gender: "",
                email: "",
                matricule: "",
                reduction: -1,
                role: "",
                EndDate: Date.now(),
              }}
              validationSchema={Yup.object({
                phone: Yup.string()
                  .matches(/^(6|2)(2|3|[5-9])[0-9]{7}$/, "Invalid phone")
                  .required("Required"),
                dob: Yup.date().max(
                  Yup.ref("EndDate"),
                  "Date of birth must be before today"
                ),
                email: Yup.string()
                  .matches( /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email" )
                  .required("Required"),
                fname: Yup.string().required("Required").min(3, "At least 3 letters"),
                lname: Yup.string().min(3, "At least 3 letters"),
                gender: Yup.string()
                  .matches(/^(F)$|^(M)$/, "Invalid gender"),
                role: Yup.string()
                  .matches(/^operator || admin || commfi || partner$/, "Invalid role")
                  .required("Required"),
                reduction: Yup.number(),
                matricule: Yup.string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                  let enter = false;
                  if ( values.role !== "partner" && values.dob !== "" && values.matricule !== "" && values.gender!=='') enter = true;
                  else if (values.role==='partner' && values.reduction >=0) enter = true;
                  if (enter) {
                      let token = localStorage.getItem('userToken')
                      if(this.props.isAuthenticated && this.props.user.roleUser ==='admin' && parseJwt(token).idUser !==undefined){
                          fetch('http://localhost:4000/api/user/createUser',{
                              method:'post',
                              headers:{"Content-Type":"application/json"},
                              body:JSON.stringify({...values, idUser:parseJwt(token).idUser})
                          }).then(data=>data.json())
                          .then(result=>{
                              if(!result.err){
                                  if(result.res)this.NotifyOperationSuccess("User created successfully. A mail has been sent to user containing their password")
                                  if(result.res)document.getElementById('creation-form').reset()
                              }else if(result.err.toString()==='User with phone or email already exists') this.NotifyOperationFailed('User with phone or email already exists')
                              else if (result.err.toString() === "TypeError: Failed to fetch") this.NotifyOperationFailed( "Verify that your internet connection is active" );
                              else this.NotifyOperationFailed(result.err.toString())
                          })
                          .catch(err=>{
                               if(err.toString()==='User with phone or email already exists') this.NotifyOperationFailed('User with phone or email already exists')
                              else if (err.toString() === "TypeError: Failed to fetch") this.NotifyOperationFailed( "Verify that your internet connection is active" );
                              else this.NotifyOperationFailed(err.toString())
                          })
                      } else this.NotifyOperationFailed("Could not complete action. Sign in or refresh")
                  } else if(values.role!=='partner' && values.dob==='')this.NotifyOperationFailed("Enter Date of birth")
                  else if(values.role!=='partner' && values.matricule==='')this.NotifyOperationFailed("Enter Matricule")
                  else if(values.role!=='partner' && values.gender==='')this.NotifyOperationFailed("Select Gender")
                  else if(values.reduction<=0)this.NotifyOperationFailed("Enter Reduction value")
                  setSubmitting(false);
              }}
            >
              {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                <Form className="component-form no-margin-form" id='creation-form'>
                  {isSubmitting ? <BarLoader color="#0D9D0A" height="5" /> : null}
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
                    <label htmlFor="title">Role</label>
                    {touched.role && errors.role ? (
                      <i className="error">{errors.role}</i>
                    ) : null}
                  </span>
                  <select
                    name="role"
                    value={values.role}
                    onChange={(e) => setFieldValue("role", e.target.value)}
                    style={{ display: "block" }}
                  >
                    <option value="" label="Select a user role" />
                    <option value="admin" label="Admin" />
                    <option value="commfi" label="Finance Member" />
                    <option value="operator" label="Operator" />
                    <option value="partner" label="Partner" />
                  </select>
      
                  <span className="guidan">
                    <label htmlFor="fname">
                      {values.role !== "partner" ? "First name" : "Name"}
                    </label>
                    {touched.fname && errors.fname ? (
                      <i className="error">{errors.fname}</i>
                    ) : null}
                  </span>
                  <Field name="fname" type="text" />
      
                  {values.role !== "partner" ? (
                    <React.Fragment>
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
                    </React.Fragment>
                  ) : null}
      
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
      
                  {values.role !== "partner" ? (
                    <React.Fragment>
                      <span className="guidan">
                        <label htmlFor="Phone">Matricule</label>
                        {touched.matricule && errors.matricule ? (
                          <i className="error">{errors.matricule}</i>
                        ) : null}
                      </span>
                      <Field name="matricule" type="text" />
                      <i className="ex-message">
                        <i>Example: </i>
                        <b>17C005</b>
                      </i>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span className="guidan">
                        <label htmlFor="Phone">Reduction Percentage</label>
                        {touched.reduction && errors.reduction ? (
                          <i className="error">{errors.reduction}</i>
                        ) : null}
                      </span>
                      <Field name="reduction" type="number" min={0} />
                      <i className="ex-message">
                        <i>Example: </i>
                        <b>25%</b>
                      </i>
                    </React.Fragment>
                  )}
      
                  {values.role!=='partner'?
                  <React.Fragment>
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
                  </React.Fragment>:null}
      
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

export default connect(mapStateToProps)(CreateUser);
