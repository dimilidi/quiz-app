import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzesWithQuestions } from "../../service/QuizService"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzesData();
  }, [page, size]);

  const fetchQuizzesData = async () => {
    try {
      const quizzesData = await getQuizzesWithQuestions(page, size);
      setQuizzes(quizzesData.content); 
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      setError(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate("/take-quiz", { state: { selectedQuiz: quizId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text">
                  <strong>Questions:</strong> {quiz.numberOfQuestions}
                </p>
                <p className="card-text">
                  <strong>Duration:</strong> {quiz.timeLimit} minutes
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleStartQuiz(quiz.id)}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
