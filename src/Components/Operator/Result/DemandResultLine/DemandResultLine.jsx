import { Field, Form, Formik } from 'formik'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import BarLoader from "react-bar-loader";
import { toast, ToastContainer } from 'react-toastify'
import * as Yup from 'yup'; 
import parseJwt from '../../../../utils/parseJwt';
import './DemandResultLine.css'

function NotifyOperationFailed(message){
  return toast.error(message);
}

function NotifyOperationSuccess(message){
  return toast.success(message);
}

class DemandResultLine extends Component {
  state = {
    actions: ["upload", "postpone"],
    openSpecial:false,
    choosenAction:''
  };

  minUpdateDate=()=>{
    let date = new Date();

    return date.setDate(date.getDate() + 1);
  }

  presentUpload=()=>{
    return(
      this.state.actions.includes(this.state.choosenAction)?<div className="upload-block">
        <label className="upload-block-header">{this.state.choosenAction}</label>
        <Formik
          initialValues={{
            upload: null,
            postpone: '',
            now: Date.now()
          }}
      validationSchema={Yup.object({
        postpone: Yup.date().min(Yup.ref('now'),'Must be after today')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let theDate = this.props.fDate.split("T");
          theDate[1] = theDate[1].split(".0")[0];
          theDate = theDate.join(" ");

          const theToken = localStorage.getItem("userToken");
          const userId = parseJwt(theToken).idUser;

          let wanted = ['operator','admin']
          const {roleUser} = this.props.user
          if (this.props.isAuthenticated && wanted.includes(roleUser)) {
            if(this.state.choosenAction==='upload' && values.upload !== null && values.upload!==undefined){
              let formData = new FormData();
              formData.append(`uploadFile`, values.upload);
              formData.append('GIN', this.props.GIN)
              formData.append('idUser', userId)
              formData.append('dueDate', theDate)

              fetch('http://localhost:4000/api/result/uploadDemandResult',{
                method:'post',
                body:formData
              }).then(data=>data.json())
              .then(result=>{
                if(result.err){
                  if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
                    NotifyOperationFailed( "Verify that your internet connection is active" );
                  }
                  else NotifyOperationFailed(result.err.toString())
                }
                else {
                  NotifyOperationSuccess('Result uploaded Successfully')
                  this.props.dispatch({type:'REMOVE_DEMAND_RESULT', payload:this.props.GIN})
                }
                setSubmitting(false);
              })
              .catch(err=>{
                if ( err.toString() === "TypeError: Failed to fetch" ) { 
                  NotifyOperationFailed( "Verify that your internet connection is active" );
                }
                else {
                  NotifyOperationFailed(err.toString())
                  console.log(err)
                }
                setSubmitting(false);
              })
            }else  if(this.state.choosenAction==='postpone' && values.postpone!==''){
              fetch('http://localhost:4000/api/result/postponeResult',{
                method:'post',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                  postpone:values.postpone,
                  GIN: this.props.GIN,
                  idUser:userId,
                  dueDate:theDate
                })
              }).then(data=>data.json())
              .then(result=>{
                if(result.err){
                  if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
                    NotifyOperationFailed( "Verify that your internet connection is active" );
                  }
                  else NotifyOperationFailed(result.err.toString())
                  console.log('err', result)
                }
                else {
                  NotifyOperationSuccess('Exam was postponed successfully')
                  this.props.dispatch({type:'REMOVE_DEMAND_RESULT', payload:this.props.GIN})
                }
                setSubmitting(false);
              })
              .catch(err=>{
                if ( err.toString() === "TypeError: Failed to fetch" ) { 
                  NotifyOperationFailed( "Verify that your internet connection is active" );
                }
                else {
                  NotifyOperationFailed(err.toString())
                  console.log(err)
                }
                setSubmitting(false);
              })
            }else setSubmitting(false)
          }else {
            NotifyOperationFailed(`${roleUser.toUpperCase()} cannot do this action`)
            setSubmitting(false)
          }
        }, 1);
      }}
    >
      {({ errors, touched, values, setFieldValue, isSubmitting }) => (
        <Form className="component-form no-margin-form">
          {isSubmitting? <BarLoader color="#0D9D0A" height="5" /> : null}
          {this.state.choosenAction === 'upload'? 
          <React.Fragment>
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
          </React.Fragment>
          :null}
          {this.state.choosenAction ==='postpone'?
            <React.Fragment>
              <span className="guidan" id="cancel-last-span">
                <label htmlFor="postpone">New date</label>
                {touched.postpone && errors.postpone ? (
                  <i className="error">{errors.postpone}</i>
                ) : null}
              </span>
              <Field name="postpone" type="date" value={values.postpone} />
            </React.Fragment>:null}
            <button type="submit" className='upload-results-sumbit' disabled={isSubmitting}>Submit</button>
          <ToastContainer />
        </Form>
      )}
    </Formik>

      </div>:null
    )
  }

  handleFileUpload(e, props) {
    console.log(e.target.className);
    let btn = document.getElementsByClassName("upld-btn-bg")[0];
    btn.classList.remove("red-bg");
    btn.classList.add("transparent-bg");
    console.log(btn);
    if (e.target.classList.contains("hidden-1")) {
      e.target.className = "hidden-2";
    }
    console.log(e.target.className);
    console.log(e.target.files[0]);
    console.log(props.GIN);
    props.onClick(props.GIN);
  }

  render() {
    return this.props.td ? (
      <div className="demand-result-line-td">
        <span
          className="demand-result-data-line"
          onClick={() => this.props.onClick(this.props.GIN)}
        >
          <i className="demand-result-line-data">{this.props.No}</i>
          <i className="demand-result-line-data">{this.props.GIN}</i>
          <i className="demand-result-line-data">{this.props.date}</i>
        </span>
        {this.props.open && !this.state.actions.includes(this.props.action) ? (
          this.props.action !== "upload" && this.props.action !== "postpone" ? (
            <span className="demand-result-btns">
              <input
                type="file"
                id="upld-result-btn"
                accept="application/pdf"
                hidden
                onChange={(e) => this.handleFileUpload(e, this.props)}
              />
              <button className="upld-btn-bg red-bg" onClick={()=>this.setState({choosenAction:'upload'})}>
                Upload
              </button>
              <button onClick={()=>this.setState({choosenAction:'postpone'})}>Postpone</button>
              {this.presentUpload()}
            </span>
          ) : this.props.action === "upload" ? (
            "hello"
          ) : (
            "world"
          )
        ) : null}
      </div>
    ) : (
      <div className="demand-result-line-th">
        <i className="demand-result-line-data">No</i>
        <i className="demand-result-line-data">GLIMS Number</i>
        <i className="demand-result-line-data">Time due</i>
      </div>
    );
  }
}

const mapStateToProps=state=>{
    return{
        isAuthenticated:state.IsAuthenticated.isAuthenticated,
        user:state.User.user
    }
}

export default connect(mapStateToProps)(DemandResultLine)