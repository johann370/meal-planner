import { useState, Fragment } from 'react';

function RecipeManager({recipes, setRecipes}) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{"name": "", "quantity": "", "unit": ""}]);
  const [instructions, setInstructions] = useState('');
  const [editingId, setEditingId] = useState(null);

  function handleDelete(id) {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`, {
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
      fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${editingId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(recipeData),
      credentials: 'include'})
      .then(response => response.json())
      .then(updatedRecipe => {
        setRecipes(recipes.map(recipe => recipe.id === updatedRecipe.id ? updatedRecipe : recipe));
        setEditingId(null);
        setTitle('');
        setIngredients([{"name": "", "quantity": "", "unit": ""}]);
        setInstructions('');
      })
      .catch(err => console.error(err));
    } else{
      fetch(`${import.meta.env.VITE_API_URL}/api/recipes`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(recipeData),
      credentials: 'include'})
      .then(response => response.json())
      .then(newRecipe => {
        setRecipes([...recipes, newRecipe]);
        setTitle('');
        setIngredients([{"name": "", "quantity": "", "unit": ""}]);
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
            <ul>
              {recipe.ingredients.map(ingredient => (
                <li key={ingredient.id}>
                  {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                </li>
              ))}
            </ul>
            <button onClick={() => handleEditClick(recipe)}>Edit</button>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        {ingredients.map((ingredient, index) => 
        <Fragment key={index}>
          <input value={ingredient.name} onChange={e => setIngredients(ingredients.map((ingredient, i) => i === index ? {...ingredient, name: e.target.value} : ingredient))} placeholder="Ingredient Name"></input>
          <input value={ingredient.quantity} onChange={e => setIngredients(ingredients.map((ingredient, i) => i === index ? {...ingredient, quantity: e.target.value} : ingredient))} placeholder="Quantity"></input>
          <input value={ingredient.unit} onChange={e => setIngredients(ingredients.map((ingredient, i) => i === index ? {...ingredient, unit: e.target.value} : ingredient))} placeholder="Unit"></input>
          <button type="button" onClick={() => setIngredients(ingredients.filter((ingredient, i) => i !== index))}>Delete Ingredient</button>
        </Fragment>
        )}
        <button type="button" onClick={() => setIngredients([...ingredients, {"name": "", "quantity": "", "unit": ""}])}>Add Ingredient</button>
        <input value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Instructions" />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  )
}

export default RecipeManager
