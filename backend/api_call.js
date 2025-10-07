

const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Dummy ingredients database for testing
const ingredients = [
    {name: "tomato", quantity: 1},
    {name: "carrot", quantity: 5},
    {name: "chicken breast", quantity: 1},
    {name: "potato", quantity: 3},
    {name: "beef", quantity: 2}
];

// Routes
// GET all items
app.get('/ingredients', (req, res) => {
    res.json(items);
});

app.get('dummyLLM', (req, res) => {
    // res.
});

// GET a single item by NAME
app.get('/ingredients/:name', (req, res) => {
    const id = parseInt(req.params.id);
    const ingredient = ingredients.find(ingredient => ingredient.name === name);
    if (ingredient) {
        res.json(item);
    } else {
        res.status(404).send('Ingredient not found');
    }
});

// POST a new item
app.post('/items', (req, res) => {
    const newItem = req.body;
    newItem.id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem, id: id }; // Ensure ID remains consistent
        res.json(items[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length < initialLength) {
        res.status(204).send(); // No content to send back
    } else {
        res.status(404).send('Item not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function get_llm() {
    return -1    
}