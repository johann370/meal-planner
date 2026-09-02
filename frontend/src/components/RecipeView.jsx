import { useState } from 'react';

function RecipeView({ recipe, setRecipe, onClose, recipeManagerRef, setRecipes, recipes }) {
  const [isEditing, setIsEditing] = useState(recipe.id === null);
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);

  function handleDeleteIngredient(e, index) {
    e.stopPropagation();
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function handleSave(event) {
    event.preventDefault();
    const recipeData = { title, ingredients, instructions };

    if (recipe.id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
        credentials: 'include'
      })
        .then(response => response.json())
        .then(updatedRecipe => {
          setRecipes(recipes.map(recipe => recipe.id === updatedRecipe.id ? updatedRecipe : recipe));
          setIsEditing(false);
        })
        .catch(err => console.error(err));
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
        credentials: 'include'
      })
        .then(response => response.json())
        .then(newRecipe => {
          setRecipes([...recipes, newRecipe]);
          setRecipe(newRecipe);
          setTitle(newRecipe.title);
          setIngredients(newRecipe.ingredients);
          setInstructions(newRecipe.instructions);
          setIsEditing(false);
        })
        .catch(err => console.error(err));
    }
  }

  function handleCancelEdit() {
    if (recipe.id) {
      setIsEditing(false);
      setTitle(recipe.title);
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
    } else {
      onClose();
    }
  }


  function handleDelete() {
    if (!recipe.id) {
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${recipe.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 204) {
          setRecipes(recipes.filter(r => r.id !== recipe.id));
          onClose();
        }
      })
      .catch(err => console.error(err));
  }


  return (
    <div className={isEditing ? "recipe-view recipe-view-edit" : "recipe-view recipe-view-read"} ref={recipeManagerRef}>
      <div id="recipe-view-header">
        <input id={"recipe-view-title"} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <span>
          {isEditing ? <button onClick={handleCancelEdit}>Cancel</button> : <button onClick={() => setIsEditing(true)}>Edit</button>}
          {isEditing && recipe.id && <button onClick={handleDelete}>Delete</button>}
          <button onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}>Close</button>
        </span>
      </div>
      <div>
        <h3>Ingredients</h3>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <input readOnly={!isEditing} value={ingredient.name} onChange={e => setIngredients(ingredients.map((ingredient, i) => i === index ? { ...ingredient, name: e.target.value } : ingredient))} placeholder="Ingredient Name"></input>
              <input readOnly={!isEditing} value={ingredient.quantity} onChange={e => setIngredients(ingredients.map((ingredient, i) => i === index ? { ...ingredient, quantity: e.target.value } : ingredient))} placeholder="Quantity"></input>
              <input readOnly={!isEditing} value={ingredient.unit} onChange={e => setIngredients(ingredients.map((ingredient, i) => i === index ? { ...ingredient, unit: e.target.value } : ingredient))} placeholder="Unit"></input>
              {isEditing && <button onClick={(e) => handleDeleteIngredient(e, index)}>Delete Ingredient</button>}
            </li>
          ))}
          {isEditing && <button onClick={() => setIngredients([...ingredients, { "name": "", "quantity": "", "unit": "" }])}>Add Ingredient</button>}
        </ul>
      </div>
      <div>
        <h3>Instructions</h3>
        <textarea readOnly={!isEditing} className="instructions-input" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Instructions"></textarea>
      </div>
      {isEditing && <button onClick={handleSave}>Save Recipe</button>}
    </div >
  );
}

export default RecipeView;
