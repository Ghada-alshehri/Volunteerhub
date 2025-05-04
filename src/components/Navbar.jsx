import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const email = localStorage.getItem("googleEmail") || localStorage.getItem("manualEmail");
    setIsLoggedIn(!!email);
  }, [location]); // يعيد التحقق كل ما تغيرت الصفحة

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Volunteer Hub</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {!isLoggedIn && (
              <li className="login-btn"><Link to="/login">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
