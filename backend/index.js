const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/api/week', (req, res) => {
    const monday = {
        day: 'Monday',
        meal: 'Ice Cream'
    };
    const tuesday = {
        day: 'Tuesday',
        meal: 'Spaghetti Bolognese'
    };
    const wednesday = {
        day: 'Wednesday',
        meal: 'Vegetable Stir Fry'
    };
    const thursday = {
        day: 'Thursday',
        meal: 'Beef Tacos'
    };
    const friday = {
        day: 'Friday',
        meal: 'Salmon with Quinoa'
    };
    const saturday = {
        day: 'Saturday',
        meal: 'Chicken Curry'
    };
    const sunday = {
        day: 'Sunday',
        meal: 'Roast Beef with Vegetables'
    };

    const week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];

    res.json(week);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});