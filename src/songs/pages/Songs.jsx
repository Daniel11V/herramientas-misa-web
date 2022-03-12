import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import LoginLogout from "../../layout/components/LoginLogout";
import { useUser } from "../../layout/context/UserContext";
import SongList from "../components/SongList";

const Songs = () => {
	const [user, setUser] = useUser();
	const history = useHistory();

	const loginAddSong = (v) => {
		setUser(v);
		history.push({
			pathname: "/add-song",
			state: { from: "Cancionero" },
		});
	};

	return (
		<Fragment>
			<div className="header">
				<h3 className="cancionero">Cancionero</h3>
				{user.name ? (
					<Link
						to={{ pathname: "/add-song", state: { from: "Cancionero" } }}
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
				)}
			</div>
			<SongList searcher={true} />
		</Fragment>
	);
};

export default Songs;
