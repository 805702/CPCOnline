const initState ={
    examinations:[
        {
            idExamination:1,
            nameExamination:'Nasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:3,
            nameExamination:'asal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:4,
            nameExamination:'casal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:5,
            nameExamination:'dasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:2,
            nameExamination:'basal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:5,
            nameExamination:'Nasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:6,
            nameExamination:'pasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:7,
            idExamCategory:1
        },
        {
            idExamination:8,
            nameExamination:'rasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:9,
            nameExamination:'wasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:10,
            nameExamination:'masal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:11,
            nameExamination:'kasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:7,
            idExamCategory:1
        },
        {
            idExamination:12,
            nameExamination:'hasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:13,
            nameExamination:'uasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        },
        {
            idExamination:14,
            nameExamination:'fasal',
            codeExamination:'EXAM1234',
            bValue:75,
            dateCreated:'2020-10-10 00:00:00',
            statusExamination:'active',
            daysToResult:4,
            idExamCategory:1
        }
    ]
}

const examReducer =(state=initState, action)=>{
    switch(action.types){
        case 'LOAD_EXAMS':
            return {...state, examinations:[action.payload]}
        case 'CREATE_EXAM':
            return {...state, examinations:[...state.examinations, action.payload]}
        default:
            return state
    }
}

export default examReducer