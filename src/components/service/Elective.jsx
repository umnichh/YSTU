import { useNavigate } from 'react-router-dom';
export default function ElectiveContainer(props){
  const electives = props.electives,
        students = props.students,
        electiveImage = props.electiveImage,
        role = localStorage.getItem('role'),
        func = props.func,
        from = props.from,
        navigate = useNavigate();

  // Редактирование электива 
  const handleEdit = (elective) => {
    navigate('/elective/edit', { state: { elective: elective } });
  };

  // Подробнее об элективе
  const handleClick = (elective) => {
    navigate('/elective/about', { state: { elective: elective } });
  };


  return (
    <>
      <div className='electives'>
      {electives.map((elective) => (
        <section key={elective.id} className='elective' id={'id' + elective.id}>
          <img src={electiveImage} alt="Изображение электива" className="elective-image"/>
          <div className="elective-info">
            <div className='elective-name'>{elective.name}</div>
            <dl>
              <dt>Статус:</dt>
              <dd 
              id={'status' + elective.id} 
              className={
                from === 'Created' ? (
                  elective.admin_status.name === 'Принят' ? 'accepted-elective' :
                  elective.admin_status.name === 'Отклонён' ? 'rejected-elective' :
                  elective.admin_status.name === 'Ожидает проверки' ? 'pending-elective' : ''
                ) : ''
              }
              >
              {elective.admin_status.name}
              </dd>
              {
                elective.admin_status.name === 'Отклонён' ? (
                  <>
                  <dt>Комментарий:</dt><dd>{elective.comment}</dd>
                  </>
                ) : ''
              }
              <dt>Осталось мест:</dt><dd>{elective.studentCounters}</dd>
              <dt>Входное тестирование:</dt><dd>Отсутствует</dd>
              <dt>Регистрация до:</dt><dd>{elective.date_finish}</dd>
            </dl>
            <div className='elective-lists'>
              <dt>Преподаватели:</dt>
              <dd>
                {elective.teachers.length > 0 ? (
                  <ul>
                    {elective.teachers.map((teacher) => (
                      <li key={teacher.id}>{teacher.last_name} {teacher.first_name} {teacher.middle_name}</li>
                    ))}
                  </ul>
                ) : (
                  <span>Не указаны</span>
                )}
              </dd>
              <dt>Институты:</dt>
              <dd> 
                {elective.institutes.length > 0 ? (
                  <ul>
                    {elective.institutes.map((institute) => (
                      <li key={institute.id}>{institute.name}</li>
                    ))}
                  </ul>
                ) : (
                  <span>Не указаны</span>
                )}
              </dd>
            </div>
            {/* GOVNO KOD NIZJE */}
          </div>
          {
            students &&
            <div className='elective-teachers'>
              Студенты: 
              {students.length > 0 ? (
                students.map((student) => (
                  <div key={student.id}>
                  • {student.last_name} {student.first_name} {student.middle_name} 
                  </div>
                ))
              ) : (
                <span> Не указаны</span>
              )}
            </div>
          }
          <div className="elective-buttons">
            {
              role === 'student'? (
                <>
                  <button className="elective-signIn sign"  id={'enroll' + elective.id} type='button' onClick={() => func(elective.id, 'enroll')}>Подать заявку</button>
                  <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
                </>
              ) : role === 'teacher' || role === 'admin' ? (
                <>
                  <button className="elective-about" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
                  {
                    from == 'Created' ?  (
                      <>
                        <button className="elective-edit"  type='button' onClick={() => handleEdit(elective)} >Редактировать</button>
                        <button className="elective-signIn deleteElective"  id={'elective' + elective.id} type='button' onClick={() => func(elective.id)}>Удалить электив</button>
                      </>
                    ) : null
                  }
                </>
              ) : null
            }
          </div>
        </section> 
      ))}
      </div>
    </>
  )
}