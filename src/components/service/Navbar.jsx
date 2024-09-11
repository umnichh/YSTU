import logo from '../../ystu-images/logo.jpg';
import { useNavigate } from 'react-router-dom';

function Navbar(){
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return(
    <div>
      <div className="student-page-header">
        <a href="https://www.ystu.ru/"><img src={logo} alt="logo" className='ystu-logo-small' /></a>
        <div className="topnav">
          <nav>
            <ul>          
              <div className='nav-links'>
                <li><a href='/student-profile'><i className="fas fa-user"></i>Мой профиль</a></li>
                <li><a href='/student-electives'><i className="fas fa-book"></i>Элективы</a></li>
                <li><a href='/student-planned'><i className="fas fa-bookmark"></i>Мои элективы</a></li>
                <li><a href='/student-finished'><i className="fas fa-check"></i>Архив</a></li>
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