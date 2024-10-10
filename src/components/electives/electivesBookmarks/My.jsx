import React, { useEffect , useState } from "react";
import electiveImage from '../../../ystu-images/elective.jpg';
import Elective from "../../service/Elective.tsx";

export default function My(){
  const [path, setPath] = useState('');
  const [electives, setElectives] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(true);

  const role = localStorage.getItem('role'); 
  // Запрашиваем роль
  useEffect(() => {
    if (role === 'student') {
      setPath('api/electives/student/');
    } else if (role === 'teacher') {
      setPath('api/electives/teacher/');
    }
  }, [role]);

  // Загрузка элективов
  useEffect(() => {
    if (path) {
      fetch(`http://212.67.13.70:8000/${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setElectives(data))
        .catch((error) => console.error(error));
    }
}, [path]);

    // Запись на электив
  async function enroll(id){
    // Метод заявки на электив
    let methodToEnroll;
    if (!isEnrolled) {
      setIsEnrolled(true);
      methodToEnroll = 'POST';
    } else if (isEnrolled) {
      setIsEnrolled(false);
      methodToEnroll = 'DELETE';
    }

    // Заявка на электив
    try{
      const response = await fetch(`http://212.67.13.70:8000/api/electives/${id}/enroll/`, {
        method: methodToEnroll,
        body: JSON.stringify(id),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (response.ok) {
        const btn = document.querySelector(`#enroll${id}`);

        // Изменение кнопки 
        if (!isEnrolled){
          btn.setAttribute('className', 'bg-green-600 p-2 w-full')
          btn.innerHTML = 'Подать заявку';
        } else if (isEnrolled) {
          btn.setAttribute('className', 'bg-red-800 p-2 w-full')
          btn.innerHTML = 'Отменить запись';
        }
      }
    } catch (error) {
        console.log(error);
    }
  }
    
  return (
    <main>
      {electives &&
        <Elective electives={electives} electiveImage={electiveImage} from='My' func={enroll}/>
      }
    </main>
  );
}



