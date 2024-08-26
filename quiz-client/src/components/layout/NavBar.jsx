import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthProvider';

const Navbar = () => {
	const { user } = useAuth(); // Get the user object from AuthProvider

	const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');
	const isTeacher = user && user.roles && user.roles.includes('ROLE_TEACHER');
	const isStudent = user && user.roles && user.roles.includes('ROLE_STUDENT');

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
					<ul className="navbar-nav ml-auto">
						
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
									<Link to={"/create-quiz"} className="nav-link">
										Create Quiz
									</Link>
								</li>
								<li className="nav-item">
									<Link to={"/all-quizzes"} className="nav-link">
										Manage Quizzes
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
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
