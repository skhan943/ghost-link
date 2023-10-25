import { createContext, useContext, useReducer, ReactNode } from "react";

// Defining Typescript types

// Represents the current state of authentication
type AuthState = {
  isAuthenticated: boolean;
};

// Defines possible actions that can be dispatched to reducer
type AuthAction = { type: "LOGIN" } | { type: "LOGOUT" };

type AuthProviderProps = { children: ReactNode };

// Authentication context created, will provide the current state and function to login/out
const AuthContext = createContext<
  | {
      authState: AuthState;
      login: () => void;
      logout: () => void;
    }
  | undefined
>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true };
    case "LOGOUT":
      return { isAuthenticated: false };
    default:
      return state;
  }
};

// Provider for the authentication context, takes children (nested components) as a prop
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Manage authentication state, initial value is false
  const [authState, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
  });

  const login = () => {
    dispatch({ type: "LOGIN" });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Makes authentication state and actions available to all child components
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access authentication context and values
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
