import React, { useLocation } from 'react-router-dom';
import electiveImage from '../../ystu-images/elective.jpg';

export default function About() {
  const location = useLocation(),
        { state } = location,
        elective = state?.elective || {}; 

  return(
    <main>
      <div className="flex">
        <img src={electiveImage} className="w-1/6 m-6 mt-10" alt="Картинка электива" />
        <dl className='w-full h-full mr-6'>
          <h1 className='text-3xl mt-10'>{elective.name}</h1>
          <dt>Статус:</dt><dd>{elective.status.name}</dd>
          <dt>Количество мест:</dt><dd>{elective.place}</dd>
          <dt>Объем:</dt><dd>{elective.volume}</dd>
          <dt>Дата начала:</dt><dd>{elective.date_start}</dd>
          <dt>Дата окончания:</dt><dd>{elective.date_finish}</dd>
          <dt>Форма прохождения:</dt><dd>{elective.form.name}</dd>
        </dl>
      </div>
      <dl className='mx-6'>
        <dt>Группа здоровья:</dt><dd>{elective.health.name}</dd>
        <dt>Оценка:</dt><dd>{elective.marks}</dd>
        <dt>Преподаватели:</dt>
        <dd>
          {elective.teachers.length > 0 ? (
            elective.teachers.map((teacher) => (
              <div key={teacher.id}>
              • {teacher.last_name} {teacher.first_name} {teacher.middle_name} 
              </div>
            ))
          ) : (
            <span> Не указаны</span>
          )}
        </dd>
        <dt>Институты:</dt>
        <dd>
          {elective.institutes.length > 0 ? (
            elective.institutes.map((institute) => (
              <div key={institute.id}>
              • {institute.name} 
              </div>
            ))
          ) : (
            <span> Не указаны</span>
          )}
        </dd>
      </dl>
      <div>
        {elective.describe}
      </div>
    </main>
  )
}
