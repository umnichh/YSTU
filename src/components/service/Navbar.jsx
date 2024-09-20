import React, { useEffect } from 'react';
import logo from '../../ystu-images/logoWithoutText.jpg';
import { useNavigate, Link, useLocation} from 'react-router-dom';

function Navbar(){
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/');
  }     

  // Функция для установки цвета иконок
  function whereAmI() {
    // Сбрасываем цвета всех иконок
    document.querySelectorAll('.resetStyle').forEach(link => {
      link.style.color = 'black';
      link.style.textDecoration = 'none';
      link.style.textUnderlineOffset = '5px';
    });

    // Устанавливаем цвет для активной иконки
    switch (location.pathname) {
      case '/profile/teacher':
      case '/profile/student':
        const userStyle = document.querySelector('.user');
        userStyle.style.color = 'rgb(219, 120, 33)';
        userStyle.style.textDecoration = 'underline 2px';
        break;
      case '/elective/create':
        const plusStyle = document.querySelector('.plus');
        plusStyle.style.color = 'rgb(219, 120, 33)';
        plusStyle.style.textDecoration = 'underline 2px';
        break
      case '/elective/created':
        const checkStyle = document.querySelector('.check');
        checkStyle.style.color = 'rgb(219, 120, 33)';
        checkStyle.style.textDecoration = 'underline 2px';
        break
      case '/elective/enrolled':
        const bookmarkStyle = document.querySelector('.bookmark');
        bookmarkStyle.style.color = 'rgb(219, 120, 33)';
        bookmarkStyle.style.textDecoration = 'underline 2px';
        break
      case '/elective/all':
        const bookStyle = document.querySelector('.book');
        bookStyle.style.color = 'rgb(219, 120, 33)';
        bookStyle.style.textDecoration = 'underline 2px';
        default:
        break;
    }
  }

  // Отслеживаем изменение маршрута
  useEffect(() => {
    whereAmI();
  }, [location.pathname]);


  return(
    <nav className='nav-container'>
      <div className='nav-logo-container'>
        <Link to="https://www.ystu.ru/" ><img src={logo} alt="logo"/></Link>
      </div>
      <div className="nav-links-container">
        {
          localStorage.getItem('role') === 'student' ? (
            <>
              <Link className='resetStyle user' to='/profile/student' onClick={whereAmI}>Мой профиль</Link>
            </>
          ) : localStorage.getItem('role') === 'teacher' ? (
            <>
              <Link className='resetStyle user' to='/profile/teacher' onClick={whereAmI}>Профиль</Link>
              <Link className="resetStyle plus" to='/elective/create' onClick={whereAmI}>Создать электив</Link>
              <Link className='resetStyle check' to='/elective/created' onClick={whereAmI}>Созданные</Link>
            </>
          ) : null
        }
        <Link className='resetStyle bookmark' to='/elective/enrolled' onClick={whereAmI}>Мои элективы</Link>
        <Link className='resetStyle book' to='/elective/all' onClick={whereAmI}>Элективы</Link>
        {/* <Link to='/elective/finished'><i className="fas fa-check"></i>Архив</Link> */}
        <button type='button'  onClick={handleLogout}><i className="fas fa-sign-out-alt"></i>Выйти</button>
      </div>
    </nav>
  )
}

export default Navbar;