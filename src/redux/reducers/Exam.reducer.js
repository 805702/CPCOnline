const initState ={
    examinations:[]
}

const examReducer =(state=initState, action)=>{
    switch(action.type){
        case 'LOAD_EXAMS':
            return {...state, examinations:action.payload}
        case 'CREATE_EXAM':
            return {...state, examinations:[...state.examinations, action.payload]}
        case 'UPDATE_EXAM':
            let newVal = state.examinations.filter(_=>_.idExamination!==action.payload.idExamination)
            newVal.push(action.payload)
            return{...state, examinations:newVal}
        default:
            return state
    }
}

export default examReducer