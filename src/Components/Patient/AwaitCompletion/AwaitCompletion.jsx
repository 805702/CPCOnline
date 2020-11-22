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
    searchValue:''
  };

  NotifyOperationFailed(message) {
    return toast.error(message);
  }

  NotifyOperationSucces(message) {
    return toast.success(message);
  }

  handleSearchChange=e=>{
    this.setState({searchValue:e.target.value})
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
    let sample = this.props.toComplete
    if(this.state.searchValue !== ''){
      sample = this.props.toComplete.filter(_=>
        _.SIN.includes(this.state.searchValue)
       ) 

    }

    sample.forEach((_) => {
      let test = singleSIN.find((__) => __.SIN === _.SIN);
      if (test === undefined)
        singleSIN.push({ SIN: _.SIN, dateCreated: _.dateCreated });
    });

    if(sample.length!==0){
      return singleSIN.map((aDemand) => {
        return (
          this.state.SIN!==aDemand.SIN?
          <React.Fragment>
            <div className="demand-GIN" key={aDemand.SIN} onClick={()=>this.handleDemandClick(aDemand.SIN)}>
              <div className="demand-GIN-indicator"></div>
              <div className="demand-GIN-data">
                  <span className="demand-GIN-data-group">
                      <i className="demand-GIN-data-label">Demand id:</i>
                      <i className="demand-GIN-data-value">{aDemand.SIN}</i>
                  </span>
                  <span className="demand-GIN-data-group">
                      <i className="demand-GIN-data-label">Demand  date:</i>
                      <i className="demand-GIN-data-value">{new Date(aDemand.dateCreated).toUTCString().split(" G")[0]}</i>
                  </span>
                  <span className="demand-GIN-data-group">
                      <i className="demand-GIN-data-label">Waiting</i>
                      <i className="demand-GIN-data-value">Completion</i>
                  </span>
              </div>
            </div>
          </React.Fragment>
          : 
          <React.Fragment>
            <div className="demand-GIN" key={aDemand.SIN} onClick={()=>this.handleDemandClick(aDemand.SIN)}>
              <div className="demand-GIN-indicator"></div>
              <div className="demand-GIN-data">
                  <span className="demand-GIN-data-group">
                      <i className="demand-GIN-data-label">Demand id:</i>
                      <i className="demand-GIN-data-value">{aDemand.SIN}</i>
                  </span>
                  <span className="demand-GIN-data-group">
                      <i className="demand-GIN-data-label">Demand  date:</i>
                      <i className="demand-GIN-data-value">{new Date(aDemand.dateCreated).toUTCString().split(" G")[0]}</i>
                  </span>
                  <Scrollbars className='demand-scrollbar' style={{height:230}}>
                    <div className="dmd-images">
                      {this.styleDemandImages()}
                    </div>
                  </Scrollbars>
              </div>
            </div>
          </React.Fragment>
        );
      });
    }else{
      return (
        <div className="grouped-demands no-demands">
          <div className="demand-GIN">
              <div className="demand-GIN-indicator"></div>
              <div className="demand-GIN-data">
                  <span className="demand-GIN-data-group">
                      {this.props.toComplete.length===0?<i className="demand-GIN-data-label">You have no demands awaiting completion</i>
                      :<i className="demand-GIN-data-label">You have no demands that match this demand id</i>}
                  </span>
              </div>
          </div>
        </div>
      )
    }
  };

  render() {
    const token = localStorage.getItem("userToken");
    return token !== null && parseJwt(token).idUser !== undefined && this.props.isAuthenticated?
    <ComponentMould>
      <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
      <div className='result-body'>
        <input type='text' placeholder='Search demand id...' onChange={this.handleSearchChange} className='result-search' />
        <Scrollbars style={{height:'69.76vh'}}>
          {this.styleToCompleteDemands()}
        </Scrollbars>
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
