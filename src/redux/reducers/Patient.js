const initState = {
    patient:{
        phoneUser:1,
        firstNameUser: '',
        dateOfBirthUser: '',
        genderUser:'',
        lastNameUser:'',
    }
}

const patientReducer = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_PATIENT':
            return { ...state, patient: action.payload }
        default:
            return state
    }
}

export default patientReducer