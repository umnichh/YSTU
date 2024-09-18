import React, { useState, useEffect} from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

function Create() {
  const currentToken = localStorage.getItem('access_token');
  const navigate = useNavigate();
  // Состояния справочников
  const [forms, setForms] = useState([]);
  const [facultets, setFacultets] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [healths, setHealths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  
  // Выбранные значения
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [selectedFacultets, setSelectedFacultets] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);  
  const [selectedSemesters, setSelectedSemesters] = useState([]);
      


  // Режимы фильтрации направлений
  const [filterStatus, setFilterStatus] = useState(0);
  const [filterSettings, setFilterSettings] = useState(0);

  function handleStatus(value) {
    setFilterStatus(value);
  }

  function handleSettings(value) {
    setFilterSettings(value);
  }
  // Получение справочной информации
  useEffect(() => {
    async function fetchInfo(){
      try{
        const response = await fetch('http://212.67.13.70:8000/api/create/info/', {
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
          setSemesters(data.semesters);
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

    const selectCourse = courses.map(course => ({
      value: course.id,
      label: +course.name
    }))
  
    const selectSemesters = semesters.map(semester => ({
      value: semester.id,
      label: +semester.name
    }))



  // Опции для маппинга
  const selectForms = mapOptions(forms);
  const selectTeacher = mapOptions(teachers, teacher => `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`);
  const selectInstitute = mapOptions(institutes);
  const selectFacultet = mapOptions(facultets);
  const selectProfile = mapOptions(profiles, profile => `${profile.name} — ${profile.form.name}`);

  // Отправка формы
  const sendElective = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
    const teacherIds = selectedTeachers.map((teacher) => teacher.value);
    const instituteIds = selectedInstitutes.map((institute) => institute.value);
    const facultetIds = selectedFacultets.map((facultet) => facultet.value);
    const profileIds = selectedProfiles.map((profile) => profile.value);

    const elective = {
      ...formObject,
      teacher_ids: teacherIds,
      institute_ids: instituteIds,
      facultet_ids: facultetIds,
      profile_ids: profileIds,
    };
    console.log(elective);
    const response = await fetch('http://212.67.13.70:8000/api/electives/create/', {
      method: 'POST',
      body: JSON.stringify(elective),
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    navigate('/elective/created');
  };

  if (!forms || !facultets || !institutes || !teachers || !profiles || !healths) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className='container'>
        <div className='create-form'>
          {(
            <form  className = "electiveForm" onSubmit={sendElective}>
              <span className='create-form-title first-title'>Информация об элективе</span>
              <label className='teacherLabel'>Преподаватели:</label>
                  <Select
                    options={selectTeacher}
                    isMulti  
                    isSearchable  
                    closeMenuOnSelect={false}  
                    placeholder="Поиск преподавателя"
                    classNamePrefix='selectTeacher'
                    onChange={(selectedOptions) => setSelectedTeachers(selectedOptions)}
                  />
              <div>
                <label >Название электива:</label>
                <input type="text"  name="name" autoComplete='off' />
              </div>
              <div>
                <label>Количество мест:</label>
                <input type="number" min="1" name="place" autoComplete='off' />
              </div>
              <div>
              <label>Форма:</label>
                <select name="form" className="selectProperty">
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </select>
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
                <label>Объем в часах:</label>
                <input type="number"  min="1" name="volume" autoComplete='off'/>
              </div>
              <div>
                <label>Дата начала:</label>
                <input type="date" name="date_start" autoComplete='off'/>
              </div>
              <div>
                <label>Дата окончания:</label>
                <input type="date" name="date_finish" autoComplete='off'/>
              </div>
              <div>
                <label>Минимальный средний балл:</label>
                <input type="number"  min="0" max="5" name="marks" autoComplete='off'/>
              </div>
              <div>
                <label>Описание:</label>
                <textarea className='electiveDescription  ' name="describe" rows="5" cols="33"></textarea>
              </div>
              <span className='create-form-title'>Фильтрация электива</span>

              <div className='filterRadios'>
                <input type="radio" id='instituteRadio' name='radio' onChange={() => handleStatus(1)} />
                <label htmlFor="instituteRadio">Институты</label>

                <input type="radio" id='facultetRadio' name='radio' onChange={() => handleStatus(2)} />
                <label htmlFor="facultetRadio">Направления</label>

                <input type="radio" id='profileRadio' name='radio' onChange={() => handleStatus(3)} />
                <label htmlFor="profileRadio">Профили</label>
              </div>
              {
                filterStatus === 1 && (
                  <div>
                    <Select
                        options={selectInstitute}
                        value={selectedInstitutes}
                        isMulti  
                        isSearchable 
                        closeMenuOnSelect={false}  
                        placeholder="Поиск"
                        classNamePrefix='selectTeacher'
                        onChange={(selectedOptions) => setSelectedInstitutes(selectedOptions)}
                      />
                  </div>
                )
              }

              {
                filterStatus === 2 && (
                  <div>
                    <Select
                        options={selectFacultet}
                        value={selectedFacultets}
                        isMulti 
                        isSearchable 
                        closeMenuOnSelect={false} 
                        placeholder="Поиск"
                        classNamePrefix='selectTeacher'
                        onChange={(selectedOptions) => setSelectedFacultets(selectedOptions)}
                      />
                  </div>
                )
              }

              {
                filterStatus === 3 && (
                  <div>
                    <Select
                        options={selectProfile}
                        value={selectedProfiles}
                        isMulti  
                        isSearchable  
                        closeMenuOnSelect={false} 
                        placeholder="Поиск"
                        classNamePrefix='selectTeacher'
                        onChange={(selectedOptions) => setSelectedProfiles(selectedOptions)}
                      />
                  </div>
                )
              }
              {filterStatus === 1 && (

              <div className='status1' >
              <span className='create-form-title'>Настройки</span>
              <div className='filterRadios'>
                <input type="radio" id='commonRadio' name='radioSettings' onChange={() => handleSettings(1)} />
                <label htmlFor="commonRadio">Общие</label>
                <input type="radio" id='broadRadio' name='radioSettings' onChange={() => handleSettings(2)} />
                <label htmlFor="broadRadio">Расширенные</label>
              </div>
              {filterSettings === 1 && (
              <div className='settings'>
                <div className='settingsContainer'>
                  <div className='semestersSettings'>
                    <label>Форма обучения</label>
                    <Select
                      options={selectForms}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Курс</label>
                    <Select
                      options={selectCourse}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Семестр</label>
                    <Select
                      options={selectSemesters}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
                    />
                  </div>
                </div>
              </div>
              )}
              {filterSettings === 2 && (
              <div className='ipfInfo'>
              {selectedInstitutes.length > 0 ? (
                selectedInstitutes.map((institute) => (
                  <div className='ifpContainer' key={institute.value}>
                  <div>
                    <label>{institute.label}</label>
                  </div>
                  <div className='settingsContainer'>
                  <div className='semestersSettings'>
                    <label>Форма</label>  
                    <Select
                      options={selectForms}                      
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Курс</label>
                    <Select
                      options={selectCourse}                      
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Семестр</label>
                    <Select
                      options={selectSemesters}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
                    />
                  </div>
                </div>
                  </div>
                ))
              ) : ( <span className='notSelected'>Нет выбранных институтов</span> )}
              </div>
              )}
              </div>
              )}
              {filterStatus === 2 && (
              <div className='status2'>
              <span className='create-form-title'>Направления</span>
              <div className='filterRadios'>
                <input type="radio" id='commonRadio' name='radioSettings' onChange={() => handleSettings(1)} />
                <label htmlFor="commonRadio">Общие</label>
                <input type="radio" id='broadRadio' name='radioSettings' onChange={() => handleSettings(2)} />
                <label htmlFor="broadRadio">Расширенные</label>
              </div>
              {filterSettings === 1 && (
              <div className='settings'>
                <div className='settingsContainer'>
                  <div className='semestersSettings'>
                    <label>Форма обучения</label>
                    <Select
                      options={selectForms}
                      value={selectedForms}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Курс</label>
                    <Select
                      options={selectCourse}
                      value={selectedCourses}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Семестр</label>
                    <Select
                      options={selectSemesters}
                      value={selectedSemesters}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
                    />
                  </div>
                </div>
              </div>
              )}

              {filterSettings === 2 && (
              <div className='ipfInfo'>
              {selectedFacultets.length > 0 ? (
                selectedFacultets.map((facultet) => (
                  <div className='ifpContainer' key={facultet.value}>
                    <label>{facultet.label}</label>
                    <div className='settingsContainer'>
                  <div className='semestersSettings'>
                    <label>Форма</label>  
                    <Select
                      options={selectForms}                      
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Курс</label>
                    <Select
                      options={selectCourse}                      
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Семестр</label>
                    <Select
                      options={selectSemesters}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
                    />
                  </div>
                </div>
                  </div>
                ))
              ) : (
                <span className='notSelected'>Нет выбранных направлений</span>
              )}
              </div>
              )}
              </div>
              )}


              {filterStatus === 3 && (
              <div className='status3'>
              <span className='create-form-title'>Профиль обучения</span>
              <div className='filterRadios'>
                <input type="radio" id='commonRadio' name='radioSettings' onChange={() => handleSettings(1)} />
                <label htmlFor="commonRadio">Общие</label>
                <input type="radio" id='broadRadio' name='radioSettings' onChange={() => handleSettings(2)} />
                <label htmlFor="broadRadio">Расширенные</label>
              </div>
              {filterSettings === 1 && (
              <div className='settings'>
                <div className='settingsContainer'>
                  <div className='semestersSettings'>
                    <label>Форма обучения</label>
                    <Select
                      options={selectForms}
                      value={selectedForms}
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Курс</label>
                    <Select
                      options={selectCourse}
                      value={selectedCourses}
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Семестр</label>
                    <Select
                      options={selectSemesters}
                      value={selectedSemesters}
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
                    />
                  </div>
                </div>
              </div>
              )}

              {filterSettings === 2 && (
              <div className='ipfInfo'>
                {selectedProfiles.length > 0 ? (
                  selectedProfiles.map((profile) => (
                    <div className='ifpContainer' key={profile.value}>
                      <label>{profile.label}</label>
                      <div className='settingsContainer'>
                  <div className='semestersSettings'>
                    <label>Курс</label>
                    <Select
                      options={selectCourse}                      
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
                    />
                  </div>
                  <div className='semestersSettings'>
                    <label>Семестр</label>
                    <Select
                      options={selectSemesters}
                      isMulti  
                      isSearchable  
                      closeMenuOnSelect={false} 
                      placeholder="Поиск"
                      classNamePrefix='selectTeacher'
                      onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
                    />
                  </div>
                </div>
                    </div>
                  ))
                ) : (
                  <span className='notSelected'>Нет выбранных прфоилей</span>
                )}
              </div>
              )}
              </div>
              )}
                <div className='createElectiveNavigation'>
                  <div className='formNavigation'>
                    <button type="submit" className='nextStepButton'>Создать электив</button>
                  </div>  
                </div>
            </form>
          )}
        </div>
      </div>
  )
}

export default Create