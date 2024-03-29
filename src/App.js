import React from "react";
import "materialize-css/dist/css/materialize.min.css";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import Navigation from "./layout/Navigation";

import SongListPage from "./pages/songs/SongListPage";
import SongPage from "./pages/songs/SongPage";
import SongFormPage from "./pages/songs/SongFormPage";

import RepertoryPage from "./pages/repertories/RepertoryPage";
import RepertoryListPage from "./pages/repertories/RepertoryListPage";
import RepertoryFormPage from "./pages/repertories/RepertoryFormPage";

import Library from "./pages/library/Library";

import UserLoadingScreen from "./layout/UserLoadingScreen.jsx";
import { useUser } from "./clases/user/useUser";
// import Suggestion from './pages/suggestions/Suggestion';

const App = () => {
	const { loading, isLogged } = useUser();

	return (
		<Router>
			{/* USER_LOADING */}
			<UserLoadingScreen loading={loading} />

			{/* NAVIGATION */}
			<Switch>
				<Route path="/song">
					<Navigation inSong={true} />
				</Route>
				<Route>
					<Navigation inSong={false} />
				</Route>
			</Switch>

			<div className="container">
				<Switch>
					<Redirect from="/" exact to="/songs" />
					<Route path="/songs" component={SongListPage} />
					<Route path="/song/:id" component={SongPage} />
					<Route path="/library">
						{isLogged ? <Library /> : <Redirect to="/songs" />}
					</Route>
					<Route path={["/add-song", "/edit-song/:id"]}>
						{isLogged ? <SongFormPage /> : <Redirect to="/songs" />}
					</Route>
					{/* <Route path="/suggestion" component={Suggestion} /> */}
					<Route path="/repertories" component={RepertoryListPage} />
					<Route path="/repertory/:id" component={RepertoryPage} />
					<Route path="/create-repertory" component={RepertoryFormPage} />
					<Route>
						<h3>Error 404 - No se encontro la página</h3>
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

export default App;
