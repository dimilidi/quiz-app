import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuestionById, updateQuestion } from "../../service/QuizService";

const UpdateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [choices, setChoices] = useState([""]);
  const [correctAnswers, setCorrectAnswers] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const questionToUpdate = await getQuestionById(id);
      if (questionToUpdate) {
        setTitle(questionToUpdate.title || "");
        setChoices(questionToUpdate.choices || [""]);
        setCorrectAnswers(questionToUpdate.correctAnswers.join(", ") || "");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch the question:", error);
    }
  };

  const handleQuestionChange = (e) => {
    setTitle(e.target.value);
  };

  const handleChoiceChange = (index, e) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = e.target.value;
    setChoices(updatedChoices);
  };

  const handleCorrectAnswerChange = (e) => {
    setCorrectAnswers(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedQuestion = {
        title,
        choices,
        correctAnswers: correctAnswers
          .toString()
          .split(",")
          .map((answer) => answer.trim()),
      };

      console.log("Updating question with data:", updatedQuestion); // Debugging log
      await updateQuestion(id, updatedQuestion);
      navigate("/all-questions");
    } catch (error) {
      console.error("Failed to update the question:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h4 className="mt-5" style={{ color: "GrayText" }}>
        Update Quiz Question
      </h4>
      <div className="col-8">
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="text-info">Question:</label>
            <textarea
              className="form-control"
              rows={4}
              value={title}
              onChange={handleQuestionChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="text-info">Choices:</label>
            {choices.map((choice, index) => (
              <input
                key={index}
                type="text"
                className="form-control mb-4"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e)}
                required
              />
            ))}
          </div>
          <div className="form-group">
            <label className="text-info">Correct Answer(s):</label>
            <input
              type="text"
              className="form-control mb-4"
              value={correctAnswers}
              onChange={handleCorrectAnswerChange}
              required
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-sm btn-outline-warning">
              Update question
            </button>
            <Link to={"/all-questions"} className="btn btn-outline-primary ml-2">
              Back to all questions
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
