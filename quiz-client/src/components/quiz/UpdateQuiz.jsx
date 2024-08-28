import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuizById, updateQuiz } from "../../service/QuizService";
import { getSubjects } from "../../service/SubjectService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UpdateQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [instructions, setInstructions] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [errors, setErrors] = useState({
        title: "",
        subject: "",
        newSubject: "",
        instructions: "",
        timeLimit: "",
    });

    useEffect(() => {
        fetchQuiz();
        fetchSubjects();
    }, []);

    const fetchQuiz = async () => {
        try {
            const quiz = await getQuizById(id);
            if (quiz) {
                setTitle(quiz.title || "");
                setSubject(quiz.subject || "");
                setInstructions(quiz.instructions || "");
                setTimeLimit(quiz.timeLimit ? quiz.timeLimit.toString() : "");
            }
        } catch (error) {
            console.error("Failed to fetch the quiz:", error);
            toast.error("Failed to load quiz data.");
        }
    };

    const fetchSubjects = async () => {
        try {
            const subjectsData = await getSubjects();
            const subjects = subjectsData.map(s => s.name);
            setSubjectOptions(subjects);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    };

    const validateForm = () => {
        let validationErrors = {
            title: "",
            subject: "",
            newSubject: "",
            instructions: "",
            timeLimit: "",
        };
        let hasError = false;

        if (!title.trim()) {
            validationErrors.title = "Please enter a quiz title.";
            hasError = true;
        }

        if (!subject.trim() || subject === "New") {
            validationErrors.subject = "Please select or add a subject.";
            hasError = true;
        }

        if (!timeLimit.trim() || isNaN(timeLimit) || Number(timeLimit) <= 0) {
            validationErrors.timeLimit = "Please enter a valid time limit.";
            hasError = true;
        }

        setErrors(validationErrors);
        return !hasError;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const updatedQuiz = {
                title,
                subject,
                instructions,
                timeLimit: Number(timeLimit),
            };

            await updateQuiz(id, updatedQuiz);
            toast.success("Quiz updated successfully!");
            navigate("/all-quizzes");
        } catch (error) {
            console.error("Failed to update the quiz:", error);
            toast.error("Failed to update quiz.");
        }
    };

    const handleAddSubject = () => {
        if (newSubject.trim() !== "") {
            setSubject(newSubject.trim());
            setSubjectOptions(prevOptions => [...prevOptions, newSubject.trim()]);
            setNewSubject("");
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                newSubject: "Subject cannot be empty.",
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
                            <h5 className="card-title">Update Quiz</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleUpdate} className="p-2">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label text-info">Quiz Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="form-control"
                                    />
                                    {errors.title && <div className="text-danger">{errors.title}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label text-info">Select Subject</label>
                                    <select
                                        id="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Select subject</option>
                                        <option value="New">Add New</option>
                                        {subjectOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.subject && <div className="text-danger">{errors.subject}</div>}
                                </div>

                                {subject === "New" && (
                                    <div className="mb-3">
                                        <label htmlFor="new-subject" className="form-label text-info">Add New Subject</label>
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
                                    <label htmlFor="instructions" className="form-label text-info">Instructions</label>
                                    <textarea
                                        id="instructions"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        className="form-control"
                                        rows={4}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="time-limit" className="form-label text-info">Time Limit (minutes)</label>
                                    <input
                                        type="text"
                                        id="time-limit"
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(e.target.value)}
                                        className="form-control"
                                    />
                                    {errors.timeLimit && <div className="text-danger">{errors.timeLimit}</div>}
                                </div>

                                <div className="btn-group">
                                    <button type="submit" className="btn btn-outline-warning mr-2">Update Quiz</button>
                                    <Link to="/all-quizzes" className="btn btn-outline-primary ml-2">Back to All Quizzes</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuiz;
