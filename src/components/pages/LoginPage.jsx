import logo from './../../ystu-images/logo.jpg';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Функция для обновления access токена с помощью refresh токена
const refreshAccessToken = async () => {
  // Получаем refresh токен из localStorage
  
  const refreshToken = localStorage.getItem('refresh_token');
  
  // Если refresh токен не найден, выводим ошибку в консоль и возвращаем null
  if (!refreshToken) {
    console.error('Refresh token not found');
    return null;
  }

  try {
    // Отправляем запрос на обновление access токена
    const response = await fetch('http://212.67.13.70:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Получаем данные из ответа
    const data = await response.json();

    // Если запрос успешен, сохраняем новый access токен и возвращаем его
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      return data.access;
    } else {
      // Если запрос неуспешен, выводим ошибку
      console.error('Failed to refresh token:', data);
      return null;
    }
  } catch (error) {
    // Обрабатываем возможные ошибки при запросе
    console.error('Error refreshing token:', error);
    return null;
  }
};


// Компонент страницы входа
function LoginPage() {
  // Локальные состояния для управления логином, паролем и токеном
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [errorMessage, setErrorMessage] = useState('');

  // Хук для навигации по маршрутам
  const navigate = useNavigate();
  // Функция для обработки авторизации
  const handleLogin = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    const credentials = { username, password }; // Собираем данные для авторизации

    try {
      // Отправляем запрос на получение токена по введенным логину и паролю
      const response = await fetch('http://212.67.13.70:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      // Если запрос успешен, сохраняем токены и обновляем состояние
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
 
        setToken(data.access);
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
  
    // Если токен не найден, пытаемся его обновить с помощью refresh токена
    if (!currentToken) {
      currentToken = await refreshAccessToken();
      if (!currentToken) {
        navigate('/login'); // Перенаправляем на страницу логина, если токен не удалось получить
        return;
      }
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
        // Если ответ от сервера успешный (статус 200-299), то:
        const data = await response.json(); 
        // Асинхронно получаем данные из ответа в формате JSON
        // Выводим данные пользователя в консоль для отладки
        console.log(data)
        
        if (data.role === 'student') {


          navigate('/student');
   
        } 
        
        if (data.role === 'teacher') {

          const response = await fetch('http://212.67.13.70:8000/api/teacher/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json',
            },
          });

          const teacherData = await response.json();
          navigate('/teacher', {state : { teacherData}});
        } 
      
      } else {
        const errorText = await response.text(); 
        // Асинхронно получаем текст ответа для отладки ошибки
        console.error(`Failed to fetch user data: ${response.status} ${response.statusText}`, errorText); 
        // Выводим в консоль статус ошибки и текст ответа для отладки
      }
      
      } catch (error) {
        // Если произошла ошибка в процессе запроса (например, проблемы с сетью)
        console.error('Error fetching user data:', error); 
        // Логируем ошибку в консоль для отладки
      }
      
      }, [navigate]); 
      // Добавляем navigate в зависимости, чтобы эффект перезапускался при изменении навигации

      useEffect(() => { 
        // Используем хук useEffect для выполнения побочных эффектов
        if (token) { 
          // Если существует токен, запускаем функцию для получения данных пользователя
          fetchUserData(); 
          // Вызываем функцию fetchUserData для получения данных пользователя
        }
        
      }, [token, fetchUserData]); 
      // Хук useEffect срабатывает при изменении токена или функции fetchUserData
       
  return (
    <div className="login">
      <div className='container'>
        <div className='bigLogo'>
          <img src={logo} alt="logo" />
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
            <label className='login-label'>
              <input 
                className="login" 
                type="text" 
                name="login" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder='Имя пользователя'/>
            </label>
            <label className='password-label'>
              <input 
                className="password" 
                type="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder='Пароль'/>
                
            </label>
            <button className='submit' type='submit'>Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
