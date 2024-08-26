import axios from 'axios';

export const api = axios.create({
  baseURL: "http://localhost:8080/password"
})

export const requestPasswordReset = async (data) => {
  try {
    const response = await api.post('/forgot', data);
    return response.data;
  } catch (error) {
    throw error.response.data || new Error('Failed to request password reset');
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post('/reset', data);
    return response.data;
  } catch (error) {
    throw error.response.data || new Error('Failed to reset password');
  }
};



