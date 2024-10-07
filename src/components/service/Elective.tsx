import { useNavigate } from 'react-router-dom';
import React from 'react';
import Search from './SearchBar';

type ElectiveProps = {
  electives : Record<string, any>,
  func : Function,
  from : string,
  electiveImage : string
}
export default function ElectiveContainer({
  electives,
  electiveImage,
  func,
  from,
} : ElectiveProps) {

  const role = localStorage.getItem('role'),
        navigate = useNavigate();

  // Редактирование электива 
  const handleEdit = (elective : Record<string, any>) => {
    navigate('/elective/edit', { state: { elective: elective } });
  };

  // Подробнее об элективе
  const handleClick = (elective : Record<string, any>) => {
    navigate('/elective/about', { state: { elective: elective } });
  };

  return (
    <>
    {electives.length > 0 ? (
     <>
    <Search  electives={electives}/>
    <div className='grid grid-cols-3 gap-4 mx-5'>
    {electives.map((elective : any) => (
      <section key={elective.id} className='py-3 px-5 flex flex-col justify-center items-center border-2 rounded-md overflow-hidden' id={'id' + elective.id}>
        <img src={electiveImage} alt="Изображение электива" className="h-48 mt1"/>
        <div>
          <div className='text-2xl h-20 mt-4 text-center'>{elective.name}</div>
          <dl>
            <dt>Статус:</dt>
            <dd 
            id={'status' + elective.id} 
            className={
              from === 'Created' ? (
                elective.admin_status.name === 'Принят' ? 'bg-green-500' :
                elective.admin_status.name === 'Отклонён' ? 'bg-red-500' :
                elective.admin_status.name === 'Ожидает проверки' ? 'bg-yellow-500' : ''
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
          <div className='flex flex-col mt-1 gap-1 w-full'>
            <dt>Преподаватели:</dt>
            <dd>
              {elective.teachers.length > 0 ? (
                <ul>
                  {elective.teachers.map((teacher : Record<string, any>) => (
                    <li key={teacher.id}>▸ {teacher.last_name} {teacher.first_name} {teacher.middle_name}</li>
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
                  {elective.institutes.map((institute: Record<string, any>) => (
                    <li key={institute.id}>▸ {institute.name}</li>
                  ))}
                </ul>
              ) : (
                <span>Не указаны</span>
              )}
            </dd>
          </div>
        </div>

        <div className="flex flex-col mt-4 gap-1 w-full text-white">
          {
            role === 'student'? (
              <>
                <button className="elective-signIn sign"  id={'enroll' + elective.id} type='button' onClick={() => func(elective.id, 'enroll')}>Подать заявку</button>
                <button className="bg-ystu-blue " type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </>
            ) : role === 'teacher' || role === 'admin' ? (
              <>
                <button className="bg-ystu-blue p-2 w-full" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
                {
                  from == 'Created' ?  (
                    <>
                      <button className="bg-gray-800 p-2 w-full"  type='button' onClick={() => handleEdit(elective)} >Редактировать</button>
                      <button className="bg-red-800 p-2 w-full"  id={'elective' + elective.id} type='button' onClick={() => func(elective.id)}>Удалить электив</button>
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
    ) : (
      <div className='text-3xl m-10'>Список элективов пуст</div>
    )
  }
  </>
  )
}
