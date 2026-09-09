import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          🌾 Crop Recommender
        </NavLink>
        <ul className="navbar-links">
          {user && (
            <>
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                  Recommend
                </NavLink>
              </li>
              <li>
                <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
                  History
                </NavLink>
              </li>
              {user.role === "admin" && (
                <li>
                  <NavLink to="/admin/crops" className={({ isActive }) => (isActive ? "active" : "")}>
                    Manage Crops
                  </NavLink>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Log out</button>
              </li>
              <li>
                <span className="navbar-tag">{user.role}</span>
              </li>
            </>
          )}
          {!user && (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
