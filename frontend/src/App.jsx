import {useState, useEffect} from 'react'
import './App.css'

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [week, setWeek] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/week')
      .then(response => response.json())
      .then(data => setWeek(data));
  }, [])


  return (
    <>
     <h1>Weekly Meals</h1>
     <ul className="week">
        {week.map((day => (<li key={day.day} className={selectedDay === day.day ? "day selected" : "day"} onClick={() => setSelectedDay(day.day)}>
          <h2>{day.day}</h2>
          <p>{day.meal}</p>
        </li>)))}
     </ul>
    </>
  )
}

export default App
