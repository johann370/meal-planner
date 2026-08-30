function RecipeView({ recipe, onClose }) {
  return (
    <div className="recipe-view">
      <h2>{recipe.title}</h2>
      <ul>
        {recipe.ingredients.map(ingredient => (
          <li key={ingredient.id}>
            {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
          </li>
        ))}
      </ul>
      <p className="instructions">{recipe.instructions}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default RecipeView;
