import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getQuestionsByQuiz } from "../../service/QuizService";
import AnswerOptions from "../../../utils/AnswerOptions";
import { addQuizAttempt } from "../../service/QuizAttemptService";
import { useAuth } from "../../context/AuthProvider"
import { getUserByEmail } from "../../service/UsersService"

const Quiz = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScores, setTotalScores] = useState(0);
  const [userId, setUserId] = useState();
  const [startTime, setStartTime] = useState(""); // Add state for start time
  const [endTime, setEndTime] = useState(""); // Add state for end time
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedQuiz } = location.state || {};
  const { user } = useAuth();

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizData(selectedQuiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (user) {
      const email = user.email;
      fetchUser(email);
    }
  }, [user]);

  useEffect(() => {
    setStartTime(location.state?.startTime || new Date().toISOString());
  }, []);

  const fetchQuizData = async (quizId) => {
    try {
      const questions = await getQuestionsByQuiz(quizId);
      setQuizQuestions(questions);
    } catch (error) {
      console.error('Failed to fetch quiz data:', error);
    }
  };

  const fetchUser = async (email) => {
    try {
      console.log(`Fetching user with email: ${email}`);
      const fetchedUser = await getUserByEmail(email); 
      setUserId(fetchedUser.id);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex((answerObj) => answerObj.id === questionId);
      const selectedAnswer = Array.isArray(answer) ? answer.map((a) => a.charAt(0)) : answer.charAt(0);

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { id: questionId, answer: selectedAnswer };
        return updatedAnswers;
      } else {
        const newAnswer = { id: questionId, answer: selectedAnswer };
        return [...prevAnswers, newAnswer];
      }
    });
  };

  const isChecked = (questionId, choice) => {
    const selectedAnswer = selectedAnswers.find((answer) => answer.id === questionId);
    if (!selectedAnswer) {
      return false;
    }
    if (Array.isArray(selectedAnswer.answer)) {
      return selectedAnswer.answer.includes(choice.charAt(0));
    }
    return selectedAnswer.answer === choice.charAt(0);
  };

  const handleCheckboxChange = (questionId, choice) => {
    setSelectedAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex((answerObj) => answerObj.id === questionId);
      const selectedAnswer = Array.isArray(choice) ? choice.map((c) => c.charAt(0)) : choice.charAt(0);

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        const existingAnswer = updatedAnswers[existingAnswerIndex].answer;
        let newAnswer;
        if (Array.isArray(existingAnswer)) {
          newAnswer = existingAnswer.includes(selectedAnswer) ? existingAnswer.filter((a) => a !== selectedAnswer) : [...existingAnswer, selectedAnswer];
        } else {
          newAnswer = [existingAnswer, selectedAnswer];
        }
        updatedAnswers[existingAnswerIndex] = { id: questionId, answer: newAnswer };
        return updatedAnswers;
      } else {
        const newAnswer = { id: questionId, answer: [selectedAnswer] };
        return [...prevAnswers, newAnswer];
      }
    });
  };

  const handleSubmit = async () => {
    let scores = 0;
    quizQuestions.forEach((question) => {
      const selectedAnswer = selectedAnswers.find((answer) => answer.id === question.id);
      if (selectedAnswer) {
        const selectedOptions = Array.isArray(selectedAnswer.answer) ? selectedAnswer.answer.map((option) => option.charAt(0)) : [selectedAnswer.answer.charAt(0)];
        const correctOptions = Array.isArray(question.correctAnswers) ? question.correctAnswers.map((option) => option.charAt(0)) : [question.correctAnswers.charAt(0)];
        const isCorrect = selectedOptions.length === correctOptions.length && selectedOptions.every((option) => correctOptions.includes(option));
        if (isCorrect) {
          scores++;
        }
      }
    });

    setTotalScores(scores);

    try {
      const actualEndTime = new Date().toISOString();

      const payload = {
        quizId: selectedQuiz,
        studentId: userId,
        startTime,
        endTime: actualEndTime, 
        score: scores,
      };

      console.log(payload);

      await addQuizAttempt(payload);
      navigate("/quiz-result", { state: { quizQuestions, totalScores: scores } });
    } catch (error) {
      console.error("Failed to save quiz attempt:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="p-5">
      <h3 className="text-info">
        Question {quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} of {quizQuestions.length}
      </h3>

      <h4 className="mb-4">
        <pre>{currentQuestionIndex + 1}. {quizQuestions[currentQuestionIndex]?.title}</pre>
      </h4>

      <AnswerOptions
        question={quizQuestions[currentQuestionIndex]}
        isChecked={isChecked}
        handleAnswerChange={handleAnswerChange}
        handleCheckboxChange={handleCheckboxChange}
      />

      <div className="mt-4">
        <button
          className="btn btn-sm btn-primary me-2"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous question
        </button>
        <button
          className={`btn btn-sm btn-info ${currentQuestionIndex === quizQuestions.length - 1 && "btn btn-sm btn-warning"}`}
          onClick={handleNextQuestion}
          disabled={!selectedAnswers.some(
            (answer) => answer.id === quizQuestions[currentQuestionIndex]?.id || answer.answer.length > 0
          )}
        >
          {currentQuestionIndex === quizQuestions.length - 1 ? "Submit quiz" : "Next question"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
