import { useState } from 'react';
import RecipeView from './RecipeView.jsx';

function RecipeManager({ isDisplayed, recipes, setRecipes, selectedDay, handleAssign, onClose }) {
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [importUrl, setImportUrl] = useState('');

  function handleImport() {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes/import-from-url`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: importUrl })
    })
      .then(response => response.json())
      .then(newRecipe => {
        if (newRecipe.error) {
          alert(newRecipe.error);
          return;
        }

        setRecipes([...recipes, newRecipe]);
        setImportUrl('');
      })
      .catch(err => console.log(err))
  }

  if (viewingRecipe && isDisplayed) {
    return <RecipeView recipe={viewingRecipe} setRecipe={setViewingRecipe} onClose={() => setViewingRecipe(null)} setRecipes={setRecipes} recipes={recipes} />;
  }

  return (
    <div className={isDisplayed ? "recipe-manager" : "recipe-manager hidden-mobile"}>
      <div className="header">
        {selectedDay ? <h2>Assign to {selectedDay}</h2> : <h2>Manage Recipes</h2>}
        <button className="mobile-close-button" onClick={onClose}>Close</button>
      </div>

      <button onClick={(e) => {
        e.stopPropagation();
        setViewingRecipe({ id: null, title: '', ingredients: [{ name: '', quantity: '', unit: '' }], instructions: '' })
      }}>New Recipe</button>

      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id} className="recipe" onClick={() => handleAssign(selectedDay, recipe.id)} style={{ cursor: 'pointer' }}>
            <p>{recipe.title}</p>
            <button onClick={(e) => {
              e.stopPropagation();
              setViewingRecipe(recipe);
            }}>View</button>
          </li>
        ))}
      </ul>

      {/* <div>
        <input value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder="Recipe URL" />
        <button onClick={handleImport}>Import from URL</button>
      </div> */}
    </div >
  )
}

export default RecipeManager
