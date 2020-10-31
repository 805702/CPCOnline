const initState = {
    demandHasExamJoin:[]
}

const demandHasExamJoinReducer =(state=initState, action)=>{
    switch(action.type){
        case 'LOAD_DEMAND_HAS_EXAM_JOIN':
            return {...state, demandHasExamJoin:action.payload}
        case 'CREATE_DEMAND_HAS_EXAM_JOIN':
            return {...state, demandHasExamJoin:[...state.demandHasExamJoin, action.payload]}
        default:
            return state
    }
}

export default demandHasExamJoinReducer