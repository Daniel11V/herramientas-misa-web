import React, { Fragment } from "react";
// import { Link } from "react-router-dom";
// import LoginLogout from "../../layout/components/LoginLogout";
// import { useHistory } from "react-router";
import SongList from "../songs/components/SongCollection";

const MyLibrary = () => {
	// const history = useHistory();

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
			<SongList searcher={false} />
		</Fragment>
	);
};

export default MyLibrary;
