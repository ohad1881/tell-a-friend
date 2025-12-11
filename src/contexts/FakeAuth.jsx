import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = { user: null, isAuthenticated: false, howManyRated: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload.user,
        howManyRated: action.payload.howManyRated,
        isAuthenticated: true,
      };
    case "incrementRated":
      return {
        ...state,
        howManyRated: state.howManyRated + 1,
      };
    case "logout":
      return { user: null, isAuthenticated: false, howManyRated: 0 };
    default:
      throw new Error("unknown action");
  }
}

const FAKE_USER = {
  name: "ohad",
  email: "123@123",
  password: "123",
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function login(email, password) {
    if (email !== FAKE_USER.email || password !== FAKE_USER.password)
      return false;

    try {
      const res = await fetch(
        `http://localhost:3001/howManyRated?email=${email}`
      );
      const data = await res.json();

      dispatch({
        type: "login",
        payload: {
          user: FAKE_USER,
          howManyRated: data.how_many ?? 0,
        },
      });
    } catch (err) {
      console.error("Failed loading rated count:", err);

      dispatch({
        type: "login",
        payload: {
          user: FAKE_USER,
          howManyRated: 0,
        },
      });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  function incrementRated() {
    dispatch({ type: "incrementRated" });
  }
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        howManyRated: state.howManyRated,
        login,
        logout,
        incrementRated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("used outside");
  return context;
}

export { AuthProvider, useAuth };
