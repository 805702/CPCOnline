const initState = {
  personnel: [
    // {
    //   phoneUser: 671455815,
    //   statusUser: "active",
    //   firstNameUser: "Tamen",
    //   dateOfBirthUser: "2020-11-11",
    //   genderUser: "m",
    //   roleUser: "commfi",
    //   emailUser: "lorraintchakoumi@gmail.com",
    //   lastNameUser: "Marceline",
    //   specialData: "17C005",
    // },
  ],
};

const personnel = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_PERSONNEL":
      return { ...state, personnel: action.payload };
    case "DEACTIVATE_USER":
      const theUser = state.personnel.find(user=>user.phoneUser===action.payload)
      let users = state.personnel.filter(user=>user.phoneUser!==action.payload)
      if(theUser !== undefined){
        theUser.statusUser='inactive'
        users.push(theUser)
      }

      return { ...state, personnel:users };
      case 'ACTIVATE_USER':
        const anotherUser = state.personnel.find(user=>user.phoneUser===action.payload)
        let theUsers = state.personnel.filter(user=>user.phoneUser!==action.payload)
        if(anotherUser !== undefined){
          anotherUser.statusUser='active'
          theUsers.push(anotherUser)
        }
  
        return { ...state, personnel:theUsers };

    default:
      return state;
  }
};

export default personnel;
