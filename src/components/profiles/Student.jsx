import student from '../../ystu-images/student.jpg';
import { useEffect, useState } from 'react';
import Navbar from '../service/Navbar.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';


function StudentPage() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentToken = localStorage.getItem('access_token');
      const response = await fetch('http://212.67.13.70:8000/api/student/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      }
    };
  fetchUserData();
  }, []);

  if (!studentData) {
    return <div></div>; 
  }

  const {
    last_name = '',
    first_name = '',
    middle_name = '',
    profile = {},
    year_of_study = 'Не указано',
    group = 'Не указана',
    average_grade = 'Не указана',
    health = {},
  } = studentData;

  const fullName = `${last_name} ${first_name} ${middle_name}`;
  const program = profile.facultet?.name || 'Не указано';
  const healthGroup = health.name || 'Не указана';
  
  return (
    <div className="student-page-container">
      <Navbar/>

      <div className='student-profile'>
        <img className='student-image' src={student} alt='student'/>
        <div className='student-info'>
          <div className='fullname'>{fullName}</div>
          <div className='student-parameters'>
            <div className='student-properties'>
              <span>Направление:</span>
              <span>Статус:</span>
              <span>Курс:</span>
              <span>Группа:</span>
              <span>Успеваемость:</span>
              <span>Группа здоровья:</span>
            </div>
            <div className='student-values'>
              <span>{program}</span>
              <span>"Студенты"</span>
              <span>{year_of_study}</span>
              <span>{group}</span>
              <span id='ratings'>{average_grade}</span>
              <span>{healthGroup}</span>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
}

export default StudentPage;



