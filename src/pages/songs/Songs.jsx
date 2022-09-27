import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogout from "../../layout/components/LoginLogout";
import { useHistory } from "react-router";
import SongList from "./components/SongList";
import { login } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";

const Songs = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.user.isLogged);

	const loginAddSong = (userData) => {
		dispatch(login(userData));
		history.push({
			pathname: "/add-song",
			state: { from: "Cancionero" },
		});
	};

	return (
		<Fragment>
			<div className="header">
				<h3 className="cancionero">Cancionero</h3>
				{isLogged ? (
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
			<SongList searcher={false} />
		</Fragment>
	);
};

export default Songs;
