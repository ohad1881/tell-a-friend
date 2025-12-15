import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  user: null,
  username: null,
  isAuthenticated: false,
  howManyRated: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload.user,
        username: action.payload.username,
        howManyRated: action.payload.howManyRated,
        isAuthenticated: true,
      };
    case "incrementRated":
      return {
        ...state,
        howManyRated: state.howManyRated + 1,
      };
    case "logout":
      return {
        user: null,
        username: null,
        isAuthenticated: false,
        howManyRated: 0,
      };
    default:
      throw new Error("unknown action");
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function login(email, password) {
    try {
      const res = await fetch(
        `http://localhost:3001/login?email=${email}&password=${password}`
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return false;
      }

      const ratedRes = await fetch(
        `http://localhost:3001/howManyRated?email=${email}`
      );

      const ratedData = await ratedRes.json();
      const howMany = ratedData.how_many ?? 0;

      dispatch({
        type: "login",
        payload: {
          user: data.user,
          username: data.username,
          howManyRated: howMany,
        },
      });

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
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
        username: state.username,
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
