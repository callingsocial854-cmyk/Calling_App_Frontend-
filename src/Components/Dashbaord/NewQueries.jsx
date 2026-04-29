import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./DynamicForm.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel as MuiFormControlLabel,
} from "@mui/material";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { createQueryThunk } from "../../features/queryThunks";
import LocationSelector from "../LocationSelector";

const NewQueries = () => {
  const Base_URL = import.meta.env.VITE_BASE_URL;
  const [sector, setSector] = useState("");
  const [, setIsDescriptionVisible] = useState(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isScheduleVisible, setIsScheduleVisible] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [categoryFields, setCategoryFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [locationData, setLocationData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Base_URL}getCategoriesInUser`);
      if (response.data.status) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector) {
      fetchCategoryFields(sector);
    }
  }, [sector]);

  const fetchCategoryFields = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Base_URL}getFieldsByCategoryInUser?categoryId=${categoryId}`,
      );

      if (response.data.status) {
        // Sort all fields by order ascending
        const sortedFields = response.data.data.sort(
          (a, b) => a.order - b.order,
        );
        setCategoryFields((prev) => ({
          ...prev,
          [categoryId]: sortedFields,
        }));

        const initialFormData = {};
        sortedFields.forEach((field) => {
          if (field.fieldType === "checkbox") {
            initialFormData[field.key] = [];
          } else {
            initialFormData[field.key] = "";
          }
        });
        setFormData((prev) => ({
          ...prev,
          [categoryId]: initialFormData,
        }));
      }
    } catch (error) {
      console.error("Error fetching category fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [sector]: {
        ...prev[sector],
        [fieldKey]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!sector) return false;

    const fields = categoryFields[sector] || [];
    const data = formData[sector] || {};

    let newErrors = {};
    let firstInvalidField = null;

    // Only validate fields where isRequired === true
    fields.forEach((field) => {
      if (!field.isRequired) return;

      const value = data[field.key];
      let isEmpty = false;

      if (field.fieldType === "checkbox") {
        isEmpty = !Array.isArray(value) || value.length === 0;
      } else {
        isEmpty = !value || value.toString().trim() === "";
      }

      if (isEmpty) {
        newErrors[field.key] = `${field.label} is required`;
        if (!firstInvalidField) {
          firstInvalidField = `field-${field.key}`;
        }
      }
    });

    // Location is always required (default)
    if (!locationData?.state) {
      newErrors.location = "state";
      firstInvalidField ||= "location-section";
    } else if (!locationData?.city) {
      newErrors.location = "city";
      firstInvalidField ||= "location-section";
    } else if (!locationData?.areas?.length) {
      newErrors.location = "areas";
      firstInvalidField ||= "location-section";
    }

    setErrors(newErrors);

    if (firstInvalidField) {
      const el = document.getElementById(firstInvalidField);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = el?.querySelector("input, select, textarea");
      input?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (sector && categoryFields[sector]) {
      const currentFields = categoryFields[sector];
      const currentFormData = formData[sector] || {};

      const requiredFieldsFilled = currentFields
        .filter((field) => field.isRequired)
        .every((field) => {
          const value = currentFormData[field.key];
          if (field.fieldType === "checkbox") {
            return Array.isArray(value) && value.length > 0;
          }
          return value && value.toString().trim() !== "";
        });

      if (requiredFieldsFilled) {
        const desc = generateDescription(
          currentFields,
          currentFormData,
          locationData,
        );
        setDescription(desc);
        setIsDescriptionVisible(true);
      } else {
        setIsDescriptionVisible(false);
      }
    }
  }, [sector, formData, categoryFields]);

  const generateDescription = (fields, formData, locationData) => {
    let parts = [];

    const serviceField = fields.find((f) =>
      ["dropdown", "multiselect", "text"].includes(f.fieldType),
    );

    let serviceLabel = "";

    if (serviceField) {
      let value = formData[serviceField.key];

      if (
        serviceField.fieldType === "dropdown" ||
        serviceField.fieldType === "multiselect"
      ) {
        const option = serviceField.options?.find((opt) => opt.value === value);
        serviceLabel = option ? option.label : "";
      } else {
        serviceLabel = value;
      }

      if (serviceLabel) parts.push(`${serviceLabel} services`);
    }

    if (locationData?.city) {
      parts.push(`in ${locationData.city}`);
    }

    if (locationData?.areas?.length > 0) {
      const areaNames = locationData.areas.map((a) => a.name);
      const areasText =
        areaNames.length === 1
          ? areaNames[0]
          : areaNames.slice(0, -1).join(", ") + " and " + areaNames.slice(-1);
      parts.push(`covering ${areasText}`);
    }

    const otherParts = [];

    fields.forEach((field) => {
      if (field.key === serviceField?.key) return;
      const value = formData[field.key];
      if (!value) return;

      if (field.fieldType === "dropdown") {
        const option = field.options?.find((opt) => opt.value === value);
        if (option) otherParts.push(option.label);
      } else {
        otherParts.push(value);
      }
    });

    let sentence = `I am looking for ${parts.join(" ")}.`;

    if (otherParts.length > 0) {
      sentence = sentence.slice(0, -1);
      sentence += `, for ${otherParts.join(", ")}.`;
    }

    return sentence;
  };

  const renderField = (field) => {
    const value =
      formData[sector]?.[field.key] ||
      (field.fieldType === "checkbox" ? [] : "");

    switch (field.fieldType) {
      case "dropdown":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <div className="select-wrapper">
              <select
                id={field.key}
                className="form-select"
                value={value}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                required={field.isRequired}
              >
                <option value="">Select {field.label}</option>
                {field.options &&
                  field.options.map((option) => (
                    <option key={option._id || option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              {errors[field.key] && (
                <div className="field-error">{errors[field.key]}</div>
              )}
              <FaChevronDown className="select-arrow" />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <input
              id={field.key}
              type="text"
              className="form-input"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.key] && (
              <div className="field-error">{errors[field.key]}</div>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <textarea
              id={field.key}
              className="form-textarea"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              required={field.isRequired}
              rows={4}
            />
            {errors[field.key] && (
              <div className="field-error">{errors[field.key]}</div>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <FormControl component="fieldset" required={field.isRequired}>
              <RadioGroup
                row
                name={field.key}
                value={value}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                {field.options &&
                  field.options.map((option) => (
                    <MuiFormControlLabel
                      key={option._id || option.value}
                      value={option.value}
                      control={
                        <Radio
                          sx={{
                            color: "#1976d2",
                            "&.Mui-checked": { color: "#1976d2" },
                          }}
                        />
                      }
                      label={option.label}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </div>
        );

      case "checkbox":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <div className="checkbox-group">
              {field.options &&
                field.options.map((option) => (
                  <div
                    key={option._id || option.value}
                    className="checkbox-option"
                  >
                    <input
                      id={`${field.key}-${option.value}`}
                      type="checkbox"
                      value={option.value}
                      checked={value.includes(option.value)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...value, option.value]
                          : value.filter((v) => v !== option.value);
                        handleInputChange(field.key, newValue);
                      }}
                    />
                    <label htmlFor={`${field.key}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
            </div>
            {errors[field.key] && (
              <div className="field-error">{errors[field.key]}</div>
            )}
          </div>
        );

      case "date":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <input
              id={field.key}
              type="date"
              className="form-input"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.key] && (
              <div className="field-error">{errors[field.key]}</div>
            )}
          </div>
        );

      case "number":
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">
              {field.label}
              {field.isRequired && <span className="required"> *</span>}
            </label>
            <input
              id={field.key}
              type="number"
              className="form-input"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.key] && (
              <div className="field-error">{errors[field.key]}</div>
            )}
          </div>
        );

      default:
        return (
          <div className="form-group" key={field._id} id={`field-${field.key}`}>
            <label className="form-label">{field.label}</label>
            <input
              id={field.key}
              type="text"
              className="form-input"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
            />
            {errors[field.key] && (
              <div className="field-error">{errors[field.key]}</div>
            )}
          </div>
        );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".sector-dropdown")) {
        setIsSectorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOpen = () => {
    const isValid = validateForm();
    if (!isValid) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // All fields sorted by order — no required/optional split
  const allFields =
    sector && categoryFields[sector]
      ? [...categoryFields[sector]].sort((a, b) => a.order - b.order)
      : [];

  const handleSubmit = async () => {
    try {
      let finalQuery = description + (extraDetails ? " " + extraDetails : "");
      const queryData = {
        description: finalQuery,
        startTime: startTime ? startTime.format("hh:mm A") : "",
        endTime: endTime ? endTime.format("hh:mm A") : "",
        industry: sector,
      };

      const createQueryData = await dispatch(createQueryThunk(queryData));

      if (createQueryData?.payload?.status === true) {
        setSuccessAlert(true);
        setTimeout(() => {
          navigate("/dashboard");
          handleClose();
          // Reset form
          setSector("");
          setFormData({});
          setDescription("");
          setExtraDetails("");
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
    }
  };

  useEffect(() => {
    setLocationData(null);
  }, [sector]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Create Your Query</h2>
      </div>

      <div className="dynamic-form-wrapper">
        <div className="form-section">
          <label className="form-label">Select Industry</label>
          <div className="sector-dropdown">
            <div
              className={`sector-dropdown-toggle ${isSectorDropdownOpen ? "open" : ""}`}
              onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
            >
              <div className="selected-sector">
                <span className="selected-sector-text">
                  {sector
                    ? categories.find((c) => c._id === sector)?.name || "Loading..."
                    : "Choose an Industry..."}
                </span>
              </div>
              <FaChevronDown
                className={`dropdown-arrow ${isSectorDropdownOpen ? "rotate" : ""}`}
              />
            </div>

            {isSectorDropdownOpen && (
              <div className="sector-dropdown-menu">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className={`sector-dropdown-item ${sector === category._id ? "selected" : ""}`}
                    onClick={() => {
                      setSector(category._id);
                      setIsSectorDropdownOpen(false);
                    }}
                  >
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Form Fields */}
        {sector && categoryFields[sector] && (
          <div className="dynamic-form-content">
            <h3 className="sector-title">
              {categories.find((c) => c._id === sector)?.name} Requirements
            </h3>

            {loading ? (
              <div className="loading">Loading form fields...</div>
            ) : (
              <div className="form-fields-container">
                <div className="form-fields-grid">
                  {/* Location always shown first, always required */}
                  <div id="location-section">
                    <LocationSelector
                      onChange={setLocationData}
                      errors={errors}
                    />
                  </div>

                  {/* All fields in order sequence */}
                  {allFields.map((field) => renderField(field))}
                </div>

                <div className="submit-section">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={handleClickOpen}
                  >
                    Submit Query
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={handleClose} className="beautiful-dialog">
        <DialogTitle>Review Your Query and add extra details</DialogTitle>
        <DialogContent>
          <div className="description-review">
            <p className="description-text">{description}</p>
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Add more details (optional)"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Add more details to help refine your query..."
            multiline
            rows={4}
            value={extraDetails}
            onChange={(e) => setExtraDetails(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Add query schedule"
            onChange={() => setIsScheduleVisible(!isScheduleVisible)}
            checked={!isScheduleVisible}
          />

          {!isScheduleVisible && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker", "TimePicker"]}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  sx={{ marginRight: 2 }}
                />
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successAlert}
        autoHideDuration={2000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Query created successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewQueries;