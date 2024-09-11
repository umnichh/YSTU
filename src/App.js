import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import StudentPage from './components/pages/StudentPage';
import StudentElectives from './components/pages/StudentElectives';



import TeacherPage from './components/pages/TeacherPage';
import NotFoundPage from './components/pages/NotFoundPage';
import ElectivePage from './components/pages/ElectivePage';
// import MyElectives from './components/pages/MyElectives';
import TeacherElectives from './components/pages/TeacherElectives';
import ProtectedRoute from './components/service/ProtectedRoute';


import './components/styles/common.css';
import './components/styles/login.css';
import './components/styles/student-profile.css';
import './components/styles/student-electives.css';
import MyElectives from './components/pages/MyElectives';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-profile" element={<ProtectedRoute element={StudentPage} allowedRoles={['student']} />} />
        <Route path="/student-electives" element={<ProtectedRoute element={StudentElectives} allowedRoles={['student']} />} />
        <Route path="/student-planned" element={<ProtectedRoute element={MyElectives} allowedRoles={['student']} />} />
        <Route path="/elective-page" element={<ProtectedRoute element={ElectivePage} allowedRoles={['student']} />} />

        <Route path="/teacher-profile" element={<ProtectedRoute element={TeacherPage} allowedRoles={['teacher']} />} />
        <Route path="/teacher-electives" element={<ProtectedRoute element={TeacherElectives} allowedRoles={['teacher']} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
