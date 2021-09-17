import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import axios from './axios';
import Navigation from './components/Navigation.jsx';
import ListSongs from './components/ListSongs.jsx';
import SongForm from './components/SongForm.jsx';
import Suggestion from './components/Suggestion.jsx';
import Song from './components/Song.jsx';

const App = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, [])

  const fetchSongs = async () => {
    const res = await axios.get('/api/songs');
    //console.log(res.data);
    if (res.data) { setSongs(res.data); }
  }

  return (
    <Router>
      {/* NAVIGATION */}
      <Switch>
        <Route path="/song" >
          <Navigation inSong={true} />
        </Route>
        <Route path="/" >
          <Navigation inSong={false} />
        </Route>
      </Switch>

      <div className="container">
        <Switch>
          <Redirect from="/" exact to="/songs" />
          <Route path="/songs" >
            <Link
              to={{ pathname: '/add-song', state: { from: 'Cancionero' } }}
              className="btn btn-songs waves-effect waves-light light-blue darken-3 right">
              <i className="material-icons right">add</i>Añadir
            </Link>
            <h3>Cancionero</h3>
            <ListSongs songs={songs} />
          </Route>
          <Route path="/add-song" >
            <SongForm />
          </Route>
          <Route path="/edit-song/:id" >
            <SongForm songs={songs} />
          </Route>
          <Route path="/suggestion" >
            <Suggestion />
          </Route>
          <Route path="/song/:id" >
            <Song songs={songs} />
          </Route>
          <Route>
            <h3>Error 404 - No se encontro la página</h3>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;