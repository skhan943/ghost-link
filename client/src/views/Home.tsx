import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <body className="flex flex-col bg-[#282454] h-screen">
        <Header></Header>
        <section className="flex h-screen max-w-7xl items-center self-center px-10 md:px-0">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Private conversations that won't haunt you 👻
            </h1>
            <p className="mb-8 text-xl font-normal text-gray-500 lg:text-2xl sm:px-16 xl:px-48">
              There are some things that we don't want the world to see. At
              GhostLink, we don't wanna know...
            </p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Link to="/auth/signin">
                <a
                  href=""
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-gray-300 hover:ring-4 hover:ring-gray-100"
                >
                  Sign in
                </a>
              </Link>
              <Link to="/auth/register">
                <a
                  href=""
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-gray-300 hover:ring-4 hover:ring-gray-100"
                >
                  Register
                </a>
              </Link>
            </div>
          </div>
        </section>
      </body>
    </>
  );
};

export default Home;
