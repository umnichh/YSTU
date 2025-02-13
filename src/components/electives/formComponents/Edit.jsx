import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import SelectProperty from './TeachersCourseList';

export default function Edit() {
  const location = useLocation(), 
        { state } = location,
        elective = state?.elective || {},
        electiveId = state?.elective.id || 0;

  const
    currentToken = localStorage.getItem('access_token'),
    navigate = useNavigate(),
    [isFacultative, setIsFacultative] = useState(false),
    [createOnSomething, setCreateOnSomething] = useState({}),
    [getData, setGetData] = useState(null);

  // Метаданные
  const [formInfo, setFormInfo] = useState({
    forms: [],
    facultets: [],
    institutes: [],
    profiles: [],
    teachers: [],
    courses: [],
    ugsns: [],
    healths: [],
  });

  // Получение данных из child components
  const handleGetData = (val) =>{
    setGetData(val);
  }

  // Select учителя и checkboxtree курсы
  const [selected, setSelected] = useState({
    selectedTeachers: [],
    selectedCourses: [],
    selectedProfiles: [],
  });

  // Раскрытие дерева
  const [expanded, setExpanded] = useState({
    expandedCourses: [],
    expandedProfiles: [],
  });


  // Факультатив?
  function handleFacultative(){
  setIsFacultative(!isFacultative)
  }

  // Смена состояния при выборе
  const handleSelect = (selectedOptions, name) => {
  setSelected({
  ...selected,
  [name]: selectedOptions
  });
  }

  // Смена состояния при раскрытии
  const handleExpand = (selectedOptions, name) => {
  setExpanded({
  ...expanded,
  [name]: selectedOptions
  });
  }

  // Получение справочной информации
  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/create/info/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      for (const [key, value] of Object.entries(data)) {
        setFormInfo((prev) => ({ ...prev, [key]: value }));
      }      
    })
    .catch(error => console.error(error));

    // Получение данных о курсе
    fetch(`${process.env.REACT_APP_URL}/electives/${electiveId}/edit/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then (response => response.json())
    .then (data => {
      console.log(data)
      const teachers = data.selectedTeachers.map(teacher => ({
        value: teacher.id,
        label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`,
      }));
      const profiles = data.selectedProfiles.map(profile => {
        return profile.id
      });
      const courses = data.selectedCourses.map(course => {
        return course.name
      });
      setSelected({ 
        selectedTeachers: teachers, 
        selectedProfiles: profiles,
        selectedCourses: courses,
      });
      console.log(data)
      setCreateOnSomething(data);
      })
    .catch(error => console.error(error));
  }, []);

  // Отправка формы
  const sendElective = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target),
          formObject = Object.fromEntries(formData.entries());

    const elective = {
      ...formObject,
      form: +formObject.form,
      health: +formObject.health,
      place: +formObject.place,
      selectedCourses: getData.selectedCourses.map((course) => +course),
      selectedProfiles: getData.selectedProfiles.map((profile) => +profile),
      selectedTeachers: getData.selectedTeachers.map((teacher) => teacher.value),
    };
     
    console.log(elective);
    await fetch(`${process.env.REACT_APP_URL}/${electiveId}/resend/`, {
      method: 'POST',
      body: JSON.stringify({'elective_id':electiveId}),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    fetch(`${process.env.REACT_APP_URL}/${electiveId}/edit/`, {
      method: 'PUT',
      body: JSON.stringify(elective),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log(response.text());
    })

    navigate('/electives');
  };

  console.log('selected', selected);
  return (
    formInfo &&
    <main>
      <section className='m-14 mr-56'>
        <h1 className='text-4xl mb-5 border-b-2 border-gray-700'>Редактирование электива</h1>
        {(<form className = "text-lg" autoCapitalize='on' autoComplete='off' onSubmit={sendElective}>

          <div className='createMode flex gap-2 mt-4 w-full'>
            <input type="radio" className='hidden' defaultChecked id='Факультативный курс' name='type' value='Факультативный курс' onChange={handleFacultative} />
            <label htmlFor="Факультативный курс" className='p-1 border-2 w-full'>Создать факультатив</label>
            <input type="radio" className='hidden' id='Элективный курс' name='type' value='Элективный курс' onChange={handleFacultative} />
            <label htmlFor="Элективный курс" className='p-1 border-2 w-full'>Создать электив</label>
          </div>

          <fieldset className='border-2 border-gray-500 p-4 mt-3 flex flex-col w-full'>
            <legend>Основная информация</legend>
            <label>Название электива:</label>
            <input type="text" className='border-2 p-2' defaultValue={createOnSomething.name}  name="name" />
            <label className='mt-4'>Количество мест:</label>
            <input type="number" className='border-2 p-2' min="1" defaultValue={createOnSomething.place} name="place"/>
            <label className='mt-4'>Форма проведения:</label>
            <select className='border-2 p-2' name="form" defaultValue={createOnSomething.form}>
              {formInfo.forms.map((form) => (
                <option key={form.id} value={form.id}>{form.name}</option>
              ))}
            </select>
            <label className='mt-4'>Объем в часах:</label>
            <input type="number" className='border-2 p-2' defaultValue={createOnSomething.volume}  min="1" name="volume"/>
            <label className='mt-4'>Дата начала:</label>
            <input type="date" className='border-2 p-2' defaultValue={createOnSomething.date_start} name="date_start"/>
            <label className='mt-4'>Дата окончания:</label>
            <input type="date" className='border-2 p-2' defaultValue={createOnSomething.date_finish} name="date_finish"/>
            <label className='mt-4'>Минимальный средний балл:</label>
            <input type="number" className='border-2 p-2' defaultValue={createOnSomething.marks}  min="0" max="5" name="marks"/>
            <label className='mt-4'>Группа здоровья:</label>
            <select className='border-2 p-2'  defaultValue={createOnSomething.health} name="health">
              {formInfo.healths.map((health) => ( 
                <option key={health.id} value={health.id}>{health.name}</option>
              ))}
            </select>
            <label className='mt-4'>Описание:</label>
            <textarea className='border-2 p-2' defaultValue={createOnSomething.describe} name="describe" rows="5" cols="33"></textarea>
            <label className='mt-4'>Требования преподавателя к оборудованию/материалам/кабинету/расписанию:</label>
            <textarea className='border-2 p-2' defaultValue={createOnSomething.note} name="note" rows="5" cols="33"></textarea>
          </fieldset>

          <fieldset className='border-2 border-gray-500 p-4 mt-3 flex flex-col w-full'>
            <legend>Фильтрация электива</legend>
            <SelectProperty formInfo={formInfo} selected={selected} expanded={expanded} handleSelect={handleSelect} handleExpand={handleExpand} setSelected={setSelected} setExpanded={setExpanded} sendData={handleGetData}/>
            </fieldset>
          <button className='p-2 bg-ystu-blue text-white w-full' type="submit">Создать электив</button>
        </form>
        )}
      </section>
    </main>
  )
}
