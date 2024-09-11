import logo from '../../ystu-images/logo.jpg';
import teacher from '../../ystu-images/teacher.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TeacherPage() {
  const location = useLocation();
  const { teacherData } = location.state || {};
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [forms, setForms] = useState([]);
  const [healths, setHealths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentToken = localStorage.getItem('access_token');

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const {
    last_name = '',
    first_name = '',
    middle_name = '',
  } = teacherData || {};

  const fullName = `${last_name} ${first_name} ${middle_name}`;

  const handleTeacherElectives = () => {
    navigate('/teacher-electives');
  };
  return (
    <div className='main'>
      <header className='logo'>
        <img src={logo} alt="logo" />
        <button className='logout' onClick={handleLogout}>Выйти</button>
      </header>
      <section className='fullName'>{fullName}</section>
      <section className='student'>
        <img src={teacher} alt='student' />
        <div className='student-properties'>
          <span>Cтатус:</span>
        </div>
        <div className='student-properties'>
          <span>Преподаватели</span>
        </div>
        <button onClick={handleTeacherElectives}>Просмотр всех элективов</button>
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
      <button onClick={toggleModal}>Открыть форму</button>
      </section>
      <section className='electives'>Доступные элективы</section>
      <form>
        <div className='search-container'>
          <input className='search' type="text" placeholder="Поиск"/>
        </div>
      </form>
    </div>
  );
}

export default TeacherPage;
