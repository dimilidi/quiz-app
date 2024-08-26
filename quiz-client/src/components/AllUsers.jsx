import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import ReactPaginate from 'react-paginate';
import { getAllUsers, updateUserStatus, deleteUser } from '../service/UsersService'; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10); 

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, searchTerm]);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers(currentPage, pageSize, searchTerm);
            setUsers(response.users);
            setPageCount(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await updateUserStatus(id, newStatus); // Update the user status
            setUsers(users.map(user =>
                user.id === id ? { ...user, status: newStatus } : user
            ));
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error(error.message)
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            fetchUsers(); // Refresh the list of users
        } catch (error) {
            console.error('Failed to delete user', error);
            toast.error(error.message)
        }
    };
    

    const columns = useMemo(
        () => [
            { Header: 'Name', accessor: 'name' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Contact Number', accessor: 'contactNumber' },
            {
                Header: 'Role',
                accessor: 'roles',
                Cell: ({ value }) => value.map(role => role.toLowerCase()).join(', '),
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: ({ row }) => (
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={row.original.status === 'ACTIVE'}
                            onChange={() => handleStatusChange(row.original.id, row.original.status)}
                        />
                        <label className="form-check-label">
                            {row.original.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </label>
                    </div>
                ),
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div className="btn-group">
                        <button className="btn btn-warning btn-sm" onClick={() => handleUpdate(row.original.id)}>Update</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.original.id)}>Delete</button>
                    </div>
                ),
            },
        ],
        [users]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data: users,
            manualPagination: true,
            pageCount,
        },
        useGlobalFilter,
        usePagination
    );

    const handleSearch = (e) => {
        const value = e.target.value || '';
        setSearchTerm(value);
        setGlobalFilter(value);
        setCurrentPage(0); // Reset to the first page on search
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleUpdate = (id) => {
        navigate(`/admin/update/${id}`);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to the first page on page size change
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h2 className="mb-4">All Users</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search users"
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

export default AllUsers;
