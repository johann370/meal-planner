import {useState} from 'react'
import './App.css'

function App() {
  const [selectedDay, setSelectedDay] = useState(null);


  return (
    <>
     <h1>Weekly Meals</h1>
     <ul className="week">
        <li className= {selectedDay === 'Monday' ? "day selected" :"day"} onClick={() => setSelectedDay('Monday')}>
          <h2>Monday</h2>
          <p>Sandwiches</p>
        </li>
        <li className= {selectedDay === 'Tuesday' ? "day selected" :"day"} onClick={() => setSelectedDay('Tuesday')}>
          <h2>Tuesday</h2>
          <p>Chicken Alfredo</p>
        </li>
        <li className= {selectedDay === 'Wednesday' ? "day selected" :"day"} onClick={() => setSelectedDay('Wednesday')}>
          <h2>Wednesday</h2>
          <p>Honey Garlic Chicken</p>
        </li>
        <li className= {selectedDay === 'Thursday' ? "day selected" :"day"} onClick={() => setSelectedDay('Thursday')}>
          <h2>Thursday</h2>
          <p>Vegetable Stir Fry</p>
        </li>
        <li className= {selectedDay === 'Friday' ? "day selected" :"day"} onClick={() => setSelectedDay('Friday')}>
          <h2>Friday</h2>
          <p>Beef Tacos</p>
        </li>
        <li className= {selectedDay === 'Saturday' ? "day selected" :"day"} onClick={() => setSelectedDay('Saturday')}>
          <h2>Saturday</h2>
          <p>Pizza</p>
        </li>
        <li className= {selectedDay === 'Sunday' ? "day selected" :"day"} onClick={() => setSelectedDay('Sunday')}>
          <h2>Sunday</h2>
          <p>Roast Beef</p>
        </li>
     </ul>
    </>
  )
}

export default App
