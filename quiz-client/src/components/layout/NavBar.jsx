import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthProvider';
import { FaUserCircle } from 'react-icons/fa'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const Navbar = () => {
	const { user, logout } = useAuth(); // Get the user object and logout function from AuthProvider

	const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');
	const isTeacher = user && user.roles && user.roles.includes('ROLE_TEACHER');
	const isStudent = user && user.roles && user.roles.includes('ROLE_STUDENT');

	const handleLogout = async () => {
		try {
			await logout(); // Call the logout function from AuthProvider
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow sticky-top">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to={"/"}>
					Online Quiz App
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto">
						{isAdmin && (
							<>
								<li className="nav-item">
									<Link to={"/admin/register"} className="nav-link">
										Register User
									</Link>
								</li>
								<li className="nav-item">
									<Link to={"/admin/all-users"} className="nav-link">
										Manage Users
									</Link>
								</li>
							</>
						)}

						{isTeacher && (
							<>
								<li className="nav-item">
									<Link to={"/create-quiz "} className="nav-link">
										Create Quiz
									</Link>
								</li>
								<li className="nav-item">
									<Link to={"/all-quizzes"} className="nav-link">
										Manage Qizzes
									</Link>
								</li>
								<li className="nav-item">
									<Link to={"/all-questions"} className="nav-link">
										Manage Questions
									</Link>
								</li>
							</>
						)}

						{isStudent && (
							<>
								<li className="nav-item">
									<NavLink className="nav-link" to={"/quiz-stepper"}>
										Take Quiz
									</NavLink>
								</li>
							</>
						)}
					</ul>

					<ul className="navbar-nav ms-auto">
						{user ? (
							<li className="nav-item dropdown">
								<a
									className="nav-link dropdown-toggle d-flex align-items-center"
									href="#"
									id="navbarDropdown"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<FaUserCircle size={30} className="me-2" /> {/* User icon */}
									<span>{user.name}</span>
								</a>
								<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
									<li>
										<Link to="/password/change" className="dropdown-item">
											Change Password
										</Link>
									</li>
									<li>
										<a className="dropdown-item" href="#" onClick={handleLogout}>
											Logout
										</a>
									</li>
								</ul>
							</li>
						) : (
							<li className="nav-item">
								<Link to={"/login"} className="nav-link">
									Login
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
