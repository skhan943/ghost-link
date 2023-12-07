import Header from "../components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const { logout } = useAuth(); // Get logout method

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.delete("https://localhost:443/api/delete", {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("Deleted successfully!");
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
        <Link to={"/messages"}>no</Link>
        <button onClick={handleDelete}>yes</button>
      </body>
    </>
  );
};

export default DeleteAccount;
