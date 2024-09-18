import React from 'react';
import logo from '../../ystu-images/logo.jpg';
import { useNavigate, Link} from 'react-router-dom';

function Navbar(){
  const navigate = useNavigate();
  const studentProfile = '/profile/student',
        teacherProfile = '/profile/teacher';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/');
  }     

  return(
    <nav className='nav-container'>
      <div className='nav-logo-container'>
        <Link to="https://www.ystu.ru/" ><img src={logo} alt="logo"/></Link>
      </div>
      <div className="nav-links-container">
        {
          localStorage.getItem('role') === 'student' ? (
            <>
              <Link to={studentProfile}><i className="fas fa-user"></i>Мой профиль</Link>
            </>
          ) : localStorage.getItem('role') === 'teacher' ? (
            <>
              <Link to={teacherProfile}><i className="fas fa-user"></i>Мой профиль</Link>
              <Link to='/elective/create'><i className="fas fa-plus"></i>Создать электив</Link>
              <Link to='/elective/created'><i className="fas fa-bookmark"></i>Созданные</Link>
            </>
          ) : null
        }
        <Link to='/elective/all'><i className="fas fa-book"></i>Элективы</Link>
        <Link to='/elective/enrolled'><i className="fas fa-bookmark"></i>Мои элективы</Link>
        <Link to='/elective/finished'><i className="fas fa-check"></i>Архив</Link>
        <button type='button'  onClick={handleLogout}><i className="fas fa-sign-out-alt"></i>Выйти</button>
      </div>
    </nav>
  )
}

export default Navbar;