import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { Component} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

import './TextDemand.css';


class TextDemand extends Component {

    state={
        selectedExams:[],
        options:[],
    }
    notifyNoExam =()=>toast.error('Cannot submit an empty list. You must select at least 1 exam')

    onNext=()=>{
        //upload selectedExams
        if(this.state.selectedExams.length!==0)this.props.onNext('next', this.state.selectedExams)
        else this.notifyNoExam()
    }

    componentDidMount=()=>{

        fetch("http://localhost:4000/api/exams/getExams",{
            method:"get",
            headers: {'Content-Type': 'application/json'},
        })
        .then(data=>data.json())
        .then(result=>{
            this.props.dispatch({type:'LOAD_EXAMS', payload:result.exams})
            let exams = this.props.examination.map(exam=>{
                return {...exam, label:exam.nameExamination, value:exam.idExamination}
            })
            exams = exams.sort((a,b)=>a.label.toLowerCase()<b.label.toLowerCase()?-1:1)
            const {selectedExams} = this.props
            exams=exams.filter(anExam=>{
                let ansHolder = selectedExams.find(exam=>exam.idExamination===anExam.idExamination)
                return ansHolder===undefined?true:false
            })
            console.log(exams)
            this.setState({options:exams, selectedExams})
        })
        .catch(err=>{
            // console.log(err)
        })

    }

    onUserChosesExam=(e)=>{
        if(e!==null){
            let options = this.state.options.filter(exam=>exam.idExamination !==e.idExamination)
            let selectedExams = [...this.state.selectedExams, e].sort((a,b)=>a.label.toLowerCase()<b.label.toLowerCase()?-1:1)
            this.setState({options, selectedExams})
        }
    }

    calculateExamListTotal=()=>{
        let total = 0
        this.state.selectedExams.map(exam=>{
            total+=(exam.bValue*105)
            return null
        })

        return total
    }

    onRemoveFromSelectedList=(e)=>{
        const toBeRemovedId = Number(e.target.value)
        if(!isNaN(toBeRemovedId)){
            const toBeRemovedElmt = this.state.selectedExams.find(exam=>exam.idExamination===toBeRemovedId)
            const selectedExams=this.state.selectedExams.filter(exam=>exam.idExamination!==toBeRemovedId)
            let options = [...this.state.options, toBeRemovedElmt].sort((a,b)=>a.label.toLowerCase()<b.label.toLowerCase()?-1:1)
            this.setState({options, selectedExams})
        }
    }

    handleEmptyList=()=>{
        this.setState({})
    }

    displaySelectedExamList=()=>{
        return(
            <div className="demanded-exam-info" id="demanded-exam-info">
                <div className="exm-dmd-tbl-hdr">
                    <input type="checkbox" readOnly defaultChecked />
                    <i>Exam name</i>
                    <i>Price</i>
                </div>
                <Scrollbars className='demand-scrollbar'>
                    {this.state.selectedExams.map(selectedExam=> (
                        <div className="exm-dmd-tbl-row" key={selectedExam.idExamination}>
                            <input type='checkbox' checked={true} onChange={this.onRemoveFromSelectedList} value={selectedExam.idExamination} onClick={this.onRemoveFromSelectedList} />
                            <i>{selectedExam.label}</i>
                            <i>{selectedExam.bValue*105}</i>
                        </div>
                    ))}
                </Scrollbars>
                <div className="exm-dmd-tbl-total">
                    <i>Total</i>
                    <i>{this.calculateExamListTotal()}</i>
                </div>
                <ToastContainer />
            </div>
        )
    }

    render() {

    return (
        <React.Fragment>
            <div className='demand-holder'>
                <div className="demand-upper-frame">
                    <Select
                        className='exam-autocomplete'
                        classNamePrefix='exam-select'
                        defaultValue=''
                        placeholder='Enter an Exam'
                        onChange={this.onUserChosesExam}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name='exam-select'
                        options={this.state.options}
                    />
                </div>

                {this.displaySelectedExamList()}

            </div>
            {this.props.isAuthenticated?<div className="txt-entry-mthd-btns">
                <button type='button' className='btn-cancel' onClick={()=>window.location.assign('/home')}>Cancel</button>
                <button type='submit' className='btn-nxt' onClick={this.onNext}>Next</button>
            </div>:null}
        </React.Fragment>
        )
    }
}

const mapStateToProps = state =>{
    return{
        examination: state.Examination.examinations,
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}


export default connect(mapStateToProps)(TextDemand)
