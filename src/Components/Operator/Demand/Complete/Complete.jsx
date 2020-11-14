import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextDemand from '../../../Patient/RequestEstimate/Demand/TextDemand/TextDemand'

class Complete extends Component {
    state={
        demandExams:[]
    }

    componentDidMount(){
    }

    render() {
        return (
          <div>
            <TextDemand selectedExams={this.state.demandExams} />
          </div>
        );
    }
}

const mapStateToProps=state=>{
    return{
        // complete:state.Complete.complete,
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(Complete)