import logo from '../../ystu-images/logo.jpg';
import student from '../../ystu-images/student.jpg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function StudentPage() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [electives, setElectives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentToken = localStorage.getItem('access_token');
  const [teachers, setTeachers] = useState([]);
  const [forms, setForms] = useState([]);
  const [healths, setHealths] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      const currentToken = localStorage.getItem('access_token');
      const response = await fetch('http://212.67.13.70:8000/api/student/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      }
    };

    const fetchElectives = async () => {
      const currentToken = localStorage.getItem('access_token');
      const response = await fetch('http://212.67.13.70:8000/api/electives/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setElectives(data); // Сохраняем элективы в состояние
      }
    };

    fetchUserData();
    fetchElectives();
  }, []);

  

  useEffect(() => {
    const fetchTeachers = async () => {
      const currentToken = localStorage.getItem('access_token');
      const response = await fetch('http://212.67.13.70:8000/api/create-elective/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        
        const data = await response.json();
        setTeachers(data.teachers);
        setForms(data.forms);
        setHealths(data.healths);
      }
    };
  
    fetchTeachers();
  }, []);
  

  const sendElective = (event) => {

    const formData = new FormData(event.target); // Получаем данные формы
  
    // Преобразуем FormData в объект
    const formObject = Object.fromEntries(formData.entries());
  
    // Извлекаем выбранных учителей из FormData и преобразуем их в массив
    const teacherIds = formData.getAll('teacher_ids'); // Получаем все выбранные значения
  
    // Добавляем массив учителей в объект с данными формы
    formObject.teacher_ids = teacherIds;
  
    fetch('http://212.67.13.70:8000/api/create-elective/', {
      
      method: 'POST',
      body: JSON.stringify(formObject), // Отправляем только данные формы
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  if (!studentData) {
    return <div>Loading...</div>; // Можно добавить индикатор загрузки
  }

  const {
    last_name = '',
    first_name = '',
    middle_name = '',
    profile = {},
    year_of_study = 'Не указано',
    group = 'Не указана',
    average_grade = 'Не указана',
    health = {},
  } = studentData;

  const fullName = `${last_name} ${first_name} ${middle_name}`;
  const program = profile.facultet?.name || 'Не указано';
  const healthGroup = health.name || 'Не указана';

  // Функция для открытия/закрытия модального окна
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClick = (elective) => {
    navigate('/elective', { state:{ elective: {elective} }});
  };
//  / teacher_ids
  return (
    <div className='main'>
      <header className='logo'>
      <button onClick={toggleModal}>Открыть форму</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Ваша форма</h2>
            <form onSubmit={sendElective}>
            <select name="teacher_ids" multiple>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.middle_name} {teacher.last_name}
                  </option>
                ))}
              </select>

              <div>
                <label>Имя:</label>
                <input type="text" name="name"/>
              </div>
              <div>
                <label>Количество мест:</label>
                <input type="text" name="place" />
              </div>
              <div>
                <select name="forms">
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select name="healths">
                  {healths.map((health) => (
                    <option key={health.id} value={health.id}>
                      {health.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Объем:</label>
                <input type="number" name="volume" />
              </div>
              <div>
                <label>Дата начала:</label>
                <input type="date" name="date_start"/>
              </div>
              <div>
                <label>Дата окончания:</label>
                <input type="date" name="data_finish" />
              </div>
              <div>
                <label>Минимальный средний балл:</label>
                <input type="number" name="marks"/>
              </div>
              <div>
                <label>Количество мест:</label>
                <input type="text" name="place" />
              </div>
              <div>
                <label>Группа здоровья:</label>
                <input type="text" name="health"/>
              </div>
              <div>
                <label>Описание:</label>
                <input type="text" name="describe" />
              </div>
              <button type="submit">Отправить</button>
            </form>
          </div>
        </div>
      )}
        <img src={logo} alt="logo" />
        <button className='logout' onClick={handleLogout}>Выйти</button>
      </header>
      <div className='fullName'>{fullName}</div>
      <div className='student'>
        <img src={student} alt='student' />
        <div className='student-properties'>
          <span>Направление подготовки:</span>
          <span>Статус:</span>
          <span>Курс:</span>
          <span>Группа:</span>
          <span>Успеваемость:</span>
          <span>Информация о группе здоровья:</span>
          <a href='login'>Освоенные дисциплины</a>
        </div>
        <div className='student-properties'>
          <span>{program}</span>
          <span>Студенты</span>
          <span>{year_of_study}</span>
          <span>{group}</span>
          <span id='ratings'>{average_grade}</span>
          <span>{healthGroup}</span>
        </div>
      </div>
      <form>
        <div className='search-container'>
          <input className='search' type="text" placeholder="Поиск"/>
        </div>
      </form>

      <div className='electives'>
      <div>
        {electives.map((elective) => (
          <div key={elective.id}>
            <div className='electiveName'>{elective.name}</div>
            <div className='electiveProperties'>
              <div>Осталось мест: {elective.place}</div>
              <div>
                Преподаватели: 
                {elective.teachers.length > 0 ? (
                  elective.teachers.map((teacher) => (
                    <span>
                      {teacher.first_name} {teacher.middle_name} {teacher.last_name} /
                    </span>
                  ))
                ) : (
                  <span> Преподаватели не указаны</span>
                )}
              </div>
              <div> Входное тестирование: Отсутствует</div>
              <div> Регистрация до: {elective.date_finish}</div>
              <button type='button' onClick={() => handleClick(elective)}>Подробнее</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default StudentPage;
