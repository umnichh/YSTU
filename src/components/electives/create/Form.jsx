import React, { useState, useEffect} from 'react';
import Select from 'react-select';

function Create() {
  const currentToken = localStorage.getItem('access_token');

  // Состояния справочников
  const [forms, setForms] = useState([]);
  const [facultets, setFacultets] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [healths, setHealths] = useState([]);
  const [firstStep, setFirstStep] = useState([]);
  const [secondStep, setSecondStep] = useState([]);

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
        }
      } catch(error) {
        console.error(error);
      }
    }
    fetchInfo();
  }, []);
  
  // CreateAboutProps
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [selectedFacultets, setSelectedFacultets] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([])

  // Семестры курсы
  const [semestr, setSemestr] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  const [courses, setCourse] = useState(['1', '2', '3', '4', '5', '6']);  


  // Маппинг
  const mapOptions = (items, labelFormatter = item => item.name) =>
    items.map(item => ({
      value: item.id,
      label: labelFormatter(item),
    }));
  
  // Опции для маппинга
  const selectTeacher = mapOptions(teachers, teacher => `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`);
  const selectInstitute = mapOptions(institutes);
  const selectFacultet = mapOptions(facultets);
  const selectProfile = mapOptions(profiles, profile => `${profile.name} — ${profile.form.name}`);

  // Следующий шаг
  async function nextStep(event, step) {
    event.preventDefault()
    const formData = new FormData(event.target); 
    const formObject = Object.fromEntries(formData.entries());
    document.querySelector(`.step${step}`).style.display = 'none';
    document.querySelector(`.step${step + 1}`).style.display = 'block';

    if (step === 1) {
      console.log('step1')
      const info = {...formObject, selectedTeachers}
      setFirstStep(info);
    } else if (step === 2) {
      console.log('step2')
      const info = {selectedInstitutes, selectedFacultets, selectedProfiles}
      setSecondStep(info);
    }
  }

  // НЕ РАБОТАЕТ
  const sendElective = async (event) => {
    event.preventDefault();
    const teacherIds = selectedTeachers.map((teacher) => teacher.value);
    const instituteIds = selectedInstitutes.map((institute) => institute.value);
    const facultetIds = selectedFacultets.map((facultet) => facultet.value);
    const profileIds = selectedProfiles.map((profile) => profile.value);

    const elective = {
      ...firstStep, 
      ...secondStep,
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
  };

  if (!forms || !facultets || !institutes || !teachers || !profiles || !healths) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className='container'>
        <div className='createForm step1'>
          {(
            <div className="modal">
              <div className="modal-content">
              <span className='titleStep'>Информация об элективе</span>
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
                <form  className = "electiveForm" onSubmit={(event) => nextStep(event, 1)}>
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
                  <button type="submit" className="nextStepButton">Следующий шаг</button>
                </form>
              </div>
            </div>
          )}
        </div>
          <div className='createForm step2'>
          {(
            <div className="modal">
              <div className="modal-content">
              <span className='titleStep'>Фильтр направлений</span>
                <form onSubmit={(event) => nextStep(event, 2)}>
                  <div>
                    <label className='teacherLabel'>Институт:</label>
                    <Select
                        options={selectInstitute}
                        isMulti  
                        isSearchable 
                        closeMenuOnSelect={false}  
                        placeholder="Поиск"
                        classNamePrefix='selectTeacher'
                        onChange={(selectedOptions) => setSelectedInstitutes(selectedOptions)}
                      />
                    </div>
                  <div>
                    <label className='teacherLabel'>Направление:</label>
                    <Select
                        options={selectFacultet}
                        isMulti 
                        isSearchable 
                        closeMenuOnSelect={false} 
                        placeholder="Поиск"
                        classNamePrefix='selectTeacher'
                        onChange={(selectedOptions) => setSelectedFacultets(selectedOptions)}
                      />
                  </div>
                  <div>
                    <label className='teacherLabel'>Профиль обучения:</label>
                    <Select
                        options={selectProfile}
                        isMulti  
                        isSearchable  
                        closeMenuOnSelect={false} 
                        placeholder="Поиск"
                        classNamePrefix='selectTeacher'
                        onChange={(selectedOptions) => setSelectedProfiles(selectedOptions)}
                      />
                  </div>
                  <div className='createElectiveNavigation'>
                  <div className='formNavigation'>
                    <button type="submit" className='nextStepButton'>Следующий шаг <i class="fas fa-chevron-right" ></i></button>
                  </div>  
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className='createForm step3'>
          {(
            <div className="modal">
              <div className="modal-content">
                <form onSubmit={sendElective}>
                <div className='block green'>
                <span className='titleStep'>Институты</span>
                <div className='settings'>
                  <span className='titleLow'>Общие настройки для всех институтов</span>
                  <div className='settingsContainer'>
                    <label className='formSettings'>
                      Форма обучения
                      <select>
                      {forms.map((form) => (
                          <option>{form.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className='courseSettings'>
                      Курс
                      <select>
                      {courses.map((course) => (
                          <option>{course}</option>
                        ))}
                      </select>
                    </label>
                    <label className='semestrSettings'>
                      Семестр 
                      <select>
                      {semestr.map((semestr) => (
                          <option>{semestr}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                  <div className='ipfInfo'>
                  <span className='titleLow'>Расширенные настройки</span>
                    {selectedInstitutes.length > 0 ? (
                      selectedInstitutes.map((institute) => (
                        <div className='ifpContainer' key={institute.value}>
                          <label>{institute.label}</label>
                          <div className='radioGroup'>
                          <label>
                              Очная
                              <input type="checkbox" name={`institute-${institute.value}`} value="очная" />
                            </label>
                            <label>
                              Заочная
                              <input type="checkbox" name={`institute-${institute.value}`} value="заочная" />
                            </label>
                            <label>
                              Очно-заочная
                              <input type="checkbox" name={`institute-${institute.value}`} value="очно-заочная" />
                            </label>
                            <label>
                              Курс
                              <select>
                              {courses.map((course) => (
                                <option>{course}</option>
                              ))}
                              </select>
                            </label>
                            <label>
                              Семестр
                              <select>
                              {semestr.map((semestr) => (
                                  <option>{semestr}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span>Нет выбранных институтов</span>
                    )}
                  </div>
                </div>
                  <div className='block orange'>
                  <span className='titleStep'>Направления</span>
                  <div className='settings'>
                  <span className='titleLow'>Общие настройки для всех направлений</span>
                  <div className='settingsContainer'>
                    <label className='formSettings'>
                      Форма обучения
                      <select>
                      {forms.map((form) => (
                          <option>{form.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className='courseSettings'>
                      Курс
                      <select>
                      {courses.map((course) => (
                          <option>{course}</option>
                        ))}
                      </select>
                    </label>
                    <label className='semestrSettings'>
                      Семестр 
                      <select>
                      {semestr.map((semestr) => (
                          <option>{semestr}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  </div>
                  <div className='ipfInfo'>
                  <span className='titleLow'>Расширенные настройки</span>
                    {selectedFacultets.length > 0 ? (
                      selectedFacultets.map((facultet) => (
                        <div className='ifpContainer' key={facultet.value}>
                          <label>{facultet.label}</label>
                          <div className='radioGroup'>
                            <label>
                              Очная
                              <input type="checkbox" name={`facultet-${facultet.value}`} value="очная" />
                            </label>
                            <label>
                              Заочная
                              <input type="checkbox" name={`facultet-${facultet.value}`} value="заочная" />
                            </label>
                            <label>
                              Очно-заочная
                              <input type="checkbox" name={`facultet-${facultet.value}`} value="очно-заочная" />
                            </label>
                            <label>
                              Курс
                              <select>
                              {courses.map((course) => (
                                <option>{course}</option>
                              ))}
                              </select>
                            </label>
                            <label>
                              Семестр
                              <select>
                              {semestr.map((semestr) => (
                                  <option>{semestr}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span>Не указаны</span>
                    )}
                  </div>
                  </div>
                  <div className='block'>
                  <span className='titleStep'>Профиль обучения</span>
                  <div className='settings'>
                  <span className='titleLow'>Общие настройки для всех направлений</span>
                  <div className='settingsContainer'>
                    <label className='courseSettings'>
                      Курс
                      <select>
                      {courses.map((course) => (
                          <option>{course}</option>
                        ))}
                      </select>
                    </label>
                    <label className='semestrSettings'>
                      Семестр 
                      <select>
                      {semestr.map((semestr) => (
                          <option>{semestr}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  </div>
                  <div className='ipfInfo'>
                  <span className='titleLow'>Расширенные настройки</span>
                    {selectedProfiles.length > 0 ? (
                      selectedProfiles.map((profile) => (
                        <div className='ifpContainer' key={profile.value}>
                          <label>{profile.label}</label>
                          <div className='radioGroup'>

                            <label>
                              Курс
                              <select>
                              {courses.map((course) => (
                                <option>{course}</option>
                              ))}
                              </select>
                            </label>
                            <label>
                              Семестр
                              <select>
                              {semestr.map((semestr) => (
                                  <option>{semestr}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span>Не указаны</span>
                    )}
                  </div>
                  </div>
                    <div className='createElectiveNavigation'>
                      <div className='formNavigation'>
                        <button type="submit" className='nextStepButton'>Следующий шаг<i className="fas fa-chevron-right" ></i></button>
                      </div>  
                    </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

export default Create