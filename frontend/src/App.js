import Hero from './hero.js';
import Navbar from './Navbar.js';
import Signup from './Signup.js';
import './App.css';
import Login from './Login.js';
import UserProfile from './UserProfile.js';
import Generate from './Generate.js';
import Recipes from './Recipes.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
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
        <Route path="/generate" element={<Generate />}></Route>
        <Route path="/recipes" element={<Recipes />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
