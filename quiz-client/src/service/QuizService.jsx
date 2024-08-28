import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8080"
})

export const createQuestion = async (quizQustion) => {
  try {
    const response = await api.post("/questions/create-new-question", quizQustion)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getAllQuestions = async () => {
  try {
    const response = await api.get("/questions/all-questions")
    console.log(response.data);

    return response.data
  } catch (error) {
    console.error(error)
    return []
  }
}

export const fetchQuizForUser = async (number, subject) => {
  try {
    const response = await api.get(
      `/questions/quiz/fetch-questions-for-user?numOfQuestions=${number}&subject=${subject}`
    )
    return response.data
  } catch (error) {
    console.error(error)
    return []
  }
}



export const updateQuestion = async (id, question) => {
  try {
    const response = await api.put(`/questions/question/${id}/update`, question)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/questions/question/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/questions/question/${id}/delete`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}


export const createQuiz = async (quiz) => {
  try {
    const response = await api.post("/quizzes/create", quiz)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const addQuiz = async (quiz) => {
  try {
    // Retrieve the token from wherever you have it stored (localStorage, sessionStorage, etc.)
    const token = localStorage.getItem('token'); // Example using localStorage

    // Set the Authorization header with the token
    const response = await api.post("/quizzes/add", quiz, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const getAllQuizzes = async (page, size, search = '') => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const url = api.get("/quizzes/get", {
      params: {
        page: page,
        size: size,
        search: search
      },

      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const response = await url;
    return response.data;
  } catch (error) {
    throw error.response.data || new Error('Failed to get all quizzes');
  }
};


export const getQuizById = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }
    
    const response = await api.get(`/quizzes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    return response.data
  } catch (error) {
    console.error(error)
  }
}