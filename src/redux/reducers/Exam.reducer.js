const initState ={
    examinations:[]
}

const examReducer =(state=initState, action)=>{
    switch(action.type){
        case 'LOAD_EXAMS':
            return {...state, examinations:action.payload}
        case 'CREATE_EXAM':
            return {...state, examinations:[...state.examinations, action.payload]}
        default:
            return state
    }
}

export default examReducer