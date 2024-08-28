import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';
import ReactPaginate from 'react-paginate';
import { getAllQuizzes, deleteQuiz } from '../../service/QuizService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AllQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuizzes();
    }, [currentPage, pageSize, searchTerm]);

    const fetchQuizzes = async () => {
        try {
            const response = await getAllQuizzes(currentPage, pageSize, searchTerm);
            setQuizzes(response.content);
            setPageCount(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch quizzes', error);
            toast.error('Failed to load quizzes.');
        }
    };

    const handleDeleteQuiz = async (id) => {
        try {
            await deleteQuiz(id);
            setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
            toast.success('Quiz deleted successfully.');
        } catch (error) {
            console.error('Failed to delete quiz:', error);
            toast.error('Failed to delete quiz.');
        }
    };

    const columns = useMemo(
        () => [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Subject', accessor: 'subject' },
            { Header: 'Author', accessor: 'createdBy' },
            { Header: 'Update Time', accessor: 'updatedAt' },
            { Header: 'Questions Count', accessor: 'questionsCount' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        <Link
                            to={`/update-quiz/${row.original.id}`}
                            className="btn btn-sm btn-outline-warning me-2"
                        >
                            Edit
                        </Link>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteQuiz(row.original.id)}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        [quizzes]
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
            data: quizzes,
            manualPagination: true,
            pageCount,
        },
        usePagination
    );

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (e) => {
        const value = e.target.value || '';
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0);
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <div className="row mb-3">
                <div className="col-md-6">
                    <h2>All Quizzes</h2>
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/create-quiz" className="btn btn-primary">
                        Add Quiz
                    </Link>
                </div>
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search quizzes"
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
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    );
}

export default AllQuizzes;
