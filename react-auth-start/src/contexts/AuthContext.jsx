import { createContext, useContext, useReducer } from "react";

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, getInitialAuthState());

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}

function setTokensToLocalStorage({ accessToken, refreshToken }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function removeTokensFromLocalStorage(){
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function authReducer(authState, action) {
  switch (action.type) {
    case "login": {
      setTokensToLocalStorage(action.tokens);
      return {
        ...authState,
        accessToken: action.tokens.accessToken,
        refreshToken: action.tokens.refreshToken,
        loggedIn: !!action.tokens.accessToken,
      };
    }
    case "logout": {
      removeTokensFromLocalStorage();
      return {
        ...authState,
        accessToken: null,
        refreshToken: null,
        loggedIn: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function getInitialAuthState() {
  const accessToken = localStorage.getItem("accessToken") || null;
  const refreshToken = localStorage.getItem("refreshToken") || null;
  const loggedIn = !!accessToken;
  return {
    accessToken,
    refreshToken,
    loggedIn,
  };
}
