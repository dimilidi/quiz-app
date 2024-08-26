import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:8080/auth"
})


export const registerUser = async (userData) => {
    try {
        const response = await api.post("/register", userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


export const loginUser = async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.status === 200) {
        const token = response.data.data;
        return token; 
    } else {
        throw new Error('Login failed');
    }
};


export const registerUserByAdmin = async (userData) => {
    try {
        const response = await api.post('/register-by-admin', userData);
        return response.data;
    } catch (error) {
        throw error.response.data || new Error('Failed to register user');
    }
};


