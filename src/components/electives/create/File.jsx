

const [file, setFile] = useState(null);
    const sendFile = async (event) => {
      event.preventDefault();
  
      const formData = new FormData();
      formData.append('document', file);
  
      try {
        const currentToken = localStorage.getItem('access_token');
        // Отправляем запрос на сервер через fetch
        const response = await fetch('http://212.67.13.70:8000/api/institutes/upload/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Файл успешно загружен:', data);
        } else {
          console.error('Ошибка при загрузке файла:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    };


    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
     <form onSubmit={sendFile}>
       <input type="file" onChange={handleFileChange} />
       <button type="submit">Загрузить файл</button>
     </form>
    



































  

  // const selectForms = mapOptions(forms);
  // const selectInstitute = mapOptions(institutes);
  // const selectFacultet = mapOptions(facultets);
  // const selectProfile = mapOptions(profiles, profile => `${profile.name} — ${profile.form.name}`);

    // const selectCourse = courses.map(course => ({
    //   value: course.id,
    //   label: +course.name
    // }))
  
    // const selectSemesters = semesters.map(semester => ({
    //   value: semester.id,
    //   label: +semester.name
    // }))
    // const [selectedForms, setSelectedForms] = useState([]);
    // const [selectedCourses, setSelectedCourses] = useState([]);  
    // const [selectedSemesters, setSelectedSemesters] = useState([]);
        
  
  
    // // Режимы фильтрации направлений
    // const [filterStatus, setFilterStatus] = useState(0);
    // const [filterSettings, setFilterSettings] = useState(0);
    // const [instituteId, setInstituteId] = useState(0);
    // const [courses, setCourses] = useState([]);
    // const [semesters, setSemesters] = useState([]);
    // const [selectedInstitutes, setSelectedInstitutes] = useState([]);
    // const [selectedFacultets, setSelectedFacultets] = useState([]);
    // const [selectedProfiles, setSelectedProfiles] = useState([]);
    // function handleStatus(value) {
    //   setFilterStatus(value);
    // }
    // function handleSettings(value) {
    //   setFilterSettings(value);
    // }
    // const instituteIds = selectedInstitutes.map((institute) => institute.value);
    // const facultetIds = selectedFacultets.map((facultet) => facultet.value);
    // const profileIds = selectedProfiles.map((profile) => profile.value);

{/* <div className='filterRadios'>
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
} */}

// {
// filterStatus === 2 && (
//   <div>
//     <Select
//         options={selectFacultet}
//         value={selectedFacultets}
//         isMulti 
//         isSearchable 
//         closeMenuOnSelect={false} 
//         placeholder="Поиск"
//         classNamePrefix='selectTeacher'
//         onChange={(selectedOptions) => setSelectedFacultets(selectedOptions)}
//       />
//   </div>
// )
// }

// {
// filterStatus === 3 && (
//   <div>
//     <Select
//         options={selectProfile}
//         value={selectedProfiles}
//         isMulti  
//         isSearchable  
//         closeMenuOnSelect={false} 
//         placeholder="Поиск"
//         classNamePrefix='selectTeacher'
//         onChange={(selectedOptions) => setSelectedProfiles(selectedOptions)}
//       />
//   </div>
// )
// }
// {filterStatus === 1 && (

// <div className='status1' >
// <span className='create-form-title'>Настройки</span>
// <div className='filterRadios'>
// <input type="radio" id='commonRadio' name='radioSettings' onChange={() => handleSettings(1)} />
// <label htmlFor="commonRadio">Общие</label>
// <input type="radio" id='broadRadio' name='radioSettings' onChange={() => handleSettings(2)} />
// <label htmlFor="broadRadio">Расширенные</label>
// </div>
// {filterSettings === 1 && (
// <div className='settings'>
// <div className='settingsContainer'>
//   <div className='semestersSettings'>
//     <label>Форма обучения</label>
//     <Select
//       options={selectForms}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Курс</label>
//     <Select
//       options={selectCourse}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Семестр</label>
//     <Select
//       options={selectSemesters}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
//     />
//   </div>
// </div>
// </div>
// )}
// {filterSettings === 2 && (
// <div className='ipfInfo'>
// {selectedInstitutes.length > 0 ? (
// selectedInstitutes.map((institute) => (
//   <div className='ifpContainer' key={institute.value}>
//   <div>
//     <label>{institute.label}</label>
//   </div>
//   <div className='settingsContainer'>
//   <div className='semestersSettings'>
//     <label>Форма</label>  
//     <Select
//       options={selectForms}                      
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Курс</label>
//     <Select
//       options={selectCourse}                      
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Семестр</label>
//     <Select
//       options={selectSemesters}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
//     />
//   </div>
// </div>
//   </div>
// ))
// ) : ( <span className='notSelected'>Нет выбранных институтов</span> )}
// </div>
// )}
// </div>
// )}
// {filterStatus === 2 && (
// <div className='status2'>
// <span className='create-form-title'>Направления</span>
// <div className='filterRadios'>
// <input type="radio" id='commonRadio' name='radioSettings' onChange={() => handleSettings(1)} />
// <label htmlFor="commonRadio">Общие</label>
// <input type="radio" id='broadRadio' name='radioSettings' onChange={() => handleSettings(2)} />
// <label htmlFor="broadRadio">Расширенные</label>
// </div>
// {filterSettings === 1 && (
// <div className='settings'>
// <div className='settingsContainer'>
//   <div className='semestersSettings'>
//     <label>Форма обучения</label>
//     <Select
//       options={selectForms}
//       value={selectedForms}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Курс</label>
//     <Select
//       options={selectCourse}
//       value={selectedCourses}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Семестр</label>
//     <Select
//       options={selectSemesters}
//       value={selectedSemesters}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
//     />
//   </div>
// </div>
// </div>
// )}

// {filterSettings === 2 && (
// <div className='ipfInfo'>
// {selectedFacultets.length > 0 ? (
// selectedFacultets.map((facultet) => (
//   <div className='ifpContainer' key={facultet.value}>
//     <label>{facultet.label}</label>
//     <div className='settingsContainer'>
//   <div className='semestersSettings'>
//     <label>Форма</label>  
//     <Select
//       options={selectForms}                      
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Курс</label>
//     <Select
//       options={selectCourse}                      
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Семестр</label>
//     <Select
//       options={selectSemesters}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
//     />
//   </div>
// </div>
//   </div>
// ))
// ) : (
// <span className='notSelected'>Нет выбранных направлений</span>
// )}
// </div>
// )}
// </div>
// )}


// {filterStatus === 3 && (
// <div className='status3'>
// <span className='create-form-title'>Профиль обучения</span>
// <div className='filterRadios'>
// <input type="radio" id='commonRadio' name='radioSettings' onChange={() => handleSettings(1)} />
// <label htmlFor="commonRadio">Общие</label>
// <input type="radio" id='broadRadio' name='radioSettings' onChange={() => handleSettings(2)} />
// <label htmlFor="broadRadio">Расширенные</label>
// </div>
// {filterSettings === 1 && (
// <div className='settings'>
// <div className='settingsContainer'>
//   <div className='semestersSettings'>
//     <label>Форма обучения</label>
//     <Select
//       options={selectForms}
//       value={selectedForms}
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedForms(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Курс</label>
//     <Select
//       options={selectCourse}
//       value={selectedCourses}
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Семестр</label>
//     <Select
//       options={selectSemesters}
//       value={selectedSemesters}
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
//     />
//   </div>
// </div>
// </div>
// )}

// {filterSettings === 2 && (
// <div className='ipfInfo'>
// {selectedProfiles.length > 0 ? (
//   selectedProfiles.map((profile) => (
//     <div className='ifpContainer' key={profile.value}>
//       <label>{profile.label}</label>
//       <div className='settingsContainer'>
//   <div className='semestersSettings'>
//     <label>Курс</label>
//     <Select
//       options={selectCourse}                      
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}  
//     />
//   </div>
//   <div className='semestersSettings'>
//     <label>Семестр</label>
//     <Select
//       options={selectSemesters}
//       isMulti  
//       isSearchable  
//       closeMenuOnSelect={false} 
//       placeholder="Поиск"
//       classNamePrefix='selectTeacher'
//       onChange={(selectedOptions) => setSelectedSemesters(selectedOptions)}  
//     />
//   </div>
// </div>
//     </div>
//   ))
// ) : (
//   <span className='notSelected'>Нет выбранных прфоилей</span>
// )}
// </div>
// )}
// </div>
// )}
// <div className='createElectiveNavigation'>
//   <div className='formNavigation'>
//     <button type="submit" className='nextStepButton'>Создать электив</button>
//   </div>  
// </div>