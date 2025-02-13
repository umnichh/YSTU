import All from './electivesBookmarks/All';
import My from './electivesBookmarks/My';
import Created from './electivesBookmarks/Created';
import RequestsStudents from './electivesBookmarks/RequestsStudents';
import Archive from './electivesBookmarks/Archive';

import { useState } from 'react';

export default function Electives(){
  const [mode, setMode] = useState('All'),
        role = localStorage.getItem('role');

  return (
    <main>
      <div className='w-full flex justify-center gap-3 shadow-transparent opacity-90 text-white radioGroup px-10'>
        <input type="radio" id="all" name="electives" className='hidden' value="all" defaultChecked onChange={() => setMode('All')}/>
        <label htmlFor="all" className='mt-5 text-center border-2 h-full p-3 border-black rounded-t-md border-b-0 bg-ystu-blue w-1/3'>Все элективы</label>
        {role === 'student' &&
          <>
          <input type="radio" id="my" name="electives" value="my" className='hidden' onChange={() => setMode('My')}/>
          <label htmlFor="my" className='mt-5 text-center border-2 h-full p-3 border-black rounded-t-md border-b-0 bg-ystu-blue w-1/3'>Мои элективы</label>
          </>
        }
        {role === 'teacher' && 
          <>
            <input type="radio" id="my" name="electives" value="my" className='hidden' onChange={() => setMode('My')}/>
            <label htmlFor="my" className='mt-5 text-center border-2 h-full p-3 border-black rounded-t-md border-b-0 bg-ystu-blue w-1/3'>Элективы к проведению</label>
            <input type="radio" id="created" name="electives" value="created" className='hidden' onChange={() => setMode('Created')}/>
            <label htmlFor="created" className='mt-5 text-center border-2 h-full p-3 border-black rounded-t-md border-b-0 bg-ystu-blue w-1/3'>Созданные элективы</label>
            <input type="radio" id="requestsStudents" name="electives" value="requestsStudents" className='hidden' onChange={() => setMode('RequestsStudents')}/>
            <label htmlFor="requestsStudents" className='mt-5 text-center border-2 h-full p-3 border-black rounded-t-md border-b-0 bg-ystu-blue w-1/3'>Заявки студентов</label>
          </>
        }
        <input type="radio" id="finishedElectives" name="electives" value="finishedElectives" className='hidden' onChange={() => setMode('FinishedElectives')}/>
        <label htmlFor="finishedElectives" className='mt-5 text-center border-2 h-full p-3 border-black rounded-t-md border-b-0 bg-ystu-blue w-1/3'>Завершенные элективы</label>

      </div>
      {mode === 'All' &&  <All />}
      {mode === 'My' && <My />}
      {mode === 'Created' && role === 'teacher' && <Created />}
      {mode === 'RequestsStudents' && role === 'teacher' && <RequestsStudents />}
      {mode === 'FinishedElectives' && <Archive />}
    </main>
  )
}