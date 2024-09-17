import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// authorization
import LoginPage from './components/authorization/Login';

// profiles
import Student from './components/profiles/Student';
import Teacher from './components/profiles/Teacher';

// electives
import Electives from './components/electives/Electives';
import Enrolled from './components/electives/Enrolled';
import About from './components/electives/About';
import Madeby from './components/electives/Madeby'

// create elective
import Form from './components/electives/create/Form';

// routing
import NotFoundPage from './components/routing/NotFoundPage';
import ProtectedRoute from './components/routing/ProtectedRoute';


import Layout from './components/service/Layout';

// styles
import './styles.css';
function App() {


  return (
    <Router> 
      <Routes>
        {/* authoriation */}
        <Route path="/login" element={<LoginPage />} />

        <Route exact path ='/' element={<Layout />}>
          {/* profiles */}  
          <Route path="/profile/student" element={<ProtectedRoute element={Student} allowedRoles={['student']} />} />
          <Route path="/profile/teacher" element={<ProtectedRoute element={Teacher} allowedRoles={['teacher']} />} />

          {/* electives */}
          <Route path="/elective/all" element={<ProtectedRoute element={Electives} allowedRoles={['student', 'teacher']} />} />
          <Route path="/elective/enrolled" element={<ProtectedRoute element={Enrolled} allowedRoles={['student', 'teacher']} />} />
          <Route path="/elective/about" element={<ProtectedRoute element={About} allowedRoles={['student', 'teacher']} />} />
          <Route path="/elective/created" element={<ProtectedRoute element={Madeby} allowedRoles={['teacher']} />} />

          {/* create electives */}
          <Route path="/elective/create" element={<ProtectedRoute element={Form} allowedRoles={['teacher']} />} />
        </Route>
        {/* not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
