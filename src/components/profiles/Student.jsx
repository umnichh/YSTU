import student from '../../ystu-images/student.jpg';
import { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';

function StudentPage() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try{
        const response = await fetch('http://212.67.13.70:8000/api/student/cabinet/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        if (response.ok) {
          const data = await response.json();
          setStudentData(data);
        }
      }
      catch (error) {
        console.log(error);
    }
  }
  getProfile();
}, [])

  if (!studentData) {
    return null; 
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
  const program = profile.facultet.name || 'Не указано';
  const healthGroup = health.name || 'Не указана';
  
  return (
    <div className="container">
      <div className='profile'>
        <img className='profile-image' src={student} alt='student'/>
        <div className='profile-info'>
          <div className='profile-fullname'>{fullName}</div>
          <div className='profile-parameters'>
            <div className='profile-properties'>
              <span>Направление:</span>
              <span>Статус:</span>
              <span>Курс:</span>
              <span>Группа:</span>
              <span>Успеваемость:</span>
              <span>Группа здоровья:</span>
            </div>
            <div className='profile-values'>
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



