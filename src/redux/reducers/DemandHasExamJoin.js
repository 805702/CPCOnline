const initState = {
  demandHasExamJoin: [
    // {
    //     idMedExamDemandExamination:178,
    //     idMedicalExamDemand:220,
    //     nameExamination:"Crachat",
    //     daysToResult:3,
    //     bValue:15,
    //     GIN:"72365489",
    //     resultRef(pin):"https://res.cloudinary.com/lorrain/image/upload/v1605011935/utwklvlaydo5xc6z0bh5.pdf",
    //     dateCreated:"2020-11-05T11:24:04.000Z"
    // }
  ],
};

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