const initState = {
    medicalExamDemand:[]
}

const medicalExamDemandReducer = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_MEDICAL_EXAM_DEMAND':
            return { ...state, medicalExamDemand: action.payload }
        case 'REMOVE_MEDICAL_EXAM_DEMAND':
            let demands = state.medicalExamDemand.filter(demand=>demand.SIN!==action.payload)
            return {...state, medicalExamDemand:demands}
        default:
            return state
    }
}

export default medicalExamDemandReducer