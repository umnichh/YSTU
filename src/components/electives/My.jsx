import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../service/Navbar.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';

function StudentElectives(){
  const navigate = useNavigate();
  const [electives, setElectives] = useState([]);
  const [pathToElectives, setPath] = useState('');
  
  useEffect(() => {
    const role = localStorage.getItem('role'); // Получаем роль из localStorage
  
    if (role === 'student') {
      setPath('api/electives/student/');
    } else if (role === 'teacher') {
      setPath('api/electives/teacher/');
    }
  }, []);

  useEffect(() => {
  const fetchElectives = async () => {
    if (!pathToElectives) return; // Не делаем запрос, если путь не установлен

    const currentToken = localStorage.getItem('access_token');
    const response = await fetch(`http://212.67.13.70:8000/${pathToElectives}`, {
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
}, [pathToElectives]); // Запрос выполняется при изменении pathToElectives

  const handleClick = (elective) => {
    navigate('/elective/info', { state:{ elective: elective }});
  };
  
  const signUp = (elective) => {
    const currentToken = localStorage.getItem('access_token');
    fetch(`http://212.67.13.70:8000/api/elective/${elective.id}/enroll`, {
      method: 'POST',
      body: JSON.stringify(elective.id), // Отправляем только данные формы
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          alert('Вы записались на электив');
        }
      }
      )
      .catch(error => console.error(error));


      document.getElementById(`${'sign' + elective.id}`).style.display = 'none';
      document.getElementById(`${'unsign' + elective.id}`).style.display = 'block';
  };
  
  const signDown = (elective) => {
    const currentToken = localStorage.getItem('access_token');
    fetch(`http://212.67.13.70:8000/api/elective/${elective.id}/enroll`, {
      method: 'DELETE',
      body: JSON.stringify(elective.id), // Отправляем только данные формы
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          alert('Вы отменили запись на электив');
        }
      }
      )
      .catch(error => console.error(error));

      document.getElementById(`${'sign' + elective.id}`).style.display = 'block';
      document.getElementById(`${'unsign' + elective.id}`).style.display = 'none';

  }
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
                <button className="elective-signIn sign" style={{display: 'none'}} type='button' id={'sign' + elective.id}  onClick={() => signUp(elective)}>Записаться на электив</button>
                <button className="elective-signIn unsign" style={{display: 'block'}} type='button' id={'unsign' + elective.id}  onClick={() => signDown(elective)}>Отменить запись</button>
                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
        </div>
      </div>
      
    </div>
  );
}

export default StudentElectives;



