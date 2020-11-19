import React,{Component} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import HomeLink from './HomeLink/HomeLink';
import './Home.css'

class Home extends Component {
  notifyErrorMessage = (message) => toast.error(message);

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
            this.notifyErrorMessage(
              "Verify that your internet connection is active"
            );
          } else if(result.err.toString()==='Failed to authenticate token') this.notifyErrorMessage('User not authenticated')
          else this.notifyErrorMessage(result.err.toString());
        })
        .catch((err) => {
            if (err.toString() === "TypeError: Failed to fetch") {
                this.notifyErrorMessage("Verify that your internet connection is active");
            } else if(err.toString()==='Failed to authenticate token') this.notifyErrorMessage('User not authenticated')
            else this.notifyErrorMessage(err.toString());
        });
    }
  }

  patientLinks=()=>{
      if(this.props.isAuthenticated && this.props.user.roleUser==='patient'){
          return (
            <React.Fragment>
              <HomeLink to="/demand" linkName="Request Exam" notif={false} />
              <HomeLink to="/result" linkName="Consult results" notif={false} />
              <HomeLink to='/awaitConfirmation' linkName='Pending Confirmation' notif={false} />
              <HomeLink to='/awaitCompletion' linkName='Pending Completion' notif={false} />
              <HomeLink to='/awaitPayment' linkName='Pending Payment' notif={false} />
              {/* <HomeLink to="/home" linkName="Consult history" notif={false} /> */}
            </React.Fragment>
          );
      }
  }

  visitorLinks=()=>{
      if(this.props.isAuthenticated && this.props.user.roleUser==='visitor')
      return <HomeLink to="/demand" linkName="Request Exam" notif={false} />;
  }

  adminLinks=()=>{
      if(this.props.isAuthenticated && this.props.user.roleUser === 'admin'){
          return(
              <React.Fragment>
                <HomeLink to='/demand' linkName='Request Exam' notif={false} />
                <HomeLink to='/createUser' linkName='Create Users' notif={false} />
                <HomeLink to='/manageUsers' linkName='Manage Users' notif={false} />
                <HomeLink to='/createExamCategory' linkName='Exam Category' notif={false} />
                <HomeLink to='/createExam' linkName='Create Exams' notif={false} />
                <HomeLink to='/manageExams' linkName='Manage Exams' notif={false} />
              </React.Fragment>
          )
        }
      }
      
  operatorLinks=()=>{
    if(this.props.isAuthenticated && this.props.user.roleUser==='operator'){
      return(
        <React.Fragment>
          <HomeLink to='/uploadResults' linkName='Upload Results' notif={false} />
          <HomeLink to='/specialResult' linkName='Special Results' notif={false} />
          <HomeLink to='/confirmDemands' linkName='Confirm Requests' notif={false} />
          <HomeLink to='/completeDemand' linkName='Complete Requests' notif={false} />
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <div className="home-container">
        {this.props.isAuthenticated ? (
            <React.Fragment>
                {this.patientLinks()}
                {this.visitorLinks()}
                {this.adminLinks()}
                {this.operatorLinks()}
            </React.Fragment>
        ) : null}
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = state =>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default  connect(mapStateToProps)(Home);