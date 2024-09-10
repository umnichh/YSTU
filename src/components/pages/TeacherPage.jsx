import logo from '../../ystu-images/logo.jpg';
import student from '../../ystu-images/teacher.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

function TeacherPage() {
  const location = useLocation();
  const { teacherData } = location.state || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const {
    last_name = '',
    first_name = '',
    middle_name = '',
  } = teacherData || {};

  const fullName = `${last_name} ${first_name} ${middle_name}`;

  return (
    <div className='main'>
      <header className='logo'>
        <img src={logo} alt="logo" />
        <button className='logout' onClick={handleLogout}>Выйти</button>
      </header>
      <section className='fullName'>{fullName}</section>
      <section className='student'>
        <img src={student} alt='student' />
        <div className='student-properties'>
          <span>Cтатус:</span>
          <span></span>
        </div>
        <div className='student-properties'>
          <span>Преподаватели</span>
          <span></span>
        </div>
      </section>
      <section className='electives'>Доступные элективы</section>
      <form>
        <div className='search-container'>
          <input className='search' type="text" placeholder="Поиск"/>
        </div>
      </form>
    </div>
  );
}

export default TeacherPage;
