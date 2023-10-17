import React from "react";
import { Link, To } from "react-router-dom";

const Home = (props: { linkTo: string }) => {
  return (
    <header className="bg-[#443F84] text-white py-4 text-center font-montserrat">
      <Link to={props.linkTo}>
        <h1 className="text-5xl font-bold">GhostLink</h1>
      </Link>
    </header>
  );
};

export default Home;
