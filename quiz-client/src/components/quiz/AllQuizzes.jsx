import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, usePagination} from 'react-table';
import ReactPaginate from 'react-paginate';
import { getAllQuizzes } from '../../service/QuizService';
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from '../../context/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AllQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
  
    useEffect(() => {
      fetchQuizzes();
    }, [currentPage, pageSize, searchTerm]);
  
    const fetchQuizzes = async () => {
      try {
        const response = await getAllQuizzes(currentPage, pageSize, searchTerm);
        setQuizzes(response.content); // Adjust based on your API response
        setPageCount(response.totalPages); // Adjust based on your API response
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      }
    };
  
    const columns = useMemo(
      () => [
        { Header: 'Title', accessor: 'title' },
        { Header: 'Subject', accessor: 'subject' },
        { Header: 'Author', accessor: 'createdBy' },
        { Header: 'Time', accessor: 'createdAt' },
        { Header: 'Questions Count', accessor: 'questionsCount' },
      ],
      []
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
      setCurrentPage(0); // Reset to the first page on search
    };
  
    const handlePageSizeChange = (e) => {
      setPageSize(Number(e.target.value));
      setCurrentPage(0); // Reset to the first page on page size change
    };
  
    return (
      <div className="container mt-4">
        <h2 className="mb-4">All Quizzes</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search quizzes"
          className="form-control mb-3"
        />
        <div className="mb-3">
          <label>Show </label>
          <select value={pageSize} onChange={handlePageSizeChange} className="form-select form-select-sm d-inline w-auto mx-2">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <label> entries</label>
        </div>
        <table {...getTableProps()} className="table table-bordered table-hover">
          <thead className="thead-light">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
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