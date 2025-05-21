import React from "react";
import { Redirect } from 'react-router-dom';
import '../../assets/css/main.css';
import axios from "axios";
import tools from "../../toolBox";
import ButtonUser from "../../components/ButtonUser";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSecret: false,
      redirected: false,
      token: "",
      userList: "",
      isLoading: true,
      showTrap: true,
      captchaInput: "",
      captchaPassed: false,
      url: "http://localhost:3001"
    };
    this.toggleSecret = this.toggleSecret.bind(this);
    this.validateCaptcha = this.validateCaptcha.bind(this);
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
        margin-bottom: 1.5rem;
        animation: pulseGlow 2s infinite ease-in-out alternate;
      }
      @keyframes pulseGlow {
        0% { text-shadow: 0 0 10px rgba(255,255,255,0.1); }
        100% { text-shadow: 0 0 20px rgba(255,255,255,0.4); }
      }
      .trap-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
      }
      .trap-gif {
        width: 320px;
        height: auto;
        filter: blur(6px);
        border-radius: 16px;
        margin-bottom: 1rem;
        transition: filter 0.5s ease;
      }
      .trap-gif.revealed {
        filter: blur(0);
      }
      .trap-input {
        padding: 12px;
        border-radius: 8px;
        font-size: 1rem;
        border: none;
        margin-top: 1rem;
        text-align: center;
      }
      .trap-button {
        margin-top: 1rem;
        padding: 10px 20px;
        font-weight: bold;
        background: #ff6ec4;
        border: none;
        color: white;
        border-radius: 6px;
        cursor: pointer;
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
        z-index: 100;
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

    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-confirmation-914.mp3");
    audio.volume = 0.5;
    audio.play();

    if (tools.checkIfConnected()) {
      this.promisedSetState({ token: tools.readCookie("Token") }).then(() => {
        this.fetchData();
      });
    } else {
      this.setState({ redirected: true });
    }
  }

  toggleSecret() {
    this.setState({ showSecret: !this.state.showSecret });
  }

  validateCaptcha() {
    if (this.state.captchaInput.toLowerCase().trim() === "je ne suis pas un hacker") {
      const reveal = document.getElementById("trap-gif");
      if (reveal) reveal.classList.add("revealed");
      setTimeout(() => this.setState({ captchaPassed: true }), 1000);
    } else {
      alert("Mot-clé incorrect. Indice : ce que dirait un vrai admin 👀");
    }
  }

  handleLogout() {
    // Supprimer le cookie de token
    document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Rediriger vers la page de login
    this.setState({ redirected: true });
  }

  fetchData() {
    axios.get(this.state.url + '/admin', {
      headers: { 'token': this.state.token }
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          userList: response.data,
          isLoading: false
        });
      } else {
        this.setState({ redirected: true });
      }
    }).catch(() => {
      this.setState({ redirected: true });
    });
  }

  promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

  renderUsersList() {
    const users = Array.isArray(this.state.userList)
      ? this.state.userList.filter(user => user.role === "user")
      : [];

    return (
      <div>
        <h2>Utilisateurs</h2>
        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé</p>
        ) : (
          <ul>
            {users.map((user, i) => (
              <li key={i}>
                <strong>{user.mail}</strong>: {user.secret}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  renderMainSecret() {
    const { showSecret, userList } = this.state;
    const adminSecret = Array.isArray(userList) && userList.length > 0 ? userList[0].secret : "••••••••••••";

    return (
      <div>
        <h3>Secret Administrateur</h3>
        <ButtonUser handleClick={this.toggleSecret} />
        <p style={{ marginTop: "1rem" }}>
          {showSecret ? adminSecret : "••••••••••••••••••••••"}
        </p>
      </div>
    );
  }

  render() {
    if (this.state.redirected) return <Redirect to="/login" />;

    if (!this.state.captchaPassed) {
      return (
        <div className="trap-overlay">
          <img
            id="trap-gif"
            src="https://media.tenor.com/T3hEjpi-UWcAAAAC/anime-girl-blush.gif"
            className="trap-gif"
            alt="piège visuel"
          />
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
             Zone restreinte. Prouvez que vous êtes un admin humain.
          </p>
          <input
            type="text"
            className="trap-input"
            placeholder="Tapez : je ne suis pas un hacker"
            onChange={(e) => this.setState({ captchaInput: e.target.value })}
          />
          <button className="trap-button" onClick={this.validateCaptcha}>Déverrouiller</button>
        </div>
      );
    }

    return (
      <div style={{ padding: "3rem" }}>
        <h1 className="title-glow"> Admin Shadow Interface </h1>
        <button className="logout-button" onClick={this.handleLogout}>
          Déconnexion
        </button>
        <div className="glass-card">{this.renderMainSecret()}</div>
        <div className="glass-card">{this.renderUsersList()}</div>
      </div>
    );
  }
}

export default Admin;