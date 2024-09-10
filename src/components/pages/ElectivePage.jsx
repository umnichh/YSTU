import logo from '../../ystu-images/logo.jpg';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ElectivePage() {
  const location = useLocation();
  const { state } = location;
  const elective = state?.elective || {}; // Если состояние или elective отсутствует, используем пустой объект
  
  console.log(elective);

  return(
    <>
      <div>Hi: {elective.name}</div>
    </>
  )

}

export default ElectivePage;