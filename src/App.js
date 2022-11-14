import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from './layout/Navigation';
import Songs from './pages/songs/Songs';
import Song from './pages/songs/Song';
import MyLibrary from './pages/mylibrary/MyLibrary';
import SongForm from './pages/songs/SongForm';

import Repertories from './pages/repertories/Repertories';
import Repertory from './pages/repertories/Repertory';
// import Suggestion from './pages/suggestions/Suggestion';

const App = () => {
  const isLogged = useSelector((state) => state.user.isLogged);

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
          <Route path="/mylibrary" >
            {isLogged ? <MyLibrary /> : <Redirect to="/songs" />}
          </Route>
          <Route path={["/add-song", "/edit-song/:id"]} >
            {isLogged ? <SongForm /> : <Redirect to="/songs" />}
          </Route>
          {/* <Route path="/suggestion" component={Suggestion} /> */}
          <Route path="/repertories" component={Repertories} />
          <Route path="/repertory/:id" component={Repertory} />
          <Route>
            <h3>Error 404 - No se encontro la página</h3>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;