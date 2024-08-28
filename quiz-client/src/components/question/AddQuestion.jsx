import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createQuestion, getAllQuizzes } from "../../service/QuizService";
import { getSubjects } from "../../service/SubjectService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Component to add a new question
const AddQuestion = () => {
  // State hooks
  const [title, setTitleText] = useState("");
  const [type, setType] = useState("SINGLE");
  const [choices, setChoices] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([""]);
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  // Fetch subjects and quizzes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsData = await getSubjects();
        const subjects = subjectsData.map(s => s.name);
        setSubjectOptions(subjects);

        const quizzesData = await getAllQuizzes(0, 20); 

        setQuizzes(quizzesData.content || []);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Validate form fields
  const validateForm = () => {
    let validationErrors = {};
    let hasError = false;

    if (!title.trim()) {
      validationErrors.title = "Please enter the question title.";
      hasError = true;
    }

    if (!subject.trim() || subject === "New") {
      validationErrors.subject = "Please select or add a subject.";
      hasError = true;
    }

    if (!selectedQuiz) {
    //   validationErrors.selectedQuiz = "Please select a quiz.";
    //   hasError = true;
    }

    if (choices.length === 0 || choices.some(choice => choice.trim().length <= 2)) {
      validationErrors.choices = "Please enter at least one valid choice.";
      hasError = true;
    }

    if (correctAnswers.length === 0 || correctAnswers.some(answer => !answer.trim())) {
      validationErrors.correctAnswers = "Please enter at least one correct answer.";
      hasError = true;
    }

    setErrors(validationErrors);
    return !hasError;
  };

  // Add new choice option
  const handleAddChoice = () => {
    let newChoiceLetter = choices.length ? String.fromCharCode(65 + choices.length) : "A";
    const newChoice = `${newChoiceLetter}.`;
    setChoices([...choices, newChoice]);
  };

  // Remove choice option
  const handleRemoveChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  // Update choice value
  const handleChoiceChange = (index, value) => {
    setChoices(choices.map((choice, i) => (i === index ? value : choice)));
  };

  // Update correct answer value
  const handleCorrectAnswerChange = (index, value) => {
    setCorrectAnswers(correctAnswers.map((answer, i) => (i === index ? value : answer)));
  };

  // Add new correct answer field
  const handleAddCorrectAnswer = () => {
    setCorrectAnswers([...correctAnswers, ""]);
  };

  // Remove correct answer field
  const handleRemoveCorrectAnswer = (index) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = {
        title,
        type,
        choices,
        correctAnswers: correctAnswers.map((answer) => {
          const choiceLetter = answer.charAt(0).toUpperCase();
          const choiceIndex = choiceLetter.charCodeAt(0) - 65;
          return choiceIndex >= 0 && choiceIndex < choices.length ? choiceLetter : null;
        }),
        subject,
        quizIds: [selectedQuiz] 
      };

      await createQuestion(result);

      // Reset form fields
      setTitleText("");
      setType("SINGLE");
      setChoices([]);
      setCorrectAnswers([""]);
      setSubject("");
      setSelectedQuiz("");
      setErrors({});

      toast.success("Question added successfully!");
      navigate("/all-questions");

    } catch (error) {
      console.error(error);
      toast.error("Failed to add question.");
    }
  };

  // Add new subject
  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setSubject(newSubject.trim());
      setSubjectOptions([...subjectOptions, newSubject.trim()]);
      setNewSubject("");
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        newSubject: "Subject cannot be empty."
      }));
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Add New Question</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <form onSubmit={handleSubmit} className="p-2">
                  {/* Subject dropdown */}
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label text-info">
                      Select Category
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="form-control">
                      <option value="">Select category</option>
                      <option value="New">Add New</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.subject && <div className="text-danger">{errors.subject}</div>}
                  </div>

                  {subject === "New" && (
                    <div className="mb-3">
                      <label htmlFor="new-subject" className="form-label text-info">
                        Add New Subject
                      </label>
                      <input
                        type="text"
                        id="new-subject"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="form-control"
                      />
                      {errors.newSubject && <div className="text-danger">{errors.newSubject}</div>}

                      <button
                        type="button"
                        onClick={handleAddSubject}
                        className="btn btn-outline-primary mt-2">
                        Add Subject
                      </button>
                    </div>
                  )}

                  {/* Quiz selection dropdown */}
                  <div className="mb-3">
                    <label htmlFor="quiz" className="form-label text-info">
                      Select Quiz
                    </label>
                    <select
                      id="quiz"
                      value={selectedQuiz}
                      onChange={(e) => setSelectedQuiz(e.target.value)}
                      className="form-control">
                      <option value="">Select a quiz</option>
                      {quizzes.map((quiz) => (
                        <option key={quiz.id} value={quiz.id}>
                          {quiz.title}
                        </option>
                      ))}
                    </select>
                    {errors.selectedQuiz && <div className="text-danger">{errors.selectedQuiz}</div>}
                  </div>

                  {/* Question title */}
                  <div className="mb-3">
                    <label htmlFor="title-text" className="form-label text-info">
                      Question
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={title}
                      onChange={(e) => setTitleText(e.target.value)}></textarea>
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                  </div>

                  {/* Question type */}
                  <div className="mb-3">
                    <label htmlFor="title-type" className="form-label text-info">
                      Question Type
                    </label>
                    <select
                      id="title-type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="form-control">
                      <option value="SINGLE">Single Choice</option>
                      <option value="MULTIPLE">Multiple Choice</option>
                    </select>
                  </div>

                  {/* Choices */}
                  <div className="mb-3">
                    <label className="form-label text-info">Choices</label>
                    {choices.map((choice, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => handleChoiceChange(index, e.target.value)}
                          className="form-control"
                          placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(index)}
                          className="btn btn-outline-danger">
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddChoice}
                      className="btn btn-outline-primary">
                      Add Choice
                    </button>
                    {errors.choices && <div className="text-danger">{errors.choices}</div>}
                  </div>

                  {/* Correct Answers */}
                  <div className="mb-3">
                    <label className="form-label text-info">Correct Answers</label>
                    {correctAnswers.map((answer, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                          className="form-control"
                          placeholder={`Correct Answer ${String.fromCharCode(65 + index)}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCorrectAnswer(index)}
                          className="btn btn-outline-danger">
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCorrectAnswer}
                      className="btn btn-outline-primary">
                      Add Correct Answer
                    </button>
                    {errors.correctAnswers && <div className="text-danger">{errors.correctAnswers}</div>}
                  </div>

                  {/* Submit and Back Buttons */}
                  <div className="btn-group">
                    <button type="submit" className="btn btn-outline-success mr-2">
                      Save Question
                    </button>
                    <Link to={"/all-questions"} className="btn btn-outline-primary ml-2">
                      Back to Existing Questions
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
