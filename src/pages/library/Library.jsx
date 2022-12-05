import React, { Fragment } from "react";
import SongCollection from "../components/SongCollection";
import { useLibraryPage } from "./hooks/useLibraryPage";
// import { Link } from "react-router-dom";
// import LoginLogout from "../../layout/components/LoginLogout";
// import { useHistory } from "react-router";

const Library = () => {
	// const history = useHistory();
	const [songList, loadingSongList, errorSongList] = useLibraryPage();

	// const loginAddSong = (v) => {
	// 	setUser(v);
	// 	history.push({
	// 		pathname: "/add-song",
	// 		state: { from: "Mi Biblioteca" },
	// 	});
	// };

	return (
		<Fragment>
			<div className="header">
				<h3 className="cancionero">Mi Biblioteca</h3>
				{/* {user.name ? (
					<Link
						to={{ pathname: "/add-song", state: { from: "Mi Biblioteca" } }}
						className="btn waves-effect waves-light blue darken-2 right"
					>
						<i className="material-icons right">add</i>Añadir
					</Link>
				) : (
					<LoginLogout update={(v) => loginAddSong(v)}>
						<div className="btn waves-effect waves-light blue darken-2 right">
							<i className="material-icons right">add</i>Añadir
						</div>
					</LoginLogout>
				)} */}
			</div>
			{/* <RepertoryList
				repertoryList={repertoryList}
				loading={loadingRepertoryList}
				error={errorRepertoryList}
				/> */}
			<SongCollection searcher={false} songList={songList}
				loading={loadingSongList}
				error={errorSongList} />
		</Fragment>
	);
};

export default Library;
