const initState = {
    user:{
        phoneUser:'',
        firstNameUser: '',
        dateOfBirthUser: '',
        genderUser:'',
        lastNameUser:'',
        roleUser:'',
        emailUser:''
    }
}

const userReducer = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_USER':
            return { ...state, user: action.payload }
        default:
            return state
    }
}

export default userReducer