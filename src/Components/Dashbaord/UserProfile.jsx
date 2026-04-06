import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Profile.css";
import { FiMessageSquare } from "react-icons/fi";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("queries");
  const [isEditing, setIsEditing] = useState(false);

  // Sample user data - in real app, this would come from props or context
  const [userData, setUserData] = useState({
    name: "Sneha Patel",
    email: "rebeca.powel@example.com",
    mobile: "+1 (555) 123-4567",
    location: "Indore India",
    joinDate: "2024-01-15",
    dateOfBirth: "1990-05-15",
    preferredTime: "14:30",
    profileImage: "media/banner/user_1.jpg",
    test: "eye-test",
  });

  const [formData, setFormData] = useState({
    ...userData,
    test: userData.test || "", // Ensure test has a value
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    console.log("Profile updated:", formData);
  };

  const handleCancelEdit = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profileImage: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="wrapper" className="wrapper">
      <div className="page-content">
        <div className="container-fluid">
          {/* Profile Header */}
          <div
            className="banner-user"
            style={{
              background:
                "linear-gradient(to right, #673ab7, #512da8)",
            }}
          >
            <div className="banner-content">
              <div className="media">
                <div className="item-img">
                  <img
                    src={formData.profileImage}
                    alt="User"
                    style={{ width: "150px" }}
                  />
                  <div className="image-overlay">
                    <label htmlFor="profileImageUpload" className="camera-icon">
                      <FaCamera />
                      <input
                        id="profileImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>
                <div className="media-body">
                  <div className="header-top">
                    <div>
                      <h3 className="item-title">{userData.name}</h3>
                      <div className="item-subtitle">
                        <FaMapMarkerAlt />
                        {userData.location}
                      </div>
                    </div>
                  </div>

                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-number" style={{ color: "#fff" }}>
                        30
                      </span>
                      <span className="stat-label" style={{ color: "#fff" }}>
                        Query
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number" style={{ color: "#fff" }}>
                        12
                      </span>
                      <span className="stat-label" style={{ color: "#fff" }}>
                        Comments
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number" style={{ color: "#fff" }}>
                        1.2k
                      </span>
                      <span className="stat-label" style={{ color: "#fff" }}>
                        Views
                      </span>
                    </div>
                  </div>

                  <div className="member-since">
                    
                    <button type="button" className="tab-btn active" style={{ backgroundColor: "#fff", color: "black"}}> <FiMessageSquare /> Message</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`tab-btn ${activeTab === "queries" ? "active" : ""}`}
                onClick={() => setActiveTab("queries")}
              >
                <FaUser />
                Queries List
              </button>
            </div>

            <div className="tab-content">
              {/* queries Information Tab */}
              {activeTab === "queries" && (
                <div className="tab-pane active">
                  <div className="block-box post-view query-item">
                    <div className="post-header">
                      <div className="media">
                        <div className="user-img">
                          <img
                            alt="Rajesh Kumar"
                            src="media/figure/chat_5.jpg"
                          />
                        </div>
                        <div className="media-body">
                          <div className="user-title">
                            <a href="/myQueryDetail" data-discover="true">
                              Rajesh Kumar
                            </a>
                          </div>
                          <ul className="entry-meta">
                            <li className="meta-privacy">
                              <i className="icofont-users-alt-4" />
                              Friends
                            </li>
                            <li className="meta-time">2 mins ago</li>
                            <li className="query-status active">active</li>
                          </ul>
                        </div>
                      </div>
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ...
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item">Edit</a>
                          <a className="dropdown-item">Delete</a>
                        </div>
                      </div>
                    </div>
                    <div className="post-body">
                      <div className="query-preview">
                        <h4 className="query-title">
                          How to implement drag and drop in React?
                        </h4>
                        <p className="query-description">
                          I'm trying to implement a drag and drop feature for
                          file uploads in my React application. Can someone help
                          me with the best approach?
                        </p>
                        <div className="media-previews">
                          <div className="media-preview">
                            <img
                              alt="Preview 1"
                              src="media/figure/sample1.jpg"
                            />
                          </div>
                        </div>
                        <div className="query-meta-preview">
                          <span className="query-type">technical</span>
                          <span className="attachments-count">
                            1 attachments
                          </span>
                        </div>
                      </div>
                      
                    </div>
                    <div className="post-footer">
                      <ul>
                        <li className="post-react">
                          <a>
                            <i className="icofont-thumbs-up" />
                            React!
                          </a>
                          <ul className="react-list">
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_1.png"
                                />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_3.png"
                                />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_4.png"
                                />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_2.png"
                                />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_7.png"
                                />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_6.png"
                                />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img
                                  alt="Like"
                                  src="media/figure/reaction_5.png"
                                />
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a>
                            <i className="icofont-comment" />
                            Comment
                          </a>
                        </li>
                        <li className="post-share">
                          <a className="share-btn">
                            <i className="icofont-share" />
                            Share
                          </a>
                          <ul className="share-list">
                            <li>
                              <a className="color-fb">
                                <i className="icofont-facebook" />
                              </a>
                            </li>
                            <li>
                              <a className="color-messenger">
                                <i className="icofont-facebook-messenger" />
                              </a>
                            </li>
                            <li>
                              <a className="color-instagram">
                                <i className="icofont-instagram" />
                              </a>
                            </li>
                            <li>
                              <a className="color-whatsapp">
                                <i className="icofont-brand-whatsapp" />
                              </a>
                            </li>
                            <li>
                              <a className="color-twitter">
                                <i className="icofont-twitter" />
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
