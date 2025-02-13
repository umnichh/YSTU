import React, { useEffect , useState } from "react";
import Elective from "../../service/Elective.tsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../../ystu-images/elective.jpg';

export default function Madeby(){
  const [electives, setElectives] = useState(null), 
        currentToken = localStorage.getItem('access_token'),
        role = localStorage.getItem('role');

  let path;

  // Загрузка созданных элективов
  useEffect(() => {
    if (role === 'student') {
      path = ('archive/student/');
    } else if (role === 'teacher') {
      path = ('archive/teacher/');
    }
    fetch(`${process.env.REACT_APP_URL}/${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => setElectives(data))
    .catch(error => console.error(error));
  
  }, [currentToken]);

  return (
    <main>
      {electives && 
        <Elective electives={electives} electiveImage={electiveImage} from='Created'/>
      }
    </main>
  );
}
