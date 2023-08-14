import "materialize-css/dist/css/materialize.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./layout/Navigation";

import { SongListPage } from "./pages/songs/SongListPage";
// import SongPage from "./pages/songs/SongPage";
// import SongFormPage from "./pages/songs/SongFormPage";
import { SongPage } from "./pages/songs/SongPage.js";

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
		<BrowserRouter>
			{/* USER_LOADING */}
			<UserLoadingScreen loading={loading} />

			{/* NAVIGATION */}
			<Routes>
				<Route path="/song">
					<Navigation inSong={true} />
				</Route>
				<Route>
					<Navigation inSong={false} />
				</Route>
			</Routes>

			<div className="container">
				<Routes>
					<Route path="/" element={<Navigate replace to="/songs" />} />
					<Route path="/songs" element={SongListPage} />
					<Route path="/song/:id" element={SongPage} />
					<Route
						path="/library"
						element={isLogged ? <Library /> : <Navigate replace to="/songs" />}
					/>
					{/* <Route path={["/add-song", "/edit-song/:id"]}>
						{isLogged ? <SongFormPage /> : <Redirect to="/songs" />}
					</Route> */}
					{/* <Route path="/suggestion" element={Suggestion} /> */}
					<Route path="/repertories" element={RepertoryListPage} />
					<Route path="/repertory/:id" element={RepertoryPage} />
					<Route path="/create-repertory" element={RepertoryFormPage} />
					<Route>
						<h3>Error 404 - No se encontro la página</h3>
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default App;
