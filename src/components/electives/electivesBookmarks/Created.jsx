import React, { useEffect , useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../../ystu-images/elective.jpg';
import Search from "../../service/SearchBar";
import Elective from "../../service/Elective";

export default function CreatedElectives(){
  const [electives, setElectives] = useState([]),
        currentToken = localStorage.getItem('access_token');

  // Загрузка созданных элективов
  useEffect(() => {
        fetch(`http://212.67.13.70:8000/api/electives/created/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then (response => response.json())
        .then (data => setElectives(data))
        .catch(error => console.error('Error:', error));
  }, [currentToken]);

  // Удаление электива
  function deleteElective(id){
    const result = window.confirm('Вы уверены, что хотите удалить электив?');
    if (result) {
      fetch(`http://212.67.13.70:8000/api/electives/${id}/`, {
          method: 'DELETE',
          body: JSON.stringify(id), 
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            document.getElementById('id' + id).remove();
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }

  return (
    <main>
      {
        electives && 
        <>
          <Search electives={electives}/>
          <Elective electives={electives} electiveImage={electiveImage} from='Created' func={deleteElective}/>
        </>
      }
    </main>
  );
}
