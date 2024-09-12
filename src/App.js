import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// authorization
import LoginPage from './components/authorization/Login';

// profiles
import Student from './components/profiles/Student';
import Teacher from './components/profiles/Teacher';

// electives
import All from './components/electives/All';
import Info from './components/electives/Info';
import My from './components/electives/My';
import Create from './components/electives/Create';
import Made from './components/electives/Made'

// routing
import NotFoundPage from './components/routing/NotFoundPage';
import ProtectedRoute from './components/routing/ProtectedRoute';

// styles
import './components/styles/common.css';
import './components/styles/login.css';
import './components/styles/student-profile.css';
import './components/styles/student-electives.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* authoriation */}
        <Route path="/login" element={<LoginPage />} />

        {/* profiles */}  
        <Route path="/profile/student" element={<ProtectedRoute element={Student} allowedRoles={['student']} />} />
        <Route path="/profile/teacher" element={<ProtectedRoute element={Teacher} allowedRoles={['teacher']} />} />

        {/* electives */}
        <Route path="/elective/all" element={<ProtectedRoute element={All} allowedRoles={['student', 'teacher']} />} />
        <Route path="/elective/my" element={<ProtectedRoute element={My} allowedRoles={['student', 'teacher']} />} />
        <Route path="/elective/info" element={<ProtectedRoute element={Info} allowedRoles={['student', 'teacher']} />} />
        <Route path="/elective/made" element={<ProtectedRoute element={Made} allowedRoles={['teacher']} />} />

        {/* create electives */}
        <Route path="/elective/create" element={<ProtectedRoute element={Create} allowedRoles={['teacher']} />} />
        

        {/* not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
