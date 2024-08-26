import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../service/AuthService.jsx';
import { useAuth } from '../context/AuthProvider.jsx';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure login from useAuth

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser(formData); // Get token from loginUser
            login(token); // Pass the token to login
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="login template d-flex justify-content-center align-items-center vh-100 bg-primary">
            <div className='form-container p-5 rounded bg-white'>
                <form onSubmit={handleSubmit}>
                    <h3 className='text-center'>Sign In</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <div className='mb-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter Email'
                            className='form-control'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder='Enter Password'
                            className='form-control'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <input type="checkbox" className='custom-control custom-checkbox' id='check' />
                        <label htmlFor="check" className='custom-input-label ms-2'>
                            Remember me
                        </label>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className='btn btn-primary'>Sign in</button>
                    </div>
                    <p className='text-end mt-2'>Forgot <a href="">Password?</a> <Link to="/signup" className='ms-2'>Sign up</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;
