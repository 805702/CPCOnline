const initState = {
  toPay: [],
};

const toPay = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_TO_PAY":
      return { ...state, toPay: action.payload };
    default:
      return state;
  }
};

export default toPay;
