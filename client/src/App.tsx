import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/Home";
import Auth from "./views/Auth";
import Messages from "./views/Messages";
import DeleteAccount from "./views/DeleteAccount";
import Compose from "./views/Compose";
import { useAuth } from "./components/AuthContext";

function App() {
  const { authState } = useAuth();

  // Routes are protected, unauthorized users redirected to login screen
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/:mode" element={<Auth />} />
      <Route
        path="/compose"
        element={
          authState.isAuthenticated ? (
            <Compose />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/messages"
        element={
          authState.isAuthenticated ? (
            <Messages />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/self-destruct"
        element={
          authState.isAuthenticated ? (
            <DeleteAccount />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
