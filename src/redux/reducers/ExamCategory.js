const initState = {
  examCategory: [
    // {idExamCategory, nameExamCategory}
  ],
};

const examCategory = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_EXAM_CATEGORY":
      return { ...state, examCategory: action.payload };
    default:
      return state;
  }
};

export default examCategory;
