import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import CheckboxTree from 'react-checkbox-tree';
import Select from 'react-select';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';


export default function Create() {
  const editorRef = useRef(null);
  const currentToken = localStorage.getItem('access_token');
  const navigate = useNavigate();

  // Отображение фильтров
  const [facultativeState, setFacultative] = useState(false);
  const [type, setType] = useState(1);
  const [forAll, setForAll] = useState(false)
  const [filterSettings, setFilterSettings] = useState(false);

  // Данные электива при создании на основании
  const [electiveData, setElectiveData] = useState({});

  // Состояния справочников
  const [createdElectives, setCreatedElectives] = useState([]);
  const [forms, setForms] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [ugsns, setUgsn] = useState([]);
  const [facultets, setFacultets] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [healths, setHealths] = useState([]);

  // Выбранные значения
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [checkedCourses, setCheckedCourses] = useState([]);
  const [checkedCoursesList, setCheckedCoursesList] = useState({});
  const [expandedList, setExpandedList] = useState({});
  const [expanded, setExpanded] = useState([]);
  const [courses, setCourses] = useState([]);


  useEffect(() => {
    // Метаданные
    fetch('http://212.67.13.70:8000/api/create/info/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setForms(data.forms);
      setFacultets(data.facultets);
      setInstitutes(data.institutes);
      setTeachers(data.teachers);
      setProfiles(data.profiles);
      setHealths(data.healths);
      setCourses(data.courses);
      setUgsn(data.ugsns);
    })
    .catch(error => console.error(error));

    // Список созданных элективов
    fetch(`http://212.67.13.70:8000/api/electives/created/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setCreatedElectives(data);
    })
    .catch(error => console.error(error));

  }, []);

  // Является ли факультативом
  function handleFacultative(){
    setFacultative(!facultativeState)
    facultativeState == false ? setType(2) : setType(1);
  }

  // Обработчик для изменения состояния курсов для конкретного профиля
  const handleCheckCourses = (profileName, checkedCourses) => {
    setCheckedCoursesList(prevState => ({
      ...prevState,
      [profileName]: checkedCourses,
    }));
  };

  // Обработчик для изменения состояния расширения для конкретного профиля
  const handleExpandCourses = (profileName, expanded) => {
    setExpandedList(prevState => ({
      ...prevState,
      [profileName]: expanded, // Сохраняем состояние расширения для каждого профиля
    }));
  };

  // Радио для всех институтов
  function handleForAllInstitutes(){
    setForAll(!forAll)
  }

  // Расширенная фильтрация курсов
  function handleSettings(){
    setFilterSettings(!filterSettings);
    setCheckedCourses([]);
    setCheckedCoursesList({});
  }

  // Опции для маппинга
  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`,
  }))

  // Отправка формы
  async function sendElective(event){
    event.preventDefault();
    const formData = new FormData(event.target),
          formObject = Object.fromEntries(formData.entries()),
          teacherIds = selectedTeachers.map((teacher) => teacher.value),
          describe = editorRef.current.getContent({ format: 'text' });
          
    let elective = {
      describe,
      selectedTeachers: teacherIds,
      type,
      checked,
      ...formObject,
    };

    if (checkedCourses.length != 0) elective.checkedCourses = checkedCourses;
    if (checkedCoursesList.length != 0) elective.checkedCoursesList = checkedCoursesList;
     
    fetch('http://212.67.13.70:8000/api/electives/create/', {
      method: 'POST',
      body: JSON.stringify(elective),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    navigate('/electives');
  };

  // Создание на основании
  function CreateOnSomething(id){
      fetch(`http://212.67.13.70:8000/api/electives/${id}/edit/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const teacherIds = data.selectedTeachers.map(teacher => ({
          id: teacher.id,
          label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`,
        }));
        const profileIds = data.checked.map(profile => {
          return profile.id
        });
        setSelectedTeachers(teacherIds);
        setChecked(profileIds);
        setElectiveData(data);

        // Не работает
        // setCheckedCourses(data.checkedCourses);
        // setCheckedCoursesList(data.checkedCoursesList);
      })
      .catch(error => console.error(error));
  }
  
  // Вытаскиваем значения из справочников и возвращаем в один объект
  const combinedData = institutes.map(institute => {
    const relatedUgsns = ugsns
      .filter(ugsn => ugsn.institute.id === institute.id)
      .map(ugsn => {
        const relatedFaculties = facultets
          .filter(faculty => faculty.ugsn.id === ugsn.id)
          .map(faculty => {
            const relatedProfiles = profiles.filter(profile => profile.facultet.id === faculty.id);
            return {
              ...faculty,
              profiles: relatedProfiles,
            };
          });
        return {
          ...ugsn,
          facultets: relatedFaculties,
        };
      });
    return {
      ...institute,
      ugsns: relatedUgsns,
    };
  });
  
  // Дерево для элективов
  const treeData = combinedData.map(institute => ({
    label: institute.name,
    value: `institute-${institute.id}`,
    children: institute.ugsns.map(ugsn => ({
      label: ugsn.name,
      value: ugsn.id,
      children: ugsn.facultets.map(faculty => ({
        label: faculty.name,
        value: `faculty-${faculty.id}`,
          children:  faculty.profiles.map(profile => ({
          label: profile.name + ' — ' + profile.form.name,
          value: profile.id
        })),
      })),
    })),
  }));

  // Дерево для курсов
  const courseTree = courses.map(course => ({
    label: course.name,
    value: `course-${course.name}`,
    children: (course.semesters || []).map(semester => ({
        label: semester.name,
        value: semester.id
    }))
  }));

  if (!forms || !facultets || !institutes || !teachers || !profiles || !healths) {
    return <div>Загрузка...</div>;
  }

  return (
    <main>
      <div className='create-form'>
        <div>
          {createdElectives.map((elective) => (
              <div key={elective.id}>
                <button onClick={() => CreateOnSomething(elective.id)}>{elective.name}</button>
              </div>
            ))}
        </div>
          {(<form className = "elective-form" autoCapitalize='on' autoComplete='off' onSubmit={sendElective}>
                <span className='create-form-title first-title'>Информация об элективе</span>
                <div className='forAll'>
                  <label htmlFor="facultativeRadio">Создание факультатива</label>
                  <input type="checkbox" id='facultativeRadio' name='facultative' onChange={handleFacultative} />
                </div>
                <label className='teacherLabel'>Преподаватели:</label>
                <Select
                  options={teacherOptions}
                  value={selectedTeachers} 
                  isMulti  
                  isSearchable  
                  closeMenuOnSelect={false}  
                  placeholder="Поиск преподавателя"
                  classNamePrefix='teacherOptions'
                  onChange={(selectedOptions) => setSelectedTeachers(selectedOptions)}
                />
                <fieldset>
                  <legend>Основная информация</legend>
                  <label >Название электива:</label>
                  <input type="text" defaultValue={electiveData.name}  name="name" />
                  <label>Количество мест:</label>
                  <input type="number" min="1" defaultValue={electiveData.place} name="place" />
                  <label>Форма проведения:</label>
                  <select name="form" defaultValue={electiveData.form} className="selectProperty">
                    {forms.map((form) => (
                      <option key={form.id} value={form.id}>
                        {form.name}
                      </option>
                    ))}
                  </select>
                  <div className='electiveDates'>
                    <div>
                      <label>Объем в часах:</label>
                      <input type="number" defaultValue={electiveData.volume}  min="1" name="volume"/>
                    </div>
                    <div>
                      <label>Дата начала:</label>
                      <input type="date" defaultValue={electiveData.date_start} name="date_start"/>
                    </div>
                    <div>
                      <label>Дата окончания:</label>
                      <input type="date" defaultValue={electiveData.date_finish} name="date_finish"/>
                    </div>
                  </div>
                  <label>Минимальный средний балл:</label>
                  <input type="number" defaultValue={electiveData.marks}  min="0" max="5" name="marks"/>
                  <label>Группа здоровья:</label>
                  <select defaultValue={electiveData.health} name="health" className="selectProperty">
                    {healths.map((health) => ( 
                      <option key={health.id} value={health.id}>
                        {health.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <label>Описание:</label>
            
                  <label>Требования преподавателя к оборудованию/материалам/кабинету/расписанию:</label>
                  <textarea defaultValue={electiveData.note} className='electiveDescription  ' name="note" rows="5" cols="33"></textarea>
              <div>
                <span className='create-form-title'>Фильтрация электива</span>
                  <div className='forAll'>
                    <label htmlFor="forAll">Электив для всех институтов</label>
                    <input type="checkbox" id='facultativeRadio' name='forAll' onChange={handleForAllInstitutes}/>
                  </div>
                {
                  !forAll &&
                  <>
                    <label>Выберите институты и направления, которые будут проходить электив</label>
                    <div className='tree'>
                      <CheckboxTree
                        nodes={treeData}
                        checked={checked}
                        expanded={expanded}
                        onCheck={(checked) => {setChecked(checked); console.log(checked)}}
                        onExpand={(expanded) => setExpanded(expanded)}
                        classNamePrefix="checkTree"
                      />
                    </div>
                  </>
                }
                <div className='status2'>
                <span className='create-form-title'>Курсы</span>
                <div className='forAll'>
                <label htmlFor="commonRadio">Расширенные настройки</label>
                <input type="checkbox" id='commonRadio' name='radioSettings' onChange={() => handleSettings()} />
                </div>
                {filterSettings === false && (
                  <div className='settings'>
                  <div className='settingsContainer'>
                  <label>Выберите курсы или семестры, которые будут проходить электив</label>
                  <div className='tree'>
                    <CheckboxTree
                      nodes={courseTree}
                      checked={checkedCourses}
                      expanded={expanded}
                      onCheck={(checkedCourses) => {
                        setCheckedCourses(checkedCourses)
                        }
                      }
                      onExpand={(expanded) => setExpanded(expanded)}
                      classNamePrefix="checkTree"
                    />
                  </div>
                </div>
                </div>
                )}
                {filterSettings === true && (
                <div className='ipfInfo'>
                {checked.length > 0 ? (
                  checked.map((check, index) => {
                    const profile = profiles.find((p) => p.id === Number(check));
                    if (!profile) return null; // Проверка на случай отсутствия профиля

                    return (
                      <div className='ifpContainer' key={profile.id}>
                        <label>{profile.name}</label>
                        <div className='settingsContainer'>
                          <div className='semestersSettings'>
                            <div className='courseTree'>
                              <CheckboxTree
                                nodes={courseTree}
                                checked={checkedCoursesList[profile.id] || []} // Уникальное состояние для каждого профиля
                                expanded={expandedList[profile.id] || []} // Уникальное состояние для каждого профиля
                                onCheck={(checkedCourses) => handleCheckCourses(profile.id, checkedCourses)} // Обновляем по имени профиля
                                onExpand={(expanded) => handleExpandCourses(profile.id, expanded)} // Обновляем по имени профиля
                                classNamePrefix="courseTreePrefix"
                              />  
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className='notSelected'>Нет выбранных профилей</span>
                )}
                </div>
                )}
                </div>
                  </div>
              <button className='create-form-button' type="submit">Создать электив</button>
            </form>
          )}
        </div>
      </main>
  )
}
