import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const Auth = () => {
  const mode = useParams();
  console.log(mode);

  return (
    <body className="flex flex-col bg-[#282454] h-screen">
      <Header></Header>
    </body>
  );
};

export default Auth;
