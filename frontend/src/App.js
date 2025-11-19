import Hero from './hero.js';
import Navbar from './Navbar.js';
import Signup from './Signup.js';
import './App.css';
import Login from './Login.js';
import UserProfile from './UserProfile.js';
import Generate from './Generate.js';
import Recipes from './Recipes.js';
import Preferences from './Preferences.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [cuisines, setCuisines] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const budgetState = useState(0);
  const difficultyState = useState("Beginner");
  const timeState = useState(0);

  return (
    //hero
   // about
  // some other page that is being created
    <Router>
      <div className="App">
      
        <Navbar />
        {/*<Hero />
        <header className="App-header">
          <p>
          </p>
        </header>*/}
        
      </div>
      <Routes>
        <Route path="/" element={<Hero />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/profile" element={<UserProfile name={"Tester"}/>}></Route>
        <Route path="/generate" element={<Generate time={timeState[0] }difficulty={difficultyState[0]} budget={budgetState[0]} allergens={allergens} appliances={appliances} cuisines={cuisines}/>}></Route>
        <Route path="/recipes" element={<Recipes />}></Route>
        <Route path="/preferences" element={<Preferences timeState={timeState} difficultyState={difficultyState} budgetState={budgetState} setAllergens={setAllergens} setCuisines={setCuisines} setAppliances={setAppliances}/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
