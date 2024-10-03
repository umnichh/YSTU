import React, { useState, useEffect} from 'react';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

function Create() {
  const location = useLocation();
  const { state } = location;
  const elective = state?.elective || {}; 
  const elective_id = elective.id;
  const currentToken = localStorage.getItem('access_token');
  const navigate = useNavigate();

  // Отображение фильтров
  const [facultativeState, setFacultative] = useState(false);
  const [type, setType] = useState(1);
  const [forAll, setForAll] = useState(false)
  const [filterSettings, setFilterSettings] = useState(false)

  // Состояния справочников
  const [forms, setForms] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [ugsns, setUgsn] = useState([]);
  const [facultets, setFacultets] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [healths, setHealths] = useState([]);
  const [checked, setChecked] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [electiveData, setElectiveData] = useState({});
  const [describe, setDescribe] = useState('Описания нет');
  const [dateStart, setDateStart] = useState([]);
  const [dateFinish, setDateFinish] = useState([]);
  const [checkedCourses, setCheckedCourses] = useState([]);
  const [checkedCoursesList, setCheckedCoursesList] = useState({});

  const [expandedList, setExpandedList] = useState({});
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

  const [expanded, setExpanded] = useState([]);
  const [courses, setCourses] = useState([]);

  // Выбранные значения
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  function handleForAll(){
    setForAll(!forAll)
  }

  function handleSettings(){
    setFilterSettings(!filterSettings);
    setCheckedCourses([]);
    setCheckedCoursesList({});
  }
  function handleFacultative(){
    setFacultative(!facultativeState)
    facultativeState == false ? setType(2) : setType(1);
  }


  // Получение справочной информации
  useEffect(() => {
    async function fetchInfo(){
      try{
        const response = await fetch(`http://212.67.13.70:8000/api/electives/${elective.id}/edit/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setElectiveData(data);

          const profileIds = data.checked.map(profile => String(profile.id));
          const teacherIds = data.selectedTeachers.map(teacher => ({
            value: teacher.id,
            label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`}));
          setChecked(profileIds);
          setCheckedCourses(data.checkedCourses);
          setCheckedCoursesList(data.checkedCoursesList);
          setSelectedTeachers(teacherIds);
          console.log('ELECTVIE', data)
        }
      } catch(error) {
        console.error(error);
      }
      try{
        const response = await fetch(`http://212.67.13.70:8000/api/create/info/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json()
          setForms(data.forms);
          setFacultets(data.facultets);
          setInstitutes(data.institutes);
          setTeachers(data.teachers);
          setProfiles(data.profiles);
          setHealths(data.healths);
          setCourses(data.courses);
          setUgsn(data.ugsns);
          
        }
      } catch(error) {
        console.error(error);
      }
    }

    fetchInfo();
  }, []);

  // Маппинг
  const mapOptions = (items, labelFormatter = item => item.name) =>
    items.map(item => ({
      value: item.id,
      label: labelFormatter(item),
    }));
  // Опции для маппинга
  const selectTeacher = mapOptions(teachers, teacher => `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`);
  // Отправка формы
  const sendElective = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
    const teacherIds = selectedTeachers.map((teacher) => teacher.value);
    let elective;
    if (checkedCourses.length != 0){
      elective = {
        selectedTeachers: teacherIds,
        checkedCourses,
        type,
        checked,
        ...formObject,
      };
    } else if (checkedCourses.length == 0){
      elective = {
        checkedCoursesList,
        selectedTeachers: teacherIds,
        type,
        checked,
        ...formObject,
      }
    }
    await fetch(`http://212.67.13.70:8000/api/electives/${elective_id}/resend/`, {
      method: 'POST',
      body: JSON.stringify({'elective_id':elective_id}),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    await fetch(`http://212.67.13.70:8000/api/electives/${elective_id}/edit/`, {
      method: 'PUT',
      body: JSON.stringify(elective),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });





    // navigate('/elective/created');
  };

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
  
   
  // Создает дерево
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

  const courseTree = courses.map(course => ({
    label: course.name,
    value: `course-${course.name}`,
    children: (course.semesters || []).map(semester => ({
        label: semester.name,
        value: semester.id
    }))
}));

  if (!forms || !facultets || !institutes || !teachers || !profiles || !healths || !courses || !ugsns || !checked) {
    return <div>Загрузка...</div>;
  }

  // const teacherNames = elective.teacherIds.map(teacherId => {
  //   const teacher = teachers.find(t => t.id === teacherId);
  //   return teacher ? teacher.name : 'Учитель не найден';
  // });

  const teacherNames = selectedTeachers.map(teacher => ({label: teacher.last_name + ' ' + teacher.first_name + ' ' + teacher.middle_name, value: teacher.id}));

  return (
    
    <main>
        <div className='create-form'>
          {(
            <form  className = "electiveForm" onSubmit={sendElective}>
              <span className='create-form-title first-title'>Информация об элективе</span>
              <div className='facultativeRadio'>
                <div className='forAll'>
                  <label htmlFor="facultativeRadio">Создание факультатива</label>
                  <input  type="checkbox" id='facultativeRadio' name='facultative' onChange={handleFacultative} />
                </div>
              </div>
              
              <label className='teacherLabel'>Преподаватели:</label>
              <Select
                options={selectTeacher}  // для мульти-селекта передаем массив значений
                value={selectedTeachers} 
                isMulti  
                isSearchable  
                closeMenuOnSelect={false}  
                placeholder="Поиск преподавателя"
                classNamePrefix='selectTeacher'
                onChange={(selectedOptions) => setSelectedTeachers(selectedOptions)}
              />
              <div>
                <label >Название электива:</label>
                <input type="text" defaultValue={electiveData.name}  name="name" autoComplete='off'  required title="Введите название электива"  />
              </div>
              <div>
                <label>Количество мест:</label>
                <input type="number" min="1" defaultValue={electiveData.place} name="place" autoComplete='off' />
              </div>
              <div>
              <label>Форма проведения:</label>
                <select name="form"  className="selectProperty">
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='electiveDates'>
                <div>
                  <label>Объем в часах:</label>
                  <input type="number" defaultValue={electiveData.volume} min="1" name="volume" autoComplete='off'/>
                </div>
                <div>
                  <label>Дата начала:</label>
                  <input type="date" defaultValue={electiveData.date_start} name="date_start" autoComplete='off'/>
                </div>
                <div>
                  <label>Дата окончания:</label>
                  <input type="date" defaultValue={electiveData.date_finish} name="date_finish" autoComplete='off'/>
                </div>
              </div>
              <div>
                <label>Минимальный средний балл:</label>
                <input type="number" defaultValue={electiveData.marks}  min="0" max="5" name="marks" autoComplete='off'/>
              </div>
              <div>
              <label>Группа здоровья:</label>
                <select name="health" className="selectProperty">
                  {healths.map((health) => ( 
                    <option key={health.id} value={health.id}>
                      {health.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Описание:</label>
                <textarea className='electiveDescription' defaultValue={electiveData.describe} name="describe" rows="5" cols="33"></textarea>
              </div>
              <div>
                <label>Требования преподавателя к оборудованию/материалам/кабинету/расписанию:</label>
                <textarea className='electiveDescription' defaultValue={electiveData.note} name="note" rows="5" cols="33"></textarea>
              </div>
              {
              !facultativeState  && 
              <div>
                <span className='create-form-title'>Фильтрация электива</span>
                  <div className='forAll'>
                    <label htmlFor="forAll">Электив для всех институтов</label>
                    <input type="checkbox" id='facultativeRadio' name='forAll' onChange={handleForAll}/>
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
                        onCheck={(checked) => setChecked(checked)}
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

                {/* <span className='create-form-title'>Курсы</span>
                <label>Выберите курсы и семестры, которые будут проходить электив</label>
                  <div className='tree'>
                    <CheckboxTree
                      nodes={treeData}
                      checked={checked}
                      expanded={expanded}
                      onCheck={(checked) => setChecked(checked)}
                      onExpand={(expanded) => setExpanded(expanded)}
                      classNamePrefix="checkTree"
                    />
                </div> */}
              </div>


              }
              <button className='create-form-button' type="submit">Создать электив</button>
            </form>
          )}
        </div>
      </main>
  )
}

export default Create