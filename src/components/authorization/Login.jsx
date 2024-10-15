import logo from './../../ystu-images/logo.jpg';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState({ username, password });
  const [role, setRole] = useState(null);

  // Обработка логина
  const handleLogin = (e) => {
    e.preventDefault();
    setCredentials({ username, password });
  };

  console.log('TEST:', process.env.REACT_APP_TEST);

  //Отправка логина и пароля, получение токена
  useEffect(() => {
    sendCredentials();
    async function sendCredentials() {
      const response = await fetch(`${process.env.REACT_APP_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      try {
        if (response.ok){
          const data = await response.json();
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          getUserRole();
        }
      }
      catch (error) {
        console.log('Ошибка на стадии авторизации пользователя:', error);
      }
    }
    async function getUserRole(){
      const response = await fetch(`${process.env.REACT_APP_URL}/auth/user-role/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      const data = await response.json();
      localStorage.setItem('role', data.role); //УБРАТЬ ПОЗЖЕ
      setRole(data.role);
      console.log(data)
    }
  }, [credentials]);
  
  useEffect(() => {
    if (role){
      if (role === 'student') {
        navigate('/profile/student/');
      } else if (role === 'teacher') {
        navigate('/profile/teacher/');
      } else if (role === 'admin'){
        navigate('/elective/status/');
      }
    }
  }, [role, navigate]);

  return (
    <form className="text-2xl absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-12 flex flex-col gap-4 justify-center items-center shadow-xl border-2" onSubmit={handleLogin}>
      <img src={logo} className="p-10 px-0 w-3/4" alt="Логотип ЯГТУ"/>
      <div className='relative'>
        <i className='absolute top-1/2 -translate-y-1/2 fas fa-user pr-3 pl-4 text-gray-300'></i>
        <input
          className="py-3 pl-14 border-2 rounded-xl transition focus:border-orange-400 outline-none shadow-sm "          
          type="text"
          name="login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          required
          placeholder="Имя пользователя"
        />
      </div>
      <div className='relative'>
        <i className='absolute top-1/2 -translate-y-1/2 fas fa-lock pr-3 pl-4 text-gray-300'></i>
        <input
          className="py-3 pl-14 border-2 rounded-xl transition focus:border-orange-400 outline-none"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          required
          placeholder="Пароль"
        />
      </div>
      <button className="uppercase font-semibold mt-6 mb-16 bg-ystu-blue focus:opacity-90 text-white py-4 px-32 hover:opacity-90" type="submit">Войти</button>
    </form>
  );
}


