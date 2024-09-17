import React, { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";

import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';

function Madeby(){
  const navigate = useNavigate();
  const [electives, setElectives] = useState([]);
  const currentToken = localStorage.getItem('access_token');


  // Переход на страницу с информацией об элективеq
  const handleClick = (elective) => {
    navigate('/elective/about', { state:{ elective: elective }});
  };


  // Загрузка созданных элективов
  useEffect(() => {
    async function fetchElectives() {
      try {
        const response = await fetch(`http://212.67.13.70:8000/api/electives/created/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          setElectives(data); // Сохраняем элективы в состояние
        } else {
          console.error('Ошибка получения элективов:', response.status); // Логируем ошибку
        }
      } catch (error){
        console.log(error);
      }
    }
    fetchElectives();
  }, [currentToken]);


  // Удаление электива
  async function deleteElective(id){
    const result = window.confirm('Вы уверены, что хотите удалить электив?');
    if (result) {
      try{
        const response = await fetch(`http://212.67.13.70:8000/api/electives/${id}/`, {
          method: 'DELETE',
          body: JSON.stringify(id), 
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          console.log('Электив был удален')
          document.getElementById('elective' + id).remove();
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  return (
    <div className="student-page-container">

      <form>
        <div className='search-container'>
          <input className='search-electives' type="text" placeholder="Поиск элективов"/>
        </div>
      </form>
      <div className='electives'>
        <div className='elective-container'>
          {electives.map((elective) => (
            <div key={elective.id} className='elective' id = {'elective' + elective.id }>
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
                </div>
              </div>
              <div className="elective-buttons">
                <button className="elective-signIn  deleteElective" style={{display: 'block'}} type='button' id={'unsign' + elective.id}  onClick={() => deleteElective(elective.id)}>Удалить электив</button>
                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
        </div>
      </div>
      
    </div>
  );
}

export default Madeby