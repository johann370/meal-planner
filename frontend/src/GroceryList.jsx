import { useState, useEffect } from 'react';

function GroceryList() {
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/grocery-list`, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => setGroceryList(data));
  }, []);

  return (
    <div className="grocery-list">
      <h2>Grocery List</h2>
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
