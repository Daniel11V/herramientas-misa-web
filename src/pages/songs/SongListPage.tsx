import { FC, memo } from "react";
import { useNavigate } from "react-router";
import { useSongListPage } from "./hooks/useSongListPage";
import { Header } from "../../styles/styles";
import SongCollection from "../components/SongCollection";
import LoggedButton from "../../layout/components/LoggedButton";
// import { TSong } from "../../classes/song/types";

export const SongListPage: FC = memo(() => {
	const {songList, loadingSongList, errorSongList} = useSongListPage();
	console.log("ACA SongListPage", {songList, loadingSongList, errorSongList})
	// console.log("ACA SongListPage")
	// const songList: TSong[] = []
	// const loadingSongList = true
	// const errorSongList = null
	
	const navigate = useNavigate();
	const loginAddSong = () => {
		navigate("/add-song", { state: { from: "Cancionero" } });
	};

	return (
		<div className="container">
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
		</div>
	);
});
