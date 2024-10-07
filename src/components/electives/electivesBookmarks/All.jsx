import React, { useEffect , useState } from "react";
import electiveImage from '../../../ystu-images/elective.jpg';
import Elective from "../../service/Elective.tsx";

export default function Electives(){
  const role = localStorage.getItem('role'),
        [path, setPath] = useState(''),
        [electives, setElectives] = useState(null),
        [isEnrolled, setIsEnrolled] = useState(false);

  // Путь к элективам в зависимости от роли
  useEffect(() => {
    role === 'student' ? setPath('api/electives/choice/') :
    role === 'teacher' || role === 'admin' ? setPath('api/electives/') : 0;
  }, [role]);

  // Получение элективов
  useEffect(() => {
    if (path) {
      fetch(`http://212.67.13.70:8000/${path}`, {
        methodToEnroll: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {setElectives(data); console.log(data)})
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
        if (isEnrolled){
          btn.setAttribute('class', 'sign elective-signIn')
          btn.innerHTML = 'Подать заявку';
        } else if (!isEnrolled) {
          btn.setAttribute('class', 'unsign elective-signIn')
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
        <Elective electives={electives} electiveImage={electiveImage} from='All' func={enroll}/>
      }
    </main>
  );
}




