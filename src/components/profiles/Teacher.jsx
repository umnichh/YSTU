import teacher from '../../ystu-images/teacher.jpg';
import React, { useEffect, useState } from 'react';

function TeacherPage() {
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try{
        const response = await fetch('http://212.67.13.70:8000/api/teacher/cabinet/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        if (response.ok) {
          const data = await response.json();
          setTeacherData(data);
        }
      }
      catch (error) {
        console.log(error);
    }
  }
  getProfile();
}, [])

  const {
    last_name = '',
    first_name = '',
    middle_name = '',
  } = teacherData || {};
  
  const fullName = `${last_name} ${first_name} ${middle_name}`;

  return (
    <div className="container">
      <div className='profile'>
        <img className='profile-image' src={teacher} alt='teacher'/>
        <div className='profile-info'>
          <div className='profile-fullname'>{fullName}</div>
          <div className='profile-parameters'>
            <div className='profile-properties'>
              <span>Статус:</span>
            </div>
            <div className='profile-values'>
              <span>"Преподаватели"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherPage;

