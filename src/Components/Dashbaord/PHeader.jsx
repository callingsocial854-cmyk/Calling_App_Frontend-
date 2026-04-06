import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/newLogo.png";
import profile from "../../assets/chat_5.jpg"


const PHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <header className="fixed-header">
        <div className="header-menu">
          <div className="navbar" style={{ justifyContent: "space-between" }}>
            <div className="nav-item d-sm-block">
              <div className="header-logo">
                <Link to="/">
                  <img
                    src={logo}
                    alt="QueryConnect"
                    style={{ maxWidth: "140px" }}
                  />
                </Link>
              </div>
            </div>

            <nav id="dropdown" className="template-main-menu">
                  <button
                    type="button"
                    className="mobile-menu-toggle mobile-toggle-close"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="icofont-close" />
                  </button>
                  <ul className="menu-content">
                    <li className="header-nav-item">
                      <Link to="/dashboard" className="menu-link active">
                        Dashboard
                      </Link>
                    </li>
                    
                  </ul>
                </nav>

            <div className="nav-item header-control">
              

              {/* Admin Dropdown */}
              <div className="inline-item">
                <div className="dropdown dropdown-admin">
                  <button
                    className="dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="media">
                      <span className="item-img">
                        <img src={profile} alt="Chat" />
                      </span>
                    </span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <ul className="admin-options">
                      
                      <li>
                        <Link to="/profile">Profile</Link>
                      </li>
                      <li>
                        <Link to="/support">Support</Link>
                      </li>
                      
                      <li>
                        <Link to="/inactiveQueries">Inactive Queries</Link>
                      </li>
                      <li>
                        <Link onClick={handleLogout} >Log Out</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default PHeader;
