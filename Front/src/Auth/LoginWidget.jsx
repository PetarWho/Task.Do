import React, { useState } from 'react';

const API_BASE_URL = 'https://localhost:7136/api/Account';

const LoginWidget = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      const jwtToken = data.Token;
      setToken(jwtToken);
      setError(null);

      console.log('JWT Token:', jwtToken);
    } catch (error) {
      setError(error.message);
      console.error('Login failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorizedRequest = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const responseData = await response.json();
      console.log('User Profile:', responseData);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Authorized request failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    
    setToken(null);
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {token && (
        <div>
          <h2>Authorized Request</h2>
          <button onClick={handleAuthorizedRequest} disabled={loading}>
            {loading ? 'Making request...' : 'Make Authorized Request'}
          </button>
          <br />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginWidget;
