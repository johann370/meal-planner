import { useState, useEffect } from 'react'

function RecipeManager() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => setRecipes(data));
  }, [])

  function handleDelete(id) {
    fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 204) {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      }
    })
  }

  function handleEditClick(recipe) {
    setEditingId(recipe.id);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const recipeData = {title, ingredients, instructions};

    if(editingId) {
      fetch(`http://localhost:3000/api/recipes/${editingId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(recipeData),
      credentials: 'include'})
      .then(response => response.json())
      .then(updatedRecipe => {
        setRecipes(recipes.map(recipe => recipe.id === updatedRecipe.id ? updatedRecipe : recipe));
        setEditingId(null);
        setTitle('');
        setIngredients('');
        setInstructions('');
      })
      .catch(err => console.error(err));
    } else{
      fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(recipeData),
      credentials: 'include'})
      .then(response => response.json())
      .then(newRecipe => {
        setRecipes([...recipes, newRecipe]);
        setTitle('');
        setIngredients('');
        setInstructions('');
      })
      .catch(err => console.error(err));
    }
  }

  return (
    <div className="recipe-manager">
      <h2>Manage Recipes</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id} className="recipe">
            {recipe.title}
            <button onClick={() => handleEditClick(recipe)}>Edit</button>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="Ingredients" />
        <input value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Instructions" />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  )
}

export default RecipeManager
