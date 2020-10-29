const initState = {
    medExamResult:[
        {
            resultRef:'',
            dueDate:'2020-07-10',
            dateUploaded:'2020-07-10',
            idMedExamDemandExamination:5
        },
        {
            resultRef:'',
            dueDate:'2020-07-10',
            dateUploaded:null,
            idMedExamDemandExamination:4
        },
        {
            resultRef:'',
            dueDate:'2020-07-10',
            dateUploaded:null,
            idMedExamDemandExamination:3
        },
        {
            resultRef:'',
            dueDate:'2020-07-10',
            dateUploaded:null,
            idMedExamDemandExamination:2
        },
        {
            resultRef:'',
            dueDate:'2020-07-10',
            dateUploaded:null,
            idMedExamDemandExamination:1
        },
    ]
}

const medExamResult =(state=initState, action)=>{
    switch(action.types){
        case 'LOAD_MED_EXAM_RESULT':
            return {...state, medExamResult:[action.payload]}
        case 'CREATE_MED_EXAM_RESULT':
            return {...state, medExamResult:[...state.medExamResult, action.payload]}
        default:
            return state
    }
}

export default medExamResult