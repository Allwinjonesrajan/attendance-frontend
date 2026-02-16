import React, { useState } from "react";
import { CONFIG } from "../config/regConfig";

const Login = ({ onLoginSuccess }) => {
  const [loginType, setLoginType] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (loginType === "admin") {
      if (email === "admin@gmail.com" && password === "admin") {
        onLoginSuccess({ role: "admin" });
      } else {
        alert("Invalid Admin Credentials!");
      }
    } else if (loginType === "hr") {
    if (email === "hr@gmail.com" && password === "hr123") {
      onLoginSuccess({ role: "hr" });
    } else {
      alert("Invalid HR Credentials!");
    }
  }
    else {
      const branchKey = Object.keys(CONFIG.BRANCH_AUTH).find(
        (key) =>
          CONFIG.BRANCH_AUTH[key].email === email &&
          CONFIG.BRANCH_AUTH[key].pass === password,
      );
      if (branchKey) {
        onLoginSuccess({ role: "branch", name: branchKey });
      } else {
        alert("Invalid Branch Email or Password!");
      }
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
    },
    card: {
      background: "#fff",
      padding: "40px",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    },
    input: {
      width: "100%",
      padding: "14px",
      margin: "10px 0",
      borderRadius: "10px",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
    btn: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#0f766e",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      marginTop: "10px",
    },
    choiceBtn: {
      padding: "20px",
      margin: "10px",
      width: "140px",
      cursor: "pointer",
      borderRadius: "15px",
      border: "2px solid #11998e",
      background: "#fff",
      color: "#11998e",
      fontWeight: "bold",
    },
    backBtn: {
      float: "left",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "20px",
      color: "#11998e",
    },
  };

  if (!loginType)
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ color: "#333" }}>Attendance Register</h2>
          <p style={{ color: "#666" }}>Select Login Type</p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              style={styles.choiceBtn}
              onClick={() => setLoginType("admin")}
            >
              ADMIN
            </button>
            <button
              style={styles.choiceBtn}
              onClick={() => setLoginType("branch")}
            >
              BRANCH
            </button>
            <button style={styles.choiceBtn} onClick={() => setLoginType("hr")}>
              HR
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => setLoginType(null)} style={styles.backBtn}>
          ←
        </button>
        <h3 style={{ marginBottom: "20px", color: "#0f766e" }}>
          {loginType.toUpperCase()} LOGIN
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            required
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            required
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button type="submit" style={styles.btn}>
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
