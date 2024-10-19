import photo from '../../ystu-images/teacher.jpg';
import React, { useEffect, useState } from 'react';



export default function TeacherProfile() {
  const [teacherData, setTeacherData] = useState({});

  // Загрузка данных преподавателя
  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/teacher/cabinet/`, {
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
    <main>
      
     <form onSubmit={sendFile}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Загрузить файл</button>
      </form> 
      {teacherData && (
        <>
          <section className='border-2 flex m-4'>
            <img className='w-1/6 min-w-52' src={photo} alt='Фотография преподавателя'/>
            <div className='flex flex-col m-4 gap-4'>
              <div className='text-4xl border-b-2 border-black borderwid'>{last_name} {first_name} {middle_name}</div>
              <dl>
                <dt>Статус:</dt><dd>Преподаватели</dd>
              </dl>
            </div>
          </section>
          <section className='w-full p-4'>
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
          </section>
        </>
      )}
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