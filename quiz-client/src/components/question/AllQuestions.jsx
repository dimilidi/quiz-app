// import React, { useEffect, useState } from "react"
// import { deleteQuestion, getAllQuestions, getQuizById } from "../../service/QuizService"
// import { Link } from "react-router-dom"
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';


// const AllQuestions = () => {
// const [questions, setQuestions] = useState([]);
// const [isLoading, setIsLoading] = useState(true);

// useEffect(() => {
// fetchQuestions();
// }, []);

// const fetchQuestions = async () => {
// try {
// 	const questionsData = await getAllQuestions();

// 	for (let i = 0; i < questionsData.length; i++) {
// 	const question = questionsData[i];
// 	let quizNames = [];

// 	for (let j = 0; j < question.quizIds.length; j++) {
// 		const quizId = question.quizIds[j];
// 		const quiz = await getQuizById(quizId);
// 		console.log(quiz);
		

// 		if (quiz) {
// 		quizNames.push(quiz.title);
// 		} else {
// 		quizNames.push("Unknown Quiz");
// 		}
// 	}

// 	question.quizNames = quizNames.join(", ");
// 	}

// 	setQuestions(questionsData);
// 	setIsLoading(false);
// } catch (error) {
// 	console.error("Failed to fetch questions or quizzes:", error);
// 	toast.error("Failed to load data.");
// 	setIsLoading(false);
// }
// };

// const handleDeleteQuestion = async (id) => {
// try {
// 	await deleteQuestion(id);
// 	setQuestions(questions.filter((question) => question.id !== id));
// 	toast.success("Question deleted successfully.");
// } catch (error) {
// 	console.error(error);
// 	toast.error("Failed to delete question.");
// }
// };

// if (isLoading) {
// return <p>Loading...</p>;
// }

// return (
// <div className="container mt-4">
// 	<ToastContainer />
// 	<div className="row mb-3">
// 	<div className="col-md-6">
// 		<h4>All Quiz Questions</h4>
// 	</div>
// 	<div className="col-md-6 text-end">
// 		<Link to="/add-question" className="btn btn-primary">
// 		Add Question
// 		</Link>
// 	</div>
// 	</div>
// 	<table className="table table-bordered table-hover">
// 	<thead className="thead-light">
// 		<tr>
// 		<th>#</th>
// 		<th>Question Title</th>
// 		<th>Subject</th>
// 		<th>Quizzes</th> 
// 		<th>Actions</th>
// 		</tr>
// 	</thead>
// 	<tbody>
// 		{questions.map((question, index) => (
// 		<tr key={question.id}>
// 			<td>{index + 1}</td>
// 			<td>{question.title}</td>
// 			<td>{question.subject}</td>
// 			<td>{question.quizNames ? question.quizNames : "No quiz assigned"}</td> 
// 			<td>
// 			<Link to={`/update-question/${question.id}`} className="btn btn-sm btn-outline-warning me-2">
// 				Edit
// 			</Link>
// 			<button
// 				className="btn btn-sm btn-outline-danger"
// 				onClick={() => handleDeleteQuestion(question.id)}
// 			>
// 				Delete
// 			</button>
// 			</td>
// 		</tr>
// 		))}
// 	</tbody>
// 	</table>
// </div>
// );
// };

// export default AllQuestions;



import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTable, usePagination } from "react-table";
import ReactPaginate from "react-paginate";
import { getAllQuestions, getQuizById, deleteQuestion } from "../../service/QuizService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, pageSize, searchTerm]);

  const fetchQuestions = async () => {
    try {
      // Fetch paginated questions and add search term to the request
      const response = await getAllQuestions(currentPage, pageSize, searchTerm);
      const questionsData = response.content;

      // Process each question to fetch corresponding quizzes
      for (let i = 0; i < questionsData.length; i++) {
        const question = questionsData[i];
        let quizNames = [];

        for (let j = 0; j < question.quizIds.length; j++) {
          const quizId = question.quizIds[j];
          const quiz = await getQuizById(quizId);

          if (quiz) {
            quizNames.push(quiz.title);
          } else {
            quizNames.push("Unknown Quiz");
          }
        }

        question.quizNames = quizNames.join(", ");
      }

      setQuestions(questionsData);
      setPageCount(response.totalPages);
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
      console.error("Failed to delete question:", error);
      toast.error("Failed to delete question.");
    }
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Question Title", accessor: "title" },
      { Header: "Subject", accessor: "subject" },
      {
        Header: "Quizzes",
        accessor: "quizNames",
        Cell: ({ value }) => (value ? value : "No quiz assigned"),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div>
            <Link
              to={`/update-question/${row.original.id}`}
              className="btn btn-sm btn-outline-warning me-2"
            >
              Edit
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDeleteQuestion(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [questions]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: questions,
      manualPagination: true,
      pageCount,
    },
    usePagination
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearch = (e) => {
    const value = e.target.value || "";
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page on page size change
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>All Questions</h2>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/add-question" className="btn btn-primary">
            Add Question
          </Link>
        </div>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search questions"
        className="form-control mb-3"
      />
      <div className="mb-3">
        <label>Show </label>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="form-select form-select-sm d-inline w-auto mx-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
        <label> entries</label>
      </div>
      <table {...getTableProps()} className="table table-bordered table-hover">
        <thead className="thead-light">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default AllQuestions;
