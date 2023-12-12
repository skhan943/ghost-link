import Header from "../components/Header";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  const { logout } = useAuth(); // Get logout method

  // Function to handle logging out
  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "https://localhost:443/api/auth/logout",
        {
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
        <Link to={"/self-destruct"}>Delete</Link>
      </body>
    </>
  );
};

export default Messages;
