import { getDb } from "./mongodb.js";
import { ObjectId } from "mongodb";

const express = require('express');
const app = express();
const port = 3000;

//Initialize pluralize variable for node.js to handle plural cases
var pluralize = require('pluralize')


// Middleware to parse JSON request bodies
app.use(express.json());

//Middleware to get DB
app.use(async (req, res, next) => {
   try {
    req.db = await getDb(); // attach db to the request
    next(); // continue to next handler
   } catch(e) {
    next(e)
   } 
});

// Dummy ingredients database for testing
const ingredients = new Map([
    ["tomato", 1],
    ["carrot", 5],
    ["chicken breast", 1],
    ["potato", 3],
    ["beef", 2]
]);

// Routes
// GET all ingredients
app.get('/ingredients', (req, res) => {
    res.json(Object.fromEntries(ingredients));
});

// Dummy API call for getting a recipe from LLM (sends a string on get)
app.get('/dummyLLMReceipe', (req, res) => {
    recipe = "This is a fake recipe";
    res.send(recipe);
});

// GET a single item by ingredient
app.get('/ingredients/:ingredient', async (req, res) => {
    const ingredientName = pluralize.singular(req.params.ingredient.toLowerCase());
    const ingredientQuantity = ingredients.get(ingredientName);
    // const doc = await req.db.collection("ingredients").findOne({ name: ingredientName });
    
    if (ingredientQuantity != undefined) {
        res.json({ingredientName, ingredientQuantity});
    } else {
        res.status(404).send('Ingredient not found');
    }
});

// POST a new ingredient
app.post('/ingredients', (req, res) => {
    const newIngredient = pluralize.singular(req.body.ingredient.toLowerCase());
    const newIngredientQuantity = Number(req.body.quantity);
    
    if (ingredients.has(newIngredient)) {
        return res.status(400).json({ error: 'Ingredient already exists' });
    }

    ingredients.set(newIngredient, newIngredientQuantity);
    res.status(201).json(newIngredient, newIngredientQuantity);
});

// GET a recipe by making a call to /ingredients, then send the JSON to /dummyLLMReceipe to get back a recipe
app.get('/getRecipe', (req, res) => {
    ingredients_input = app.get('/ingredients');
    recipe = app.get('/dummyLLMReceipe', req=ingredients_input)
    res.send(recipe);
});

// PUT (update) an ingredient by name
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

// DELETE an ingredient by name
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