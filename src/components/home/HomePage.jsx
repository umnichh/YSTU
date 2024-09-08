import './HomePage.css';
import logo from '../../ystu-images/images/image 1.jpg';
import student from '../../ystu-images/test-images/image 2.jpg'
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const  {data }  = location.state || {};
  console.log(data)
  /////////////////////////////////////////////////////////
  let fullName = data.last_name + ' ' + data.first_name + ' ' + data?.middle_name;
  let program = data.profile.facultet.name;
  let status = 'Cтуденты';
  let year = data.year_of_study;
  let group = data.group;
  let ratings = data.average_grade;
  let healthGroup = data.health.name;
  return (
    <>
    <div className='main'>
      <div className='logo'>
        <img src={logo} alt="logo" />
      </div>
      <div className='fullName'>{fullName}</div>
      <div className='student'>
        <img src={student} alt='student' />
        <div className='student-properties'>
          <span>Направление подготовки:</span>
          <span>Cтатус:</span>
          <span>Курс:</span>
          <span>Группа:</span>
          <span>Успеваемость:</span>
          <span>Информация о группе здоровья:</span>
          <a href='login'>Освоенные дисциплины</a>
        </div>
        <div className='student-properties'>
          <span>{program}</span>
          <span>{status}</span>
          <span>{year}</span>
          <span>{group}</span>
          <span id='ratings'>{ratings}</span>
          <span>{healthGroup}</span>
        </div>
        
      </div>
      <div className='electives'>Доступные элективы</div>
      <form>
        <div className='search-container'>        
          <input className='search' type="text" placeholder="Поиск"/>
        </div>
      </form>
    </div>
    
    </>
  )
}

export default HomePage;