import React from "react";
import ButtonUser from "../../components/ButtonUser";
import { Redirect } from 'react-router-dom';

class AdminShadow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSecret: false,
      userList: [
        { mail: "user1@gmail.com", secret: "Si tu vois un oiseau blanc sur un lac, c'est un signe !" },
        { mail: "user2@gmail.com", secret: "Le caractère autotélique et systémique du capitalisme ne doit pas être absolutisé !" }
      ],
      redirectToLogin: false
    };
    this.toggleSecret = this.toggleSecret.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        background: radial-gradient(ellipse at center, #0f0c29, #302b63, #24243e);
        margin: 0;
        font-family: 'Inter', sans-serif;
        color: white;
      }
      .glass-card {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 60px rgba(255, 105, 180, 0.3);
        padding: 2rem;
        margin: 1rem 0;
        transition: all 0.3s ease-in-out;
      }
      .glass-card:hover {
        transform: scale(1.02);
      }
      .title-glow {
        font-size: 2.8rem;
        background: linear-gradient(90deg, #ff6ec4, #7873f5);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin: 2rem 0;
        animation: pulseGlow 2s infinite ease-in-out alternate;
      }
      @keyframes pulseGlow {
        0% { text-shadow: 0 0 10px rgba(255,255,255,0.1); }
        100% { text-shadow: 0 0 20px rgba(255,255,255,0.4); }
      }
      .logout-button {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #ff6ec4, #7873f5);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      }
      .logout-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(0,0,0,0.4);
      }
      .logout-button:active {
        transform: translateY(1px);
      }
    `;
    document.head.appendChild(style);
  }

  toggleSecret() {
    this.setState({ showSecret: !this.state.showSecret });
  }

  handleLogout() {
    // Supprimer le cookie de token
    document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Rediriger vers la page de login
    this.setState({ redirectToLogin: true });
  }

  renderMainSecret() {
    return (
      <div className="glass-card">
        <h2 style={{ fontSize: "1.6rem" }}> Secret Administrateur</h2>
        <p>Si tu souhaites afficher ton secret, clique sur le bouton ci-dessous ⤵ ⚡ <ButtonUser handleClick={this.toggleSecret} /> </p>
        <p style={{ marginTop: "1rem" }}>
          {this.state.showSecret
            ? "Je sais où se situe la chouette d'or !"
            : "••••••••••••••••••••••••••••"}
        </p>
      </div>
    );
  }

  renderUsersList() {
    const { userList } = this.state;
    return (
      <div className="glass-card">
        <h2 style={{ fontSize: "1.6rem" }}>Utilisateurs</h2>
        {userList.length === 0 ? (
          <p>Aucun utilisateur trouvé</p>
        ) : (
          <ul>
            {userList.map((user, i) => (
              <li key={i}>
                <strong>{user.mail}</strong>: {user.secret}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ padding: "3rem" }}>
        <h1 className="title-glow"> Admin Shadow Interface </h1>
        <button className="logout-button" onClick={this.handleLogout}>
          Déconnexion
        </button>
        {this.renderMainSecret()}
        {this.renderUsersList()}
      </div>
    );
  }
}

export default AdminShadow;