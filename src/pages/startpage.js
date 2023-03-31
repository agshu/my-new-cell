import React from "react";
import LogIn from "../login";

const Startpage = () => {
  return (
    <div className="startpage">
      <section className="hero">
        <hr className="startpage-hr" />
        <h1 className="startpage-h1">THE CELL</h1>
        <hr className="startpage-hr" />
      </section>
      <LogIn />
    </div>
  );
};

export default Startpage;
