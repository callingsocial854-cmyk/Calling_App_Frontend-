import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const Profile = () => {
  const Base_URL = import.meta.env.VITE_BASE_URL;
  const File_URL = import.meta.env.VITE_FILE_URL;
  const [errors, setErrors] = useState({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    userEmail: "",
    phone: "",
    gender: "",
    location: "",
    dob: "",
    profileImage: "",
  });

  // ✅ Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${Base_URL}getUserById`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });


      const { user, totalActiveQueries, totalInActiveQueries } =
        response.data.data;

      const combinedData = {
        ...user,
        totalActiveQueries,
        totalInActiveQueries,
      };


      setUserData(combinedData);
      setFormData({
        fullName: user.fullName || "",
        userEmail: user.userEmail || "",
        phone: user.phone || "",
        gender: user.gender || "",
        location: user.location || "",
        dob: user.dob || "",
        profileImage: user.profileImage || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ Live validation on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field in real-time
    validateField(name, value);
  };

  // ✅ Validate individual field
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required";
        } else if (value.length < 3) {
          newErrors.fullName = "Full name must be at least 3 characters";
        } else {
          delete newErrors.fullName;
        }
        break;

      case "userEmail": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.userEmail = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.userEmail = "Enter a valid email address";
        } else {
          delete newErrors.userEmail;
        }
        break;
      }

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (value.length !== 10) {
          newErrors.phone = "Phone number must be exactly 10 digits";
        } else {
          delete newErrors.phone;
        }
        break;

      case "gender":
        if (!value.trim()) {
          newErrors.gender = "Gender is required";
        } else if (!["male", "female", "other"].includes(value.toLowerCase())) {
          newErrors.gender = "Enter Male, Female, or Other";
        } else {
          delete newErrors.gender;
        }
        break;

      case "dob":
        if (!value.trim()) {
          newErrors.dob = "Date of Birth is required";
        } else {
          delete newErrors.dob;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // ✅ Form submission validation
  const _validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = "Enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   console.log("Validation failed");
    //   return;
    // }

    try {
      // Prepare data for update
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("userEmail", formData.userEmail);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("dob", formData.dob);

      // 👇 Include profileImage only if user updated it
      if (formData.profileImage && formData.profileImage instanceof File) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await axios.post(
        `${Base_URL}updateProfile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAlertMessage("Profile updated successfully");
      setSuccessAlert(true);
      console.log("Profile updated successfully:", response.data);
      setUserData((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: userData.fullName,
      userEmail: userData.userEmail,
      gender: userData.gender,
      location: userData.location,
      dob: userData.dob,
      profileImage: userData.profileImage,
    });
    setIsEditing(false);
    // Clear errors when canceling
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        previewImage: previewURL,
      }));
    }
  };

  if (!userData) return <p>Loading...</p>;

  const getProfileImageSrc = () => {
    if (formData.previewImage) {
      return formData.previewImage;
    }
    const imageUrl = formData.profileImage || userData.profileImage;
    if (!imageUrl)
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    if (imageUrl.startsWith("http") || imageUrl.startsWith("data:")) {
      return imageUrl;
    } else {
      return `${File_URL}${
        imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
      }`;
    }
  };

  return (
    <div id="wrapper" className="wrapper">
      <div className="page-content">
        <div className="container-fluid">
          {/* Profile Header */}
          <div className="banner-user">
            <div className="banner-content">
              <div className="media">
                <div className="item-img">
                  <img
                    src={getProfileImageSrc()}
                    alt="User"
                    style={{ width: "150px", borderRadius: "50%" }}
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
                      <h3 className="item-title" style={{ color: "#fff" }}>
                        {userData.fullName}
                      </h3>
                    </div>
                  </div>

                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-number" style={{ color: "#fff" }}>
                        {userData.totalActiveQueries}
                      </span>
                      <span className="stat-label" style={{ color: "#fff" }}>
                        Active Query
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number" style={{ color: "#fff" }}>
                        {userData.totalInActiveQueries}
                      </span>
                      <span className="stat-label" style={{ color: "#fff" }}>
                        Inactive Query
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`tab-btn ${
                  activeTab === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveTab("personal")}
              >
                <FaUser />
                Personal Info
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "personal" && (
                <div className="tab-pane active">
                  <div className="section-header">
                    <h3>Personal Information</h3>
                    <button
                      className="btn btn-edit"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <FaEdit />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>
                          <FaUser /> Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your full name"
                          className={errors.fullName ? "error-input" : ""}
                        />
                        {errors.fullName && (
                          <small className="error-text">
                            {errors.fullName}
                          </small>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          <FaEnvelope /> Email Address
                        </label>
                        <input
                          type="email"
                          name="userEmail"
                          value={formData.userEmail}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your email"
                          className={errors.userEmail ? "error-input" : ""}
                        />
                        {errors.userEmail && (
                          <small className="error-text">
                            {errors.userEmail}
                          </small>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          <FaPhone /> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            setFormData((prev) => ({ ...prev, phone: value }));
                            validateField("phone", value);
                          }}
                          disabled={!isEditing}
                          maxLength="10"
                          pattern="[0-9]{10}"
                          inputMode="numeric"
                          placeholder="Enter 10-digit phone number"
                          className={errors.phone ? "error-input" : ""}
                        />
                        {errors.phone && (
                          <small className="error-text">{errors.phone}</small>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          <FaUser /> Gender
                        </label>

                        <div
                          className="gender-options"
                          style={{
                            display: "flex",
                            gap: "15px",
                            alignItems: "center",
                          }}
                        >
                          {["Male", "Female", "Other"].map((option) => (
                            <label
                              key={option}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <input
                                type="radio"
                                name="gender"
                                value={option}
                                checked={formData.gender === option}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                              />
                              {option}
                            </label>
                          ))}
                        </div>

                        {errors.gender && (
                          <small className="error-text">{errors.gender}</small>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          <FaCalendarAlt /> Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={errors.dob ? "error-input" : ""}
                        />
                        {errors.dob && (
                          <small className="error-text">{errors.dob}</small>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn btn-cancel"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-save"
                          disabled={Object.keys(errors).length > 0}
                        >
                          <FaCheckCircle /> Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Snackbar open={successAlert} autoHideDuration={6000} onClose={() => setSuccessAlert(false)}>
  <Alert
    onClose={() => setSuccessAlert(false)}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    {alertMessage}
  </Alert>
</Snackbar>
    </div>
  );
};

export default Profile;
