const initState = {
    medExamResult:[
        // {
        //     idMedicalExamResult:37, 
        //     resultRef:"https://res.cloudinary.com/lorrain/image/upload/v1605011935/utwklvlaydo5xc6z0bh5.pdf",    
        //     receptionStatus:"pending",  
        //     initialDueDate:"2020-11-08T00:00:00.000Z",    
        //     dueDate:"2020-11-07T10:38:03.000Z", 
        //     dateUploaded:null,   
        //     uploadedBy:23, 
        //     idMedExamDemandExamination:178
        // }
    ]
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