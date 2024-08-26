import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../service/PasswordService'

function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await requestPasswordReset({ email });
      setMessage(response.message);
      setError('');
    } catch (err) {
      setError(err.message || 'Request failed');
      setMessage('');
    }
  };

  return (
    <div className="password-reset-request template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="form-container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Reset Password</h3>
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetRequest;


// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { resetPassword } from '../service/AuthService.jsx'; // Update the path as needed

// function ResetPassword() {
// const [newPassword, setNewPassword] = useState('');
// const [confirmPassword, setConfirmPassword] = useState('');
// const [error, setError] = useState('');
// const location = useLocation();
// const [token, setToken] = useState('');

// useEffect(() => {
// const params = new URLSearchParams(location.search);
// const tokenParam = params.get('token');
// if (tokenParam) {
//     setToken(tokenParam);
// } else {
//     setError('Invalid or missing token.');
// }
// }, [location]);

// const handleSubmit = async (e) => {
// e.preventDefault();
// if (newPassword !== confirmPassword) {
//     setError('Passwords do not match');
//     return;
// }
// try {
//     await resetPassword({ token, newPassword });
//     // Handle success, e.g., redirect to login page
// } catch (err) {
//     setError(err.message || 'Failed to reset password');
// }
// };

// return (
// <div>
//     <form onSubmit={handleSubmit}>
//     <h3>Reset Password</h3>
//     {error && <p>{error}</p>}
//     <div>
//         <label>New Password</label>
//         <input
//         type="password"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         required
//         />
//     </div>
//     <div>
//         <label>Confirm Password</label>
//         <input
//         type="password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         required
//         />
//     </div>
//     <button type="submit">Reset Password</button>
//     </form>
// </div>
// );
// }

// export default ResetPassword;
