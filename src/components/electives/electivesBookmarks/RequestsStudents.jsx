import React, { useEffect , useState } from "react";

export default function StudentList(){
  const [electives, setElectives] = useState(null),
        [students, setStudents] = useState({}),
        [showStudents, setShowStudents] = useState({});

  // Получение элективов
  useEffect(() => {
      fetch(`http://212.67.13.70:8000/api/electives/`, {
        methodToEnroll: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setElectives(data))
        .catch((error) => console.error(error));
}, []);

  // Запись на электив
  function request(id){
      fetch(`http://212.67.13.70:8000/api/electives/${id}/requests/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setStudents((prev) => ({ ...prev, [id]: data })))
        .catch((error) => console.error(error));

        setShowStudents((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  console.log(students)
  console.log(showStudents)

  return (
    <main>
      {electives &&
        <>
          <table className="electives-table">
            <thead>
              <tr>
                <th>Название электива</th>
                <th>Регистрация до</th>
                <th>Средний балл</th>
                <th>Входное тестирование</th>
                <th>Показать студентов</th>
              </tr>
            </thead>
            <tbody>
              {electives.map((elective) => (
                  <React.Fragment key={elective.id}>
                    <tr>
                      <td>{elective.name}</td>
                      <td>{elective.date_start}</td>
                      <td>{elective.marks}</td>
                      <td>Отсутствует</td>
                      <td>
                        <button 
                          className="showStudents" 
                          onClick={() => request(elective.id)}
                        >
                          {showStudents[elective.id] ? 'Скрыть студентов' : 'Показать всех студентов'}
                        </button>
                          
                      </td>
                    </tr>

                    {showStudents[elective.id] && students[elective.id]  && 
                      <tr>
                         <td colSpan="5">
                          <table className="students-table">
                          <thead>
                            <tr>
                              <th>Фамилия</th>
                              <th>Имя</th>
                              <th>Отчество</th>
                              <th>Профиль</th>
                              <th>Группа</th>
                              <th>Группа здоровья</th>
                              <th>Средний балл</th>
                            </tr>
                          </thead>
                        <tbody>
                          {students[elective.id].map((student) => (
                              <tr key={student.id}>
                                <td>{student.last_name}</td>
                                <td>{student.first_name}</td>
                                <td>{student.middle_name}</td>
                                <td>{student.profile.name}</td>
                                <td>{student.group}</td>
                                <td>{student.health.name}</td>
                                <td>{student.average_grade}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                    </tr>
                    }
                  </React.Fragment>
                ))
              }
            </tbody>
          </table>
          </>
      }
    </main>
  );
}

