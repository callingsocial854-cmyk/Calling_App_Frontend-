import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/newLogo.png";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");

    // initial state set
    setIsMobile(mq.matches);

    const handler = (e) => setIsMobile(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  
  return (
    <div className={`${isMobile ? "sticky-header sal-disabled mobile-menu-wrapper" : ""}`}>
      <div className={`wrapper overflow-hidden ${isOpen ? "mobile-menu-expand" : ""}`}>
      <header className="header">
        <div id="rt-sticky-placeholder" />
        <div id="header-menu" className="header-menu menu-layout1">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-2">
                <div className="temp-logo">
                  <Link to="/">
                    <img src={logo} alt="Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-6 col-lg-7 col-sm-7 col-8 d-flex justify-content-xl-start justify-content-center">
                <div className="mobile-nav-item hide-on-desktop-menu">
                  <div className="mobile-toggler">
                    <button type="button" className="mobile-menu-toggle" onClick={() => setIsOpen(true)}>
                      <i className="icofont-navigation-menu" />
                    </button>
                  </div>
                  <div className="mobile-logo">
                    <a>
                      <img src={logo} alt="Logo" />
                    </a>
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
                      <a className="menu-link active">
                        Home
                      </a>
                    </li>
                    <li className="header-nav-item">
                      <a className="menu-link">
                        About Us
                      </a>
                    </li>
                    <li className="header-nav-item">
                      <a className="menu-link">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="col-xl-4 col-lg-3 col-sm-5 col-4 d-flex justify-content-end">
                <div className="header-action">
                  <ul>
                    
                    <li className="login-btn">
                      <Link to="/login" className="item-btn">
                        <i className="fas fa-user" />
                        Login
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      </div>
    </div>
  );
};

export default Header;
