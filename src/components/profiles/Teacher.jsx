import teacher from '../../ystu-images/teacher.jpg';
import { useEffect, useState } from 'react';
import Navbar from '../service/Navbar.jsx';


function TeacherPage() {

  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentToken = localStorage.getItem('access_token');
      const response = await fetch('http://212.67.13.70:8000/api/teacher/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const teacherData = await response.json();
        setTeacherData(teacherData);
      }
    };
  fetchUserData();
  }, []);

  const {
    last_name = '',
    first_name = '',
    middle_name = '',
  } = teacherData || {};
  
  const fullName = `${last_name} ${first_name} ${middle_name}`;

  return (
    <div className="student-page-container">
    <Navbar/>

    <div className='student-profile'>
      <img className='student-image' src={teacher} alt='student'/>
      <div className='student-info'>
        <div className='fullname'>{fullName}</div>
        <div className='student-parameters'>
          <div className='student-properties'>
            <span>Статус:</span>
          </div>
          <div className='student-values'>
            <span>"Преподаватели"</span>
          </div>
        </div>
      </div>
    </div>


    </div>
  );
}

export default TeacherPage;

