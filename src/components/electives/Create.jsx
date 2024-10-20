import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import SelectProperty from './formComponents/TeachersCourseList';


export default function Create() {
  const currentToken = localStorage.getItem('access_token'),
        navigate = useNavigate(),
        [isFacultative, setIsFacultative] = useState(false),
        [createOnSomething, setCreateOnSomething] = useState({}),
        [createdElectives, setCreatedElectives] = useState([]),
        [selectedTest, setSelectedTest] = useState(null),
        [tests, setTests] = useState([]),
        [getData, setGetData] = useState(null);
        const [selectedElective, setSelectedElective] = useState(null);
        
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

  // Информация для формы
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


    // Список созданных элективов
    fetch(`${process.env.REACT_APP_URL}/electives/created/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => setCreatedElectives(data))
    .catch(error => console.error(error));

    // Список созданных тестов
    fetch(`${process.env.REACT_APP_URL}/tests/created/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {setTests(data); console.log('testiki', data)})
    .catch(error => console.error(error));
  }, []);
  
  // Создание на основании
  function CreateOnSomething(id){
    fetch(`${process.env.REACT_APP_URL}/electives/${id}/edit/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
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

      // Не работает
      // setCheckedCourses(data.selected.selectedCourses);
      // setSemesterList(data.selected.List);
    })
    .catch(error => console.error(error));
  }

  console.log(formInfo);

  // Отправка формы
  async function sendElective(event){
    event.preventDefault();
    const formData = new FormData(event.target),
          formObject = Object.fromEntries(formData.entries());

    const elective = {
      ...formObject,
      form: +formObject.form,
      testId: selectedTest?.id || null,
      health: +formObject.health,
      place: +formObject.place,
      selectedCourses: getData.selectedCourses.map((course) => +course),
      selectedProfiles: getData.selectedProfiles.map((profile) => +profile),
      selectedTeachers: getData.selectedTeachers.map((teacher) => teacher.value),
    };
     
    console.log('ELECTIVE TO SEND', elective);
    fetch(`${process.env.REACT_APP_URL}/electives/create/`, {
      method: 'POST',
      body: JSON.stringify(elective),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    // navigate('/electives');
  };


  const CloseDetails = (element) => {
    document.getElementById(element).removeAttribute('open')
  }


  return (
    formInfo &&
    <main>
      {selectedTest?.name}
      <section className='m-14'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Создание электива</h1>
        
    <div className='flex flex-col gap-4'>
    <div>
    <details className='createOnSomething  flex-col border border-gray-200 rounded-lg shadow-lg text-base w-full transition-all duration-300 ease-in-out' id='createOnSomething'>
      <summary className='p-3 cursor-pointer bg-blue-100 border-b-2 border-b-blue-500 text-blue-700 font-semibold hover:text-blue-800 rounded-t-lg'>
        Создать на основании
      </summary>
      <div className='divide-y divide-gray-200 bg-white'>
        {createdElectives.map((elective) => (
          <div key={elective.id}>
            <button 
              className='w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition duration-200 ease-in-out'
              onClick={() => {
                setSelectedElective(elective.name);
                CreateOnSomething(elective.id);
                CloseDetails('createOnSomething');
              }}>
              {elective.name}
            </button>
          </div>
        ))}
      </div>
    </details>

    {/* Отображение выбранного электива */}
    {selectedElective && (
      <div className='p-2 text-blue-700 bg-gray-100 rounded-b-lg shadow-inner mb-4'>
        <strong>Выбранный электив:</strong> {selectedElective}
      </div>
    )}
    </div>
    <div>
    <details className='addTest flex-col border border-gray-200 rounded-lg shadow-lg text-base w-full  transition-all duration-300 ease-in-out' id='addTest'>
      <summary className='p-3 cursor-pointer bg-blue-100 text-blue-700 font-semibold hover:text-blue-800 border-b-2 border-b-blue-500 rounded-t-lg'>
        Прикрепить тест для электива
      </summary>
      <div className='divide-y divide-gray-200 bg-white'>
        {tests && tests.map((test) => (
          <div key={test.id}>
            <button 
              className='w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition duration-200 ease-in-out'
              onClick={() => {
                setSelectedTest(test.name);
                CloseDetails('addTest');
              }}>
              {test.name}
            </button>
          </div>
        ))}
      </div>
    </details>

    {/* Отображение выбранного теста */}
    {selectedTest && (
      <div className='p-2 text-blue-700 bg-gray-100 rounded-b-lg shadow-inner'>
        <strong>Выбранный тест:</strong> {selectedTest}
      </div>
    )}
    </div>
    </div>
   


        {(<form autoCapitalize='on' autoComplete='off' onSubmit={sendElective}>

          <div className='createMode flex gap-2 mt-4 w-full'>
            <input type="radio" className='hidden' defaultChecked id='Факультативный курс' name='type' value='Факультативный курс' onChange={handleFacultative} />
            <label htmlFor="Факультативный курс" className='p-2 bg-gray-200 rounded-lg w-full'>Создать факультатив</label>
            <input type="radio" className='hidden' id='Элективный курс' name='type' value='Элективный курс' onChange={handleFacultative} />
            <label htmlFor="Элективный курс" className='p-2 bg-gray-200 rounded-lg w-full'>Создать электив</label>
          </div>

          <fieldset className='border-2 mt-2 border-gray-300 rounded-md p-4 mt-3 flex flex-col w-full'>
            <legend className='text-lg font-semibold'>Основная информация</legend>
            <label>Название электива:</label>
            <input type="text" className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.name}  name="name" />
            <label className='mt-3'>Количество мест:</label>
            <input type="number" className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' min="1" defaultValue={createOnSomething.place} name="place"/>
            <label className='mt-3'>Форма проведения:</label>
            <select className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' name="form" defaultValue={createOnSomething.form}>
              {formInfo.forms.map((form) => (
                <option key={form.id} value={form.id}>{form.name}</option>
              ))}
            </select>
            <label className='mt-3'>Объем в часах:</label>
            <input type="number" className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.volume}  min="1" name="volume"/>
            <label className='mt-3'>Дата начала:</label>
            <input type="date" className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.date_start} name="date_start"/>
            <label className='mt-3'>Дата окончания:</label>
            <input type="date" className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.date_finish} name="date_finish"/>
            <label className='mt-3'>Минимальный средний балл:</label>
            <input type="number" className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.marks}  min="0" max="5" name="marks"/>
            <label className='mt-3'>Группа здоровья:</label>
            <select className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'  defaultValue={createOnSomething.health} name="health">
              {formInfo.healths.map((health) => ( 
                <option key={health.id} value={health.id}>{health.name}</option>
              ))}
            </select>
            <label className='mt-3'>Описание:</label>
            <textarea className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.describe} name="describe" rows="5" cols="33"></textarea>
            <label className='mt-3'>Требования преподавателя к оборудованию/материалам/кабинету/расписанию:</label>
            <textarea className='border-2 mt-0.5 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' defaultValue={createOnSomething.note} name="note" rows="5" cols="33"></textarea>
          </fieldset>

          <fieldset className='border-2 mt-2 border-gray-300 rounded-lg p-4 mt-3 flex flex-col w-full'>
            <legend className='text-lg font-semibold'>Фильтрация электива</legend>
              <SelectProperty formInfo={formInfo} selected={selected} expanded={expanded} handleSelect={handleSelect} handleExpand={handleExpand} setSelected={setSelected} setExpanded={setExpanded} sendData={handleGetData}/>
          </fieldset>
          <button className='p-2 rounded-lg mt-4 bg-ystu-blue text-white w-full' type="submit">Создать электив</button>
        </form>
        )}
      </section>
    </main>
  )
}