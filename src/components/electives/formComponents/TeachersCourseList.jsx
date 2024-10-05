import CheckboxTree from 'react-checkbox-tree';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import SelectList from './SemesterList';

export default function SelectProperty(props) {
  const [isForAll, setForAll] = useState(false),
        [isAdvanced, setIsAdvanced] = useState(false),
        formInfo = props.formInfo,
        selected = props.selected,
        expanded = props.expanded,
        handleSelect = props.handleSelect,
        handleExpand = props.handleExpand;
    
  // Опции для выбора учителя
  const teacherOptions = formInfo.teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`,
  }))

  // Опции для выбора курсов
  const handleIsAdvanced = (e) => {
    setIsAdvanced(e.target.id)
  }

  // Для всех институтов?
  const handleIsAll = (param) => {
    setForAll(param)
  }

  // Вытаскиваем значения из справочников и возвращаем в один объект
  const combinedData = formInfo.institutes.map(institute => {
    const relatedUgsns = formInfo.ugsns.filter(ugsn => ugsn.institute.id === institute.id)
      .map(ugsn => {
        const relatedFaculties = formInfo.facultets.filter(faculty => faculty.ugsn.id === ugsn.id)
          .map(faculty => {
            const relatedProfiles = formInfo.profiles.filter(profile => profile.facultet.id === faculty.id);
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
  const courseTree = formInfo.courses.map(course => ({
    label: course.name,
    value: `course-${course.name}`,
    children: (course.semesters || []).map(semester => ({
        label: semester.name,
        value: semester.id
    }))
  }));

  useEffect(() => {
    props.sendData({...selected});
  }, [selected])

  console.log(selected.selectedTeachers);
  return (
    <>
      <label>Преподаватели:</label>
      <Select
        options={teacherOptions}
        value={selected.selectedTeachers} 
        isMulti  
        isSearchable  
        closeMenuOnSelect={false}  
        classNamePrefix='teacherOptions'
        name='selectedTeachers'
        onChange={(select) => {handleSelect(select, 'selectedTeachers');  console.log(select)}}
      />

      <div className='createMode flex gap-2 mt-4 w-full'>
        <input type="radio" className='hidden' id='allProfiles' name='profileSettings' value='allProfiles' onChange={() => handleIsAll(false)} />
        <label htmlFor="allProfiles" defaultChecked className='p-1 border-2 w-full'>Создать для всех институтов и направлений</label>
        <input type="radio" className='hidden' id='someProfiles' name='profileSettings' value='someProfiles' onChange={() => handleIsAll(true)} />
        <label htmlFor="someProfiles" className='p-1 border-2 w-full'>Выбрать профили обучения</label>
      </div>
      {isForAll &&
      <>
        <label>Выберите институты и направления, которые будут проходить электив</label>
        <div className='tree'>
          <CheckboxTree
            nodes={treeData}
            checked={selected.selectedProfiles}
            expanded={expanded.expandedProfiles}
            name='selectedProfiles'
            onCheck={(select) => handleSelect(select, 'selectedProfiles')}
            onExpand={(expand) => handleExpand(expand, 'expandedProfiles')}
            classNamePrefix="checkTree"
          />
        </div>
      </>
      }

      <div className='createMode flex gap-2 mt-4 w-full'>
        <input type="radio" className='hidden' id='allCourses' name='courseSettings' value='allCourses' onChange={handleIsAdvanced} />
        <label htmlFor="allCourses" defaultChecked className='p-1 border-2 w-full'>Создать для всех курсов</label>
        <input type="radio" className='hidden' id='someCourses' name='courseSettings' value='someCourses' onChange={handleIsAdvanced} />
        <label htmlFor="someCourses" className='p-1 border-2 w-full'>Создать для выбранных курсов</label>
        <input type="radio" className='hidden' id='manyCourses' name='courseSettings' value='manyCourses' onChange={handleIsAdvanced} />
        <label htmlFor="manyCourses" className='p-1 border-2 w-full'>Создать для курсов по направлениям</label>
      </div>
      {isAdvanced === 'someCourses' && (
        <>
          <label className='mt-4'>Выберите курсы или семестры, которые будут проходить электив</label>
          <div className='tree'>
            <CheckboxTree
              nodes={courseTree}
              checked={selected.selectedCourses}
              expanded={expanded.expandedCourses}
              name='selectedCourses'
              onCheck={(select) => handleSelect(select, 'selectedCourses')}
              onExpand={(expand) => handleExpand(expand, 'expandedCourses')}
              classNamePrefix="checkTree"
            />
          </div>
        </>
      )}

      {isAdvanced === 'manyCourses' && (
        <SelectList  
          isAdvanced={isAdvanced} 
          formInfo={formInfo} 
          selected={selected}
          />
        )}
    </>
  )
}

