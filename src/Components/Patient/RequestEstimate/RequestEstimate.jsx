import React, { Component } from 'react'
import { connect } from 'react-redux'
import Block from '../../../Global/Block/Block'
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
        selectExams:[],
        medPersonnel:{name:'', title:''},
        step:'exams',

        status:'',
        SIN:''
    }
    /**
     * exams: select exam either by text or image method
     * iden: enter the indentificaiton information
     * med: enter med personnel data
     * validate: validate and confirm request (only for text entryMethod)
     */
    componentDidMount(){
        if(this.props.user.roleUser !=="" && this.props.user.roleUser!=='visitor'){
            const identification ={
                phone: this.props.user.phoneUser,
                fname: this.props.user.firstNameUser,
                lname: this.props.user.lastNameUser,
                dob: this.props.user.dateOfBirthUser,
                gender: this.props.user.genderUser.toUpperCase(),
                email: this.props.user.emailUser
            }
            this.setState({identification})
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
        if(third){
            this.setState({step:'confirm', status:false})
        }else{
            switch(method){
                case 'next':
                    switch(this.state.step){
                        case 'exams':
                            let step=''
                            if(this.props.user.roleUser !=="" && this.props.user.roleUser!=='visitor'){
                                step='med'
                            }else step='iden'
                            if(this.state.entryMethod==='text')return this.setState({selectExams:data, step:step})
                            else return this.setState({step:step, images:data})
                        case 'iden':
                            return this.setState({step:'med', identification:data})
                        case 'med':
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
                            if(this.props.user.roleUser !=="" && this.props.user.roleUser!=='visitor'){
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
        return(
            <div className="entry-method-container">
                {this.props.user.roleUser==='visitor' || this.props.user.roleUser==='patient' || this.props.user.roleUser===undefined
                ?<div className="entry-method-tab">
                    <i className={`fa fa-pencil entry-mthd-tab-elmt ${this.state.entryMethod==='text'?'active-entry-method':''}`} onClick={()=>this.changeEntryMethod('text')} />
                    <i className={`fa fa-camera-retro entry-mthd-tab-elmt ${this.state.entryMethod==='image'?'active-entry-method':''}`} onClick={()=>this.changeEntryMethod('image')} />
                </div>:null}

                <div className="entry-method-holder">
                    {this.state.entryMethod==='text'?<TextDemand onNext={this.handleNextBtn} selectedExams={this.state.selectExams} />:null}
                    {this.state.entryMethod==='image' && (this.props.user.roleUser==='visitor' || this.props.user.roleUser==='patient' || this.props.user.roleUser===undefined)
                    ?<ImageDemand onNext={this.handleNextBtn} images={this.state.images} />:null}
                </div>
            </div>
        )
    }

    render() {
        return (
            <ComponentMould>
                {this.state.step!=='confirm'?<Block pageName='Complete Your Request' message={this.blockMessage()} />:null}
                {this.state.step==='exams'?this.examSelection():null}
                {this.state.step==='iden'?<Identification onNext={this.handleNextBtn} identification={this.state.identification} token={localStorage.getItem('userToken')} />:null}
                {this.state.step==='validate'?
                    <Validation
                        identification={this.state.identification}
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
                        images={this.state.images}
                        entryMethod={this.state.entryMethod}
                        medPersonnel={this.state.medPersonnel}
                    />
                    :null
                }
                { this.state.step==='confirm'? <Confirmation status={this.state.status} SIN={this.state.SIN} />:null }
            </ComponentMould>
        )
    }
}

const mapStateToProps=state=>{
    return{
        user: state.User.user
    }
}

export default connect(mapStateToProps)(RequestEstimate)