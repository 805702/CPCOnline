const initState = {
    medP:{
        title:'Dr',
        name: 'XX'
    }
}

const medPReducer = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_MED_P':
            return { ...state, medP: action.payload }
        default:
            return state
    }
}

export default medPReducer