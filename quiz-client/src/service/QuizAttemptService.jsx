import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8080"
})

export const addQuizAttempt = async (quizAttempt) => {
    try {
      const token = localStorage.getItem('token'); 
  
      const response = await api.post("/quiz-attempts/add", quizAttempt, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  export const getQuizAttemptById = async (id) => {
    try {
      const token = localStorage.getItem('token'); 
  
      const response = await api.get(`/quiz-attempts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }


  export const getQuizAttemptsByUser = async (userId, page = 0, size = 10) => {
    try {
        const token = localStorage.getItem('token');
    
        if (!token) {
            throw new Error('No token found. Please log in.');
        }
    
        const response = await api.get(`/quiz-attempts/user/${userId}`, {
            params: {
                page: page,
                size: size
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Failed to get quiz attempts');
    }
};


export const getBestQuizAttempts = async (userId, page = 0, size = 10) => {
  try {
      const token = localStorage.getItem('token');
      const timestamp = new Date().getTime();
  
      if (!token) {
          throw new Error('No token found. Please log in.');
      }
  
      const response = await api.get(`/quiz-attempts/best/user/${userId}`, {
          params: {
              userId: userId,
              page: page,
              size: size,
              _: timestamp 
          },
          headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      });
  
      return response.data;
  } catch (error) {
      console.error('Failed to get best quiz attempts:', error);
      throw error.response?.data || new Error('Failed to get best quiz attempts');
  }
};
