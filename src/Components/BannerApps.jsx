import React from "react";

const BannerApps = () => {
  return (
    <div>
      <section className="banner-apps">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex align-items-center">
              <div className="banner-content">
                <h2 className="item-title">
                  Fully Responsive QueryConnect WordPress Theme
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
                <a
                 
                  className="button-slide"
                >
                  <span className="btn-text">Purchase Now</span>
                  <span className="btn-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="21px"
                      height="10px"
                    >
                      <path
                        fillRule="evenodd"
                        fill="rgb(255, 255, 255)"
                        d="M16.671,9.998 L12.997,9.998 L16.462,6.000 L5.000,6.000 L5.000,4.000 L16.462,4.000 L12.997,0.002 L16.671,0.002 L21.003,5.000 L16.671,9.998 ZM17.000,5.379 L17.328,5.000 L17.000,4.621 L17.000,5.379 ZM-0.000,4.000 L3.000,4.000 L3.000,6.000 L-0.000,6.000 L-0.000,4.000 Z"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="banner-img">
                <div className="apps-view">
                  <img src="media/banner/apps.png" alt="Apps" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BannerApps;
