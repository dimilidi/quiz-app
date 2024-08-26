import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from "../service/AuthService.jsx";

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',         // Added contactNumber number field
        password: '',
        confirmPassword: '', // Added confirm password field
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
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await registerUser(formData);
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-primary">
            <div className="form-container p-5 rounded bg-white">
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center">Sign Up</h3>
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
                        <label htmlFor="contactNumber">contactNumber Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Enter contactNumber Number"
                            className="form-control"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid mt-2">
                        <button type="submit" className="btn btn-primary">
                            Sign Up
                        </button>
                    </div>
                    <p className="text-end mt-2">
                        Already registered?{' '}
                        <Link to="/login" className="ms-2">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
