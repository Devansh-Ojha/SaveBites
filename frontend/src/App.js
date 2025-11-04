import hero from './hero.js';
import Navbar from './Navbar.js';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    //hero
   // about
  // some other page that is being created
    
    <div className="App">
      <Navbar />
      <hero />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
    </div>
  );
}

export default App;
