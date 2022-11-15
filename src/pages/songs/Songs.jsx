import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogout from "../../layout/components/LoginLogout";
import { useHistory } from "react-router";
import SongList from "./components/SongList";
import { useDispatch, useSelector } from "react-redux";
// import { useSongBookList } from "./hooks/useSongBookList";
import { useSongList } from "../../clases/song/useSongList";
import { login } from "../../clases/user/actions";
import styled from "styled-components";

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
			<Header>
				<HeaderTitle>Cancionero</HeaderTitle>
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
			</Header>
			<SongList
				searcher
				songs={songList}
				loading={loadingSongList}
				error={errorSongList}
			/>
		</Fragment>
	);
};

const Header = styled.div`
	display: flex;
	align-items: center;
	margin: 20px 0 20px 0;
`;
const HeaderTitle = styled.h3`
	flex: 1;
	margin: 0;

	@media (max-width: 800px) {
		font-size: 2.6rem;
	}

	@media (max-width: 600px) {
		font-size: 2rem;
	}
`;

export default Songs;
