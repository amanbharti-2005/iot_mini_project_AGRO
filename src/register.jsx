import { Link } from "react-router-dom";
import "./components/styles/register.css";

export default function Register() {
  return (
    <div className="auth-container">

      <div className="shape shapeA"></div>
      <div className="shape shapeB"></div>

      <div className="auth-box slide-up">
        <h1 className="title">Create Account 🌱</h1>
        <p className="subtitle">Join AGRO Smart Farming</p>

        <form>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <button className="btn">Register</button>

          <p className="switch-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
