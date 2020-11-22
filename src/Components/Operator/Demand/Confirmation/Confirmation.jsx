import React, { Component } from 'react'
import { connect } from 'react-redux';
import Confirm from './Confirm/Confirm'
import { ToastContainer, toast } from 'react-toastify';
import GINConfirm from './GINConfirm/GINConfirm'
import 'react-toastify/dist/ReactToastify.css';

class Confirmation extends Component {
  state = {
    SIN: "",
    searchValue:''
  };

  notifyErrorMessage = (message) => toast.error(message);

  componentDidMount() {
    // load data into the medicalExamDemand redux state
    let userToken = localStorage.getItem("userToken");
    if(userToken!==null){
      fetch("http://localhost:4000/api/auth/validateToken", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken }),
      })
        .then((data) => data.json())
        .then((result) => {
          if (!result.err) {
            this.props.dispatch({ type: "LOAD_USER", payload: result.theUser });
            this.props.dispatch({type: "LOAD_IS_AUTHENTICATED",payload: true,});

            const {roleUser} = this.props.user
            if(this.props.isAuthenticated && roleUser==='operator'){
                fetch("http://localhost:4000/api/demand/confirmDemands", {
                method: "get",
                headers: { "Content-Type": "application/json" },
                })
                .then((data) => data.json())
                .then((result) => {
                    this.props.dispatch({
                    type: "LOAD_MEDICAL_EXAM_DEMAND",
                    payload: result.toConfirm,
                    });
                })
                .catch((err) => {
                    if (err.toString() === "TypeError: Failed to fetch")
                    this.notifyErrorMessage(
                        "Verify that your internet connection is active"
                    );
                    else this.notifyErrorMessage(err.toString());
                });
            }else this.notifyErrorMessage("Wrong login credentials. Login as an Operator")
          } else if (!result.theUser)
            this.notifyErrorMessage("No user found with given credentials");
          else if (result.err.toString() === "TypeError: Failed to fetch")
            this.notifyErrorMessage(
              "Verify that your internet connection is active"
            );
          else if (result.err.toString() === "Failed to authenticate token")
            this.notifyErrorMessage("User not authenticated");
          else this.notifyErrorMessage(result.err.toString());
        })
        .catch((err) => {
          if (err.toString() === "TypeError: Failed to fetch")
            this.notifyErrorMessage(
              "Verify that your internet connection is active"
            );
          else if (err.toString() === "Failed to authenticate token")
            this.notifyErrorMessage("User not authenticated");
          else this.notifyErrorMessage(err.toString());
        });
    }
  }

  handleBack = () => {
    this.setState({ SIN: "" });
  };

  handleSearchChange=e=>{
    this.setState({searchValue:e.target.value})
  }

  handleDemandClick = (SIN) => {
    // fetch('http://localhost:4000/api/demand/treatDemand',{
    //     body:JSON.stringify({SIN}),
    //     headers:{'Content-Type':'application/json'},
    //     method:'post'
    // }).then(data=>data.json)
    // .then(result=>{
    this.setState({ SIN });
    // })
    // .catch(err=>console.log(err))
  };

  render() {
    return (
      <div className='confirmation'>
        <ToastContainer />
        {this.state.SIN !== "" ? (
          <GINConfirm
            SIN={this.state.SIN}
            onBack={this.handleBack}
            dispatch={this.props.dispatch}
          />
        ) : (
          <Confirm
            dispatch={this.props.dispatch}
            onNext={this.handleDemandClick}
            handleSearchChange={this.handleSearchChange}
            searchValue={this.state.searchValue}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps=state=>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(Confirmation)