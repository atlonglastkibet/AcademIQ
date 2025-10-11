import React, { useState } from "react";
import bgVideo from "../assets/ABHS_Homepage_Video.webm";
import TopNav from "./TopNav";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate ()
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={bgVideo} type="video/webm" />
       
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      ></div>

      {/* Hamburger menu (top-right) */}
      <button
        onClick={toggleMenu}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10,
          width: 40,
          height: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "block",
            height: 3,
            width: "100%",
            backgroundColor: "white",
            transform: menuOpen ? "rotate(45deg) translateY(12px)" : "none",
            transition: "0.3s",
          }}
        />
        <span
          style={{
            display: "block",
            height: 3,
            width: "100%",
            backgroundColor: "white",
            opacity: menuOpen ? 0 : 1,
            transition: "0.3s",
          }}
        />
        <span
          style={{
            display: "block",
            height: 3,
            width: "100%",
            backgroundColor: "white",
            transform: menuOpen ? "rotate(-45deg) translateY(-12px)" : "none",
            transition: "0.3s",
          }}
        />
      </button>

      {/* Full-screen overlay menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "grey",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s ease",
          zIndex: 9,
          display: "flex",
          justifyContent: "flex-start", 
        }}
      >
        <div
          style={{
            width: "60%",
            height: "100%",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start", 
            gap: 30,
            color: "#fff",
          }}
        >
        

        
        </div>
      </div>

    
<div
  style={{
    position: "absolute",
    bottom: 30,
    right: 50,
    color: "#fff",
    textAlign: "right",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  }}
>
  {/* First line */}
  <div style={{ fontSize: "3rem", fontWeight: "bold" }}>Learn, Grow</div>

  
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 30 , fontWeight: "bold" }}>
      <div style={{ width: 40, height: 3, backgroundColor: "#fff" }}></div>
      <div style={{ width: 50, height: 3, backgroundColor: "#fff" }}></div>
      <div style={{ width: 60, height: 3, backgroundColor: "#fff" }}></div>
    </div>

    
    <div style={{ fontSize: "5rem", fontWeight: "bold" }}>Excel</div>
  </div>
</div>



<a
  href="#next-section" 
  style={{
    position: "absolute",
    bottom: -100,
    left: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
    color: "#00ff00", 
  }}
>
 
  <span style={{ fontWeight: "bold", marginBottom: 8, fontSize: "2rem" }}>
    Explore
  </span>


  <div style={{ width: 3, height: "200px", backgroundColor: "#00ff00" }}></div>
</a>


      {/* Landing page content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>
        AcademIQ
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "2rem", fontFamily: "'Georgia', serif", 
    fontStyle: "italic",}}>
          “Nurturing talent. Building leaders.”
        </p>
        <button
  onClick={() => navigate("/roles")}
  style={{
    padding: "10px 30px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ff7f50",
    color: "#fff",
    cursor: "pointer",
  }}
>
  Get Started
</button>
      </div>
    </div>
    
<TopNav/>
<Footer />
    </>


      

    
  );
};



export default Landing;