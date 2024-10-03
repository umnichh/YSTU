import React, { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";

import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';

function Madeby(){
  const navigate = useNavigate();
  const [electives, setElectives] = useState([]);
  const currentToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role'); 
  // Запрашиваем роль


  // Переход на страницу с информацией об элективе 
  const handleClick = (elective) => {
    navigate('/elective/about', { state:{ elective: elective }});
  };


  // Загрузка созданных элективов
  useEffect(() => {
    async function fetchElectives() {
      let path;
      if (role === 'student') {
        path = 'api/archive/student/';
      } else if (role === 'teacher') {
        path = 'api/archive/teacher/';
      }
      try {
        const response = await fetch(`http://212.67.13.70:8000/${path}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          setElectives(data); // Сохраняем элективы в состояние
          console.log(data);
        } else {
          console.error('Ошибка получения элективов:', response.status); // Логируем ошибку
          console.log(response.json())
        }
      } catch (error){

        console.log(error);
      }
    }
    fetchElectives();
  }, [currentToken]);

  
  return (
    <main>
      <div className='electives'>
        <div className='elective-container'>
        <form>
        <div className='search-container'>
          <input className='search-electives' type="text" placeholder="Поиск элективов"/>
        </div>
      </form>
          {electives.map((elective) => (
            <div key={elective.id} className='elective' id = {'elective' + elective.id }>
              <img src={electiveImage} alt="elective" className="elective-image"/>
              <div className="elective-info">
                <div className='elective-name'>{elective.name}</div>
                <div className='elective-properties'>
                  <div>Статус: {elective.status.name}</div>
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
                </div>
              </div>
              <div className="elective-buttons">
                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>      
              </div>
            </div> 
          ))} 
        </div>
      </div>
      
    </main>
  );
}

export default Madeby