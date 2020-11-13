import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import Block from '../../../Global/Block/Block'
import 'react-toastify/dist/ReactToastify.css';
import ComponentMould from '../../../Global/ComponentMould/ComponentMould'
import Identification from './Identification/Identification'
import Validation from '../Validation/Validation'
import ImageDemand from './Demand/ImageDemand/ImageDemand'
import TextDemand from './Demand/TextDemand/TextDemand'
import './RequestEstimate.css'
import MedPersonnel from './MedPersonnel/MedPersonnel'
import Confirmation from '../Confirmation/Confirmation'

class RequestEstimate extends Component {
    state={
        entryMethod:'text',
        identification:{
            phone: "",
            fname: "",
            lname: "",
            dob: "",
            gender: "M",
            email: "",
        },
        images:[],
        binary_images:[],
        selectExams:[],
        medPersonnel:{name:'', title:''},
        step:'exams',

        status:'',
        SIN:''
    }

    notifyErrorMessage = (message) => toast.error(message);

    /**
     * exams: select exam either by text or image method
     * iden: enter the indentificaiton information
     * med: enter med personnel data
     * validate: validate and confirm request (only for text entryMethod)
     */
    componentDidMount(){
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
                this.props.dispatch({ type: "LOAD_USER", payload: result.theUser, });
                this.props.dispatch({ type: "LOAD_IS_AUTHENTICATED", payload: true, });
                const { roleUser, phoneUser, firstNameUser, lastNameUser, dateOfBirthUser, genderUser, emailUser } = this.props.user;
                const notWanted = ["visitor", "partner"];
                if ( this.props.isAuthenticated && !notWanted.includes(roleUser)) {
                    const identification = {
                        phone: phoneUser,
                        fname: firstNameUser,
                        lname: lastNameUser,
                        dob: dateOfBirthUser,
                        gender: genderUser.toUpperCase(),
                        email: emailUser,
                    };
                    this.setState({ identification });
                }
              } else if(!result.theUser)this.notifyErrorMessage('No user found with given credentials')
              else if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
                this.notifyErrorMessage( "Verify that your internet connection is active" ); 
                } else if ( result.err.toString() === "Failed to authenticate token" ) this.notifyErrorMessage("User not authenticated");
              else this.notifyErrorMessage(result.err.toString());
            })
            .catch((err) => {
              if (err.toString() === "TypeError: Failed to fetch") {
                this.notifyErrorMessage( "Verify that your internet connection is active" );
              } else if (err.toString() === "Failed to authenticate token") this.notifyErrorMessage("User not authenticated");
              else this.notifyErrorMessage(err.toString());
            });
        }
    }

    blockMessage=()=>{
        switch(this.state.step){
            case 'exams':
                return 'Select the exams you wish'
            case 'iden':
                return 'Enter your identification information'
            case 'med':
                return "Enter your doctor's information"
            case 'validate':
                return 'Validate your request'
            default: return ''
        }
    }

    changeEntryMethod=(entryMethod)=>this.setState({entryMethod})

    handleNextBtn=(method,data, third)=>{
        if(third===true){
            this.setState({step:'confirm', status:false})
        }else{
            const isAuthenticated = this.props.isAuthenticated
            const {roleUser} = this.props.user
            const notWanted = ['visitor', 'partner']
            switch(method){
                case 'next':
                    switch(this.state.step){
                        case 'exams':
                            let step=''
                            if(isAuthenticated && !notWanted.includes(roleUser)){
                                step='med'
                            }else step='iden'
                            if(this.state.entryMethod==='text')return this.setState({selectExams:data, step:step})
                            else return this.setState({ step:step, images:data, binary_images:third })
                        case 'iden':
                            return this.setState({step:'med', identification:data})
                        case 'med':
                            if(this.state.entryMethod==='image'){
                                return this.setState({step:'confirm', SIN:data.SIN, status:data.status})
                            }
                            return this.setState({step:'validate', medPersonnel:data})
                        case 'validate':
                            return this.setState({step:'confirm', SIN:data.SIN, status:data.status})
                        default: return ''
                    }
                case 'back':
                    switch(this.state.step){
                        case 'iden':
                            return this.setState({step:'exams', identification:data})
                        case 'med':
                            let step=''
                            if(isAuthenticated && !notWanted.includes(roleUser)){
                                step='exams'
                            }else step='iden'

                            return this.setState({step:step, medPersonnel:data})
                        case 'validate':
                            return this.setState({step:'med'})
                        default: return ''
                    }
                default:return ''
            }
        }
    }

    examSelection=()=>{
        const wanted=['visitor', 'patient']
        const {roleUser} = this.props.user
        let isAuthenticated = this.props.isAuthenticated
        return(
            <div className="entry-method-container">
                {isAuthenticated && wanted.includes(roleUser)
                ?<div className="entry-method-tab">
                    <i className={`fa fa-pencil entry-mthd-tab-elmt ${this.state.entryMethod==='text'?'active-entry-method':''}`} onClick={()=>this.changeEntryMethod('text')} />
                    <i className={`fa fa-camera-retro entry-mthd-tab-elmt ${this.state.entryMethod==='image'?'active-entry-method':''}`} onClick={()=>this.changeEntryMethod('image')} />
                </div>:null}

                <div className="entry-method-holder">
                    {this.state.entryMethod==='text'?<TextDemand onNext={this.handleNextBtn} selectedExams={this.state.selectExams} />:null}
                    {this.state.entryMethod==='image' && (isAuthenticated && wanted.includes(roleUser))
                    ?<ImageDemand onNext={this.handleNextBtn} images={this.state.images} binary_images={this.state.binary_images} />:null}
                </div>
            </div>
        )
    }

    render() {
        const notWanted = ["visitor", "partner"];
        const {roleUser}=this.props.user
        const identification = {
        phone: this.props.user.phoneUser,
        fname: this.props.user.firstNameUser,
        lname: this.props.user.lastNameUser,
        dob: this.props.user.dateOfBirthUser,
        gender: this.props.user.genderUser!==undefined?this.props.user.genderUser.toUpperCase():this.props.user.genderUser,
        email: this.props.user.emailUser,
        };
        return (
            <ComponentMould>
                {this.state.step!=='confirm'?<Block pageName='Complete Your Request' message={this.blockMessage()} />:null}
                {this.state.step==='exams'?this.examSelection():null}
                {this.state.step==='iden'?<Identification onNext={this.handleNextBtn} identification={this.state.identification} token={localStorage.getItem('userToken')} />:null}
                {this.state.step==='validate'?
                    <Validation
                        identification={this.props.isAuthenticated && !notWanted.includes(roleUser)?identification:this.state.identification}
                        selectedExams={this.state.selectExams}
                        medPersonnel={this.state.medPersonnel}
                        entryMethod={this.state.entryMethod}
                        onNext={this.handleNextBtn}
                    />
                    :null
                }
                {this.state.step==='med'?
                    <MedPersonnel
                        onNext={this.handleNextBtn}
                        identification={this.state.identification}
                        images={this.state.binary_images}
                        entryMethod={this.state.entryMethod}
                        medPersonnel={this.state.medPersonnel}
                    />
                    :null
                }
                { this.state.step==='confirm'? <Confirmation status={this.state.status} SIN={this.state.SIN} entryMethod={this.state.entryMethod} />:null }
                <ToastContainer />
            </ComponentMould>
        )
    }
}

const mapStateToProps=state=>{
    return{
        user: state.User.user,
        isAuthenticated: state.IsAuthenticated.isAuthenticated
    }
}

export default connect(mapStateToProps)(RequestEstimate)