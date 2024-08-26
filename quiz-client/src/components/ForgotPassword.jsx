import React, { useState } from 'react';
import { requestPasswordReset } from '../service/PasswordService';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestPasswordReset({ email });
            setMessage(response.message);
        } catch (err) {
            setError(err.message || 'Failed to send reset password link');
        }
    };

    return (
        <div className="forgot-password template d-flex justify-content-center align-items-center vh-100 bg-primary">
            <div className='form-container p-5 rounded bg-white'>
                <form onSubmit={handleSubmit}>
                    <h3 className='text-center'>Forgot Password</h3>
                    {message && <p className="text-success">{message}</p>}
                    {error && <p className="text-danger">{error}</p>}
                    <div className='mb-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter Email'
                            className='form-control'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className='btn btn-primary'>Send Reset Link</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
