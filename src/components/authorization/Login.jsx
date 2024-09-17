import logo from './../../ystu-images/logo.jpg';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
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

  //Отправка логина и пароля, получение токена
  useEffect(() => {
    sendCredentials();
    async function sendCredentials() {
      const response = await fetch('http://212.67.13.70:8000/api/auth/token/', {
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
      const response = await fetch('http://212.67.13.70:8000/api/auth/user-role/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      const data = await response.json();
      localStorage.setItem('role', data.role); //УБРАТЬ ПОЗЖЕ
      setRole(data.role);
    }
  }, [credentials]);
  
  useEffect(() => {
    if (role){
      if (role === 'student') {
        navigate('/profile/student/');
      } else if (role === 'teacher') {
        navigate('/profile/teacher/');
      }
    }
  }, [role, navigate]);
  //navigate eslint error
  return (
    <div className="container">
      <div className="login-form">
        <div className="logo-container">
          <img src={logo} className="ystu-logo-big" alt="YSTU" />
        </div>
        <form onSubmit={handleLogin}>
          <div className="icon-container login-container">
            <input
              className="login-form_input"
              id="login"
              type="text"
              name="login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              placeholder="Имя пользователя"
            />
          </div>
          <div className="icon-container password-container">
            <input
              className="login-form_input"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
              placeholder="Пароль"
            />
          </div>
          <button className="login-form_button" type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>  
  );
}

export default LoginPage;
