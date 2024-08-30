import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../../service/SubjectService";
import { getQuizzesBySubject } from "../../service/QuizService";

const QuizStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectData();
  }, []);

  const fetchSubjectData = async () => {
    try {
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const fetchQuizzesData = async (subject) => {
    try {
      const quizzesData = await getQuizzesBySubject(subject);
	  console.log(quizzesData);
	  const quizzesWithQuestions =  quizzesData.filter((quiz) => quiz.questionsCount > 0);
	  setQuizzes(quizzesWithQuestions);
      
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (selectedSubject && selectedQuiz) {
        navigate("/take-quiz", {
          state: {
            selectedQuiz,
            selectedSubject,
            startTime: new Date().toISOString() 
          },
        });
      } else {
        alert("Please select a subject and a quiz.");
      }
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubjectChange = (event) => {
    const subject = event.target.value;
    setSelectedSubject(subject);
    setSelectedQuiz("");
    fetchQuizzesData(subject);
  };

  const handleQuizChange = (event) => {
    const selectedQuizId = event.target.value;
    setSelectedQuiz(selectedQuizId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-info mb-2">I want to take a quiz on:</h3>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-info mb-2">Select a quiz:</h3>
            <select
              className="form-select"
              value={selectedQuiz}
              onChange={handleQuizChange}
              disabled={!selectedSubject}
            >
              <option value="">Select a quiz</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Confirmation</h2>
            <p>Subject: {selectedSubject}</p>
            <p>Quiz: {selectedQuiz}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const progress = currentStep === 3 ? 100 : ((currentStep - 1) / 2) * 100;
    return (
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
        >
          Step {currentStep}
        </div>
      </div>
    );
  };

  return (
    <section className="mt-5">
      <h3 style={{ color: "GrayText" }} className="mb-4">
        Welcome to quiz online
      </h3>
      {renderProgressBar()}
      <div className="card">
        <div className="card-body">
          {renderStepContent()}
          <div className="d-flex justify-content-between mt-4">
            {currentStep > 1 && (
              <button className="btn btn-primary" onClick={handlePrevious}>
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedSubject) ||
                  (currentStep === 2 && !selectedQuiz)
                }
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button className="btn btn-success" onClick={handleNext}>
                Start Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizStepper;
