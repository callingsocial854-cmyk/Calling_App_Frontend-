import React from "react";
import "./Banner.css";
import DynamicForm from "./Dashbaord/DynamicForm";

const Banner = () => {
  return (
    <div>
      <section className="hero-banner">
        <div className="container">
          <div className="banner-layout">
            {/* Left Content */}

            {/* Right Content - Dynamic Form */}
            <div className="banner-form">
              
                <DynamicForm />
              
            </div>
          </div>
        </div>

        {/* Background Elements */}
        
        <div className="map-line">
          <img
            src="media/banner/map_line.png"
            alt="map"
            data-sal="slide-up"
            data-sal-duration={500}
            data-sal-delay={800}
            className="sal-animate"
          />
          <ul className="map-marker">
            <li
              data-sal="slide-up"
              data-sal-duration={700}
              data-sal-delay={1000}
              className="sal-animate"
            >
              <img src="media/banner/marker_1.png" alt="marker" />
            </li>
            <li
              data-sal="slide-up"
              data-sal-duration={800}
              data-sal-delay={1000}
              className="sal-animate"
            >
              <img src="media/banner/marker_2.png" alt="marker" />
            </li>
            <li
              data-sal="slide-up"
              data-sal-duration={900}
              data-sal-delay={1000}
              className="sal-animate"
            >
              <img src="media/banner/marker_3.png" alt="marker" />
            </li>
            <li
              data-sal="slide-up"
              data-sal-duration={1000}
              data-sal-delay={1000}
              className="sal-animate"
            >
              <img src="media/banner/marker_4.png" alt="marker" />
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Banner;