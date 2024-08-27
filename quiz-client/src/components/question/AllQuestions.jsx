import React, { useEffect, useState } from "react"
import { deleteQuestion, getAllQuestions } from "../../service/QuizService"
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
      const data = await getAllQuestions();
      setQuestions(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id}>
              <td>{index + 1}</td>
              <td>{question.title}</td>
              <td>{question.subject}</td>
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
