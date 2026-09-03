import { useState, useEffect } from 'react';

function GroceryList({ isDisplayed, week, onClose }) {
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/grocery-list`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setGroceryList(data));
  }, [week]);

  return (
    <div className={isDisplayed ? "grocery-list" : "grocery-list hidden-mobile"}>
      <h2>Grocery List</h2>
      <button className="mobile-close-button" onClick={onClose}>Close</button>
      <ul>
        {groceryList.map(item => (
          <li key={`${item.name} ${item.unit}`}>
            {`${item.quantity} ${item.unit} ${item.name}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroceryList;
