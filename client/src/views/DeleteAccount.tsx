import Header from "../components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const { logout } = useAuth(); // Get logout method

  // Function to handle deleting account
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
        <div className="h-screen flex justify-center items-center font-montserrat">
          <div className="bg-[#443F84] p-12 rounded-lg shadow-md text-center">
            <p className="text-lg mb-4 text-white">
              Are you sure you want to delete your account?
            </p>
            <p className="text-lg mb-4 text-white">All data will be lost.</p>
            <div className="flex justify-around">
              <Link
                to="/messages"
                className="bg-indigo-700 text-white px-4 py-2 rounded-md mr-2"
              >
                No, go back!
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default DeleteAccount;
