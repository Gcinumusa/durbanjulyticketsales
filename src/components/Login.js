import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./register.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://ticket.julyoceanlounges.com/api/login', credentials);
      // Assuming the response will contain the token and any other necessary data
      navigate('/dashboard', { state: { user: response.data.user } });
    } catch (err) {
      setError('Failed to login. Check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="register-container">
        <div className="register-form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="register-input"
          required
        />
          <label htmlFor="email">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="register-input"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
