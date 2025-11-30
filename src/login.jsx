import { useState } from "react";
import { Link } from "react-router-dom";
import "./components/styles/login.css";

// Firebase Imports
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "./firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // -------- VALIDATION --------
    if (!email.trim()) {
      setLoading(false);
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      setError("Enter a valid email");
      return;
    }

    if (!password.trim()) {
      setLoading(false);
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters");
      return;
    }

    // -------- FIREBASE LOGIN --------
    const auth = getAuth(app);
    const db = getDatabase(app);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Fetch user data from Realtime DB
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      let name = "";
      if (snapshot.exists()) {
        name = snapshot.val().name;
      }

      // Save in localStorage
      localStorage.setItem(
        "agro-user",
        JSON.stringify({
          uid: user.uid,
          name: name,
          email: user.email,
        })
      );

      setSuccess("Login Successful!");

      // 🚨 ADDED SUCCESS ALERT
      alert("Login Successful!");

      // Redirect after a moment
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);

    } catch (err) {
      setLoading(false);
      setError(err.message.replace("Firebase:", "").trim());
    }
  };

  return (
    <div className="auth-container">
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>

      <div className="auth-box fade-in">
        <h1 className="title">Welcome Back 👋</h1>
        <p className="subtitle">Login to your AGRO account</p>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleSubmit}>
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

          <button className="btn" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>

          <p className="switch-text">
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
