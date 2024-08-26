import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../service/AuthService.jsx';
import { useAuth } from '../context/AuthProvider.jsx';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); 

    useEffect(() => {
        if (location.state && location.state.email) {
            setFormData({ ...formData, email: location.state.email });
        }
        // Check if email is stored in localStorage and prefill the form
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData({ ...formData, email: savedEmail });
            setRememberMe(true);
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser(formData); // Get token from loginUser
            login(token); // Pass the token to login

            // Save email to localStorage if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

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
                        <input
                            type="checkbox"
                            id='check'
                            className='custom-control custom-checkbox'
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                        <label htmlFor="check" className='custom-input-label ms-2'>
                            Remember me
                        </label>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className='btn btn-primary'>Sign in</button>
                    </div>
                    <p className='text-end mt-2'>
                        <Link to="/password/forgot">Forgot Password?</Link>
                        <Link to="/signup" className='ms-2'>Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
