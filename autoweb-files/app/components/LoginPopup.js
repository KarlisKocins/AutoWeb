import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';

export default function LoginPopup({ isOpen, onClose, onCreateAccountClick }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.user);
      onClose();
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="popup-title">Laipni lūdzam atpakaļ!</h2>
        <p className="popup-subtitle">Lūdzu, piesakieties savā kontā</p>
        {error && <p className="error-message">
          {error === 'Login failed' ? 'Pieteikšanās neizdevās' : error}
        </p>}
        <form className="popup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              id="username" 
              placeholder="Lietotājvārds" 
              required 
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              id="password" 
              placeholder="Parole" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-submitLogin">
            Pieslēgties
          </button>
        </form>
        <p className="popup-footer">
          Nav profila?{" "}
          <button className="create-account-btn" onClick={onCreateAccountClick}>
            Izveidot profilu
          </button>
        </p>
      </div>
    </div>
  );
}
