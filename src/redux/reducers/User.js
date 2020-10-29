const initState = {
    user:{
        phoneUser:693256789,
        firstNameUser: 'Kouatchoua Tchakoumi',
        dateOfBirthUser: '1999-03-27',
        genderUser:'M',
        lastNameUser:"Lorrain",
        roleUser:'admin',
        emailUser:'ltchakoumi@outlook.com'
    }
}

const userReducer = (state=initState, action) =>{
    switch(action.types){
        case 'LOAD_USER':
            return {...state, user:[action.payload]}
        default:
            return state
    }
}

export default userReducer