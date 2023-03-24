import React from "react";
import Register from "../register";
import LogIn from "../login";

const Startpage = () => {
  return (
    <div className="startpage">
      <section className="hero">
        <hr className="startpage-hr" />
        <h1 className="startpage-h1">THE CELL</h1>
        <hr className="startpage-hr" />
      </section>
      <Register />
      <LogIn />
    </div>
  );
};

export default Startpage;
