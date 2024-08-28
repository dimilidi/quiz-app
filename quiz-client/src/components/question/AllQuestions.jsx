import React, { useEffect, useState } from "react"
import { deleteQuestion, getAllQuestions, getQuizById } from "../../service/QuizService"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questionsData = await getAllQuestions();

      for (let i = 0; i < questionsData.length; i++) {
        const question = questionsData[i];
        let quizNames = [];

        for (let j = 0; j < question.quizIds.length; j++) {
          const quizId = question.quizIds[j];
          const quiz = await getQuizById(quizId);
		  console.log(quiz);
		  

          if (quiz) {
            quizNames.push(quiz.title);
          } else {
            quizNames.push("Unknown Quiz");
          }
        }

        question.quizNames = quizNames.join(", ");
      }

      setQuestions(questionsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch questions or quizzes:", error);
      toast.error("Failed to load data.");
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions(questions.filter((question) => question.id !== id));
      toast.success("Question deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row mb-3">
        <div className="col-md-6">
          <h4>All Quiz Questions</h4>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/add-question" className="btn btn-primary">
            Add Question
          </Link>
        </div>
      </div>
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>#</th>
            <th>Question Title</th>
            <th>Subject</th>
            <th>Quizzes</th> {/* New Column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id}>
              <td>{index + 1}</td>
              <td>{question.title}</td>
              <td>{question.subject}</td>
              <td>{question.quizNames}</td> {/* Display quiz names */}
              <td>
                <Link to={`/update-question/${question.id}`} className="btn btn-sm btn-outline-warning me-2">
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllQuestions;
