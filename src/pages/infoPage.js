import React from "react";
import { useNavigate } from "react-router-dom";

const Infopage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/ar");
  };

  return (
    <div className="info-page">
      <section className="hero">
        <hr className="startpage-hr" />
        <h1 className="startpage-h1">THE CELL</h1>
        <hr className="startpage-hr" />
      </section>
      <div className="startpage-p animate__animated animate__fadeInLeft">
        Välkommen till din cell!
        <br />
        <br />
        Din cell kommer växa under 48 timmar och du får följa varje steg. När
        det är dags för nästa steg får du ett meddelande. Under resans gång
        kommer du lära dig massa nytt och spännande om cellens livscykel.
        <br />
        <br />
        Under resans gång kommer du lära dig massa nytt och spännande om cellens
        livscykel.
        <br />
        <br />
        Tryck på pilen för att starta din cell.
        <button
          className="start-btn"
          type="submit"
          id="startButton"
          onClick={handleClick}
        ></button>
      </div>
    </div>
  );
};

export default Infopage;
