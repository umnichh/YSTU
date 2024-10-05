import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

export default function SelectList(props){
  const selected = props.selected,
        formInfo = props.formInfo,
        [semesterList, setSemesterList] = useState({}),
        [expandedList, setExpandedList] = useState({});
  
  // Дерево для курсов
  const courseTree = formInfo.courses.map(course => ({
    label: course.name,
    value: `course-${course.name}`,
    children: (course.semesters || []).map(semester => ({
        label: semester.name,
        value: semester.id
    }))
  }));

  // Обработчик для изменения состояния курсов для конкретного профиля
  const handleCheckCourses = (profileName, selectedCourses) => {
    setSemesterList(prevState => ({
      ...prevState,
      [profileName]: selectedCourses,
    }));
  };

  // Обработчик для изменения состояния расширения для конкретного профиля
  const handleExpandCourses = (profileName, expanded) => {
    setExpandedList(prevState => ({
      ...prevState,
      [profileName]: expanded, 
    }));
  };

  return(
    <>
      {selected.selectedProfiles.length > 0 ? (
        selected.selectedProfiles.map((check) => {
          const profile = formInfo.profiles.find((p) => p.id === Number(check));
          return (
            <div key={profile.id}>
              <label>{profile.name}</label>
                <CheckboxTree
                  nodes={courseTree}
                  checked={semesterList[profile.id] || []}
                  expanded={expandedList[profile.id] || []}
                  onCheck={(checked) => handleCheckCourses(profile.id, checked)} // Обновляем по имени профиля
                  onExpand={(expanded) => handleExpandCourses(profile.id, expanded)} // Обновляем по имени профиля
                  classNamePrefix="courseTreePrefix"
                />  
            </div>
          );
        })
      ) : <label className='mt-4'>Нет выбранных профилей</label>
      }
    </> 
  )
}