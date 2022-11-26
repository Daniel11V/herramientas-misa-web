import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogout from "../../layout/components/LoginLogout";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useSongListPage } from "./hooks/useSongListPage";
import { login } from "../../clases/user/actions";
import { Header } from "../../styles/styles";
import SongCollection from "./components/SongCollection";

const SongListPage = () => {
	const [songList, loadingSongList, errorSongList] = useSongListPage();
	const history = useHistory();
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.user.isLogged);
	const userId = useSelector((state) => state.user.google.googleId);

	const loginAddSong = (userData) => {
		dispatch(login(userData));
		history.push({
			pathname: "/add-song",
			state: { from: "Cancionero" },
		});
	};

	return (
		<Fragment>
			<Header>
				<h3>Cancionero</h3>
				{userId === "111418653738749034139" && (
					<>
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
					</>
				)}
			</Header>
			<SongCollection
				searcher
				songList={songList}
				loading={loadingSongList}
				error={errorSongList}
			/>
		</Fragment>
	);
};

export default SongListPage;
