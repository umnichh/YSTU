// src/components/ProtectedRoute.js
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const [role, setRole] = useState(null); // Хранение роли пользователя
  const [loading, setLoading] = useState(true); // Состояние загрузки данных

  const token = localStorage.getItem('access_token'); // Получение токена из localStorage

  // Функция для получения роли пользователя с сервера
  const getRole = useCallback(async () => {
    if (token) {
      try {
        const response = await fetch('http://212.67.13.70:8000/api/user-role/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.role; // Возвращаем роль пользователя
        } else {
          console.error('Failed to fetch role:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    }
    return null; // Если нет токена или произошла ошибка, возвращаем null
  }, [token]); // Зависимость от token, чтобы обновлять функцию при его изменении

  useEffect(() => {
    // Эффект для получения роли пользователя и установки состояния
    const fetchRole = async () => {
      const userRole = await getRole(); // Получаем роль пользователя
      setRole(userRole); // Устанавливаем роль в состояние
      setLoading(false); // Устанавливаем состояние загрузки в false
    };

    fetchRole(); // Запускаем получение роли
  }, [getRole]); // Зависимость от getRole, чтобы перезапускать эффект при его изменении

  if (loading) {
    return <div></div>; // Отображаем сообщение о загрузке, пока данные не получены
  }

  // Проверяем, есть ли у пользователя нужная роль, и показываем элемент или перенаправляем на страницу логина
  return allowedRoles.includes(role) ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
