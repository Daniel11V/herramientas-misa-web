import React, { useEffect } from 'react';
import M from 'materialize-css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import ListSongs from './components/ListSongs.jsx';
import AddSong from './components/AddSong.jsx';
import Suggestion from './components/Suggestion.jsx';
import Song from './components/Song.jsx';

const App = () => {
  useEffect(() => {
    let elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  }, [])

  return (
    <Router>
      {/* NAVIGATION */}
      <nav className="light-blue darken-4" style={{ marginBottom: '20px' }}>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo hide-on-med-and-down" style={{ paddingLeft: '20px' }}>Herramientas para Misa</Link>
          <div data-target="mobile-demo" className="sidenav-trigger hide-on-large-only" style={{ cursor: 'pointer' }}><i className="material-icons">menu</i></div>
          <ul className="right hide-on-med-and-down">
            <li><Link to="/songs">Cancionero</Link></li>
            <li><Link to="/add-song">Añadir Canción</Link></li>
            <li><Link to="/suggestion">Recomendación</Link></li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav sidenav-close" id="mobile-demo">
        <li>
          <div className="user-view">
            <div className="background">
              <img src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg" alt="background" />
            </div>
            <Link to="/profile"><img className="circle" src="https://pbs.twimg.com/profile_images/1395495484463239171/SL1JdI2__400x400.jpg" alt="profile" /></Link>
            <Link to="/profile"><span className="white-text name">Daniel Vinet</span></Link>
            <Link to="/profile"><span className="white-text email">daniel1vinet@gmail.com</span></Link>
          </div>
        </li>
        <li><i><a href="/" className="subheader" style={{ paddingLeft: '20px' }}>Herramientas para misa</a></i></li>
        <li><Link to="/songs" >Cancionero</Link></li>
        <li><Link to="/add-song" >Añadir Canción</Link></li>
        <li><Link to="/suggestion" >Recomendación para misa</Link></li>
      </ul>

      <div className="container">
        <Switch>
          <Redirect from="/" exact to="/songs" />
          <Route path="/songs" >
            <div className="row">
              <h3>Cancionero</h3>
              <ListSongs />
            </div>
          </Route>
          <Route path="/add-song" >
            <AddSong />
          </Route>
          <Route path="/suggestion" >
            <Suggestion />
          </Route>
          <Route path="/song/:id" >
            <Song />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;