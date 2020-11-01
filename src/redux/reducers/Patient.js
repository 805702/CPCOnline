const initState = {
    patient:{
        phoneUser:657140183,
        firstNameUser: 'Tchakoumi Kouatchoua',
        dateOfBirthUser: '1999-03-27',
        genderUser:'m',
        lastNameUser:'Lorrain',
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