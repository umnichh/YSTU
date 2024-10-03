export default function Search({electives}) {
  const SearchElectives = (value) => {
    electives.filter((elective) => {
      if (elective.name.toLowerCase().includes(value.toLowerCase())) {
        document.getElementById(`id${elective.id}`).style.display = 'flex';
      } else {
        document.getElementById(`id${elective.id}`).style.display = 'none';
      }
    })
  };  return (
    <search>
      <form>
        <div className='search-container'>
          <input className='search-electives' type="search" onChange={(e) => SearchElectives(e.target.value)} placeholder="Поиск элективов"/>
        </div>
      </form>
    </search>
  );
}