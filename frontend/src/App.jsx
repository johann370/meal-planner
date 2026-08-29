import {useState, useEffect} from 'react'
import './App.css'
import RecipeManager from './components/RecipeManager.jsx'
import GroceryList from './components/GroceryList.jsx'
import Login from './components/Login.jsx'

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [week, setWeek] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

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


  function handleAssign(day, recipeId) {
    fetch(`${import.meta.env.VITE_API_URL}/api/week/${day}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
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
     <h1>Weekly Meals</h1>
     <ul className="week">
        {week.map((day => (<li key={day.day} className={selectedDay === day.day ? "day selected" : "day"} onClick={() => setSelectedDay(day.day)}>
          <h2>{day.day}</h2>
          <p>{day.meal}</p>
          <select defaultValue="" onChange={e => handleAssign(day.day, e.target.value)}>
            <option value="" disabled>Assign a recipe...</option>
            {recipes.map(recipe => (
              <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
            ))}
          </select>
        </li>)))}
     </ul>
     <RecipeManager recipes={recipes} setRecipes={setRecipes} />
     <GroceryList week={week} />
    </>
  )
}

export default App
