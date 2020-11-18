import React, { Component } from 'react'
import { connect } from 'react-redux'
import BarLoader from "react-bar-loader";
import { ToastContainer, toast } from "react-toastify";
import parseJwt from '../../../../utils/parseJwt'
import TextDemand from '../../../Patient/RequestEstimate/Demand/TextDemand/TextDemand'

class Complete extends Component {
    state={
        SIN:'',
        submitting:false
    }

    NotifyOperationFailed(message){
        return toast.error(message)
    }
    
    NotifyOperationSucces(message){
        return toast.success(message)
    }

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
                if(this.props.user.roleUser==='operator')
                fetch('http://localhost:4000/api/demand/getDemandsToComplete',{
                    method:'get',
                    headers:{'Content-Type':'application/json'}
                }).then(data=>data.json())
                .then(result=>{
                    if(!result.err){
                        if(result.dbRes) this.props.dispatch({type:'LOAD_TO_COMPLETE', payload:result.dbRes})
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
            else if ( result.err.toString() === "TypeError: Failed to fetch") { 
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

    styleDemandImages=()=>{
        if(this.state.SIN!==''){
            let images = this.props.toComplete.filter(_=>_.SIN===this.state.SIN)
            return images.map((image,_)=><img key={_} src={`http://localhost:4000/static/${image.imageRef}`} alt='demand' />)
        }
        return("No demand selected")
    }

    styleToCompleteDemands=()=>{
        const singleSIN =[]
        this.props.toComplete.forEach(_=> {
            let test = singleSIN.find(__=>__.SIN===_.SIN)
            if(test === undefined)singleSIN.push({SIN:_.SIN, dateCreated:_.dateCreated})
        });
        return singleSIN.map(aDemand=>{
            return <div className="a-to-complete-dmd" key={aDemand.SIN} onClick={()=>this.setState({SIN:aDemand.SIN})}>
                <i className="a-to-complete-dmd-data">{aDemand.SIN}</i>
                <i className="a-to-complete-dmd-data">{new Date(aDemand.dateCreated).toUTCString().split(' G')[0]}</i>
            </div>
        }
        )
    }

    handleTextNext=(method, data, third)=>{
        // console.log('data: ', data)
        if(this.state.SIN!==''){
            this.setState({submitting:true},()=>{
                let total = 0;
                data.forEach((_) => (total += _.bValue * 105));
                const demandExams = data.map((_) => _.idExamination);
                let token = localStorage.getItem("userToken");
                let userId = parseJwt(token).idUser;
                fetch('http://localhost:4000/api/demand/completeDemand',{
                    method:'post',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        SIN:this.state.SIN,
                        completedBy: userId,
                        examIdList:demandExams,
                        demandAmount: total
                    })
                }).then(data=>data.json())
                .then(result=>{
                    if(!result.err){
                        if(result.res){
                            this.props.dispatch({type:'REMOVE_A_TO_COMPLETE', payload:this.state.SIN})
                            this.NotifyOperationSucces("The demand was completed successfully")
                            this.setState({SIN:''})
                        }else this.NotifyOperationFailed("The database result is not normal")
                    }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                    else this.NotifyOperationFailed(result.err.toString())

                    this.setState({submitting:false})
                })
                .catch((err) => {
                    if (err.toString() === "TypeError: Failed to fetch") 
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                    else this.NotifyOperationFailed(err.toString());
                    this.setState({submitting:false})
                });        
            })
        }else this.NotifyOperationFailed("You've opened no demand")
    }

    render() {
        const token = localStorage.getItem("userToken");
        return (token !== null && parseJwt(token).idUser !== undefined && this.props.isAuthenticated && this.props.user.roleUser==='operator')?
        (
          <div>
            {this.styleToCompleteDemands()}
            {this.styleDemandImages()}
            {this.state.submitting ? <BarLoader color="#0D9D0A" height="5" /> : null}
            <TextDemand
              selectedExams={[]}
              onNext={this.handleTextNext}
              complete={true}
            />
            <ToastContainer />
          </div>
        ):<span>Invalid User Sign in to get acces to this page.</span>
    }
}

const mapStateToProps=state=>{
    return{
        toComplete:state.ToComplete.toComplete,
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(Complete)