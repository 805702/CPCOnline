const initState = {
  toComplete: [],
};

const toComplete = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_TO_COMPLETE":
      return { ...state, toComplete: action.payload };
    case "REMOVE_A_TO_COMPLETE":
      let newList = state.toComplete.filter(_=>_.SIN!==action.payload)
      return{...state, toComplete:newList}
    default:
      return state;
  }
};

export default toComplete;