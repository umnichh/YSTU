import React, { useState, useEffect } from 'react';
import Navbar from '../service/Navbar';

function Create() {

  const [teachers, setTeachers] = useState([]);
  const [forms, setForms] = useState([]);
  const [healths, setHealths] = useState([]);
  const [facultets, setFacultets] = useState([]);
  const [institutes, setInstutes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const currentToken = localStorage.getItem('access_token');
  const [electiveObject, setElective] = useState({});
  
  
  useEffect(() => {
    const fetchTeachersAndInstitute = async () => {
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
        console.log('ГОВНО', data)
      }

      const filtered = await fetch(`http://212.67.13.70:8000/api/all-institutes/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (filtered.ok) {
        const data = await filtered.json();
        setInstutes(data.institutes);
        setFacultets(data.facultets);
        setProfiles(data.profiles);
        console.log('ИНСТИТУТЫ', data)
      }
    };

    
    fetchTeachersAndInstitute();
  }, []);

  const nextStep = async (event) => {
    event.preventDefault()

    document.querySelector('.step1').style.display = 'none';
    document.querySelector('.step2').style.display = 'block';

    const formData = new FormData(event.target); // Получаем данные формы

    // Преобразуем FormData в объект
    const formObject = Object.fromEntries(formData.entries());

    // Извлекаем выбранных учителей из FormData и преобразуем их в массив
    const teacherIds = formData.getAll('teacher_ids'); // Получаем все выбранные значения

    // Добавляем массив учителей в объект с данными формы
    formObject.teacher_ids = teacherIds;

    setElective(formObject);
  }

  const sendElective = async (event) => {
    event.preventDefault()

    const instituteData = new FormData(event.target); // Получаем данные формы
    const instituteObject = Object.fromEntries(instituteData.entries());

    const elective = Object.assign({}, instituteObject, electiveObject);

    console.log(elective)

    const response = await fetch('http://212.67.13.70:8000/api/create-elective/', {
      method: 'POST',
      body: JSON.stringify(elective),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.json();
    console.log(data)
  };

  return (
    <div className="student-page-container">
      <Navbar/>
      <div className='form step1'>
      {(
        <div className="modal">
          <div className="modal-content">
            <h2>Ваша форма</h2>
            <form onSubmit={nextStep}>
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
                Форма
                <select name="form">
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                Здоровье
                <select name="health">
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
                <input type="date" name="date_finish"/>
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
                <label>Описание:</label>
                <textarea name="describe" rows="5" cols="33"></textarea>
              </div>
              <button type="submit">Следующий шаг</button>
            </form>
          </div>
        </div>
      )}
      </div>
      <div className='form step2'>
      {(
        <div className="modal">
          <div className="modal-content">
            <h2>Ваша форма</h2>
            <form onSubmit={sendElective}>
              <div>
              <select name="institutes">
                  {institutes && institutes.length > 0 && institutes.map((institutes) => (
                    <option key={institutes.id} value={institutes.id}>
                      {institutes.name}
                    </option>
                  ))}
                </select>

              </div>
              <div>
              <select name="facultets">
                  {facultets && facultets.length > 0 && facultets.map((facultets) => (
                    <option key={facultets.id} value={facultets.id}>
                      {facultets.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select name="profiles">
                  {profiles && profiles.length > 0 && profiles.map((profiles)  => (
                    <option key={profiles.id} value={profiles.id}>
                      {profiles.name + ' - ' + profiles.form.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Создать электив</button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Create































// const [file, setFile] = useState(null);
    // const sendFile = async (event) => {
    //   event.preventDefault();
  
    //   const formData = new FormData();
    //   formData.append('document', file);
  
    //   try {
    //     const currentToken = localStorage.getItem('access_token');
    //     // Отправляем запрос на сервер через fetch
    //     const response = await fetch('http://212.67.13.70:8000/api/electives/upload/', {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${currentToken}`,
    //       },
    //       body: formData
    //     });
        
    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log('Файл успешно загружен:', data);
    //     } else {
    //       console.error('Ошибка при загрузке файла:', response.statusText);
    //     }
    //   } catch (error) {
    //     console.error('Ошибка при загрузке файла:', error);
    //   }
    // };


    // const handleFileChange = (event) => {
    //   setFile(event.target.files[0]);
    // };
  
  //    <form onSubmit={sendFile}>
  //      <input type="file" onChange={handleFileChange} />
  //      <button type="submit">Загрузить файл</button>
  //    </form>