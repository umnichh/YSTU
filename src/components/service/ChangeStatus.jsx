export default function ChangeStatus(props){
  const statuses = props.statuses;
  const setStatus_id = props.setStatus_id;
  const setComment = props.setComment;
  const status_id = props.status_id;
  return(
    
    <div>Статус:
              Ожидают проверки

      <select name="status" id="status" onChange={(e) => setStatus_id(e.target.value)}>
        {statuses.map((status) => (
          <option key={status.id} value={status.id} >{status.name}</option>
        ))}
      </select>
      {
        status_id == 3 ? <input required type='textarea' onChange={(e) => setComment(e.target.value)}/> : <></>
      }
    </div>
  )
}

<div className="elective-buttons">

<button className="elective-edit" type='button' onClick={() => enroll(elective.id, status_id)} >Принять</button>

  <button className="elective-info_button" type='button' onClick={() => handleClick(elective)}>Подробнее</button>
</div>