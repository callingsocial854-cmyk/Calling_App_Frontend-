import React, { useState } from 'react';
import LocationSearch from './LocationSearch';

const JitsiCall = () => {
  const [origin, setOrigin] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleOriginSelect = (locationData) => {
    if (locationData) {
      setOrigin(locationData.formatted_address);
      setSelectedLocation(locationData);
      console.log("Origin selected:", locationData);
      console.log("Latitude:", locationData.latitude);
      console.log("Longitude:", locationData.longitude);
    } else {
      setOrigin("");
      setSelectedLocation(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h3>Location Search Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          From Location:
        </label>
        <LocationSearch
          placeholder="Enter location..."
          onLocationSelect={handleOriginSelect}
          value={origin}
          name="origin"
          required={true}
          style={{ marginBottom: '10px' }}
        />
      </div>

      {/* Display selected location info */}
      {selectedLocation && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h4>Selected Location:</h4>
          <p><strong>Address:</strong> {selectedLocation.formatted_address}</p>
          <p><strong>Latitude:</strong> {selectedLocation.latitude}</p>
          <p><strong>Longitude:</strong> {selectedLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default JitsiCall;