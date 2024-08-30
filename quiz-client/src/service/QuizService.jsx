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


export const getAllQuestions= async (page, size, search = '') => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const url = api.get("/questions/all-questions", {
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


  export const getQuestionsByQuiz = async (quizId) => {
    try {
      const response = await api.get(`/questions/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions by quiz:', error);
      throw error;
    }
  };



export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/questions/question/${id}/delete`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}


// export const createQuiz = async (quiz) => {
//   try {
//     const response = await api.post("/quizzes/create", quiz)
//     return response.data
//   } catch (error) {
//     console.error(error)
//   }
// }

export const addQuiz = async (quiz) => {
  try {
    const token = localStorage.getItem('token'); 

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


export const getQuizzesWithQuestions = async (page, size, search = '') => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await api.get("/quizzes/with-questions", {
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

    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes with questions:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const getQuizzesBySubject = async (subjectName) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await api.get('/quizzes/by-subject', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        subject: subjectName 
      }
    });

    console.log(response);

    return response.data; 
  
  } catch (error) {
    console.error('Error fetching quizzes by subject:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const updateQuiz= async (id, quiz) => {
  try {
    const response = await api.put(`/quizzes/quiz/${id}/update`, quiz)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteQuiz = async (id) => {
  try {
    const response = await api.delete(`/quizzes/quiz/${id}/delete`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}