import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../Assets/travel_wallpaper.jpg';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [registerDisabled, setRegisterDisabled] = useState(true);

  useEffect(() => {
    const { username, email, password, confirmPassword } = form;
    const isValid = username && email && password && confirmPassword && password === confirmPassword;
    setRegisterDisabled(!isValid);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('✅ Registered successfully. You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <h2 style={{ textAlign: 'center' }}>📝 Register</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={{ padding: '8px', fontSize: '14px' }}
          />

          <label htmlFor="email" style={{ marginTop: 10 }}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={{ padding: '8px', fontSize: '14px' }}
          />

          <label htmlFor="password" style={{ marginTop: 10 }}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={{ padding: '8px', fontSize: '14px' }}
          />

          <label htmlFor="confirmPassword" style={{ marginTop: 10 }}>Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={{ padding: '8px', fontSize: '14px' }}
          />

          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

          <button
            type="submit"
            disabled={registerDisabled}
            style={{
              marginTop: 20,
              padding: '6px 12px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100px',
              alignSelf: 'center'
            }}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: 15, textAlign: 'center', fontSize: '14px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
