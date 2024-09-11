
function MyElectives() {
  const currentToken = localStorage.getItem('access_token');
  fetch('http://212.67.13.70:8000/api/electives/teacher/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));


  
  return (
    <div>
    hi
    </div>
  );
}

export default MyElectives;