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
        <div className="w-1/5 bg-[#5A5690] text-white h-full p-4">
          <div className="flex justify-around items-center">
            <Link to={"/self-destruct"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-square-x"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
                <path d="M9 9l6 6m0 -6l-6 6" />
              </svg>
            </Link>
            <button onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-logout-2"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
                <path d="M15 12h-12l3 -3" />
                <path d="M6 15l-3 -3" />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-edit"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                <path d="M16 5l3 3" />
              </svg>
            </button>
          </div>
        </div>
      </body>
    </>
  );
};

export default Messages;
