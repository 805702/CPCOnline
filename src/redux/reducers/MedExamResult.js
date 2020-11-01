const initState = {
    medExamResult:[]
}

const medExamResultReducer =(state=initState, action)=>{
    switch(action.type){
        case 'LOAD_MED_EXAM_RESULT':
            return {...state, medExamResult:action.payload}
        case 'CREATE_MED_EXAM_RESULT':
            return {...state, medExamResult:[...state.medExamResult, action.payload]}
        default:
            return state
    }
}

export default medExamResultReducer