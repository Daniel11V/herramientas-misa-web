import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogout from "../../layout/components/LoginLogout";
import { useHistory } from "react-router";
import SongList from "./components/SongList";
import { useDispatch, useSelector } from "react-redux";
// import { useSongBookList } from "./hooks/useSongBookList";
import { useSongList } from "../../clases/song/useSongList";
import { login } from "../../clases/user/actions";

const Songs = () => {
	// const [songBookList, loadingSongBookList, errorSongBookList] =
	// 	useSongBookList();
	const [songList, loadingSongList, errorSongList] = useSongList();
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
			<SongList
				searcher
				songs={songList}
				loading={loadingSongList}
				error={errorSongList}
			/>
		</Fragment>
	);
};

export default Songs;
