import React, { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';

export default function Status(){
  const navigate = useNavigate();
  const [toCheck, setToCheck] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [cancelled, setCancelled] = useState(null);
  const [comment, setComment] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [status_id, setStatus_id] = useState([]);

  useEffect(() => {
    fetch(`http://212.67.13.70:8000/api/electives/to_check/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setToCheck(data.checked_electives)
      setStatuses(data.admin_statuses)
    })
    .catch(error => console.error(error));

    fetch(`http://212.67.13.70:8000/api/electives/checked/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => setConfirmed(data))
    .catch(error => console.error(error));

    fetch(`http://212.67.13.70:8000/api/electives/cancelled/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => setCancelled(data))
    .catch(error => console.error(error));

  }, []);

  if (!toCheck || !statuses || !confirmed || !cancelled) {
    return null; 
  }

  // Запись на электив
  function enroll(id, status_id){
    fetch(`http://212.67.13.70:8000/api/electives/${id}/check/`, {
        method: 'POST',
        body: JSON.stringify({'elective_id':id,'status_id':status_id, 'comment':comment}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then(response => {
        if (response.ok) {
          alert('Вы изменили статус электива')
        } else {
          alert('Не удалось изменить статус')
        }
      })
      .catch(error => console.error(error));
  }
    
  // Обработчик клика на электив
  const handleClick = (elective) => {
    navigate('/elective/about', { state: { elective: elective } });
  };
  

  return (
    <main>
      <div className='electives'>
        <div className='elective-container'>
        <div className="searchSettings">
        </div>
          Ожидают проверки
          {toCheck.map((elective) => (
            <div key={elective.id} className='elective'>
            
              <img src={electiveImage} alt="elective" className="elective-image"/>
              <div className="elective-info">
                <div className='elective-name'>{elective.name}</div>
                <div className='elective-properties'>
                  <div>Осталось мест: {elective.place}</div>
                  <div> Входное тестирование: Отсутствует</div>
                  <div> Регистрация до: {elective.date_finish}</div>
                  <div className='elective-teachers'>
                    Преподаватели: 
                    {elective.teachers.length > 0 ? (
                      elective.teachers.map((teacher) => (
                        <div key={teacher.id}>
                        • {teacher.last_name} {teacher.first_name} {teacher.middle_name} 
                        </div>
                      ))
                    ) : (
                      <span> Не указаны</span>
                    )}
                  </div>
                  <div className='elective-institutes'>
                    Институты: 
                    {elective.institutes.length > 0 ? (
                      elective.institutes.map((institute) => (
                        <div key={institute.id}>
                        • {institute.name} 
                        </div>
                      ))
                    ) : (
                      <span>Электив для всех направлений</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="elective-buttons">

              <button className="elective-edit" type='button' onClick={() => enroll(elective.id, status_id)} >Принять</button>

                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
          <div>Статус:
                  <select name="status" id="status" onChange={(e) => setStatus_id(e.target.value)}>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id} >{status.name}</option>
                    ))}
                  </select>
                  {
                    status_id == 3 ? <input required type='textarea' onChange={(e) => setComment(e.target.value)}/> : <></>
                  }
          </div>
          Подтвержденные
          {confirmed.map((elective) => (
            <div key={elective.id} className='elective'>
            
              <img src={electiveImage} alt="elective" className="elective-image"/>
              <div className="elective-info">
                <div className='elective-name'>{elective.name}</div>
                <div className='elective-properties'>
                  <div>Осталось мест: {elective.place}</div>
                  <div> Входное тестирование: Отсутствует</div>
                  <div> Регистрация до: {elective.date_finish}</div>
                  <div className='elective-teachers'>
                    Преподаватели: 
                    {elective.teachers.length > 0 ? (
                      elective.teachers.map((teacher) => (
                        <div key={teacher.id}>
                        • {teacher.last_name} {teacher.first_name} {teacher.middle_name} 
                        </div>
                      ))
                    ) : (
                      <span> Не указаны</span>
                    )}
                  </div>
                  <div className='elective-institutes'>
                    Институты: 
                    {elective.institutes.length > 0 ? (
                      elective.institutes.map((institute) => (
                        <div key={institute.id}>
                        • {institute.name} 
                        </div>
                      ))
                    ) : (
                      <span>Электив для всех направлений</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="elective-buttons">

              <button className="elective-edit" type='button' onClick={() => enroll(elective.id, status_id)} >Принять</button>

                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
          <div>Статус:
                  <select name="status" id="status" onChange={(e) => setStatus_id(e.target.value)}>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id} >{status.name}</option>
                    ))}
                  </select>
                  {
                    status_id == 3 ? <input required type='textarea' onChange={(e) => setComment(e.target.value)}/> : <></>
                  }
          </div>
          Отклоненные
          {cancelled.map((elective) => (
            <div key={elective.id} className='elective'>
            
              <img src={electiveImage} alt="elective" className="elective-image"/>
              <div className="elective-info">
                <div className='elective-name'>{elective.name}</div>
                <div className='elective-properties'>
                  <div>Осталось мест: {elective.place}</div>
                  <div> Входное тестирование: Отсутствует</div>
                  <div> Регистрация до: {elective.date_finish}</div>
                  <div className='elective-teachers'>
                    Преподаватели: 
                    {elective.teachers.length > 0 ? (
                      elective.teachers.map((teacher) => (
                        <div key={teacher.id}>
                        • {teacher.last_name} {teacher.first_name} {teacher.middle_name} 
                        </div>
                      ))
                    ) : (
                      <span> Не указаны</span>
                    )}
                  </div>
                  <div className='elective-institutes'>
                    Институты: 
                    {elective.institutes.length > 0 ? (
                      elective.institutes.map((institute) => (
                        <div key={institute.id}>
                        • {institute.name} 
                        </div>
                      ))
                    ) : (
                      <span>Электив для всех направлений</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="elective-buttons">

              <button className="elective-edit" type='button' onClick={() => enroll(elective.id, status_id)} >Принять</button>

                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
          <div>Статус:
                  <select name="status" id="status" onChange={(e) => setStatus_id(e.target.value)}>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id} >{status.name}</option>
                    ))}
                  </select>
                  {
                    status_id == 3 ? <input required type='textarea' onChange={(e) => setComment(e.target.value)}/> : <></>
                  }
          </div>
        </div>
      </div>
    </main>
  );
}




