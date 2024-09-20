import React, { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';

function Electives(){
  const role = localStorage.getItem('role'); 
  const navigate = useNavigate();
  const [path, setPath] = useState('');
  const [electives, setElectives] = useState(null);

  // Запрашиваем роль
  useEffect(() => {
    if (role === 'student') {
      setPath('api/electives/choice/');
    } else if (role === 'teacher') {
      setPath('api/electives/');
    }
  }, [role]);

  useEffect(() => {
    console.log(path)
    async function getElectives() {
      try{
          console.log(path)
        const response = await fetch(`http://212.67.13.70:8000/${path}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        if (response.ok) {
          const data = await response.json();
          setElectives(data);
        }
      } catch (error) {
          console.log(response.text());
      }
  }
  getElectives();
}, [path]);

  if (!electives) {
    return null; 
  }
  // Запись на электив
  async function enroll(id, settings){
    let method = null;
    settings == 'enroll' ? method = 'POST' :
    settings == 'unroll' ? method = 'DELETE' : 0;
    try{
      const response = await fetch(`http://212.67.13.70:8000/api/electives/${id}/enroll/`, {
        method: method,
        body: JSON.stringify(id),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (response.ok) {
        if (method === 'POST') {
          
          alert('Вы записались на электив');
          document.getElementById(`${'sign' + id}`).style.display = 'none';
          document.getElementById(`${'unsign' + id}`).style.display = 'block';
  
        } else if (method === 'DELETE') {
          alert('Вы отменили запись на электив');
          document.getElementById(`${'sign' + id}`).style.display = 'block';
          document.getElementById(`${'unsign' + id}`).style.display = 'none';
        }
      }
    } catch (error) {
        console.log(error);
    }
  }
    
  // Обработчик клика на электив
  const handleClick = (elective) => {
    navigate('/elective/about', { state: { elective: elective } });
  };
  

  return (
    <div className="container">

      <div className='electives'>
        <div className='elective-container'>
          <div className="searchSettings">
            <form>
              <div className='search-container'>
                <input className='search-electives' type="text" placeholder="Поиск элективов"/>
              </div>
            </form>
            {/* <div className="searchRadios">
            <div className='searchRadio'>
                  <input type="radio" id='facultativeRadio' name='facultative' defaultChecked='checked' onChange={() => setFacultative(1)} />
                  <label htmlFor="facultativeRadio">Электив</label>
                </div>
                <div className='searchRadio'>
                  <input type="radio" id='electiveRadio' name='facultative' onChange={() => setFacultative(2)} />
                  <label htmlFor="electiveRadio">Факультатив</label>
                </div>
            </div> */}

          </div>

          {electives.map((elective) => (
            <div key={elective.id} className='elective' onClick={() => handleClick(elective)}>
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
              {
                role === 'student'? (
                  <>
                    <button className="elective-signIn sign" type='button' id={'sign' + elective.id}  onClick={() => enroll(elective.id, 'enroll')}>Записаться на электив</button>
                    <button className="elective-signIn unsign" type='button' id={'unsign' + elective.id}  onClick={() => enroll(elective.id, 'unroll')}>Отменить запись</button>
                  </>
                ) : role === 'teacher' ? (
                  <>
                    <button className="elective-edit" type='button' >Редактировать</button>
                  </>
                ) : null
              }
                <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
              </div>
            </div> 
          ))} 
        </div>
      </div>
    </div>
  );
}

export default Electives;



