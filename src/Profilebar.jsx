// src/ProfileBar.jsx
import { useEffect, useState } from "react";
import "./components/styles/Profilebar.css";
export default function ProfileBar() {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("agro-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("agro-user");
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="profile-bar">
      <div className="profile-info">
        <span className="emoji">👤</span>

        {user ? (
          <span className="profile-name">
            {user.name ? user.name : user.email}
          </span>
        ) : (
          <span className="profile-name">Guest</span>
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
