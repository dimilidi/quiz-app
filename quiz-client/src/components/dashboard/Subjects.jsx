import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjectsWithQuizCounts } from "../../service/SubjectService"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectsData();
  }, []);

  const fetchSubjectsData = async () => {
    try {
      const subjectsData = await getSubjectsWithQuizCounts();
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const handleSubjectClick = (subjectName) => {
    navigate(`/quizzes`, { state: { subject: subjectName } });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {subjects.map((subject) => (
          <div 
            key={subject.name} 
            className="col-md-4 mb-4"
            onClick={() => handleSubjectClick(subject.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 subject-card">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 className="card-title text-center">{subject.name}</h5>
                <p className="card-text text-center">{subject.quizCount} {subject.quizCount > 1 ?  "Quizzes" : "Qiuz"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
