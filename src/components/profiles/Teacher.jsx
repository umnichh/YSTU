import teacher from '../../ystu-images/teacher.jpg';
import React, { useEffect, useState } from 'react';

function TeacherPage() {
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try{
        const response = await fetch('http://212.67.13.70:8000/api/teacher/cabinet/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        if (response.ok) {
          const data = await response.json();
          setTeacherData(data);
        }
      }
      catch (error) {
        console.log(error);
    }
  }
  getProfile();
}, [])

  const {
    last_name = '',
    first_name = '',
    middle_name = '',
  } = teacherData || {};
  
  const fullName = `${last_name} ${first_name} ${middle_name}`;
  




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
      console.error('Ошибка при загрузке файла:', response.text());
    }
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
  }
};


const handleFileChange = (event) => {
  setFile(event.target.files[0]);
};






  return (
    <div className="container">
     <form onSubmit={sendFile}>
   <input type="file" onChange={handleFileChange} />
   <button type="submit">Загрузить файл</button>
 </form>
      <div className='profile'>
        <img className='profile-image' src={teacher} alt='teacher'/>
        <div className='profile-info'>
          <div className='profile-fullname'>{fullName}</div>
          <div className='profile-parameters'>
            <div className='profile-properties'>
              <span>Статус:</span>
            </div>
            <div className='profile-values'>
              <span>"Преподаватели"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherPage;

