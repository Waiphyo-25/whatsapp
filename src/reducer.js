export const initialState = {
  user: null, //not being login
};

export const actionTypes = {
  SET_USER: "SET_USER", //when we sign in
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state, //keep everything that was already in there
        user: action.user, //dispatch
      };
    default:
      return state;
  }
};
export default reducer;
