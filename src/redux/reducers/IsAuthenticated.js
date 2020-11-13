const initState = {
  isAuthenticated: false
};

const isAuthenticatedReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_IS_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
};

export default isAuthenticatedReducer;
