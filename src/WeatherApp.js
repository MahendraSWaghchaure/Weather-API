import React, { useState } from 'react';
import { AlertCircle, Search, Thermometer, Wind, Droplet } from 'lucide-react';
import './WeatherApp.css';

const API_KEY = '01068d0761d84ccb8a980728242807'; // Replace with your actual API key
const API_BASE_URL = 'http://api.weatherapi.com/v1';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/current.json?key=${API_KEY}&q=${city}`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div className="weather-app">
      <div>
        <h1>Weather App</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <Search size={20} />
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {weather && (
          <div className="weather-info">
            <h2 className="city-name">{weather.location.name}, {weather.location.country}</h2>
            <p className="temperature">{Math.round(weather.current.temp_c)}°C</p>
            <p className="weather-condition">{weather.current.condition.text}</p>
            <div className="weather-details">
              <WeatherInfo icon={<Thermometer size={24} />} label="Feels like" value={`${Math.round(weather.current.feelslike_c)}°C`} />
              <WeatherInfo icon={<Wind size={24} />} label="Wind" value={`${weather.current.wind_kph} km/h`} />
              <WeatherInfo icon={<Droplet size={24} />} label="Humidity" value={`${weather.current.humidity}%`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WeatherInfo = ({ icon, label, value }) => (
  <div className="weather-detail-item">
    {icon}
    <p className="weather-detail-label">{label}</p>
    <p className="weather-detail-value">{value}</p>
  </div>
);

export default WeatherApp;