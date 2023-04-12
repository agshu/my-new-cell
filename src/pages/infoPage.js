import React from "react";
import { useNavigate } from "react-router-dom";

const Infopage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/zero-phase");
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
        cellen är på väg att utvecklas får du ett meddelande till den mail som
        du loggat in med. Under resans gång kommer du lära dig massa nytt och
        spännande om celler.
        <br />
        <br />
        Det är kul att uppleva den här appen tillsammans – både barn och vuxna!{" "}
        <b>
          Glöm inte att testa att trycka på objekten ni ser i AR. Då kanske ni
          får reda på något mer!
        </b>
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
