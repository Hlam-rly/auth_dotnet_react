
export const AuthReducerVariables =
{
  INITIAL_STATE:
  {
    regEmail: "",
    regNickname: "",
    regPassword: "",
    siEmail: "",
    siPassword: ""
  },
  ACTIONS:
  {
    CHANGE_REG_EMAIL: "CHANGE_REG_EMAIL",
    CHANGE_REG_NICKNAME: "CHANGE_REG_NICKNAME",
    CHANGE_REG_PASSWORD: "CHANGE_REG_PASSWORD",
    CHANGE_SI_EMAIL: "CHANGE_SI_EMAIL",
    CHANGE_SI_PASSWORD: "CHANGE_SI_PASSWORD"
  }
}

export const authReducer = (state, action) =>
{
  switch (action.type)
  {
    case AuthReducerVariables.ACTIONS.CHANGE_REG_EMAIL:
    {
        return {
          ...state, regEmail: action.payload
        };
    }
    case AuthReducerVariables.ACTIONS.CHANGE_REG_NICKNAME:
    {
        return {
          ...state, regNickname: action.payload
        };
    }
    case AuthReducerVariables.ACTIONS.CHANGE_REG_PASSWORD:
    {
      return {
        ...state, regPassword: action.payload
      }
    }
    case AuthReducerVariables.ACTIONS.CHANGE_SI_EMAIL:
    {
      return {
        ...state, siEmail: action.payload
      }
    }
    case AuthReducerVariables.ACTIONS.CHANGE_SI_PASSWORD:
    {
      return {
        ...state, siPassword: action.payload
      }
    }
    default:
    {
      return state
    }
  }
}