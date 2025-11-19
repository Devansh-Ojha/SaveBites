import pluralize from 'pluralize';
// import { getDb } from './mongodb.js';
import 'dotenv/config';

import express from 'express';
const app = express();
const port = 3008;
import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI



// Middleware to parse JSON request bodies
app.use(express.json());

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Successful connection to MongoDB")
    } catch (error) {
        console.log(error);
    }
}

class UserProfileClass {
    // Model static
    static findByUsername(username) {
      return this.findOne({ username });
    }
  
    // Instance helpers (operate on schema's camelCase fields)
    fullSummary() {
      return `${this.username} • budget=${this.budget ?? 0} • time=${this.timeAvailable ?? 0}m`;
    }
  
    addRestriction(r) {
      const x = String(r);
      this.dietaryRestrictions ??= [];
      if (!this.dietaryRestrictions.includes(x)) this.dietaryRestrictions.push(x);
      return this;
    }
    removeRestriction(r) {
      const x = String(r);
      this.dietaryRestrictions = (this.dietaryRestrictions ?? []).filter(s => s !== x);
      return this;
    }
  
    addPreference(p) {
      const x = String(p);
      this.cuisinePreferences ??= [];
      if (!this.cuisinePreferences.includes(x)) this.cuisinePreferences.push(x);
      return this;
    }
    removePreference(p) {
      const x = String(p);
      this.cuisinePreferences = (this.cuisinePreferences ?? []).filter(s => s !== x);
      return this;
    }
  
    setBudget(amount) {
      this.budget = Number(amount);
      return this;
    }
    setTime(minutes) {
      this.timeAvailable = parseInt(minutes, 10) || 0;
      return this;
    }
  
    addAppliance(a) {
      const x = String(a);
      this.appliances ??= [];
      if (!this.appliances.includes(x)) this.appliances.push(x);
      return this;
    }
    removeAppliance(a) {
      const x = String(a);
      this.appliances = (this.appliances ?? []).filter(s => s !== x);
      return this;
    }
  
    rateRecipe(recipe, rating) {
      this.recipeRatings ??= new Map(); // Mongoose Map works with set/get
      this.recipeRatings.set(String(recipe), Number(rating));
      return this;
    }
  }

connect();

// Define your schema (e.g., for a 'Product' model)
const userProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    dietaryRestrictions: [String],
    cuisinePreferences: [String],
    budget: Number,
    timeAvailable: Number,
    appliances: [String],
    recipeRatings: { type: Map, of: Number },
    ingredients:   { type: Map, of: Number },
  }, {
    timestamps: true,
    collection: 'User Profile'
  });
  
  // 3) Attach the class
  userProfileSchema.loadClass(UserProfileClass);
  
  // 4) Model (clean name; schema controls collection)
  const UserProfile = mongoose.models.UserProfile
    || mongoose.model('UserProfile', userProfileSchema);

app.get('/users', async (req, res) => {
    try {
        const users = await UserProfile.find({}).lean();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get('/users/:username', async (req, res) => {
    try {
        const { username } = req.params
        const user = await UserProfile.findByUsername(req.params.username);
        if (!user) return res.status(404).json({ error: "Could not find user" });

        return res.status(200).json(user);
    } catch(error){
        console.log(error)
        return res.status(500).json({error: "Failed to fetch user"});
    }
});

// CREATE user
app.post('/users', async (req, res) => {
    try {
      const {
        username,
        dietaryRestrictions,
        cuisinePreferences,
        budget,
        timeAvailable,
        appliances,
        recipeRatings,
        ingredients,
      } = req.body;
  
      if (!username) {
        return res.status(400).json({ error: "username is required" });
      }
  
      const newUser = await UserProfile.create({
        username,
        dietaryRestrictions,
        cuisinePreferences,
        budget,
        timeAvailable,
        appliances,
        recipeRatings,
        ingredients,
      });
  
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      if (error?.code === 11000) {
        return res.status(409).json({ error: "Username already exists" });
      }
      return res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.delete('/users/:username', async (req, res) => {
    try {
        const { username } = req.params
        const doc = await UserProfile.findOneAndDelete({ username }).lean();
        if(!doc) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(204).send()
    } catch(error){
        console.error(error)
        return res.status(500).json({ error: "Failed to delete user" });
    }
  });
  app.patch('/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ error: "username is required" });
        }
        
        const allowed = ['dietaryRestrictions','cuisinePreferences','budget','timeAvailable','appliances','recipeRatings','ingredients'];
        const update = {};
        const unupdate = {};
        for (const k of allowed) {
            const hasKey = Object.prototype.hasOwnProperty.call(req.body, k);
            if (!hasKey) continue;
      
            const val = req.body[k];
      
            if (val === null) {
              unupdate[k] = "";
            } else if (val !== undefined) {
              update[k] = val;
            }
        }
        
        const updateOps = {};
        if (Object.keys(update).length) updateOps.$set = update;
        if (Object.keys(unupdate).length) updateOps.$unset = unupdate;

        const user = await UserProfile.findOneAndUpdate({ username }, updateOps, { new: true, runValidators: true }).lean();
        return res.status(200).json(user);
    } catch(error){
        console.error(error)
        return res.status(500).json({ error: "Failed to patch user" });
    }
  });


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
// PARAM: username
// GET all ingredients of the user
app.get('/user-ingredients/:user', async (req, res) => {
    try {
        const { user : username } = req.params
        const user = await UserProfile.findByUsername(username);
        if (!user) return res.status(404).json({ error: "Could not find user" });
        return res.status(200).json(user.ingredients);
    } catch(error){
        console.log(error)
        return res.status(500).json({error: "Failed to fetch user"});
    }
});

// GET a single item by ingredient
app.get('/user-ingredients/:ingredient', async (req, res) => {
  try {
    const { user : username, ingredient } = req.params;

  // look up user in MongoDB
    const user = await UserProfile.findByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "Could not find user" });
    }

    const ingredientName = pluralize.singular(ingredient.toLowerCase());
    const ingredients = user.ingredients || {};
    const ingredientQuantity = ingredients[ingredient];

  // if ingredient not found, error 404
  if (ingredientQuantity != undefined) {
    return res.status(200).json({
      ingredientName,
      ingredientQuantity,
    });
  } else {
    return res.status(404).json({ error: 'Ingredient not found' });
  }
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch ingredient' });
  }
});

    // const ingredientName = pluralize.singular(req.params.ingredient.toLowerCase());
    // const ingredientQuantity = ingredients.get(ingredientName);
    // // const doc = await req.db.collection("ingredients").findOne({ name: ingredientName });
    
    // if (ingredientQuantity != undefined) {
    //     res.json({ingredientName, ingredientQuantity});
    // } else {
    //     res.status(404).send('Ingredient not found');
    // }

// PARAM: username
// BODY: key value pair ingredient - quantity
// PATCH a new ingredient
app.patch('/user-ingredients/:user', async (req, res) => {
    
    try {
        const { user : username } = req.params
        const user = await UserProfile.findByUsername(username);
        if (!user) return res.status(404).json({ error: "Could not find user" });
        return res.status(200).json(user.ingredients);
    } catch(error){
        console.log(error)
        return res.status(500).json({error: "Failed to fetch user"});
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
app.delete('/user-ingredients/:user', async (req, res) => {
    const ingredientToDel = pluralize.singular(req.params.ingredient.toLowerCase());

    if (!req.user || !req.user._id) {
      return res.status(404).json({message: 'Could not find user'})
    }

    unupdate = ['dietaryRestrictions','cuisinePreferences','budget','timeAvailable','appliances','recipeRatings'];
    const updatedUser = await UserProfile.findOneAndUpdate(req.params.username);
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