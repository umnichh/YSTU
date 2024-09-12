import logo from '../../ystu-images/logo.jpg';
import { useNavigate } from 'react-router-dom';

function Navbar(){
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  let studentProfile = '/profile/student',
      teacherProfile = '/profile/teacher';


  return(
    <div>
      <div className="student-page-header">
        <a href="https://www.ystu.ru/"><img src={logo} alt="logo" className='ystu-logo-small' /></a>
        <div className="topnav">
          <nav>
            <ul>          
              <div className='nav-links'>
                {
                  localStorage.getItem('role') === 'student' ? (
                    <>
                      <li><a href={studentProfile}><i className="fas fa-user"></i>Мой профиль</a></li>
                    </>
                  ) : localStorage.getItem('role') === 'teacher' ? (
                    <>
                      <li><a href={teacherProfile}><i className="fas fa-user"></i>Мой профиль</a></li>
                      <li><a href='/elective/create'><i className="fas fa-plus"></i>Создать электив</a></li>
                      <li><a href='/elective/made'><i className="fas fa-bookmark"></i>Созданные</a></li>
                    </>
                  ) : null
                }
                <li><a href='/elective/all'><i className="fas fa-book"></i>Элективы</a></li>
                <li><a href='/elective/my'><i className="fas fa-bookmark"></i>Мои элективы</a></li>
                <li><a href='/elective/finished'><i className="fas fa-check"></i>Архив</a></li>
                <li><button type='button' className='sidebar_logout-button' onClick={handleLogout}><i className="fas fa-sign-out-alt"></i>Выйти</button></li>
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Navbar;