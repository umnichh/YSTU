import All from './electivesBookmarks/All';
import My from './electivesBookmarks/My';
import Created from './electivesBookmarks/Created';
import RequestsStudents from './electivesBookmarks/RequestsStudents';

import { useState } from 'react';

export default function Electives(){
  const [mode, setMode] = useState('All'),
        role = localStorage.getItem('role');

  return (
    <main>
      <div className='radioGroup'>
        <input type="radio" id="all" name="electives" value="all" defaultChecked onChange={() => setMode('All')}/>
        <label htmlFor="all">Все элективы</label>
        {role === 'student' &&
          <>
          <input type="radio" id="my" name="electives" value="my" onChange={() => setMode('My')}/>
          <label htmlFor="my">Мои элективы</label>
          </>
        }
        {role === 'teacher' && 
          <>
            <input type="radio" id="my" name="electives" value="my" onChange={() => setMode('My')}/>
            <label htmlFor="my">Элективы к проведению</label>
            <input type="radio" id="created" name="electives" value="created" onChange={() => setMode('Created')}/>
            <label htmlFor="created">Созданные элективы</label>
            <input type="radio" id="requestsStudents" name="electives" value="requestsStudents" onChange={() => setMode('RequestsStudents')}/>
            <label htmlFor="requestsStudents">Заявки студентов</label>
          </>
        }
      </div>
      {mode === 'All' &&  <All />}
      {mode === 'My' && <My />}
      {mode === 'Created' && role === 'teacher' && <Created />}
      {mode === 'RequestsStudents' && role === 'teacher' && <RequestsStudents />}
    </main>
  )
}