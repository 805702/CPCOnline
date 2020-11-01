const initState = {
    medicalExamDemand:[
        {SIN:'12453658', dateCreated:'2020-11-01T10:02:46.0000Z'},
        {SIN:'12453858', dateCreated:'2020-11-01T11:02:46.0000Z'},
        {SIN:'12459858', dateCreated:'2020-10-31T10:02:46.0000Z'},
        {SIN:'12456858', dateCreated:'2020-10-01T10:02:50.0000Z'},
    ]
}

const medicalExamDemandReducer = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_MEDICAL_EXAM_DEMAND':
            return { ...state, medicalExamDemand: action.payload }
        default:
            return state
    }
}

export default medicalExamDemandReducer