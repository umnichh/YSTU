import student from '../../ystu-images/student.jpg';
import { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);

  // Загрузка данных студента
  useEffect(() => {
    fetch('http://212.67.13.70:8000/api/student/cabinet/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => setStudentData(data))
    .catch(error => console.error('Error:', error));
  }, [])

  if (!studentData) {
    return <div>Загрузка...</div>;
  }

  // Деструктуризация
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

  const program = profile.facultet.name || 'Не указано',
        healthGroup = health.name || 'Не указана';
  
  return (
    <main>
      {
        studentData && (
          <section className='border-2 flex m-4'>            
            <img className='w-1/6 min-w-52' src={student} alt='student'/>
            <div className='flex flex-col m-4 gap-4'>
              <div className='text-4xl border-b-2 border-black borderwid'>{last_name} {first_name} {middle_name}</div>
              <dl>
                <dt>Направление:</dt><dd>{program}</dd>
                <dt>Статус:</dt><dd>"Студенты"</dd>
                <dt>Курс:</dt><dd>{year_of_study}</dd>
                <dt>Группа:</dt><dd>{group}</dd>
                <dt>Успеваемость:</dt><dd id='ratings'>{average_grade}</dd>
                <dt>Группа здоровья:</dt><dd>{healthGroup}</dd>
              </dl>
            </div>
          </section>
        )
      }
    </main>
  );
}
