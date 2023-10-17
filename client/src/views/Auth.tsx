import React from "react";
import { useParams } from "react-router-dom";

const Auth = () => {
  const mode = useParams();
  console.log(mode);

  return <h1>This will be the Auth page</h1>;
};

export default Auth;
