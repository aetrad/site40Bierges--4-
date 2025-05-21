import React from "react";
import { Redirect } from 'react-router-dom';

// core components
import '../../assets/css/main.css';
import tools from "../../toolBox";
import axios from "axios";

// Constante du nombre d'or pour un design harmonieux
const goldenRatio = 1.618;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      redirectedAdmin: false,
      mail: "",
      password: "",
      url: "http://localhost:3001",
      loading: false,
      error: null
    };
    this.handleConnect = this.handleConnect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  componentDidMount() {
    if (tools.checkIfConnected()) {
      this.setState({ redirected: true });
    }
  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.value,
      error: null // Réinitialiser l'erreur lors de la modification
    });
  }

  handleConnect() {
    // Validation du formulaire
    if (this.state.mail === '' || this.state.password === '') {
      this.setState({ error: 'Veuillez remplir tous les champs du formulaire' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(this.state.mail)) {
      this.setState({ error: 'Le format de l\'email est incorrect' });
      return;
    }

    // Activer l'état de chargement
    this.setState({ loading: true });

    axios.post(this.state.url + '/connection', {
      mail: this.state.mail,
      password: this.state.password
    }).then(response => {
      if (response.status === 200) {
        // Configuration du cookie
        let d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "Token=" + response.data.token + ";" + expires + ";path=/";
        
        // Redirection selon le rôle
        if (response.data.role === "user") {
          this.setState({ redirected: true });
        } else if (response.data.role === "admin") {
          this.setState({ redirectedAdmin: true });
        }
      } else {
        this.setState({ error: "Erreur " + response.status });
      }
    }).catch(error => {
      console.log(error);
      this.setState({ 
        error: error.response?.data?.message || "Erreur lors de la connexion",
        loading: false
      });
    }).finally(() => {
      // Désactiver l'état de chargement (si pas redirigé)
      if (!this.state.redirected && !this.state.redirectedAdmin) {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    // Redirection selon le rôle
    if (this.state.redirected) return (<Redirect to="/index" />);
    if (this.state.redirectedAdmin) return (<Redirect to="/admin" />);

    // Styles basés sur le nombre d'or
    const styles = {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        padding: "20px"
      },
      formContainer: {
        width: `${300 * goldenRatio}px`,
        padding: `${24}px`,
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      },
      title: {
        fontSize: "24px",
        color: "#333",
        marginBottom: "16px",
        textAlign: "center",
        fontWeight: "600"
      },
      inputGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "16px"
      },
      label: {
        fontSize: "16px",
        marginBottom: "8px",
        color: "#555"
      },
      input: {
        padding: "12px",
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        marginBottom: "12px",
        width: "100%",
        boxSizing: "border-box"
      },
      button: {
        padding: "12px",
        fontSize: "16px",
        backgroundColor: this.state.loading ? "#88a7d3" : "#3a7bd5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: this.state.loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        marginTop: "16px",
        fontWeight: "600",
        boxShadow: "0 4px 8px rgba(58, 123, 213, 0.3)",
        opacity: this.state.loading ? 0.7 : 1
      },
      error: {
        color: "#e74c3c",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "8px"
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Connexion</h2>
          
          <div style={styles.inputGroup}>
            <label htmlFor="mail" style={styles.label}>Email</label>
            <input
              type="text"
              id="mail"
              name="mail"
              value={this.state.mail}
              onChange={this.handleChange}
              style={styles.input}
              placeholder="exemple@domaine.com"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              style={styles.input}
              placeholder="Votre mot de passe"
            />
          </div>
          
          {this.state.error && <div style={styles.error}>{this.state.error}</div>}
          
          <button 
            onClick={this.handleConnect} 
            disabled={this.state.loading}
            style={styles.button}
          >
            {this.state.loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
      </div>
    );
  }
}

export default Login;