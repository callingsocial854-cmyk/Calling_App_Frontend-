import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 👇 wrapper function for Link click
  const handleLinkClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div>
      <div className={`fixed-sidebar ${isOpen ? "lg-menu-open" : ""}`}>
        {/* Small Sidebar */}
        <div className="fixed-sidebar-left small-sidebar">
          <div className="sidebar-toggle">
            <button
              className="toggle-btn toggler-open"
              onClick={() => setIsOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div className="sidebar-menu-wrap">
            <ul className="side-menu">
              <li>
                <Link to="/dashboard" className="menu-link" onClick={() => handleLinkClick("/dashboard")}>
                  <i className="icofont-dashboard" />
                </Link>
              </li>
              <li>
                <Link to="/profile" className="menu-link" onClick={() => handleLinkClick("/profile")}>
                  <i className="icofont-user" />
                </Link>
              </li>
              <li>
                <Link to="/myQueries" className="menu-link" onClick={() => handleLinkClick("/myQueries")}>
                  <i className="icofont-question" />
                </Link>
              </li>
              <li>
                <Link to="/newQueries" className="menu-link" onClick={() => handleLinkClick("/newQueries")}>
                  <i className="icofont-plus" />
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="menu-link" onClick={() => handleLinkClick("/notifications")}>
                  <i className="icofont-notification" />
                </Link>
              </li>
              <li>
                <Link to="/messages" className="menu-link" onClick={() => handleLinkClick("/messages")}>
                  <i className="icofont-ui-message" />
                </Link>
              </li>
              <li>
                <Link to="/support" className="menu-link" onClick={() => handleLinkClick("/support")}>
                  <i className="icofont-support" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="menu-link" onClick={() => handleLinkClick("/login")}>
                  <i className="icofont-logout" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Large Sidebar */}
        <div className="fixed-sidebar-left large-sidebar">
          <div className="sidebar-toggle">
            <div className="sidebar-logo">
              <Link to="/" onClick={() => handleLinkClick("/")}>
                <img src="media/newLogo.png" alt="Logo" style={{ maxWidth: "100px"}} />
              </Link>
            </div>
            <button
              className="toggle-btn toggler-close"
              onClick={() => setIsOpen(false)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div className="sidebar-menu-wrap">
            <ul className="side-menu">
              <li>
                <Link to="/dashboard" className="menu-link" onClick={() => handleLinkClick("/dashboard")}>
                  <i className="icofont-dashboard" />
                  <span className="menu-title">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="menu-link" onClick={() => handleLinkClick("/profile")}>
                  <i className="icofont-user" />
                  <span className="menu-title">Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/myQueries" className="menu-link" onClick={() => handleLinkClick("/myQueries")}>
                  <i className="icofont-question" />
                  <span className="menu-title">My Queries</span>
                </Link>
              </li>
              <li>
                <Link to="/newQueries" className="menu-link" onClick={() => handleLinkClick("/newQueries")}>
                  <i className="icofont-plus" />
                  <span className="menu-title">New Query</span>
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="menu-link" onClick={() => handleLinkClick("/notifications")}>
                  <i className="icofont-notification" />
                  <span className="menu-title">Notifications</span>
                </Link>
              </li>
              <li>
                <Link to="/messages" className="menu-link" onClick={() => handleLinkClick("/messages")}>
                  <i className="icofont-ui-message" />
                  <span className="menu-title">Messages</span>
                </Link>
              </li>

              <li>
                <Link to="/callHistory" className="menu-link" onClick={() => handleLinkClick("/messages")}>
                  <i className="icofont-phone" />
                  <span className="menu-title">CallHistory</span>
                </Link>
              </li>

              <li>
                <Link to="/support" className="menu-link" onClick={() => handleLinkClick("/support")}>
                  <i className="icofont-support" />
                  <span className="menu-title">Support</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="menu-link" onClick={() => handleLinkClick("/login")}>
                  <i className="icofont-logout" />
                  <span className="menu-title">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Sidebar;
