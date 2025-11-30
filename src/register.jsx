// src/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./components/styles/register.css";

// Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { ref, set } from "firebase/database";
import { app } from "./firebase";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) return setError("Full Name is required");
    if (!email.trim()) return setError("Email is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Enter a valid email");

    if (!password.trim()) return setError("Password is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    const auth = getAuth(app);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // WRITE DATA TO REALTIME DATABASE
      await set(ref(db, "users/" + user.uid), {
        name: name,
        email: email,
      });

      alert("Registration successful!");
      window.location.href = "/login";

    } catch (err) {
      setError(err.message.replace("Firebase:", "").trim());
    }
  };

  return (
    <div className="auth-container">
      <div className="shape shapeA"></div>
      <div className="shape shapeB"></div>

      <div className="auth-box slide-up">
        <h1 className="title">Create Account 🌱</h1>
        <p className="subtitle">Join AGRO Smart Farming</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn">Register</button>

          <p className="switch-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
