// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { getQuestionById, updateQuestion, getAllQuizzes } from "../../service/QuizService";
// import { getSubjects } from "../../service/SubjectService";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const UpdateQuestion = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [choices, setChoices] = useState([""]);
//   const [correctAnswers, setCorrectAnswers] = useState("");
//   const [subject, setSubject] = useState("");
//   const [newSubject, setNewSubject] = useState("");
//   const [subjectOptions, setSubjectOptions] = useState([]);
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     fetchQuestion();
//     fetchSubjectsAndQuizzes();
//   }, []);

//   const fetchQuestion = async () => {
//     try {
//       const questionToUpdate = await getQuestionById(id);
//       if (questionToUpdate) {
//         setTitle(questionToUpdate.title || "");
//         setChoices(questionToUpdate.choices || [""]);
//         setCorrectAnswers(questionToUpdate.correctAnswers.join(", ") || "");
//         setSubject(questionToUpdate.subject || "");
//         setSelectedQuiz(questionToUpdate.quizIds[0] || "");
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch the question:", error);
//     }
//   };

//   const fetchSubjectsAndQuizzes = async () => {
//     try {
//       const subjectsData = await getSubjects();
//       const subjects = subjectsData.map(s => s.name);
//       setSubjectOptions(subjects);

//       const quizzesData = await getAllQuizzes(0, 20);
//       setQuizzes(quizzesData.content || []);
//     } catch (error) {
//       console.error('Failed to fetch subjects or quizzes:', error);
//       toast.error("Failed to load subjects or quizzes.");
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const updatedQuestion = {
//         title,
//         choices,
//         correctAnswers: correctAnswers
//           .toString()
//           .split(",")
//           .map((answer) => answer.trim()),
//         subject,
//         quizIds: [selectedQuiz]
//       };

//       await updateQuestion(id, updatedQuestion);
//       toast.success("Question updated successfully!");
//       navigate("/all-questions");
//     } catch (error) {
//       console.error("Failed to update the question:", error);
//       toast.error("Failed to update question.");
//     }
//   };

//   const validateForm = () => {
//     let validationErrors = {};
//     let hasError = false;

//     if (!title.trim()) {
//       validationErrors.title = "Please enter the question title.";
//       hasError = true;
//     }

//     if (!subject.trim() || subject === "New") {
//       validationErrors.subject = "Please select or add a subject.";
//       hasError = true;
//     }

//     if (!selectedQuiz) {
// 	// validationErrors.selectedQuiz = "Please select a quiz.";
// 	// hasError = true;
//     }

//     if (choices.length === 0 || choices.some(choice => choice.trim().length <= 2)) {
//       validationErrors.choices = "Please enter at least one valid choice.";
//       hasError = true;
//     }

//     if (!correctAnswers.trim()) {
//       validationErrors.correctAnswers = "Please enter the correct answer(s).";
//       hasError = true;
//     }

//     setErrors(validationErrors);
//     return !hasError;
//   };

//   const handleAddSubject = () => {
//     if (newSubject.trim()) {
//       setSubject(newSubject.trim());
//       setSubjectOptions([...subjectOptions, newSubject.trim()]);
//       setNewSubject("");
//     } else {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         newSubject: "Subject cannot be empty."
//       }));
//     }
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="container">
//       <ToastContainer />
//       <h4 className="mt-5" style={{ color: "GrayText" }}>Update Quiz Question</h4>
//       <div className="col-8">
//         <form onSubmit={handleUpdate}>
// 		<div className="form-group">
//             <label className="text-info">Select Category:</label>
//             <select
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select category</option>
//               <option value={"New"}>Add New</option>
//               {subjectOptions.map((option) => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//             {errors.subject && <div className="text-danger">{errors.subject}</div>}
//           </div>

//           {subject === "New" && (
//             <div className="form-group">
//               <label className="text-info">Add New Subject:</label>
//               <input
//                 type="text"
//                 value={newSubject}
//                 onChange={(e) => setNewSubject(e.target.value)}
//                 className="form-control"
//               />
//               {errors.newSubject && <div className="text-danger">{errors.newSubject}</div>}
//               <button
//                 type="button"
//                 onClick={handleAddSubject}
//                 className="btn btn-outline-primary mt-2"
//               >
//                 Add Subject
//               </button>
//             </div>
//           )}

//           <div className="form-group">
//             <label className="text-info">Select Quiz:</label>
//             <select
//               value={selectedQuiz}
//               onChange={(e) => setSelectedQuiz(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select quiz</option>
//               {quizzes.map((quiz) => (
//                 <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
//               ))}
//             </select>
//             {errors.selectedQuiz && <div className="text-danger">{errors.selectedQuiz}</div>}
//           </div>

//           <div className="form-group">
//             <label className="text-info">Question:</label>
//             <textarea
//               className="form-control"
//               rows={4}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             ></textarea>
//             {errors.title && <div className="text-danger">{errors.title}</div>}
//           </div>

//           <div className="form-group">
//             <label className="text-info">Choices:</label>
//             {choices.map((choice, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 className="form-control mb-4"
//                 value={choice}
//                 onChange={(e) => {
//                   const updatedChoices = [...choices];
//                   updatedChoices[index] = e.target.value;
//                   setChoices(updatedChoices);
//                 }}
//                 required
//               />
//             ))}
//             {errors.choices && <div className="text-danger">{errors.choices}</div>}
//           </div>

//           <div className="form-group">
//             <label className="text-info">Correct Answer(s):</label>
//             <input
//               type="text"
//               className="form-control mb-4"
//               value={correctAnswers}
//               onChange={(e) => setCorrectAnswers(e.target.value)}
//               required
//             />
//             {errors.correctAnswers && <div className="text-danger">{errors.correctAnswers}</div>}
//           </div>

//           <div className="btn-group">
//             <button type="submit" className="btn btn-sm btn-outline-warning">
//               Update Question
//             </button>
//             <Link to={"/all-questions"} className="btn btn-outline-primary ml-2">
//               Back to All Questions
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateQuestion;


import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuestionById, updateQuestion, getAllQuizzes } from "../../service/QuizService";
import { getSubjects } from "../../service/SubjectService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UpdateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [choices, setChoices] = useState([""]);
//   const [correctAnswers, setCorrectAnswers] = useState([""]);
const [correctAnswers, setCorrectAnswers] = useState([""]);
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionToUpdate = await getQuestionById(id);
        if (questionToUpdate) {
          setTitle(questionToUpdate.title || "");
          setChoices(questionToUpdate.choices || [""]);
          setCorrectAnswers(questionToUpdate.correctAnswers || "");
          setSubject(questionToUpdate.subject || "");
          setSelectedQuiz(questionToUpdate.quizIds[0] || "");
        }
        
        const subjectsData = await getSubjects();
        setSubjectOptions(subjectsData.map(s => s.name));
        
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
  }, [id]);

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
      validationErrors.selectedQuiz = "Please select a quiz.";
      hasError = true;
    }

    if (choices.length === 0 || choices.some(choice => choice.trim().length <= 2)) {
      validationErrors.choices = "Please enter at least one valid choice.";
      hasError = true;
    }

    if (!correctAnswers.some(answer => answer.trim())) {
      validationErrors.correctAnswers = "Please enter at least one correct answer.";
      hasError = true;
    }

    setErrors(validationErrors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updatedQuestion = {
        title,
        choices,
        correctAnswers: correctAnswers
          .toString()
          .split(",")
          .map(answer => answer.trim()),
        subject,
        quizIds: [selectedQuiz]
      };

      await updateQuestion(id, updatedQuestion);
      toast.success("Question updated successfully!");
      navigate("/all-questions");
    } catch (error) {
      console.error('Failed to update the question:', error);
      toast.error("Failed to update question.");
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setSubject(newSubject.trim());
      setSubjectOptions(prevOptions => [...prevOptions, newSubject.trim()]);
      setNewSubject("");
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        newSubject: "Subject cannot be empty."
      }));
    }
  };

  const handleAddChoice = () => {
    let newChoiceLetter = choices.length ? String.fromCharCode(65 + choices.length) : "A";
    const newChoice = `${newChoiceLetter}.`;
    setChoices(prevChoices => [...prevChoices, newChoice]);
  };

  const handleRemoveChoice = (index) => {
    setChoices(prevChoices => prevChoices.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (index, value) => {
    setChoices(prevChoices => prevChoices.map((choice, i) => (i === index ? value : choice)));
  };

  const handleCorrectAnswerChange = (index, value) => {
    setCorrectAnswers(prevAnswers => prevAnswers.map((answer, i) => (i === index ? value : answer)));
  };

  const handleAddCorrectAnswer = () => {
    setCorrectAnswers(prevAnswers => [...prevAnswers, ""]);
  };

  const handleRemoveCorrectAnswer = (index) => {
    setCorrectAnswers(prevAnswers => prevAnswers.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-8 mt-5">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Update Question</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="p-3">
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label text-info">
                    Select Category
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select category</option>
                    <option value="New">Add New</option>
                    {subjectOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
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
                      className="btn btn-outline-primary mt-2"
                    >
                      Add Subject
                    </button>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="quiz" className="form-label text-info">
                    Select Quiz
                  </label>
                  <select
                    id="quiz"
                    value={selectedQuiz}
                    onChange={(e) => setSelectedQuiz(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select quiz</option>
                    {quizzes.map(quiz => (
                      <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                    ))}
                  </select>
                  {errors.selectedQuiz && <div className="text-danger">{errors.selectedQuiz}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="title-text" className="form-label text-info">
                    Question
                  </label>
                  <textarea
                    id="title-text"
                    className="form-control"
                    rows={4}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                  {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>

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
                        className="btn btn-outline-danger"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddChoice}
                    className="btn btn-outline-primary"
                  >
                    Add Choice
                  </button>
                  {errors.choices && <div className="text-danger">{errors.choices}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label text-info">Correct Answers</label>
                  {correctAnswers.map((answer, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                        className="form-control"
                        placeholder={`Answer ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCorrectAnswer(index)}
                        className="btn btn-outline-danger"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCorrectAnswer}
                    className="btn btn-outline-primary"
                  >
                    Add Correct Answer
                  </button>
                  {errors.correctAnswers && <div className="text-danger">{errors.correctAnswers}</div>}
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">Update Question</button>
                  <Link to="/all-questions" className="btn btn-secondary">Back</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestion;
