import React, { useState, useEffect} from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

function Create() {
  const currentToken = localStorage.getItem('access_token');
  const navigate = useNavigate();
  // Состояния справочников
  const [forms, setForms] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [ugsns, setUgsn] = useState([]);
  const [facultets, setFacultets] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [healths, setHealths] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [facultativeState, setFacultative] = useState(1);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);




  // Выбранные значения
  const [selectedTeachers, setSelectedTeachers] = useState([]);

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
          setUgsn(data.ugsns);
          console.log(data)
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

    const elective = {
      facultativeState,
      checked,
      ...formObject,
      selectedTeachers: teacherIds,
    };
    console.log(elective)
    await fetch('http://212.67.13.70:8000/api/electives/create/', {
      method: 'POST',
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
  
  console.log(combinedData)
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
          label: profile.name,
          value: profile.id
        })),
      })),
    })),
  }));
  
  if (!forms || !facultets || !institutes || !teachers || !profiles || !healths) {
    return <div>Загрузка...</div>;
  }

  return (
    
    <div className='container'>
        <div className='create-form'>
          {(
            <form  className = "electiveForm" onSubmit={sendElective}>
              <span className='create-form-title first-title'>Информация об элективе</span>
              <label>Создать:</label>
              <div className='facultativeRadio'>
                <div className='facultativeContainer'>
                  <input type="radio" id='facultativeRadio' name='facultative' defaultChecked='checked' onChange={() => setFacultative(1)} />
                  <label htmlFor="facultativeRadio">Электив</label>
                </div>
                <div className='electiveContainer'>
                  <input type="radio" id='electiveRadio' name='facultative' onChange={() => setFacultative(2)} />
                  <label htmlFor="electiveRadio">Факультатив</label>
                </div>
              </div>
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
              {
              facultativeState === 1 && 
              <div>
                <span className='create-form-title'>Фильтрация электива</span>
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
                <span className='create-form-title'>Курсы</span>
                <label>Выберите курсы и семестры, которые будут проходить электив</label>
                  <div className='tree'>
                    {/* <CheckboxTree
                      nodes={treeData}
                      checked={checked}
                      expanded={expanded}
                      onCheck={(checked) => setChecked(checked)}
                      onExpand={(expanded) => setExpanded(expanded)}
                      classNamePrefix="checkTree"
                    /> */}
                </div>
              </div>


              }
              <button className='create-form-button' type="submit">Создать электив</button>
            </form>
          )}
        </div>
      </div>
  )
}

export default Create