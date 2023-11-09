import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Messages = () => {
  const navigate = useNavigate();

  const { authState, logout } = useAuth(); // Get login method

  console.log(authState);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:443/api/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Logged out!");
        logout();
        navigate("/"); // Use navigate to redirect
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <body className="flex flex-col bg-[#282454] h-screen">
        <Header linkTo="/messages"></Header>
        <button onClick={handleLogout}>Logout</button>
      </body>
    </>
  );
};

export default Messages;
