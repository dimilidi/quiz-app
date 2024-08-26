import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUserByAdmin } from '../service/UsersService';

function UpdateUser() {
  const { id } = useParams(); // Get user ID from URL parameters
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    role: 'TEACHER' // Default role, will be replaced by fetched user data
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(id);
        setFormData({
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
          role: user.roles[0] // Assuming user has one role, update if multiple roles are possible
        });
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await updateUserByAdmin(id, formData);
        navigate('/admin'); // Redirect to admin dashboard or another page
    } catch (err) {
        setError(err.message || 'Update failed');
    }
  };

  return (
    <div className="update-user template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="form-container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Update User</h3>
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
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
