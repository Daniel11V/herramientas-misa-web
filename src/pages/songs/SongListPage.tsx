import React, { Fragment } from "react";
import { useNavigate } from "react-router";
import { useSongListPage } from "./hooks/useSongListPage";
import { Header } from "../../styles/styles";
import SongCollection from "../components/SongCollection";
import LoggedButton from "../../layout/components/LoggedButton";

export const SongListPage: React.FC = () => {
	const [songList, loadingSongList, errorSongList] = useSongListPage();
	const navigate = useNavigate();

	const loginAddSong = () => {
		navigate("/add-song", { state: { from: "Cancionero" } });
	};

	return (
		<Fragment>
			<Header>
				<h4>Cancionero</h4>
				<LoggedButton
					onClick={loginAddSong}
					className="btn waves-effect waves-light blue darken-2 right"
				>
					<i className="material-icons right">add</i>Añadir
				</LoggedButton>
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
