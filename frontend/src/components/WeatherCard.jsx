import React from 'react';

const WeatherCard = ({ city, temperature, description }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <h2>{city}</h2>
      <p>Temperature: {temperature}°C</p>
      <p>{description}</p>
    </div>
  );
};

export default WeatherCard;
