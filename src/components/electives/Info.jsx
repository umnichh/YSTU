import { useLocation } from 'react-router-dom';
import Navbar from '../service/Navbar';
import electiveImage from '../../ystu-images/elective.jpg';
import '../styles/elective-info.css';
import Footer from '../service/Footer';
function Info() {
  const location = useLocation();
  const { state } = location;
  const elective = state?.elective || {}; // Если состояние или elective отсутствует, используем пустой объект
  
  const {
    date_finish = '',
    date_start = '',
    describe = 'Описания нет',
    form = {},  // Вложенный объект
    health = {}, // Вложенный объект
    marks = 'Минимального порога нет',
    name = 'Название не указано',
    place = 'Количество мест не указано',
    volume = 'Объем не указан',
  } = elective;

  console.log(elective)

  // Деструктурируем вложенные объекты
  return(
    <>
      <div className="student-page-container">
      <Navbar /> 
        <div className='elective-info-container'>
          <div className='elective-info-header'>
            {name}
            <img src={electiveImage} alt="elective" className="elective-image-info"/>
          </div>
          <div className='elective-info-info'>
            <div className='elective-info-properties'>
              <span>Количество мест:</span>
              <span>Объем:</span>
              <span>Дата начала:</span>
              <span>Дата конца:</span>
              <span>Форма прохождения:</span>
              <span>Группа здоровья:</span>
              <span>Оценка:</span>
              <span>Преподаватели:</span>
            </div>
            <div className='elective-info-values'>

              <span>{place}</span>
              <span>{volume}</span>
              <span>{date_start}</span>
              <span>{date_finish}</span>
              <span>{form.name}</span>
              <span>{health.name}</span>
              <span>{marks}</span>
              {elective.teachers.length > 0 ? (
                elective.teachers.map((teacher) => (
                  <div>
                    {teacher.last_name} {teacher.first_name} {teacher.middle_name} 
                  </div>
                ))
              ) : (
                <span> Не указаны</span>
              )}
            </div>
          </div>
        </div>
        <div className='describe-container'>
        {describe}
        </div>
        <Footer />
      </div>
     
    </>
  )

}

export default Info;