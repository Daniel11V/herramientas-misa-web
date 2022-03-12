import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useUser } from './layout/context/UserContext';
import Navigation from './layout/components/Navigation';
import Song from './songs/pages/Song';
import Songs from './songs/pages/Songs';
import SongForm from './songs/pages/SongForm';
import Repertories from './repertories/pages/Repertories';
import Suggestion from './suggestions/pages/Suggestion';

const App = () => {
  const [user] = useUser();

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
          <Route path="/repertories" component={Repertories} />
          <Route>
            <h3>Error 404 - No se encontro la página</h3>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;