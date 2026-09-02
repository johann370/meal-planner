import { useState } from 'react';
import RecipeView from './RecipeView.jsx';

function RecipeManager({ recipes, setRecipes, selectedDay, handleAssign, onClose, recipeManagerRef }) {
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

  if (viewingRecipe) {
    return <RecipeView recipe={viewingRecipe} setRecipe={setViewingRecipe} onClose={() => setViewingRecipe(null)} recipeManagerRef={recipeManagerRef} setRecipes={setRecipes} recipes={recipes} />;
  }

  return (
    <div className="recipe-manager" ref={recipeManagerRef}>
      <h2>Manage Recipes</h2>
      <button onClick={onClose}>Close</button>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id} className="recipe" onClick={() => handleAssign(selectedDay, recipe.id)} style={{ cursor: 'pointer' }}>
            <span>{recipe.title}</span>
            <button onClick={(e) => {
              e.stopPropagation();
              setViewingRecipe(recipe);
            }}>View</button>
          </li>
        ))}
      </ul>

      <div>
        <input value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder="Recipe URL" />
        <button onClick={handleImport}>Import from URL</button>
      </div>

      <button onClick={(e) => {
        e.stopPropagation();
        setViewingRecipe({ id: null, title: '', ingredients: [{ name: '', quantity: '', unit: '' }], instructions: '' })
      }}>New Recipe</button>
    </div >
  )
}

export default RecipeManager
