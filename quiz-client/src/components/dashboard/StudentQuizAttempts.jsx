// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTable, usePagination } from 'react-table';
// import ReactPaginate from 'react-paginate';
// import { getQuizAttemptsByUser } from '../../service/QuizAttemptService';
// import { ToastContainer, toast } from 'react-toastify';
// import { useAuth } from "../../context/AuthProvider"
// import { getUserByEmail } from "../../service/UsersService"
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';


// function StudentQuizAttempts() {
//     const [quizAttempts, setQuizAttempts] = useState([]);
//     const [pageCount, setPageCount] = useState(0);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [pageSize, setPageSize] = useState(10);
//     const [userId, setUserId] = useState();
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (user) {
//             const email = user.email;
//             fetchUser(email);
//         }
//     }, [user]);

//     useEffect(() => {
//         if (userId) {
//             fetchQuizAttempts();
//         }
//     }, [userId, currentPage, pageSize]);


//     const fetchUser = async (email) => {
//         try {
//             console.log(`Fetching user with email: ${email}`);
//             const fetchedUser = await getUserByEmail(email);
//             setUserId(fetchedUser.id);
//             console.log(fetchedUser.id);

//         } catch (error) {
//             console.error('Failed to fetch user data:', error);
//         }
//     };


//     const fetchQuizAttempts = async () => {
//         try {
//             console.log(userId);
//             const response = await getQuizAttemptsByUser(userId, currentPage, pageSize);
//             setQuizAttempts(response.content);
//             setPageCount(response.totalPages);
//         } catch (error) {
//             console.error('Failed to fetch quiz attempts', error);
//             toast.error('Failed to load quiz attempts.');
//         }
//     };



//     const handleRetakeQuiz = async (quizId) => {
//         navigate("/take-quiz", { state: { selectedQuiz: quizId } });
//     };


//     const columns = useMemo(
//         () => [
//             { Header: 'Quiz Name', accessor: 'quizName' },
//             { Header: 'Subject', accessor: 'quizSubject' },
//             { Header: 'Score', accessor: 'score' },
//             { Header: 'Quiz Time', accessor: 'timeLimit' },
//             { Header: 'My Time', accessor: 'time' },
//             { Header: 'Date', accessor: 'date' },
//             { Header: 'Questions Count', accessor: 'questionsCount' },
//             {
//                 Header: 'Actions',
//                 Cell: ({ row }) => (
//                     <button
//                         className="btn btn-sm btn-primary"
//                         onClick={() => handleRetakeQuiz(row.original.quizId)}
//                     >
//                         Retake
//                     </button>
//                 ),
//             },
//         ],
//         [quizAttempts]
//     );

//     const calculateTimeDifference = (startTime, endTime) => {
//         const start = new Date(startTime);
//         const end = new Date(endTime);
//         const difference = (end - start) / (1000 * 60);
//         return difference.toFixed(2); 
//     };

//     const dataWithComputedValues = quizAttempts.map((attempt) => ({
//         ...attempt,
//         time: calculateTimeDifference(attempt.startTime, attempt.endTime),
//         date: new Date(attempt.endTime).toLocaleDateString(),
//     }));

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         rows,
//         prepareRow,
//     } = useTable(
//         {
//             columns,
//             data: dataWithComputedValues,
//             manualPagination: true,
//             pageCount,
//         },
//         usePagination
//     );

//     const handlePageClick = (data) => {
//         setCurrentPage(data.selected);
//     };

//     const handlePageSizeChange = (e) => {
//         setPageSize(Number(e.target.value));
//         setCurrentPage(0);
//     };

//     return (
//         <div className="container mt-4">
//             <ToastContainer />
//             <div className="row mb-3">
//                 <div className="col-md-6">
//                     <h2>My Quiz Attempts</h2>
//                 </div>
//             </div>
//             <div className="mb-3">
//                 <label>Show </label>
//                 <select
//                     value={pageSize}
//                     onChange={handlePageSizeChange}
//                     className="form-select form-select-sm d-inline w-auto mx-2"
//                 >
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={30}>30</option>
//                 </select>
//                 <label> entries</label>
//             </div>
//             <table {...getTableProps()} className="table table-bordered table-hover">
//                 <thead className="thead-light">
//                     {headerGroups.map((headerGroup) => (
//                         <tr {...headerGroup.getHeaderGroupProps()}>
//                             {headerGroup.headers.map((column) => (
//                                 <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//                             ))}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                     {rows.map((row) => {
//                         prepareRow(row);
//                         return (
//                             <tr {...row.getRowProps()}>
//                                 {row.cells.map((cell) => (
//                                     <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                                 ))}
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//             <ReactPaginate
//                 previousLabel={'Previous'}
//                 nextLabel={'Next'}
//                 breakLabel={'...'}
//                 breakClassName={'page-item'}
//                 breakLinkClassName={'page-link'}
//                 pageCount={pageCount}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={5}
//                 onPageChange={handlePageClick}
//                 containerClassName={'pagination justify-content-center'}
//                 pageClassName={'page-item'}
//                 pageLinkClassName={'page-link'}
//                 previousClassName={'page-item'}
//                 previousLinkClassName={'page-link'}
//                 nextClassName={'page-item'}
//                 nextLinkClassName={'page-link'}
//                 activeClassName={'active'}
//             />
//         </div>
//     );
// }

// export default StudentQuizAttempts;


import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../../context/AuthProvider";
import { getBestQuizAttempts } from '../../service/QuizAttemptService'; 
import { getUserByEmail } from "../../service/UsersService"
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentQuizAttempts() {
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [userId, setUserId] = useState();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const email = user.email;
            fetchUser(email);
        }
    }, [user]);

    useEffect(() => {
        if (userId) {
            fetchBestQuizAttempts();
        }
    }, [userId, currentPage, pageSize]);

    const fetchUser = async (email) => {
        try {
            console.log(`Fetching user with email: ${email}`);
            const fetchedUser = await getUserByEmail(email);
            setUserId(fetchedUser.id);
            console.log(fetchedUser.id);

        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const fetchBestQuizAttempts = async () => {
        try {
            const response = await getBestQuizAttempts(userId, currentPage, pageSize);
            setQuizAttempts(response.content);
            setPageCount(response.totalPages);
            console.log(response.content);
            
        } catch (error) {
            console.error('Failed to fetch best quiz attempts', error);
            toast.error('Failed to load best quiz attempts.');
        }
    };

    const handleRetakeQuiz = async (quizId) => {
        navigate("/take-quiz", { state: { selectedQuiz: quizId } });
    };

    const columns = useMemo(
        () => [
            { Header: 'Quiz Name', accessor: 'quizName' },
            { Header: 'Subject', accessor: 'quizSubject' },
            { Header: 'Score', accessor: 'score' },
            { Header: 'Quiz Time', accessor: 'timeLimit' },
            { Header: 'My Time', accessor: 'time' },
            { Header: 'Date', accessor: 'date' },
            { Header: 'Questions Count', accessor: 'questionsCount' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleRetakeQuiz(row.original.quizId)}
                    >
                        Retake
                    </button>
                ),
            },
        ],
        [quizAttempts]
    );

    const calculateTimeDifference = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const difference = (end - start) / (1000 * 60);
        return difference.toFixed(2);
    };

    const dataWithComputedValues = quizAttempts.map((attempt) => ({
        ...attempt,
        time: calculateTimeDifference(attempt.startTime, attempt.endTime),
        date: new Date(attempt.endTime).toLocaleDateString(),
    }));

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data: dataWithComputedValues,
            manualPagination: true,
            pageCount,
        },
        usePagination
    );

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
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
                    <h2>My Quiz Attempts</h2>
                </div>
            </div>
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

export default StudentQuizAttempts;
