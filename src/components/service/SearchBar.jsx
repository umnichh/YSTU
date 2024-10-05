import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Search({electives}) {
  const SearchElectives = (value) => {
    electives.filter((elective) => {
      if (elective.name.toLowerCase().includes(value.toLowerCase())) {
        document.getElementById(`id${elective.id}`).style.display = 'flex';
      } else {
        document.getElementById(`id${elective.id}`).style.display = 'none';
      }
    })
  };  
  
  return (
    <search>
      <div className='relative flex justify-center'>
        <input 
          className='w-11/12 my-4  bg-gray-100 p4 border-2 border-gray-400 rounded-lg pl-8 text-lg py-2 focus:outline-none focus:border-blue-500' 
          type="text" 
          onChange={(e) => SearchElectives(e.target.value)} 
          placeholder="Поиск элективов"/>
      </div>
    </search>
  );
}