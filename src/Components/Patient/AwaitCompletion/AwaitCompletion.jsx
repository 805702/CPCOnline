import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Block from "../../../Global/Block/Block";
import ComponentMould from "../../../Global/ComponentMould/ComponentMould";
import parseJwt from "../../../utils/parseJwt";
import './AwaitCompletion.css'
import { Scrollbars } from "react-custom-scrollbars";


class Complete extends Component {
  state = {
    SIN: "",
    submitting: false,
  };

  NotifyOperationFailed(message) {
    return toast.error(message);
  }

  NotifyOperationSucces(message) {
    return toast.success(message);
  }

  componentDidMount() {
    let userToken = localStorage.getItem("userToken");
    fetch("http://localhost:4000/api/auth/validateToken", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken }),
    })
      .then((data) => data.json())
      .then((result) => {
        if (!result.err) {
            this.props.dispatch({ type: "LOAD_USER", payload: result.theUser });
            this.props.dispatch({ type: "LOAD_IS_AUTHENTICATED", payload: true });
            if(this.props.user.roleUser!=='visitor')
            fetch("http://localhost:4000/api/demand/getPatientToComplete", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({idUser: parseJwt(userToken).idUser})
            })
            .then((data) => data.json())
            .then((result) => {
            if (!result.err) {
                if (result.dbRes)
                this.props.dispatch({
                    type: "LOAD_TO_COMPLETE",
                    payload: result.dbRes,
                });
            } else if ( result.err.toString() === "TypeError: Failed to fetch" )
                this.NotifyOperationFailed( "Verify that your internet connection is active" );
            else this.NotifyOperationFailed(result.err.toString());
            })
            .catch((err) => {
            if (err.toString() === "TypeError: Failed to fetch")
                this.NotifyOperationFailed( "Verify that your internet connection is active" );
            else this.NotifyOperationFailed(err.toString());
            });

        } else if (!result.theUser)
          this.NotifyOperationFailed("No user found with given credentials");
        else if (result.err.toString() === "TypeError: Failed to fetch") {
          this.NotifyOperationFailed(
            "Verify that your internet connection is active"
          );
        } else if (result.err.toString() === "Failed to authenticate token")
          this.NotifyOperationFailed("User not authenticated");
        else this.NotifyOperationFailed(result.err.toString());
      })
      .catch((err) => {
        if (err.toString() === "TypeError: Failed to fetch") {
          this.NotifyOperationFailed(
            "Verify that your internet connection is active"
          );
        } else if (err.toString() === "Failed to authenticate token")
          this.NotifyOperationFailed("User not authenticated");
        else this.NotifyOperationFailed(err.toString());
      });
  }

  styleDemandImages = () => {
    if (this.state.SIN !== "") {
      let images = this.props.toComplete.filter(
        (_) => _.SIN === this.state.SIN
      );
      return images.map((image, _) => (
        <img
          key={_}
          src={`http://localhost:4000/static/${image.imageRef}`}
          alt="demand"
        />
      ));
    }
  };

  handleDemandClick=(SIN)=>{
      if(this.state.SIN===SIN) this.setState({SIN:''})
      else this.setState({SIN})
  }

  styleToCompleteDemands = () => {
    const singleSIN = [];
    this.props.toComplete.forEach((_) => {
      let test = singleSIN.find((__) => __.SIN === _.SIN);
      if (test === undefined)
        singleSIN.push({ SIN: _.SIN, dateCreated: _.dateCreated });
    });
    return singleSIN.map((aDemand) => {
      return (
        this.state.SIN!==aDemand.SIN?<div
          className="a-to-complete-dmd"
          key={aDemand.SIN}
          onClick={() => this.handleDemandClick(aDemand.SIN)}
        >
          <i className="a-to-complete-dmd-data">{aDemand.SIN}</i>
          <i className="a-to-complete-dmd-data">
            {new Date(aDemand.dateCreated).toUTCString().split(" G")[0]}
          </i>
        </div>: <div className="a-to-complete-dmd-imgs">
            <div
            className="a-to-complete-dmd"
            key={aDemand.SIN}
            onClick={() => this.handleDemandClick(aDemand.SIN)}
            >
                <i className="a-to-complete-dmd-data">{aDemand.SIN}</i>
                <i className="a-to-complete-dmd-data">
                {new Date(aDemand.dateCreated).toUTCString().split(" G")[0]}
            </i>
            </div>
            <Scrollbars className='demand-scrollbar' style={{height:230}}>
              <div className="dmd-images">
                {this.styleDemandImages()}
              </div>
            </Scrollbars>
        </div>
      );
    });
  };

  render() {
    const token = localStorage.getItem("userToken");
    return token !== null && parseJwt(token).idUser !== undefined && this.props.isAuthenticated?
    <ComponentMould>
      <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
      <div className='result-body'>
        <div className="a-to-complete-dmd-hdr" >
          <i className="a-to-complete-dmd-data">Demand SIN</i>
          <i className="a-to-complete-dmd-data"> Date Demanded </i>
        </div>
        {this.styleToCompleteDemands()}
        <ToastContainer />
      </div>
    </ComponentMould>:'Unauthenticated user'
  }
}

const mapStateToProps = (state) => {
  return {
    toComplete: state.ToComplete.toComplete,
    isAuthenticated: state.IsAuthenticated.isAuthenticated,
    user: state.User.user,
  };
};

export default connect(mapStateToProps)(Complete);
