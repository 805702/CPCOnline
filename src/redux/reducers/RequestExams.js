const initState = {
    requestExams:[
        {nameExamination:'Crachat'},
        {nameExamination:'Fufu'},
        {nameExamination:'Kazal'},
    ]
}

const requestExamsReducer = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_REQUEST_EXAM':
            return { ...state, requestExams: action.payload }
        default:
            return state
    }
}

export default requestExamsReducer