import logo from './../../ystu-images/logo.jpg';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Компонент страницы входа
function LoginPage() {
  // Локальные состояния для управления логином, паролем, токеном, ошибками ввода
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [errorMessage, setErrorMessage] = useState('');

  // Навигация
  const navigate = useNavigate();

  // Функция для проверки ввода имени пользователя и пароля
  const checkInputs = () => {
    setErrorMessage(''); // Сбрасываем старое сообщение об ошибке
    let error;
    let loginInput = document.getElementById('login');
    let passwordInput = document.getElementById('password');

    // Уведомления об ошибках ввода 
    // Сбрасываем старое сообщение об ошибке и стили
    loginInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');

    // Проверка наличия имени пользователя и пароля 
    if (!username && !password) {
      error = 'Введите имя пользователя и пароль';
      loginInput.classList.add('input-error');
      passwordInput.classList.add('input-error');
    } else if (!username) {
      error = 'Введите имя пользователя';
      loginInput.classList.add('input-error');
    } else if (!password) {
      error = 'Введите пароль';
      passwordInput.classList.add('input-error');
    }

    if (error) {
      setErrorMessage(error);
      return false;
    } else {
      return true;
    }

  }
  // Функция для обработки авторизации
  const handleLogin = async (e) => {
    // Предотвращаем перезагрузку страницы
    e.preventDefault(); 
    if (!checkInputs()){
      return;
    }

    // Собираем данные для авторизации
    const credentials = { username, password }; 
    try {
      // Отправляем запрос на получение токена по введенным логину и паролю
      const response = await fetch('http://212.67.13.70:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Получаем данные из ответа
      const data = await response.json();

      // Если запрос успешен, сохраняем токены и обновляем состояние
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setAccessToken(data.access);

      } else {
        // Выводим сообщение об ошибке авторизации
        setErrorMessage(data.message || 'Неверный логин или пароль'); // Устанавливаем сообщение об ошибке

      }
    } catch (error) {
      // Обрабатываем ошибки, связанные с запросом
      console.error('Error logging in:', error);
      setErrorMessage('Сервер не отвечает'); // Устанавливаем сообщение об ошибке
    }
  };

  // Функция для получения данных пользователя, обернутая в useCallback
  const fetchUserData = useCallback(async () => {
    let currentToken = localStorage.getItem('access_token');

    // Перенаправляем на страницу логина, если токен не удалось получить
    if (!currentToken) {
      navigate('/login'); 
      return;
    }
    
    // Если токен удалось получить, пытаемся получить данные пользователя 
    try {
      // Отправляем запрос для получения данных пользователя
      const response = await fetch('http://212.67.13.70:8000/api/user-role/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) { 
        const data = await response.json(); 

        // Если роль получена перенаправляем на соответствующую страницу
        if (data.role === 'student') {
          localStorage.setItem('role', data.role);
          navigate('/profile/student');
        } else if (data.role === 'teacher') {
          navigate('/profile/teacher');
          localStorage.setItem('role', data.role);
        } else {
          return;
        }

      } else {
        const errorText = await response.text(); 
        console.error(`Failed to fetch user data: ${response.status} ${response.statusText}`, errorText); 
      }
      
      } catch (error) {
        console.error('Error fetching user data:', error); 
      }
    // Добавляем navigate в зависимости, чтобы эффект перезапускался при изменении навигации
    }, [navigate]); 

      // Хук useEffect срабатывает при изменении accessToken или функции fetchUserData
      useEffect(() => { 
        if (accessToken) { 
          fetchUserData(); 
        }
      }, [accessToken, fetchUserData]); 

  return (
    <div className='login-page-container-center'>
      <div className='login-page-container'>
        <div className='logo-container'>
          <img src={logo} className = 'ystu-logo-big' alt="YSTU" />
        </div>
        <div className='login-form'>
          {errorMessage && (
          <div className="error-message-wrapper">
            <div className="error-message">
              {errorMessage}
            </div>
          </div>
          )}
          <form onSubmit={handleLogin}>
            <div className='icon-container login-container'>
              <input 
                className="login-form_input" 
                id = 'login'
                type="text" 
                name="login" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                autoComplete='off'
                placeholder='Имя пользователя'/>
            </div>
            <div className='icon-container password-container'>
              <input 
                className="login-form_input" 
                id = 'password'
                type="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete='off'
                placeholder='Пароль'/>
            </div>
            <button className='login-form_button' type='submit'>Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
