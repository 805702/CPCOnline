const initState ={
    awaitConfirmation:[

    ]
}

const awaitConfirmation =(state=initState, action)=>{
    switch(action.type){
        case 'LOAD_AWAIT_CONFIRMATION':
            return {...state, awaitConfirmation:action.payload}
        default:
            return state
    }
}

export default awaitConfirmation