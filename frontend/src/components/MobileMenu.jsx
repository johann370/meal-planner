function MobileMenu({ setDisplayGroceryList, setDisplayRecipeManager, setDisplayWeek }) {
    function openPlanner() {
        setDisplayWeek(true);
        setDisplayRecipeManager(false);
        setDisplayGroceryList(false);
    }

    function openRecipes() {
        setDisplayWeek(false);
        setDisplayRecipeManager(true);
        setDisplayGroceryList(false);
    }

    function openGrocery() {
        setDisplayWeek(false);
        setDisplayRecipeManager(false);
        setDisplayGroceryList(true);
    }

    return (
        <div id="mobile-menu">
            <button onClick={openPlanner}>Planner</button>
            <button onClick={openRecipes}>Recipes</button>
            <button onClick={openGrocery}>Grocery List</button>
        </div>
    )
}

export default MobileMenu;