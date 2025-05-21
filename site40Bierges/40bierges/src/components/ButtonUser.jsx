import React from "react";
import { useState, useEffect } from "react";
import '../assets/css/main.css';

function ButtonUser({ handleClick }) {
  // État pour l'animation au survol
  const [isHovered, setIsHovered] = useState(false);
  
  // Constante du nombre d'or
  const goldenRatio = 1.618;
  
  // Styles basés sur le nombre d'or
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${16 * goldenRatio}px`,
      maxWidth: `${300 * goldenRatio}px`,
      margin: "0 auto",
      gap: `${10 * goldenRatio}px`,
      borderRadius: "8px",
      background: "linear-gradient(145deg, #f9f9f9, #f0f0f0)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
    },
    text: {
      fontSize: `${16}px`,
      lineHeight: `${16 * goldenRatio}px`,
      textAlign: "center",
      marginBottom: `${8 * goldenRatio}px`,
      color: "#333",
      fontWeight: "500"
    },
    button: {
      padding: `${10}px ${10 * goldenRatio}px`,
      fontSize: "16px",
      borderRadius: "6px",
      border: "none",
      background: isHovered 
        ? "linear-gradient(145deg, #3a7bd5, #00d2ff)" 
        : "linear-gradient(145deg, #3a7bd5, #3a6073)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      transform: isHovered ? `scale(${1 + (1/goldenRatio) * 0.1})` : "scale(1)",
      boxShadow: isHovered 
        ? "0 6px 12px rgba(58, 123, 213, 0.3)" 
        : "0 4px 6px rgba(58, 123, 213, 0.2)"
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.text}>
        Si tu souhaites afficher ton secret, clique sur le bouton ci-dessous ↴ ↯
      </p>
      <button 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={styles.button}
      >
        Ce bouton !
      </button>
    </div>
  );
}

export default ButtonUser;