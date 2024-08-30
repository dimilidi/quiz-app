import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const subjectFilter = location.state?.subject || '';

  useEffect(() => {
    fetchQuizzesData();
  }, [page, size, subjectFilter]);

  const fetchQuizzesData = async () => {
    try {
      const quizzesData = await getQuizzesWithQuestions(page, size, subjectFilter);
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

  const handleViewDetails = (quizId) => {
    navigate(`/quiz/${quizId}`);
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
              <div className="card-body text-center">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text">{quiz.subject}</p>
                <div className="d-flex gap-2 flex-nowrap">
                  <button
                    className="btn btn-primary me-2"
                    style={{fontSize:"14px"}}
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    Start
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{fontSize:"14px"}}
                    onClick={() => handleViewDetails(quiz.id)}
                  >
                    View
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
