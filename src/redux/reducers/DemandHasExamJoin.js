const initState = {
    demandHasExamJoin:[
        {
            idMedExamDemandExamination:1,
            idMedicalExamDemand:1,
            nameExamination:'Nasal',
            bValue: 75,
            daysToResult:1,
            GIN:1,
            dateCreated:'2020-06-13',
        },
        {
            idMedExamDemandExamination:2,
            idMedicalExamDemand:1,
            nameExamination:'Nasal',
            bValue: 75,
            daysToResult:1,
            GIN:1,
            dateCreated:'2020-06-13',
        },
        {
            idMedExamDemandExamination:3,
            idMedicalExamDemand:1,
            nameExamination:'Masal',
            bValue: 75,
            daysToResult:1,
            GIN:2,
            dateCreated:'2020-07-13',
        },
        {
            idMedExamDemandExamination:4,
            idMedicalExamDemand:1,
            nameExamination:'Kasal',
            bValue: 75,
            daysToResult:1,
            GIN:3,
            dateCreated:'2020-10-26',
        },
        {
            idMedExamDemandExamination:5,
            idMedicalExamDemand:1,
            nameExamination:'Rasal',
            bValue: 75,
            daysToResult:1,
            GIN:4,
            dateCreated:'2020-07-10',
        },
    ]
}

const demandHasExamJoinReducer =(state=initState, action)=>{
    switch(action.types){
        case 'LOAD_DEMAND_HAS_EXAM_JOIN':
            return {...state, demandHasExamJoin:[action.payload]}
        case 'CREATE_DEMAND_HAS_EXAM_JOIN':
            return {...state, demandHasExamJoin:[...state.demandHasExamJoin, action.payload]}
        default:
            return state
    }
}

export default demandHasExamJoinReducer