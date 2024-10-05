import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';

// authorization
import LoginPage from './components/authorization/Login';

// profiles
import Student from './components/profiles/Student';
import Teacher from './components/profiles/Teacher';

// electives
import Electives from './components/electives/Electives';
import About from './components/electives/About';
import Archive from './components/electives/Archive'
import Status from './components/electives/Status'

// create elective
import Form from './components/electives/formComponents/Form';
import Edit from './components/electives/formComponents/Edit';
// routing
import NotFoundPage from './components/routing/404NF';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Layout from './components/service/Layout';

// styles
import './tailwind.css';
export default function App() {
  useEffect(() => {
    function refreshTokens() {
      if (localStorage.getItem('refresh_token')) {
        fetch('http://212.67.13.70:8000/api/auth/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: localStorage.getItem('refresh_token'),
          }),
        })
          .then(response => response.json())
          .then(data => {
            localStorage.setItem('access_token', data.access);
          })
          .catch(error => console.error('Error refreshing tokens:', error));
      }
    }
  
    const minute = 60 * 1000;
    refreshTokens();
    const intervalId = setInterval(refreshTokens, minute * 5); 

    return () => clearInterval(intervalId); 
  }, []);
  

  return (
    <Router> 
      <Routes>
        {/* authoriation */}
        <Route path="/" element={<LoginPage />} />
        <Route exact path ='/' element={<Layout />}>
          {/* profiles */}  
          <Route path="/profile/student" element={<ProtectedRoute element={Student} allowedRoles={['student', 'admin']} />} />
          <Route path="/profile/teacher" element={<ProtectedRoute element={Teacher} allowedRoles={['teacher', 'admin']} />} />
          {/* electives */}
          <Route path="/electives/" element={<ProtectedRoute element={Electives} allowedRoles={['teacher', 'student']} />} />
          <Route path="/elective/about" element={<ProtectedRoute element={About} allowedRoles={['student', 'teacher', 'admin']} />} />
          <Route path="/elective/archive" element={<ProtectedRoute element={Archive} allowedRoles={['teacher', 'student', 'admin']} />} />
          <Route path="/elective/status" element={<ProtectedRoute element={Status} allowedRoles={['admin']} />} />
          {/* create electives */}
          <Route path="/elective/create" element={<ProtectedRoute element={Form} allowedRoles={['teacher', 'admin']} />} />
          <Route path="/elective/edit" element={<ProtectedRoute element={Edit} allowedRoles={['teacher', 'admin']} />} />
        </Route>
        {/* not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
