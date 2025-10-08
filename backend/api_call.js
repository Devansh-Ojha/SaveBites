

const express = require('express');
const app = express();
const port = 3000;

//init pluralize variable for node.js to handle plural cases
var pluralize = require('pluralize')


// Middleware to parse JSON request bodies
app.use(express.json());

// Dummy ingredients database for testing
const ingredients = [
    {ingredient: "tomato", quantity: 1},
    {ingredient: "carrot", quantity: 5},
    {ingredient: "chicken breast", quantity: 1},
    {ingredient: "potato", quantity: 3},
    {ingredient: "beef", quantity: 2}
];

// Routes
// GET all items
app.get('/ingredients', (req, res) => {
    res.json(items);
});

// Dummy API for getting a recipe from LLM
app.get('dummyLLM', (req, res) => {
    recipe = "";
    res.send(recipe);
});

// GET a single item by ingredient
app.get('/ingredients/:ingredient', (req, res) => {
    const ingredientName = req.params.ingredient;
    const ingredientToAdd = ingredients.find(i => pluralize.singular(ingredient.toLowerCase()) === pluralize.singular(ingredientName.toLowerCase()));
    if (ingredientToAdd) {
        const quantity = ingredientToAdd.quantity
        res.json({ingredientName, quantity});
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