import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Pages/Customer/cusLogin.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await axios.post(`http://localhost:8000/users/reset-password/${token}`, {
        newPassword
      });
      setMsg(res.data.message || 'Password updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-container">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>

        {msg && <p className="success-msg">{msg}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
