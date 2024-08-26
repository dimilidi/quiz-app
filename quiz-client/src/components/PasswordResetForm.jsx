import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../service/PasswordService';

function PasswordResetForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await resetPassword({ token, newPassword });
      setMessage(response.message);
      setError('');
      navigate('/login'); // Redirect to login after successful reset
    } catch (err) {
      setError(err.message || 'Reset failed');
      setMessage('');
    }
  };

  return (
    <div className="password-reset-form template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="form-container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Set New Password</h3>
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}
          <div className="mb-2">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetForm;
