import Hero from './Hero.js';
import Navbar from './Navbar.js';
import Signup from './Signup.js';
import logo from './logo.svg';
import './App.css';
import Login from './Login.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    //hero
   // about
  // some other page that is being created
    <Router>
      <div className="App">
      
        <Navbar />
        <Hero />
        <header className="App-header">
          <p>
          </p>
        </header>
        
      </div>
      <Routes>
        <Route path="/" element={<Hero />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
