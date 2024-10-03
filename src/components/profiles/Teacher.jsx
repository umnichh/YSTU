import teacher from '../../ystu-images/teacher.jpg';
import React, { useEffect, useState } from 'react';

export default function TeacherProfile() {
  const [teacherData, setTeacherData] = useState(null);

  // Загрузка данных преподавателя
  useEffect(() => {
    fetch('http://212.67.13.70:8000/api/teacher/cabinet/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => setTeacherData(data))
    .catch(error => console.error('Error:', error));
}, [])

  // Деструктуризация
  const {
    last_name = '',
    first_name = '',
    middle_name = '',
  } = teacherData || {};
    
  return (
    <main>
      { 
        teacherData && (
          <>
            <div className='profile'>
              <img className='profile-image' src={teacher} alt='Фотография преподавателя'/>
              <div className='profile-info'>
                <div className='profile-fullname'>{last_name} {first_name} {middle_name}</div>
                <dl>
                  <dt>Статус:</dt><dd>Преподаватели</dd>
                </dl>
              </div>
            </div>
            <article className='about-service'>
              <details>
                <summary>Как создать электив?</summary>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id cumque suscipit facere ipsa sapiente voluptates totam sit unde accusantium quisquam, magnam maiores magni modi ipsum dolorum pariatur, adipisci doloremque itaque?</p>
              </details>
              <details>
                <summary>В чем разница между элективом и факультативом?</summary>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, suscipit reprehenderit et aspernatur eius fuga molestiae quaerat. Quia cumque amet asperiores, nam voluptatum quasi ipsam dolore, odio repellendus illum animi.</p>
              </details>
              <details>
                <summary>Как работают созданные элективы и заявки студентов?</summary>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum rem, aliquam ullam doloribus quaerat blanditiis suscipit cumque corporis laudantium, quisquam, odit doloremque animi tempora! Iure facilis eligendi voluptas omnis similique. </p>
              </details>
              <details>
                <summary>Зачем нужен архив?</summary>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, suscipit reprehenderit et aspernatur eius fuga molestiae quaerat. Quia cumque amet asperiores, nam voluptatum quasi ipsam dolore, odio repellendus illum animi.</p>
              </details>
              <details>
                <summary>Как редактировать и удалить электив?</summary>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum rem, aliquam ullam doloribus quaerat blanditiis suscipit cumque corporis laudantium, quisquam, odit doloremque animi tempora! Iure facilis eligendi voluptas omnis similique. </p>
              </details>
            </article>
          </>
        )
      }
    </main>
  );
}

// const [file, setFile] = useState(null);
// const sendFile = async (event) => {
//   event.preventDefault();

//   const formData = new FormData();
//   formData.append('document', file);

//   try {
//     const currentToken = localStorage.getItem('access_token');
//     // Отправляем запрос на сервер через fetch
//     const response = await fetch('http://212.67.13.70:8000/api/institutes/upload/', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${currentToken}`,
//       },
//       body: formData
//     });
    
//     if (response.ok) {
//       const data = await response.json();
//       console.log('Файл успешно загружен:', data);
//     } else {
//       console.error('Ошибка при загрузке файла:', response.text());
//     }
//   } catch (error) {
//     console.error('Ошибка при загрузке файла:', error);
//   }
// };

// const handleFileChange = (event) => {
//   setFile(event.target.files[0]);
// };

// <form onSubmit={sendFile}>
// <input type="file" onChange={handleFileChange} />
// <button type="submit">Загрузить файл</button>
// </form>