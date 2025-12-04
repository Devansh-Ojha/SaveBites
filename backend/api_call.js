import pluralize from 'pluralize';
// import { getDb } from './mongodb.js';
import 'dotenv/config';

import express from 'express';
const app = express();
const port = 3001;
//import mongoose from 'mongoose';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
//const uri = process.env.MONGODB_URI
import cors from 'cors'

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());



// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Keeps the original extension (e.g. .png, .jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
});
const upload = multer({ storage: storage });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Successful connection to MongoDB")
    } catch (error) {
        console.log(error);
    }
}*/

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

//connect();

// Define your schema (e.g., for a 'Product' model)
/*const userProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    password: [String], 
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
*/
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
        if (mongoAvailable) {
          try {
              user = await UserProfile.findByUsername(username);
          } catch (err) {
              console.warn("Mongo fetch failed, proceeding without it.");
          }
        }

        // If no user from DB, provide a dummy user
        if (!user) {
            user = {
                username: username || "test_user",
                ingredients: new Map([["tomato", 2], ["cheese", 1], ["flour", 3]]),
                budget: 10,
                timeAvailable: 60,
                appliances: ["Oven", "Stove"],
                cuisinePreferences: ["Italian"]
            };
        }

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
        password, 
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
        password, 
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
app.get('/user-ingredients/:user/:ingredient', async (req, res) => {
  try {
    const { user : username, ingredient } = req.params
    const user = await UserProfile.findByUsername(username);
    if (!user) return res.status(404).json({ error: "Could not find user" });
    const ingredientKey = pluralize.singular(ingredient.toLowerCase());
    const ingredientQuantity = user.ingredients?.get(ingredientKey);
    if (ingredientQuantity == undefined) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    const newJson = { [ingredientKey]: ingredientQuantity };
    return res.status(200).json(newJson);

    
} catch(error){
    console.log(error)
    return res.status(500).json({error: "Failed to fetch user"});
}
});


// PARAM: username
// BODY: JSON of lists of ingredient-quantity pairs
// PATCH add all ingredients/quantities to ingredients of users
app.patch('/user-ingredients/:user', async (req, res) => {   
    try {
        const { user : username } = req.params
        const user = await UserProfile.findByUsername(username);
        if (!user) return res.status(404).json({ error: "Could not find user" });
        const entries = Object.entries(req.body);
        // Iterate over the [key, value] pairs
        for (const [key, value] of entries) {
          // Checks if user already has ingredient
          // True: Adds new quantity to  old quantity, remove if quantity goes to zero
          // False: Adds new key-value to user ingredients map
          if (user.ingredients.has(key)) {
            const oldQuantity = user.ingredients.get(key);
            if (oldQuantity + value == 0) {
              user.ingredients.delete(key);
              console.log(`Removed ${key}`);
            } else {
              user.ingredients.set(key, oldQuantity + value);
              console.log(`Added ${value} ${key}`);
            }
          } else {
            user.ingredients.set(key, value);
            console.log(`Added ${value} ${key}`);
          }
        }
        // Save changes to DB
        await user.save();
        return res.status(200).json(user.ingredients);
    } catch(error){
        console.log(error)
        return res.status(500).json({error: "Error adding new ingredient"});
    }
});

// OCR endpoint to process receipts
app.post('/ocr', upload.single('file'), async (req, res) => {
    try {
        console.log("request file:", req.file)
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const absoluteFilePath = path.resolve(__dirname, filePath);
        const scriptPath = path.resolve(__dirname, "ImageCleaning.py");
        console.log("file path:", filePath);
        console.log("absolute file path:", absoluteFilePath);
        console.log("script path:", scriptPath);

        // Call the Python OCR script
        const pythonPath = path.resolve(__dirname, 'venv/bin/python');
        const python = spawn(pythonPath, [scriptPath, JSON.stringify(user)]);

        
        let output = '';
        let error = '';
        

        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        python.on('close', (code) => {
            // Clean up uploaded file
            fs.unlink(absoluteFilePath, (err) => {
                if (err && err.code !== 'ENOENT') console.error("Error deleting file:", err);
            });

            if (code !== 0) {
                console.error("Python script error:", error);
                return res.status(500).json({ 
                    error: "OCR processing failed",
                    details: error 
                });
            }

            try {
                console.log("output:", output)
                const result = JSON.parse(output);
                return res.status(200).json(result);
            } catch (parseError) {
                console.error("Error parsing Python output:", output);
                return res.status(500).json({ 
                    error: "Failed to parse OCR results",
                    output: output 
                });
            }
        });
    } catch (error) {
        console.error("OCR endpoint error:", error);
        return res.status(500).json({ error: "OCR processing failed" });
    }
});

app.post('/generate_recipes', async (req, res) => {
    try {
        const { username } = req.body;

        // Use a dummy user object (no MongoDB)
        const user = {
            user_id: username || "test_user",
            dietary_restrictions: [],
            cuisine_preferences: ["Italian"],
            budget_usd: 10,
            time_available: 60,
            appliances: ["Oven", "Stove"],
            ingredients: { tomato: 2, cheese: 1, flour: 3 }
        };

        const scriptPath = path.resolve(__dirname, '../llm_pipeline/llm_recipe_generator.py');

        // Use Python from your venv
        const pythonPath = path.resolve(__dirname, '../venv/bin/python');

        // Spawn Python
        const python = spawn(pythonPath, [scriptPath, JSON.stringify(user)], {
            cwd: path.resolve(__dirname, '..') // Project root so data_classes is visible
        });

        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => output += data.toString());
        python.stderr.on('data', (data) => errorOutput += data.toString());

        python.on('close', (code) => {
            if (code !== 0) {
                console.error("Python error:", errorOutput);
                return res.status(500).json({ error: "Recipe generation failed", details: errorOutput });
            }

            try {
                // Split by semicolon for multiple JSON objects
                const rawObjects = output.split(';');
                const recipes = rawObjects
                    .filter(obj => obj.trim())
                    .map(obj => JSON.parse(obj));

                return res.status(200).json({ recipes });
            } catch (parseError) {
                console.error("JSON parse error:", parseError, "Output:", output);
                return res.status(500).json({ error: "Failed to parse recipes", output });
            }
        });

    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});




// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});