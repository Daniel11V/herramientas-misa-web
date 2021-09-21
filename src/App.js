import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";
import axios from './axios';
import { useSongs } from './songs-context';
import Navigation from './components/Navigation.jsx';
import SongList from './components/SongList.jsx';
import SongForm from './components/SongForm.jsx';
import Suggestion from './components/Suggestion.jsx';
import Song from './components/Song.jsx';
import LoginLogout from './components/LoginLogout.jsx';

const App = () => {
  const { setSongs, setIsLoading, needReload, setNeedReload, user, setUser } = useSongs();
  const history = useHistory();

  useEffect(() => {
    const fetchSongs = async (id) => {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/songs');
        //console.log(res.data);
        setSongs(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error de conexión: ', error);
      }
    }
    fetchSongs();
    setNeedReload(false);
  }, [setSongs, setIsLoading, needReload, setNeedReload])

  const loginAddSong = (v) => {
    setUser(v);
    history.push({
      pathname: '/add-song', state: { from: 'Cancionero' }
    });
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
            <div className="header">
              <h3 className="cancionero">Cancionero</h3>
              {user ? (
                <Link
                  to={{ pathname: '/add-song', state: { from: 'Cancionero' } }}
                  className="btn waves-effect waves-light blue darken-2 right">
                  <i className="material-icons right">add</i>Añadir
                </Link>
              ) : (
                <LoginLogout update={(v) => loginAddSong(v)}>
                  <div
                    className="btn waves-effect waves-light blue darken-2 right">
                    <i className="material-icons right">add</i>Añadir
                  </div>
                </LoginLogout>
              )

              }
            </div>
            <SongList searcher={true} />
          </Route>
          <Route path="/add-song" >
            <SongForm />
          </Route>
          <Route path="/edit-song/:id" >
            <SongForm />
          </Route>
          <Route path="/suggestion" >
            <Suggestion />
          </Route>
          <Route path="/song/:id" >
            <Song />
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