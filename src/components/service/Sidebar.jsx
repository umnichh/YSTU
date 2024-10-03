import React from 'react';
import logo from '../../ystu-images/logo.jpg';
import { useNavigate, Link} from 'react-router-dom';


export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <aside>
      <div className="nav-logo-container">
        <Link to="https://www.ystu.ru/"><img src={logo} alt="logo" /></Link>
      </div>
      <div className="nav-links-container">
        <Link className="resetStyle bookmark" to="/electives">Элективы</Link>
        {role === 'student' ? (
          <Link className="resetStyle user" to="/profile/student">Профиль</Link>
        ) : role === 'teacher' ? (
          <>
            <Link className="resetStyle user" to="/profile/teacher">Профиль</Link>
            <Link className="resetStyle plus" to="/elective/create">Создать электив</Link>
          </>
        ) : role === 'admin' ? (
          <Link className="resetStyle bookmark" to="/elective/status">Изменить статус электива</Link>
        ) : null}
        <Link className="resetStyle check" to="/elective/archive">Архив</Link>
        <button type="button" onClick={handleLogout}>Выйти</button>
      </div>
    </aside>
  );
}
