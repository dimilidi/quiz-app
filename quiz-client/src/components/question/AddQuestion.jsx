import React, { useEffect, useState } from "react"

import { Link, useNavigate } from "react-router-dom"
import { createQuestion } from "../../service/QuizService"
import { getSubjects } from "../../service/SubjectService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddQuestion = () => {
	const [title, settitleText] = useState("")
	const [type, setType] = useState("SINGLE")
	const [choices, setChoices] = useState([])
	const [correctAnswers, setCorrectAnswers] = useState([""])
	const [subject, setSubject] = useState("")
	const [newSubject, setNewSubject] = useState("")
	const [subjectOptions, setSubjectOptions] = useState([""])
	const [errors, setErrors] = useState({
		title: "",
		subject: "",
		newSubject: "",
		choices: "",
		correctAnswers: "",
	});
	const navigate = useNavigate();

	useEffect(() => {
		fetchSubjects()
	}, [])

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
			choices: "",
			correctAnswers: "",
		};

		let hasError = false;

		// Validation: Check if title is empty
		if (!title.trim()) {
			validationErrors.title = "Please enter the title text.";
			hasError = true;
		}

		// Validation: Check if subject is empty
		if (!subject.trim() || subject === "New") {
			validationErrors.subject = "Please select or add a subject.";
			hasError = true;
		}

		// Validation: Check if there are choices
		if (choices.length === 0 || choices.some(choice => choice.trim().length <= 2)) {
			validationErrors.choices = "Please enter at least one valid choice.";
			hasError = true;
		}

		// Validation: Check if there are correct answers
		if (correctAnswers.length === 0 || correctAnswers.some(answer => !answer.trim())) {
			validationErrors.correctAnswers = "Please enter at least one correct answer.";
			hasError = true;
		}

		setErrors(validationErrors);
		return !hasError;
	};


	const handleAddChoice = () => {
		let newChoiceLetter = "A";

		if (choices.length > 0) {
			const lastChoice = choices[choices.length - 1];
			const lastChoiceLetter = lastChoice ? lastChoice.charAt(0) : "A";
			newChoiceLetter = String.fromCharCode(lastChoiceLetter.charCodeAt(0) + 1);
		}

		const newChoice = `${newChoiceLetter}.`;
		setChoices([...choices, newChoice]);
	};

	const handleRemoveChoice = (index) => {
		setChoices(choices.filter((choice, i) => i !== index))
	}

	const handleChoiceChange = (index, value) => {
		setChoices(choices.map((choice, i) => (i === index ? value : choice)))
	}

	const handleCorrectAnswerChange = (index, value) => {
		setCorrectAnswers(correctAnswers.map((answer, i) => (i === index ? value : answer)))
	}

	const handleAddCorrectAnswer = () => {
		setCorrectAnswers([...correctAnswers, ""])
	}

	const handleRemoveCorrectAnswer = (index) => {
		setCorrectAnswers(correctAnswers.filter((answer, i) => i !== index))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!validateForm()) {
			console.log("Invalid form");
			return;

		}

		try {
			const result = {
				title,
				type,
				choices,
				correctAnswers: correctAnswers.map((answer) => {
					const choiceLetter = answer.charAt(0).toUpperCase()
					const choiceIndex = choiceLetter.charCodeAt(0) - 65
					return choiceIndex >= 0 && choiceIndex < choices.length ? choiceLetter : null
				}),

				subject
			}

			await createQuestion(result)

			settitleText("")
			setType("SINGLE")
			setChoices([])
			setCorrectAnswers([""])
			setSubject("")
			setErrors({})

			toast.success("title added successfully!");

			navigate("/all-questions")

		} catch (error) {
			console.error(error)
			toast.error("Failed to add title.");
		}
	}



	const handleAddSubject = () => {
		if (newSubject.trim() !== "") {
			setSubject(newSubject.trim());
			setSubjectOptions([...subjectOptions, newSubject.trim()]);
			setNewSubject("");
		} else {
			setErrors((prevErrors) => ({
				...prevErrors,
				newSubject: "Subject cannot be empty.",
			}));
		}
	};


	return (
		<div className="container">
			<ToastContainer />
			<div className="row justify-content-center">
				<div className="col-md-6  mt-5">
					<div className="card">
						<div className="card-header">
							<h5 className="card-title">Add New Question</h5>
						</div>
						<div className="card-body">
							<form onSubmit={handleSubmit} className="p-2">
								<div className="mb-3">
									<label htmlFor="subject" className="form-label text-info">
										Select category
									</label>
									<select
										id="subject"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
										className="form-control">
										<option value="">Select category</option>
										<option value={"New"}>Add New</option>
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
											onChange={(event) => setNewSubject(event.target.value)}
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
								<div className="mb-3">
									<label htmlFor="title-text" className="form-label text-info">
										Question
									</label>
									<textarea
										className="form-control"
										rows={4}
										value={title}
										onChange={(e) => settitleText(e.target.value)}></textarea>
									{errors.title && <div className="text-danger">{errors.title}</div>}
								</div>
								<div className="mb-3">
									<label htmlFor="title-type" className="form-label text-info">
										Question type
									</label>
									<select
										id="title-type"
										value={type}
										onChange={(event) => setType(event.target.value)}
										className="form-control">
										<option value="SINGLE">SINGLE</option>
										<option value="MULTIPLE">MULTIPLE</option>
									</select>
									{errors.type && <div className="text-danger">{errors.title}</div>}
								</div>
								<div className="mb-3">
									<label htmlFor="choices" className="form-label text-primary">
										Answer options
									</label>
									{choices.map((choice, index) => (
										<div key={index} className="input-group mb-3">
											<input
												type="text"
												value={choice}
												onChange={(e) => handleChoiceChange(index, e.target.value)}
												className="form-control"
											/>
											<button
												type="button"
												onClick={() => handleRemoveChoice(index)}
												className="btn btn-outline-danger">
												Remove
											</button>
										</div>
									))}
									{errors.choices && <div className="text-danger">{errors.choices}</div>}

									<br />
									<button
										type="button"
										onClick={handleAddChoice}
										className="btn btn-outline-primary">
										Add Option
									</button>
								</div>
								{type === "SINGLE" && (
									<div className="mb-3">
										<label htmlFor="answer" className="form-label text-success">
											Correct Answer
										</label>
										<input
											type="text"
											className="form-control"
											id="answer"
											value={correctAnswers[0]}
											onChange={(e) => handleCorrectAnswerChange(0, e.target.value)}
										/>
									</div>
								)}
								{type === "MULTIPLE" && (
									<div className="mb-3">
										<label htmlFor="answer" className="form-label text-success">
											Correct Answer(s)
										</label>
										{correctAnswers.map((answer, index) => (
											<div key={index} className="d-flex mb-2">
												<input
													type="text"
													className="form-control me-2"
													value={answer}
													onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
												/>
												{index > 0 && (
													<button
														type="button"
														className="btn btn-danger"
														onClick={() => handleRemoveCorrectAnswer(index)}>
														Remove
													</button>
												)}
											</div>
										))}
										<button
											type="button"
											className="btn btn-outline-info"
											onClick={handleAddCorrectAnswer}>
											Add Correct Answer
										</button>


									</div>

								)}
								{errors.correctAnswers && <div className="text-danger mb-3">{errors.correctAnswers}</div>}

								<div className="btn-group">
									<button type="submit" className="btn btn-outline-success mr-2" >
										Save question
									</button>
									<Link to={"/all-quizzes"} className="btn btn-outline-primary ml-2">
										Back to existing questions
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AddQuestion

