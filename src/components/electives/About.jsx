import React, { useLocation } from 'react-router-dom';
import electiveImage from '../../ystu-images/elective.jpg';

function About() {
  const location = useLocation();
  const { state } = location;
  const elective = state?.elective || {}; 

  const {
    date_finish = '',
    date_start = '',
    describe = 'Описания нет',
    form = {}, 
    health = {},
    marks = 'Минимального порога нет',
    name = 'Название не указано',
    place = 'Количество мест не указано',
    volume = 'Объем не указан',
  } = elective;

  console.log(elective);
  return(
      <main>
      <div className="about">
      <img src={electiveImage} className="about-image" alt="Картинка электива" />
      <dl>
      <h1>{name}</h1>
        <dt>Статус:</dt><dd>{elective.status.name}</dd>
        <dt>Количество мест:</dt><dd>{place}</dd>
        <dt>Объем:</dt><dd>{volume}</dd>
        <dt>Дата начала:</dt><dd>{date_start}</dd>
        <dt>Дата окончания:</dt><dd>{date_finish}</dd>
        <dt>Форма прохождения:</dt><dd>{form.name}</dd>
      </dl>
    </div>
    <dl className='about-other'>
      <dt>Группа здоровья:</dt><dd>{health.name}</dd>
      <dt>Оценка:</dt><dd>{marks}</dd>
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
    <div className="about-description">
       {describe}
      </div>
    </main>
  )

}

export default About;