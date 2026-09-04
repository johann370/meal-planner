import { useState, useEffect } from 'react'
import './App.css'
import RecipeManager from './components/RecipeManager.jsx'
import GroceryList from './components/GroceryList.jsx'
import Login from './components/Login.jsx'
import Week from './components/Week.jsx'
import MobileMenu from './components/MobileMenu.jsx'

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [week, setWeek] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [displayGroceryList, setDisplayGroceryList] = useState(true);
  const [displayRecipeManager, setDisplayRecipeManager] = useState(false);
  const [displayWeek, setDisplayWeek] = useState(false);
  const mediaQuery = window.matchMedia('(min-width: 768px)');

  function handleMediaQueryChange(e) {
    if (e.matches) {
      setDisplayGroceryList(true);
      setDisplayRecipeManager(true);
      setDisplayWeek(true);
    } else {
      setDisplayGroceryList(false);
      setDisplayRecipeManager(false);
      setDisplayWeek(true);
    }

  }

  useEffect(() => {
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }
  }, []);

  function fetchWeek() {
    fetch(`${import.meta.env.VITE_API_URL}/api/week`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWeek(data);
        } else {
          console.error('fetchWeek failed:', data);
        }
      });
  }

  function fetchRecipes() {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.error('fetchRecipes failed:', data);
        }
      });
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(() => fetchWeek())
      .catch(err => console.error(err));
  }

  function handleClearWeek() {
    fetch(`${import.meta.env.VITE_API_URL}/api/week/meals`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(() => fetchWeek())
      .catch(err => console.error(err));
  }

  function onSelectDay(day) {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
      setDisplayRecipeManager(true);
      setDisplayWeek(false);
    }
  }

  function onCloseRecipeManager() {
    setSelectedDay(null);
    setDisplayRecipeManager(false);
    setDisplayWeek(true);
  }

  function onCloseGroceryList() {
    setDisplayGroceryList(false);
    setDisplayWeek(true);
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
    <>
      <h1 id="weekly-meals-title">Weekly Meals</h1>
      <div className="main-layout">
        <MobileMenu setDisplayGroceryList={setDisplayGroceryList} setDisplayRecipeManager={setDisplayRecipeManager} setDisplayWeek={setDisplayWeek} />
        <Week isDisplayed={displayWeek} week={week} selectedDay={selectedDay} onSelectDay={onSelectDay} handleAssign={handleAssign} handleClearWeek={handleClearWeek} />
        <RecipeManager isDisplayed={displayRecipeManager} recipes={recipes} setRecipes={setRecipes} selectedDay={selectedDay} handleAssign={handleAssign} onClose={onCloseRecipeManager} />
        <GroceryList isDisplayed={displayGroceryList} setIsDisplayed={setDisplayGroceryList} week={week} onClose={onCloseGroceryList} />
      </div >
    </>
  )
}

export default App
