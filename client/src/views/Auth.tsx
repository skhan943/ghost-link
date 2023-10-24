import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

const Auth = () => {
  let modeParam = useParams();
  const mode = modeParam.mode;

  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserInput((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleAuthentication = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    if (mode === "register") {
      try {
        const response = await axios.post(
          "https://localhost:443/api/auth/register",
          userInput,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          // Registration was successful
          console.log("User registered successfully");
        }
      } catch (error: any) {
        // Handle any network or other errors
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          console.error("Network error:", error.message);
        }
      }
    } else {
      try {
        const response = await axios.post(
          "https://localhost:443/api/auth/login",
          userInput,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          // Registration was successful
          console.log("User signed in successfully");
        }
      } catch (error: any) {
        // Handle any network or other errors
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          console.error("Network error:", error.message);
        }
      }
    }
  };

  return (
    <body className="flex flex-col bg-[#282454] h-screen">
      <Header linkTo="/"></Header>
      <div className="flex flex-1 flex-col justify-center max-w-7xl w-full self-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <p className="text-5xl">👻</p>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            {mode == "register" ? (
              <p>Register an account</p>
            ) : (
              <p>Sign in to your account</p>
            )}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleAuthentication}
            method="POST"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  value={userInput.username}
                  onChange={handleChange}
                  required
                  className="bg-[#F5F5F5] p-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={userInput.password}
                  onChange={handleChange}
                  className="bg-[#F5F5F5] p-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {mode == "register" ? (
              <p className="text-center text-red-500">
                NOTE: passwords can't be reset, write yours down
              </p>
            ) : (
              <></>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {mode == "register" ? <p>Create account</p> : <p>Sign in</p>}
              </button>
            </div>

            <p className="text-center text-red-500">{errorMessage}</p>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {mode == "register" ? (
              <p>Already a member? </p>
            ) : (
              <p>Not a member? </p>
            )}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {mode == "register" ? (
                <Link to="/auth/signin" onClick={() => setErrorMessage("")}>
                  <p>Sign in</p>
                </Link>
              ) : (
                <Link to="/auth/register" onClick={() => setErrorMessage("")}>
                  <p>Register</p>
                </Link>
              )}
            </a>
          </p>
        </div>
      </div>
    </body>
  );
};

export default Auth;
