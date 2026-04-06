import React, { useEffect, useRef, useState, useCallback } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const useAreaSuggestions = (selectedCity, selectedState, selectedCountry, freeSearch) => {
  const serviceRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const debounceTimer = useRef(null);

  const getService = () => {
    if (!serviceRef.current && window.google?.maps?.places) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
    return serviceRef.current;
  };

  const fetchSuggestions = useCallback(
    (input) => {
      if (!input || input.length < 2) { setSuggestions([]); return; }
      if (!freeSearch && (!selectedCity || !selectedState)) { setSuggestions([]); return; }

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        const service = getService();
        if (!service) return;

        const cityName    = selectedCity?.label ?? "";
        const stateName   = selectedState?.label ?? "";
        const countryName = selectedCountry?.label?.replace(/^\S+\s/, "") ?? "India";

        const searchQuery = freeSearch
          ? input
          : `${input}, ${cityName}, ${stateName}, ${countryName}`;

        service.getPlacePredictions(
          {
            input: searchQuery,
            types: ["geocode"],
            componentRestrictions: { country: selectedCountry?.value?.toLowerCase() ?? "in" },
          },
          (preds, status) => {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK || !preds) {
              setSuggestions([]); return;
            }
            if (freeSearch) { setSuggestions(preds); return; }

            const cityLower  = cityName.toLowerCase();
            const stateLower = stateName.toLowerCase();
            const inputLower = input.toLowerCase().trim();

            const filtered = preds.filter((p) => {
              const desc = p.description.toLowerCase();
              if (!desc.includes(cityLower) || !desc.includes(stateLower)) return false;
              const cityIdx  = desc.indexOf(cityLower);
              const areaPart = cityIdx > 0 ? desc.substring(0, cityIdx).replace(/,\s*$/, "").trim() : "";
              return areaPart.startsWith(inputLower) || areaPart.includes(inputLower);
            });

            setSuggestions(filtered);
          }
        );
      }, 300);
    },
    [selectedCity, selectedState, selectedCountry, freeSearch]
  );

  useEffect(() => { setSuggestions([]); setQuery(""); }, [selectedCity, selectedState]);

  return { suggestions, setSuggestions, query, setQuery, fetchSuggestions };
};

/* ── react-select custom styles ── */
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "10px",
    border: state.isFocused
      ? "2px solid #667eea"
      : "2px solid #e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(102,126,234,0.15)" : "none",
    padding: "2px 4px",
    transition: "all 0.2s",
    "&:hover": { borderColor: "#667eea" },
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : state.isFocused
      ? "rgba(102,126,234,0.08)"
      : "#fff",
    color: state.isSelected ? "#fff" : "#2d3748",
    fontWeight: state.isSelected ? 600 : 400,
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#2d3748", fontWeight: 500 }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 24px rgba(102,126,234,0.15)", border: "1px solid #e2e8f0" }),
  placeholder: (base) => ({ ...base, color: "#a0aec0" }),
};

const LocationSelector = ({ onChange, errors }) => {
  const placesServiceRef = useRef(null);
  const dummyDivRef      = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState,   setSelectedState]   = useState(null);
  const [selectedCity,    setSelectedCity]     = useState(null);
  const [areas,           setAreas]            = useState([]);
  const [areaError,       setAreaError]        = useState("");
  const [dropdownOpen,    setDropdownOpen]      = useState(false);
  const [freeSearch,      setFreeSearch]        = useState(false);

  const hasError = (field) => errors?.location === field;

  const { suggestions, setSuggestions, query, setQuery, fetchSuggestions } =
    useAreaSuggestions(selectedCity, selectedState, selectedCountry, freeSearch);

  const countries = Country.getAllCountries().map((c) => ({ value: c.isoCode, label: `${c.flag} ${c.name}` }));
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.value).map((s) => ({ value: s.isoCode, label: s.name })) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map((c) => ({ value: c.name, label: c.name })) : [];

  useEffect(() => {
    const india = countries.find((c) => c.value === "IN");
    if (india) {
      setSelectedCountry(india);
      const defaultStates = State.getStatesOfCountry("IN");
      if (defaultStates.length > 0)
        setSelectedState({ value: defaultStates[0].isoCode, label: defaultStates[0].name });
    }
  }, []);

  useEffect(() => {
    if (window.google?.maps?.places && dummyDivRef.current)
      placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
  }, []);

  useEffect(() => {
    onChange?.({ country: selectedCountry?.value ?? "IN", state: selectedState?.value, city: selectedCity?.value, areas });
  }, [selectedCountry, selectedState, selectedCity, areas]);

  useEffect(() => { setFreeSearch(false); setAreaError(""); }, [selectedCity, selectedState]);

  const handleAreaInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    setAreaError("");
    if (val.length >= 2) { setDropdownOpen(true); fetchSuggestions(val); }
    else { setDropdownOpen(false); setSuggestions([]); }
  };

  const handleNotFound = () => {
    setFreeSearch(true);
    setDropdownOpen(false);
    setSuggestions([]);
    setAreaError("");
    if (query.length >= 2) {
      setTimeout(() => { setDropdownOpen(true); fetchSuggestions(query); }, 50);
    }
  };

  const handleSelectSuggestion = (prediction) => {
    if (!placesServiceRef.current) return;
    placesServiceRef.current.getDetails(
      { placeId: prediction.place_id, fields: ["geometry", "formatted_address", "address_components"] },
      (place, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) return;
        const components   = place.address_components || [];
        const countryComp  = components.find((c) => c.types.includes("country"))?.short_name;
        const stateComp    = components.find((c) => c.types.includes("administrative_area_level_1"))?.short_name;
        const cityComp     = components.find((c) => c.types.includes("locality"))?.long_name || components.find((c) => c.types.includes("administrative_area_level_2"))?.long_name;
        const cityMatch    = cityComp?.toLowerCase() === selectedCity?.value?.toLowerCase() || cityComp?.toLowerCase() === selectedCity?.label?.toLowerCase();
        const stateMatch   = stateComp === selectedState?.value;
        const countryMatch = countryComp === selectedCountry?.value;

        if (!countryMatch || !stateMatch || !cityMatch) {
          setAreaError(`"${cityComp || "This area"}" does not belong to ${selectedCity?.label}, ${selectedState?.label}. Please select a valid area.`);
          setQuery(""); setDropdownOpen(false); setSuggestions([]);
          return;
        }

        const newArea = { name: place.formatted_address || prediction.description, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        setAreas((prev) => prev.find((a) => a.name === newArea.name) ? prev : [...prev, newArea]);
        setAreaError(""); setQuery(""); setDropdownOpen(false); setSuggestions([]); setFreeSearch(false);
      }
    );
  };

  const removeArea = (index) => setAreas((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ── dropdown container style ── */
  const dropdownBase = {
    position: "absolute", top: "100%", left: 0, right: 0,
    zIndex: 9999,
    background: "#fff",
    borderRadius: "10px",
    marginTop: "4px",
    boxShadow: "0 8px 28px rgba(102,126,234,0.18)",
    border: "1px solid #e2e8f0",
  };

  /* ── input style ── */
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: freeSearch ? "2px solid #667eea" : "2px solid #e2e8f0",
    fontSize: "0.9rem",
    color: "#2d3748",
    outline: "none",
    transition: "all 0.2s",
    background: "#fff",
    boxSizing: "border-box",
    boxShadow: freeSearch ? "0 0 0 3px rgba(102,126,234,0.15)" : "none",
  };

  return (
    <div className="location-container">
      <div ref={dummyDivRef} style={{ display: "none" }} />

      {/* STATE */}
      <div className="form-group">
        <label className="form-label">State *</label>
        <Select
          styles={selectStyles}
          options={states}
          value={selectedState}
          onChange={(value) => { setSelectedState(value); setSelectedCity(null); setAreas([]); }}
          placeholder="Search State..."
          isDisabled={!selectedCountry}
        />
        {hasError("state") && <div className="field-error">State is required</div>}
      </div>

      {/* CITY */}
      <div className="form-group">
        <label className="form-label">City *</label>
        <Select
          styles={selectStyles}
          options={cities}
          value={selectedCity}
          onChange={(value) => { setSelectedCity(value); setAreas([]); }}
          placeholder="Search City..."
          isDisabled={!selectedState}
        />
        {hasError("city") && <div className="field-error">City is required</div>}
      </div>

      {/* AREA */}
      <div className="form-group" style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
        <label className="form-label">
          Areas / Localities
          {/* {freeSearch && (
            <span style={{
              marginLeft: "8px", fontSize: "0.7rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff", borderRadius: "4px", padding: "2px 8px", fontWeight: 600,
            }}>
              Free Search
            </span>
          )} */}
        </label>

        <input
          className="form-input"
          style={inputStyle}
          type="text"
          placeholder={
            !selectedCity ? "Select a city first"
            : freeSearch  ? "Search any area (filter removed)..."
            : `Search area in ${selectedCity.label}...`
          }
          disabled={!selectedCity}
          value={query}
          onChange={handleAreaInput}
          onFocus={() => { if (suggestions.length > 0) setDropdownOpen(true); }}
          autoComplete="off"
        />

        {/* Suggestions */}
        {dropdownOpen && suggestions.length > 0 && (
          <ul style={{ ...dropdownBase, padding: "4px 0", listStyle: "none", maxHeight: "220px", overflowY: "auto" }}>
            {suggestions.map((pred) => {
              const cityIdx  = pred.description.toLowerCase().indexOf((selectedCity?.label ?? "").toLowerCase());
              const areaLabel = !freeSearch && cityIdx > 0
                ? pred.description.substring(0, cityIdx).replace(/,\s*$/, "")
                : pred.description;

              return (
                <li
                  key={pred.place_id}
                  onClick={() => handleSelectSuggestion(pred)}
                  style={{ padding: "10px 14px", cursor: "pointer", fontSize: "0.875rem", color: "#2d3748", borderBottom: "1px solid #f0f0f5", transition: "all 0.15s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#2d3748";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.8rem" }}>📍</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{areaLabel}</div>
                      {!freeSearch && (
                        <div style={{ fontSize: "0.75rem", opacity: 0.55, marginTop: "2px" }}>
                          {selectedCity?.label}, {selectedState?.label}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* No results + Not Found button */}
        {dropdownOpen && query.length >= 2 && suggestions.length === 0 && !freeSearch && (
          <div style={{ ...dropdownBase, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <span style={{ fontSize: "0.84rem", color: "#718096" }}>
                No areas found in <b style={{ color: "#2d3748" }}>{selectedCity?.label}, {selectedState?.label}</b>
              </span>
              <button
                onClick={handleNotFound}
                style={{
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "7px",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "6px 12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(102,126,234,0.35)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Not Found?
              </button>
            </div>
          </div>
        )}

        {/* No results in free mode */}
        {dropdownOpen && query.length >= 2 && suggestions.length === 0 && freeSearch && (
          <div style={{ ...dropdownBase, padding: "12px 14px", fontSize: "0.85rem", color: "#718096" }}>
            No results found for "<b>{query}</b>"
          </div>
        )}

        {hasError("areas") && <div className="field-error">At least one area is required</div>}

        {areaError && (
          <div style={{
            background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)",
            marginTop: "6px", borderRadius: "8px", padding: "9px 13px",
          }}>
            <span style={{ color: "#e53e3e", fontSize: "0.85rem" }}>{areaError}</span>
          </div>
        )}

        {selectedCity && (
          <small className="hint-text" style={{ color: "#718096", marginTop: "5px", display: "block", fontSize: "0.78rem" }}>
            {freeSearch
              ? <>only areas in <b style={{ color: "#667eea" }}>{selectedCity.label}, {selectedState?.label}</b> will be accepted</>
              : <>Showing areas only within <b style={{ color: "#667eea" }}>{selectedCity.label}, {selectedState?.label}</b></>
            }
          </small>
        )}
      </div>

      {/* SELECTED AREAS */}
      {areas.length > 0 && (
        <div className="selected-areas" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
          {areas.map((area, index) => (
            <div
              key={index}
              className="area-chip"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff", borderRadius: "20px",
                padding: "5px 12px", fontSize: "0.82rem", fontWeight: 500,
                boxShadow: "0 2px 8px rgba(102,126,234,0.3)",
              }}
            >
              📍 {area.name}
              <span
                onClick={() => removeArea(index)}
                style={{
                  cursor: "pointer", marginLeft: "4px",
                  background: "rgba(255,255,255,0.25)", borderRadius: "50%",
                  width: "18px", height: "18px", display: "inline-flex",
                  alignItems: "center", justifyContent: "center", fontSize: "0.7rem",
                  fontWeight: 700, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.45)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;