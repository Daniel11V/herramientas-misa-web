import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from './axios';
import { useSongs } from './songs-context';
import Navigation from './pages/Navigation.jsx';
import SongForm from './pages/SongForm.jsx';
import Suggestion from './pages/Suggestion.jsx';
import Song from './pages/Song.jsx';
import Songs from './pages/Songs';
import Coros from './pages/Coros';

const App = () => {
  const { setSongs, setIsLoading, needReload, setNeedReload, user } = useSongs();

  useEffect(() => {
    const fetchSongs = async (repeat = 1) => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/songs');
        //console.log(res.data);
        setSongs(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`${repeat}º Error de conexión: `, error);
        if (repeat >= 3) {
          console.log('Fin de la conexión.');
          setIsLoading(false);
        } else {
          fetchSongs(repeat + 1);
        }
      }
    }
    fetchSongs();
    setNeedReload(false);
  }, [setSongs, setIsLoading, needReload, setNeedReload])

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
          <Route path="/songs" component={Songs} />
          <Route path="/song/:id" component={Song} />
          <Route path={["/add-song", "/edit-song/:id"]} >
            {user.name ? <SongForm /> : <Redirect to="/songs" />}
          </Route>
          <Route path="/suggestion" component={Suggestion} />
          <Route path="/coros" component={Coros} />
          <Route>
            <h3>Error 404 - No se encontro la página</h3>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;