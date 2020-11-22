const initState = {
    demandResults:[
        // { dueDate:'2020-03-27T00:02:46.000Z', GIN:'12345678', },
        // { dueDate:'2020-03-27T00:02:46.000Z', GIN:'12345698', },
        // { dueDate:'2020-03-27T00:02:46.000Z', GIN:'12545678', },
        // { dueDate:'2020-03-27T00:02:46.000Z', GIN:'12365678', }
    ]
}

const demandResults = (state=initState, action) =>{
    switch(action.type){
        case 'LOAD_DEMAND_RESULTS':
            return { ...state, demandResults: action.payload }
        case 'REMOVE_DEMAND_RESULT':
            let newArr = state.demandResults.filter(_=>_.GIN!==action.payload)
            return { ...state, demandResults: newArr }
        default:
            return state
    }
}

export default demandResults