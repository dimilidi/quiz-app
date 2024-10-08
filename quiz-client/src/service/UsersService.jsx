import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:8080/users"
})



// export const getAllUsers = async () => {
// try {
//     const token = localStorage.getItem('token'); 

//     if (!token) {
//         throw new Error('No token found. Please log in.');
//     }

//     const response = await api.get('/get', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     return response.data; 
// } catch (error) {
//     throw error.response.data || new Error('Failed to get all users');
// }
// };

// export const getAllUsers = async (page, size, search = '') => {
//     try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//             throw new Error('No token found. Please log in.');
//         }

//         const url = api.get("/get", {
//             params: {
//                 page: page, // Dynamic page number
//                 size: size, // Dynamic page size
//                 search: search
//             },

//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(url);

//         const response = await url;
//         return response.data; // Make sure this matches your expected response
//     } catch (error) {
//         throw error.response.data || new Error('Failed to get all users');
//     }
// };


export const getAllUsers = async (page, size, search = '') => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await api.get('/get', {
            params: {
                page,
                size,
                search
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Failed to get all users');
    }
};



export const getUserById = async (id) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await api.get(`/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw error.response.data || new Error('Failed to fetch user data');
    }
};


export const getUserByEmail = async (email) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await api.get('/getByEmail', {
            params: { email },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Failed to fetch user by email');
    }
};

export const updateUserByAdmin = async (id, updateData) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        await api.put(`/update/${id}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error.response.data || new Error('Failed to update user');
    }
};


export const updateUserStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        await api.post('/update-status', { id, status }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error.response?.data || new Error('Failed to update user status');
    }
};


export const deleteUser = async (id) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        await api.delete(`/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        console.log('User deleted successfully');
    } catch (error) {
        console.error('Failed to delete user:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete user');
    }
}


export const changePassword = async (data) => {
    try {
      const response = await api.post('/changePassword', data);
      return response.data;
    } catch (error) {
      throw error.response.data || new Error('Failed to reset password');
    }
  };