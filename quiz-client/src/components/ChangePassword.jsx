import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from '../service/UsersService.jsx';
import {useAuth} from '../context/AuthProvider.jsx'


const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {user} = useAuth();
    const email = user.email;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await changePassword(formData);
            toast.success("Password changed successfully!");
          
          console.log(user);
          
            navigate('/login', { state: { email } });
        } catch (err) {
            setError("Failed to change password. Please try again.");
            toast.error(err.message || 'Failed to change password');
            console.error(err.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
            <div className="form-container p-5 rounded bg-white">
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center">Change Password</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="mb-3">
                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            className="form-control"
                            placeholder="Enter old password"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="form-control"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default ChangePasswordForm;
