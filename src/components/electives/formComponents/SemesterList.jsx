import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

export default function SelectList(props){
  const selected = props.selected,
        formInfo = props.formInfo,
        [semesterList, setSemesterList] = useState({}),
        [expandedList, setExpandedList] = useState({}),
        courseTree = props.courseTree;

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
    <div className='mt-6 grid grid-cols-3'>
    {selected.selectedProfiles.length > 0 ? (
        selected.selectedProfiles.map((check) => {
          const profile = formInfo.profiles.find((p) => p.id === Number(check));
          return (
            <div className='border-2  p-8 text-center flex flex-col items-center' key={profile.id}>
              <strong className='text-xl underline underline-offset-2'>{profile.name + '- ' + profile.form.name}</strong>
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
    </div>
  )
}