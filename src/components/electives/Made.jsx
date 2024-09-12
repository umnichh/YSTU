import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../service/Navbar.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';

function Made(){
  const navigate = useNavigate();
  const [electives, setElectives] = useState([]);

  

  useEffect(() => {
  const fetchElectives = async () => {

    const currentToken = localStorage.getItem('access_token');
    const response = await fetch(`http://212.67.13.70:8000/api/electives_made_by_teacher`, {
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
  };

  fetchElectives();
}, []);

  const handleClick = (elective) => {
    navigate('/elective/info', { state:{ elective: elective }});
  };
  
  const deleteElective = (elective) => {
    const result = window.confirm('Вы уверены, что хотите удалить электив?');
    if (result) {
      const currentToken = localStorage.getItem('access_token');
    fetch(`http://212.67.13.70:8000/api/elective/${elective.id}/`, {
      method: 'DELETE',
      body: JSON.stringify(elective.id), // Отправляем только данные формы
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    })
      .catch(error => console.error(error));

      document.getElementById('elective' + elective.id).remove();
    } else {
      return;
    }
    


  };
  
  return (
    <div className="student-page-container">
      <Navbar />
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
                        <div>
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
                <button className="elective-signIn  deleteElective" style={{display: 'block'}} type='button' id={'unsign' + elective.id}  onClick={() => deleteElective(elective)}>Удалить электив</button>
                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
        </div>
      </div>
      
    </div>
  );
}

export default Made