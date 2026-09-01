import { useState, useEffect, useRef } from 'react'
import './App.css'
import RecipeManager from './components/RecipeManager.jsx'
import GroceryList from './components/GroceryList.jsx'
import Login from './components/Login.jsx'

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [week, setWeek] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const weekRef = useRef(null);
  const recipeManagerRef = useRef(null);

  function fetchWeek() {
    fetch(`${import.meta.env.VITE_API_URL}/api/week`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setWeek(data));
  }

  function fetchRecipes() {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setRecipes(data));
  }

  useEffect(() => {
    if (loggedIn) {
      fetchWeek();
      fetchRecipes();
    }
  }, [loggedIn])

  // TODO(you): a useEffect (empty dependency array) that:
  //   - defines a click-handler function taking the event
  //   - if the click landed inside weekRef OR recipeManagerRef (.contains(event.target)), does nothing
  //   - otherwise calls setSelectedDay(null)
  //   - registers that handler with document.addEventListener('click', ...)
  //   - returns a cleanup function that removes it with document.removeEventListener('click', ...)
  useEffect(() => {
    function handleClickOutside(event) {
      if ((weekRef.current && weekRef.current.contains(event.target)) || (recipeManagerRef.current && recipeManagerRef.current.contains(event.target))) {
        return;
      } else {
        setSelectedDay(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])


  function handleAssign(day, recipeId) {
    fetch(`${import.meta.env.VITE_API_URL}/api/week/${day}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(() => fetchWeek())
      .catch(err => console.error(err));
  }


  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
    <>
      <h1 id="weekly-meals-title">Weekly Meals</h1>
      <div className="main-layout">
        <ul className="week" ref={weekRef}>
          {week.map((day => (<li key={day.day} className={selectedDay === day.day ? "day selected" : "day"} onClick={() => setSelectedDay(day.day)}>
            <h2>{day.day.slice(0, 3)}</h2>
            <p>{day.meal}</p>
          </li>)))}
        </ul>
        {selectedDay && <RecipeManager recipes={recipes} setRecipes={setRecipes} selectedDay={selectedDay} handleAssign={handleAssign} onClose={() => setSelectedDay(null)} recipeManagerRef={recipeManagerRef} />}
        <GroceryList week={week} />
      </div >
    </>
  )
}

export default App
