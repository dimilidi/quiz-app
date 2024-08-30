import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { getQuizById } from "../../service/QuizService"; 

const QuizDetails = () => {
  const { id } = useParams(); 
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchQuizDetails();
  }, []);

  const fetchQuizDetails = async () => {
    try {
      const quizData = await getQuizById(id);
      setQuiz(quizData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch quiz details:", error);
      setError(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate("/take-quiz", { state: { selectedQuiz: id } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quiz) {
    return <div>No quiz found</div>;
  }

  return (
    <div className="container mt-4">
      <h1>{quiz.title}</h1>
      <p><strong>Subject:</strong> {quiz.subject}</p>
      <p><strong>Questions:</strong> {quiz.numberOfQuestions}</p>
      <p><strong>Duration:</strong> {quiz.timeLimit} minutes</p>
      <p><strong>Description:</strong> {quiz.instructions}</p>
      <p><strong>Author:</strong> {quiz.createdBy}</p>
      <p><strong>Last Update:</strong> {quiz.updatedAt}</p>

      <button
        className="btn btn-primary mt-3"
        onClick={handleStartQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizDetails;
