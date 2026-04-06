import React, { useState, useEffect } from "react";
import { FaChevronDown, FaPlus, FaMinus } from "react-icons/fa";
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel as MuiFormControlLabel,
} from "@mui/material";
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
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import axios from "axios";
import LocationSelector from "../LocationSelector";

const DynamicForm = () => {
  const Base_URL = import.meta.env.VITE_BASE_URL;
  const [sector, setSector] = useState("");
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isScheduleVisible, setIsScheduleVisible] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showOptional, setShowOptional] = useState(false);
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

        setShowOptional(false);
      }
    } catch (error) {
      console.error("Error fetching category fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => {
      const updatedSectorData = {
        ...prev[sector],
        [fieldKey]: value,
      };
      const fields = categoryFields[sector] || [];

      fields.forEach((field) => {
        if (field.dependsOn === fieldKey) {
          updatedSectorData[field.key] =
            field.fieldType === "multiselect" ? [] : "";
        }
      });

      return {
        ...prev,
        [sector]: updatedSectorData,
      };
    });
  };

  const validateForm = () => {
    if (!sector) return false;

    const fields = categoryFields[sector] || [];
    const data = formData[sector] || {};

    let newErrors = {};
    let firstInvalidField = null;

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

    // ✅ LOCATION VALIDATION
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

    // ✅ SCROLL TO FIRST ERROR

    if (firstInvalidField) {
      const el = document.getElementById(firstInvalidField);

      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

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
  }, [sector, formData, categoryFields, locationData]);

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

    // ✅ City from LocationSelector
    if (locationData?.city) {
      parts.push(`in ${locationData.city}`);
    }

    // ✅ Areas from LocationSelector
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
                    <option
                      key={option._id || option.value}
                      value={option.value}
                    >
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
          <div
            className="form-group"
            key={field._id}
            id={`field-${field.key}`}
          >
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
                      id={field.key}
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
                    {errors[field.key] && (
                      <div className="field-error">{errors[field.key]}</div>
                    )}
                    <label htmlFor={`${field.key}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
            </div>
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

  const requiredFields =
    sector && categoryFields[sector]
      ? categoryFields[sector].filter((field) => field.isRequired)
      : [];

  const optionalFields =
    sector && categoryFields[sector]
      ? categoryFields[sector].filter((field) => !field.isRequired)
      : [];

  const handleSubmit = () => {
    console.log("Form submitted!");
    let finalQuery = description + " " + extraDetails || "";
    let data;
    if (startTime && endTime) {
      data = {
        description: finalQuery,
        industry: sector,
        startTime: dayjs(startTime).format("hh:mm A"),
        endTime: dayjs(endTime).format("hh:mm A"),
      };
    } else {
      data = {
        description: finalQuery,
        industry: sector,
      };
    }
    navigate("/login", { state: data });

    handleClose();
  };

  useEffect(() => {
    setLocationData(null);
  }, [sector]);

  return (
    <div className="form-container" style={{ margin: "0px", padding: "0px" }}>
      <div className="form-header">
        <h2 className="form-title" style={{ color: "white" }}>
          Create Your Query
        </h2>
      </div>

      <div className="dynamic-form">
        <div className="form-section">
          <label className="form-label">Select Industry</label>
          <div className="sector-dropdown">
            <div
              className={`sector-dropdown-toggle ${
                isSectorDropdownOpen ? "open" : ""
              }`}
              onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
            >
              <div className="selected-sector">
                <span className="selected-sector-text">
                  {sector
                    ? categories.find((c) => c._id === sector)?.name ||
                      "Loading..."
                    : "Choose an Industry..."}
                </span>
              </div>
              <FaChevronDown
                className={`dropdown-arrow ${
                  isSectorDropdownOpen ? "rotate" : ""
                }`}
              />
            </div>

            {isSectorDropdownOpen && (
              <div className="sector-dropdown-menu">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className={`sector-dropdown-item ${
                      sector === category._id ? "selected" : ""
                    }`}
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

        {/* Dynamic Form */}
        {sector && categoryFields[sector] && (
          <div className="dynamic-form-content">
            <h3 className="sector-title">
              {categories.find((c) => c._id === sector)?.name} Requirements
            </h3>

            {loading ? (
              <div className="loading">Loading form fields...</div>
            ) : (
              <div className="form-fields-container">
                {/* Required fields section */}
                {requiredFields.length > 0 && (
                  <div className="required-fields-section">
                    <div className="section-header">
                      <h4>Required Information</h4>
                    </div>
                    <div className="form-fields-grid">
                      {/* {renderDefaultFields()} */}
                      <div id="location-section">
                        <LocationSelector
                          onChange={setLocationData}
                          errors={errors}
                        />
                      </div>
                      {requiredFields.map((field) => renderField(field))}
                    </div>
                  </div>
                )}

                {/* Optional fields section */}
                {optionalFields.length > 0 && (
                  <div className="optional-fields-section">
                    <div className="additional-fields-toggle">
                      <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => setShowOptional(!showOptional)}
                      >
                        {showOptional ? <FaMinus /> : <FaPlus />}
                        <span>
                          {showOptional ? "Hide" : "Show"} Additional Options
                        </span>
                      </button>
                    </div>

                    {showOptional && (
                      <div className="optional-fields-grid">
                        {optionalFields.map((field) => renderField(field))}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}

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
          <MuiFormControlLabel
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
    </div>
  );
};

export default DynamicForm;
