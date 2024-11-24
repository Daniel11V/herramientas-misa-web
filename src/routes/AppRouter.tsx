import "materialize-css/dist/css/materialize.min.css";
import { BrowserRouter, Route, Navigate, Outlet } from "react-router-dom";

import { SongListPage } from "../pages/songs/SongListPage.js";
// import SongPage from "./pages/songs/SongPage";
// import SongFormPage from "./pages/songs/SongFormPage";
import { SongPage } from "../pages/songs/SongPage.js";

// import RepertoryPage from "./pages/repertories/RepertoryPage";
// import RepertoryListPage from "./pages/repertories/RepertoryListPage";
// import RepertoryFormPage from "./pages/repertories/RepertoryFormPage";

// import Library from "./pages/library/Library";

import UserLoadingScreen from "../layout/UserLoadingScreen.js";
import { useUser } from "../classes/user/useUser.js";
import { ReactNode } from "react";
import { PrivateRouter } from "./PrivateRouter.js";
import { RoutesWithNotFound } from "./RoutesWithNotFound.js";
// import Suggestion from './pages/suggestions/Suggestion';

const PrivateGuard = () => {
	const token = localStorage.getItem("token");

	return token ? <Outlet /> : <Navigate to="songs" replace />;
};

export const AppRouter = () => {
	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				// v7_relativeSplatPath: true,
			}}
		>
			<RoutesWithNotFound>
				<Route path="/" element={<Navigate to="/songs" />} />
				<Route path="/songs" element={<SongListPage />} />
				<Route path="/song/:id" element={<SongPage />} />

				<Route element={<PrivateGuard />}>
					<Route path="/private/*" element={<PrivateRouter />} />
				</Route>

				<Route
					path="/404"
					element={<h3>Error 404 - No se encontró la página</h3>}
				/>
				<Route path="*" element={<Navigate to="/404" />} />
			</RoutesWithNotFound>

			{/* NAVIGATION */}
			{/* <Routes>
				<Route path="/song">
					<Navigation />
					inSong={true}
				</Route>
				<Route>
					<Navigation />
					inSong={false}
				</Route>
			</Routes> */}

			{/* <div className="container">
				<Routes>
					<Route path="/" element={<Navigate replace to="/songs" />} />
					<Route path="/songs" element={<SongListPage />} />
					<Route path="/song/:id" element={<SongPage />} /> */}
			{/* <Route
						path="/library"
						element={isLogged ? <Library /> : <Navigate replace to="/songs" />}
					/> */}
			{/* <Route path={["/add-song", "/edit-song/:id"]}>
						{isLogged ? <SongFormPage /> : <Redirect to="/songs" />}
					</Route> */}
			{/* <Route path="/suggestion" element={Suggestion} /> */}
			{/* <Route path="/repertories" element={<RepertoryListPage />} />
					<Route path="/repertory/:id" element={<RepertoryPage />} /> */}
			{/* <Route path="/create-repertory" element={RepertoryFormPage} /> */}
			{/* <Route>
						<h3>Error 404 - No se encontro la página</h3>
					</Route>
				</Routes>
			</div> */}
		</BrowserRouter>
	);
};
