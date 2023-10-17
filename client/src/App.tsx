import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Auth from "./views/Auth";
import Messages from "./views/Messages";
import DeleteAccount from "./views/DeleteAccount";
import Compose from "./views/Compose";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/compose" element={<Compose />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/self-destruct" element={<DeleteAccount />} />
    </Routes>
  );
}

export default App;
