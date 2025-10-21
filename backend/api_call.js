import pluralize from 'pluralize';
import { getDb } from './mongodb.js';

import express from 'express';
const app = express();
const port = 3003;

// Middleware to parse JSON request bodies
app.use(express.json());

/*//Middleware to get DB
app.use(async (req, res, next) => {
   try {
    req.db = await getDb(); // attach db to the request
    next(); // continue to next handler
   } catch(e) {
    next(e)
   } 
});
*/

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

/*// Dummy API call for getting a recipe from LLM (sends a string on get)
app.get('/dummyLLMReceipe', (req, res) => {
    recipe = "This is a fake recipe";
    res.send(recipe);
});
*/

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
app.post('/ingredients/:ingredient', (req, res) => {
    const newIngredient = pluralize.singular(req.params.ingredient.toLowerCase());
    const newIngredientQuantity = Number(req.body.quantity);
    
    // if ingredients already has the ingredient, update the quantity
    if (ingredients.has(newIngredient)) {
        const updatedQuantity = ingredients.get(newIngredient) + newIngredientQuantity;
        if (updatedQuantity > 0) {
            ingredients.set(newIngredient, updatedQuantity);
            res.status(201).json({newIngredient, updatedQuantity});
        }
        else {
            ingredients.delete(newIngredient); // delete ingredient if quantity is zero.
        }
        
    }
    else {
        // if a new ingredient, add the ingredient to ingredients
        if (newIngredientQuantity > 0) {
            ingredients.set(newIngredient, newIngredientQuantity);
            res.status(201).json({newIngredient, newIngredientQuantity});
        }
    }
});

/*// GET a recipe by making a call to /ingredients, then send the JSON to /dummyLLMReceipe to get back a recipe
app.get('/getRecipe', (req, res) => {
    ingredients_input = app.get('/ingredients');
    recipe = app.get('/dummyLLMReceipe', req=ingredients_input)
    res.send(recipe);
});
*/

// PATCH (update) an ingredient's quantity by name
app.patch('/ingredients/:ingredient', (req, res) => {
    const newIngredient = pluralize.singular(req.params.ingredient.toLowerCase());
    const newIngredientQuantity = Number(req.body.quantity);

    /*retrieve current quantity from ingredients or default to 0 and add the additional quantity for the 
    specific ingredient.*/
    const updatedQuantity = (ingredients.get(newIngredient) ?? 0) + newIngredientQuantity;
    if (updatedQuantity > 0) {
        ingredients.set(newIngredient, updatedQuantity);
    }
    else {
        ingredients.delete(newIngredient);
    }
    res.status(200).json({newIngredient, updatedQuantity})
});

// DELETE an ingredient by name
app.delete('/ingredients/:ingredient', (req, res) => {
    const ingredientToDel = pluralize.singular(req.params.ingredient.toLowerCase());
    const deleted = ingredients.delete(ingredientToDel);

    if (deleted) {
        res.status(200).json({
            message: 'Deleted ' + ingredientToDel
        });
    }
    else {
        res.status(404).json({
            message: 'Ingredient not found'
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});