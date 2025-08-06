import React, { useState } from 'react';
import axios from 'axios';
import '../Pages/Customer/cusLogin.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/users/forgot-password', { email });
      setMsg(res.data.message || 'Reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-container">
        <h2>Forgot Your Password?</h2>
        <p>Enter your email address and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        {msg && <p className="success-msg">{msg}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
