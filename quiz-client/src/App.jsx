import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import QuizStepper from "./components/quiz/QuizStepper"
import Quiz from "./components/quiz/Quiz"
import QuizResult from "./components/quiz/QuizResult"
import AllQuestions from "./components/question/AllQuestions"
import AddQuestion from "./components/question/AddQuestion"
import UpdateQuestion from "./components/question/UpdateQuestion"
import Navbar from "./components/layout/NavBar"
import Admin from "./components/Admin"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ProtectedRoute from "./context/ProtectedRoute"
import { AuthProvider } from './context/AuthProvider'
import { Navigate } from 'react-router-dom';
import RegisterUser from "./components/RegisterUser"
import AllUsers from "./components/AllUsers"
import UpdateUser from "./components/UpdateUser"
import PasswordResetRequest from "./components/PasswordResetRequest"
import PasswordResetForm from "./components/PasswordResetForm"
import ChangePassword from "./components/ChangePassword"
import CreateQuiz from "./components/quiz/CreateQuiz"
import AllQuizzes from "./components/quiz/AllQuizzes"
import UpdateQuiz from "./components/quiz/UpdateQuiz"
import Quizzes from "./components/dashboard/Quizzes"
import Subjects from "./components/dashboard/Subjects"

function App() {
	return (
		<main className="container mt-5 mb-5">
			<Router>	<AuthProvider>

				<Navbar />
				<Routes>
					{/* Public routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/password/forgot" element={<PasswordResetRequest />} />
					<Route path="/password/reset/:token" element={<PasswordResetForm />} />

					{/* Protected routes - only for signed-in users */}

					<Route path="/" element={<Home />} />
					<Route path="/password/change" element={<ChangePassword />} />


					{/* STUDENT */}
					<Route
						path="/quiz-stepper"
						element={<ProtectedRoute element={<QuizStepper />} requiredRole="STUDENT" />}
					/>
					<Route
						path="/take-quiz"
						element={<ProtectedRoute element={<Quiz />} requiredRole="STUDENT" />}
					/>
					<Route
						path="/quiz-result"
						element={<ProtectedRoute element={<QuizResult />} requiredRole="STUDENT" />}
					/>
					<Route
						path="/subjects"
						element={<ProtectedRoute element={<Subjects />} requiredRole="STUDENT" />}
					/>
					<Route
						path="/quizzes"
						element={<ProtectedRoute element={<Quizzes />} requiredRole="STUDENT" />}
					/>


					{/* ADMIN */}
					<Route path="/admin" element={<Admin />} />
					<Route 
						path="/admin/register" 
						element={<ProtectedRoute element={<RegisterUser />} requiredRole="ADMIN" />}
					/>
					<Route 
						path="/admin/all-users" 
						element={<ProtectedRoute element={<AllUsers />} requiredRole="ADMIN" />}
					/>
					<Route 
						path="/admin/update/:id" 
						element={<ProtectedRoute element={<UpdateUser />} requiredRole="ADMIN" />}
					/>


					{/* TEACHER */}
					<Route
						path="/add-question"
						element={<ProtectedRoute element={<AddQuestion />} requiredRole="TEACHER" />}
					/>
					<Route
						path="/update-question/:id"
						element={<ProtectedRoute element={<UpdateQuestion />} requiredRole="TEACHER" />}
					/>
					<Route
						path="/all-questions"
						element={<ProtectedRoute element={<AllQuestions />} requiredRole="TEACHER" />}
					/>
					<Route
						path="/create-quiz"
						element={<ProtectedRoute element={<CreateQuiz />} requiredRole="TEACHER" />}
					/>
					<Route
						path="/update-quiz/:id"
						element={<ProtectedRoute element={<UpdateQuiz />} requiredRole="TEACHER" />}
					/>
					<Route
						path="/all-quizzes"
						element={<ProtectedRoute element={<AllQuizzes />} requiredRole="TEACHER" />}
					/>

					{/* Catch-all route */}
					<Route path="*" element={<Navigate to="/" />} />

				</Routes>


			</AuthProvider>
			</Router>
		</main>
	)
}

export default App
