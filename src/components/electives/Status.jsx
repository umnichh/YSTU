import React, { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import electiveImage from '../../ystu-images/elective.jpg';
import Elective from "../../components/service/Elective";

export default function Status(){
  const navigate = useNavigate();
  const [toCheck, setToCheck] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [cancelled, setCancelled] = useState(null);
  const [comment, setComment] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [status_id, setStatus_id] = useState([]);

  useEffect(() => {
    fetch(`http://212.67.13.70:8000/api/electives/status/info/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setStatuses(data)
    })
    .catch(error => console.error(error));

    fetch(`http://212.67.13.70:8000/api/electives/to_check/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setToCheck(data.checked_electives)
    })
    .catch(error => console.error(error));

    fetch(`http://212.67.13.70:8000/api/electives/checked/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => setConfirmed(data))
    .catch(error => console.error(error));

    fetch(`http://212.67.13.70:8000/api/electives/cancelled/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then(response => response.json())
    .then(data => setCancelled(data))
    .catch(error => console.error(error));

  }, []);

  if (!toCheck || !statuses || !confirmed || !cancelled) {
    return null; 
  }

  // Запись на электив
  function enroll(id, status_id, comment){
    console.log(id, status_id, comment)
    fetch(`http://212.67.13.70:8000/api/electives/${id}/check/`, {
        method: 'POST',
        body: JSON.stringify({'elective_id':id,'status_id':status_id, 'comment':comment}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then(response => {
        if (response.ok) {
          alert('Вы изменили статус электива')
        } else {
          alert('Не удалось изменить статус')
        }
      })
      .catch(error => console.error(error));
  }
    
  

  return (
    <main>
      <div className='electives'>
        <div className='elective-container'>
        <div className="searchSettings">
        </div>
        <Elective electives={toCheck} electiveImage={electiveImage}  func={enroll} statuses={statuses} from={'Created'}/>
        Подтвержденные
        <Elective electives={confirmed} electiveImage={electiveImage} func={enroll} statuses={statuses} from={'Created'}/>
        Отклоненные
        <Elective electives={cancelled} electiveImage={electiveImage} func={enroll} statuses={statuses} from={'Created'}/>
        </div>
      </div>
    </main>
  );
}




