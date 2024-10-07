import photo from '../../ystu-images/student.jpg';
import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface StudentData {
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  profile?: {
    facultet?: {
      name?: string;
    };
  };  year_of_study?: string;
  group?: string;
  average_grade?: string;
  health?: {
    name?: string;
  };
}

export default function StudentProfile() {
  const [studentData, setStudentData] = useState<StudentData>({});

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

  // Безопасная проверка на существование вложенных объектов
  const program = profile?.facultet?.name || 'Не указано',
        healthGroup = health?.name || 'Не указана';  

  return (
    <main>
      {
        studentData && (
          <>
          <section className='border-2 flex m-4'>            
            <img className='w-1/6 min-w-52' src={photo} alt='student'/>
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
          <section className='w-full p-4'>
            <details>
              <summary>Как записаться на  электив?</summary>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, suscipit reprehenderit et aspernatur eius fuga molestiae quaerat. Quia cumque amet asperiores, nam voluptatum quasi ipsam dolore, odio repellendus illum animi.</p>
            </details>
            <details>
              <summary>В чем разница между элективом и факультативом?</summary>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, suscipit reprehenderit et aspernatur eius fuga molestiae quaerat. Quia cumque amet asperiores, nam voluptatum quasi ipsam dolore, odio repellendus illum animi.</p>
            </details>
            <details>
              <summary>Зачем нужен архив?</summary>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, suscipit reprehenderit et aspernatur eius fuga molestiae quaerat. Quia cumque amet asperiores, nam voluptatum quasi ipsam dolore, odio repellendus illum animi.</p>
            </details>
          </section>
          </>
        )   
      }
    </main>
  );
}
