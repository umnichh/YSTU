// import React, { createContext, useContext, useEffect } from 'react';

// const TokenContext = createContext();

// export const TokenProvider = ({ children }) => {
//   const refreshAccessToken = async () => {
//     try {
//       const response = await fetch('https://your-api.com/api/token/refresh/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // Убедитесь, что используются безопасные cookie
//         body: JSON.stringify({
//           refresh: localStorage.getItem('refresh_token'),
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('access_token', data.access);
//       } else {
//         console.error('Failed to refresh token');
//         // Логика для выхода из системы или переадресации пользователя
//       }
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       console.log('Refreshing access token...');
//       refreshAccessToken();
//     }, 300000); // 5 минут

//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <TokenContext.Provider value={{ refreshAccessToken }}>
//       {children}
//     </TokenContext.Provider>
//   );
// };

// export const useToken = () => useContext(TokenContext);
