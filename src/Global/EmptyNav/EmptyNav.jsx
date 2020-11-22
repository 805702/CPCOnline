import React from 'react'
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import parseJwt from '../../utils/parseJwt'
import { ToastContainer, toast } from "react-toastify";
// import logo from '../assets/logo.png'
import './EmptyNav.css'

/**
 * 
 * The navigation bar for the signin page
 * contains the <tt>CPC</tt> logo
 * @returns {JSX} to display the nav bar
 */
class EmptyNav extends Component {

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      let userToken = localStorage.getItem("userToken");
      fetch("http://localhost:4000/api/auth/validateToken", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken }),
      })
        .then((data) => data.json())
        .then((result) => {
          if (!result.err) {
              this.props.dispatch({type:'LOAD_USER', payload:result.theUser})
              this.props.dispatch({type:'LOAD_IS_AUTHENTICATED', payload:true})
          } else if (result.err.toString() === "TypeError: Failed to fetch") {
            this.notifyErrorMessage( "Verify that your internet connection is active" );
          } else if(result.err.toString()==='Failed to authenticate token') 
          this.notifySuccessMessage('Welcome to CPCOnline')
          else this.notifyErrorMessage(result.err.toString());
        })
        .catch((err) => {
          console.log(err)
            // if (err.toString() === "TypeError: Failed to fetch") {
            //     this.notifyErrorMessage("Verify that your internet connection is active");
            // } else if(err.toString()==='Failed to authenticate token') this.notifyErrorMessage('User not authenticated')
            // else this.notifyErrorMessage(err.toString());
        });
    }
  }

  notifyErrorMessage(message){return toast.error(message)}
  notifySuccessMessage(message){return toast.success(message)}

  patientLinks=()=>{
    if(this.props.isAuthenticated && this.props.user.roleUser==='patient'){
        return (
          <React.Fragment>
            <NavLink to="/demand" activeClassName="selectedLink"> Request Exam </NavLink>
            <NavLink to="/result" activeClassName="selectedLink"> consult Results </NavLink>
            <NavLink to="/awaitConfirmation" activeClassName="selectedLink"> Pending Confirmation </NavLink>
            <NavLink to="/awaitCompletion" activeClassName="selectedLink"> Pending Completion </NavLink>
            <NavLink to="/awaitPayment" activeClassName="selectedLink"> Pending Payment </NavLink>
          </React.Fragment>
        );
    }
  }

  partnerLinks=()=>{
      if(this.props.isAuthenticated && this.props.user.roleUser==='partner'){
          return (
            <React.Fragment>
              <NavLink to="/demand" activeClassName="selectedLink"> Request Exam </NavLink>
              <NavLink to="/result" activeClassName="selectedLink"> consult Results </NavLink>
              <NavLink to="/awaitConfirmation" activeClassName="selectedLink"> Pending Confirmation </NavLink>
            </React.Fragment>
          );
      }
  }

  visitorLinks=()=>{
      if(this.props.isAuthenticated && this.props.user.roleUser==='visitor')
      return <NavLink to="/demand" activeClassName="selectedLink"> Request Exam </NavLink>
  }

  adminLinks=()=>{
      if(this.props.isAuthenticated && this.props.user.roleUser === 'admin'){
          return(
              <React.Fragment>
                <NavLink to="/createUser" activeClassName="selectedLink"> Create Users </NavLink>
                <NavLink to="/manageUsers" activeClassName="selectedLink"> Manage Users </NavLink>
                <NavLink to="/createExamCategory" activeClassName="selectedLink"> Exam Category </NavLink>
                <NavLink to="/createExam" activeClassName="selectedLink"> Create Exams </NavLink>
                <NavLink to="/manageExams" activeClassName="selectedLink"> Manage Exams </NavLink>
              </React.Fragment>
          )
        }
      }
      
  operatorLinks=()=>{
    if(this.props.isAuthenticated && this.props.user.roleUser==='operator'){
      return(
        <React.Fragment>
          <NavLink to="/uploadResults" activeClassName="selectedLink"> Upload Results </NavLink>
          <NavLink to="/specialResult" activeClassName="selectedLink"> Special Results </NavLink>
          <NavLink to="/confirmDemands" activeClassName="selectedLink"> Confirm Requests </NavLink>
          <NavLink to="/completeDemand" activeClassName="selectedLink"> Complete Requests </NavLink>
        </React.Fragment>
      )
    }
  }

  logOut=()=>{
    let userToken = localStorage.getItem('userToken')
    if(userToken !== null && parseJwt(userToken).idUser !== undefined ){
      fetch('http://localhost:4000/api/auth/logout',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({idUser:parseJwt(userToken).idUser})
      }).then(data=>data.json())
      .then(result=>{
        if(!result.err){
          if(result.log){
            localStorage.setItem('userToken','')
            window.location.replace('/')
            this.props.dispatch({type:'LOAD_IS_AUTHENTICATED', payload:false})
            this.props.dispatch({type:'LOAD_USER', payload:{}})
          }else this.notifyErrorMessage("The db response is abnormal")
        }else if (result.err.toString() === "TypeError: Failed to fetch") {
          this.notifyErrorMessage( "Verify that your internet connection is active" );
        } else this.notifyErrorMessage(result.err.toString());
      })
      .catch(err=>{
        if (err.toString() === "TypeError: Failed to fetch") {
          this.notifyErrorMessage( "Verify that your internet connection is active" );
        }else this.notifyErrorMessage(err.toString());
      })
    }
  }

  render(){
    return (
      <div className="empty-nav">
        <Link to={this.props.isAuthenticated?'/home':'/'}><img src={logo} alt="logo" style={{ width: 61, height: 51 }} /></Link>
        <div className="theLinks">
          {this.patientLinks()}
          {this.partnerLinks()}
          {this.visitorLinks()}
          {this.adminLinks()}
          {this.operatorLinks()}
          {this.props.isAuthenticated?<Link to='#' onClick={this.logOut}>Log out</Link>:null}
        </div>
      </div>
    )
  }
}


const mapStateToProps = state =>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(EmptyNav)