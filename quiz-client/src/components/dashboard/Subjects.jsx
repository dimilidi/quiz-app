import React, { useEffect, useState } from "react";
import { getSubjectsWithQuizCounts } from "../../service/SubjectService"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);

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

  return (
    <div className="container mt-4">
      <div className="row">
        {subjects.map((subject) => (
          <div key={subject.name} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{subject.name}</h5>
                <p className="card-text">Number of Quizzes: {subject.quizCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;

