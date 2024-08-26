import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserByAdmin } from '../service/AuthService.jsx'; // Update this with the correct path

function RegisterUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    role: 'TEACHER' // Default role
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUserByAdmin(formData);
      navigate('/'); // Redirect to admin dashboard or another page
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-user template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="form-container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Register New User</h3>
          {error && <p className="text-danger">{error}</p>}
          <div className="mb-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter Contact Number"
              className="form-control"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;
