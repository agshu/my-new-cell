import React from "react";
import LogIn from "../login";
import Register from "../register";

const Startpage = () => {
  return (
    <div className="startpage">
      <section className="hero">
        <hr className="startpage-hr" />
        <h1 className="startpage-h1">THE CELL</h1>
        <hr className="startpage-hr" />
      </section>
      <LogIn />
      <Register />
    </div>
  );
};

export default Startpage;
