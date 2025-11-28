import { Link } from "react-router-dom";
import "./components/styles/login.css";
export default function Login() {
  return (
    <div className="auth-container">

      {/* Background decorative shapes */}
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>

      <div className="auth-box fade-in">
        <h1 className="title">Welcome Back 👋</h1>
        <p className="subtitle">Login to your AGRO account</p>

        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <button className="btn">Login</button>

          <p className="switch-text">
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

