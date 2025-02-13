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
    <aside className='flex flex-col sticky h-screen top-0  w-60 '>
      <Link to="https://www.ystu.ru/"><img className='border-x-2' src={logo} alt="Логотип ЯГТУ" /></Link>
      <div className="flex flex-col items-start gap-4 text-lg px-5 pt-2 h-full bg-ystu-blue text-white">
        <Link to="/electives">Элективы</Link>
        {role === 'student' && <Link to="/profile/student">Профиль</Link>}
        {role === 'teacher' && <>
                               <Link to="/profile/teacher">Профиль</Link>
                               <Link to="/elective/create">Создать электив</Link>
                               <Link to="/tests">Тесты</Link>
                               </>
        }
        {role === 'admin'   && <Link to="/elective/status">Изменить статус электива</Link>}
        <button type="button" onClick={handleLogout}>Выйти</button>
      </div>
    </aside>
  );
}
