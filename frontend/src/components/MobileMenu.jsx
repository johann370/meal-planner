function MobileMenu({ setDisplayGroceryList, setDisplayRecipeManager, setDisplayWeek, unselectDay }) {
    function openPlanner() {
        setDisplayWeek(true);
        setDisplayRecipeManager(false);
        setDisplayGroceryList(false);
        unselectDay();
    }

    function openRecipes() {
        setDisplayWeek(false);
        setDisplayRecipeManager(true);
        setDisplayGroceryList(false);
        unselectDay();
    }

    function openGrocery() {
        setDisplayWeek(false);
        setDisplayRecipeManager(false);
        setDisplayGroceryList(true);
        unselectDay();
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