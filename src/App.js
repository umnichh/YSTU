import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import StudentPage from './components/pages/StudentPage';
import TeacherPage from './components/pages/TeacherPage';
import NotFoundPage from './components/pages/NotFoundPage';
import ProtectedRoute from './components/service/ProtectedRoute';
import ElectivePage from './components/pages/ElectivePage';
import './components/styles/common.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student" element={<ProtectedRoute element={StudentPage} allowedRoles={['student']} />} />
        <Route path="/teacher" element={<ProtectedRoute element={TeacherPage} allowedRoles={['teacher']} />} />
        <Route path="/elective" element={<ProtectedRoute element={ElectivePage} allowedRoles={['student', 'teacher']} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
