import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import axios from "../../axios";
import { useUser } from "../../layout/context/UserContext";
import fullLabels from "../../data/fullLabels.js";
import { useSongs } from "../context/SongsContext";
import "../../styles/Song.css";

const Song = () => {
	const history = useHistory();
	const { id } = useParams();
	const { allSongs, refetchSongs, loadingSongs } = useSongs();
	const [user] = useUser();
	const emptySong = {
		_id: id,
		title: "",
		lyric: "",
		creator: "",
		author: "",
		rating: [],
		labels: [],
	};
	const [song, setSong] = useState(emptySong);
	const [finalLyric, setFinalLyric] = useState("");

	useEffect(() => {
		const elems = document.querySelectorAll(".modal");
		M.Modal.init(elems);
	}, []);

	useEffect(() => {
		if (allSongs) {
			const currentSong = allSongs.find((song) => song._id === id);
			if (currentSong) {
				setSong(currentSong);
				setFinalLyric(currentSong.lyric.replace("{\n}", "\n"));
			}
		}
	}, [id, song, allSongs]);

	const deleteSong = async () => {
		const res = await axios
			.delete(`/api/songs/${id}`)
			.catch((err) => console.error(err));
		console.log(res.data);
		M.toast({ html: "Song Deleted" });
		refetchSongs();
		history.goBack();
	};

	if (loadingSongs)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	return (
		<div className="song">
			{song.labels.length !== 0 && (
				<div
					style={{
						display: "flex",
						marginTop: "15px",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<i className="material-icons label-icon">local_offer</i>
					{song.labels.map((label, i) => (
						<div key={i} className="label">
							<span>
								{
									fullLabels[
										fullLabels.findIndex((type) => type.lbs[label].length > 0)
									].lbs[label]
								}
							</span>
						</div>
					))}
				</div>
			)}
			<h3 className="header-song">
				{song.title} {song.author && ` - ${song.author}`}
			</h3>
			<div className="lyrics">
				<span className="input-field">{finalLyric}</span>
			</div>
			{song.creator && (
				<span style={{ fonStyle: "italic" }}>
					Transcripción hecha por {song.creator}
				</span>
			)}
			{(song.creator === user.name ||
				user.googleId === "111418653738749034139") && (
				<div className="btns">
					<Link
						to={{ pathname: `/edit-song/${id}`, state: { from: "Canción" } }}
						className="btn btn-song waves-effect waves-light blue darken-2"
					>
						<i className="material-icons right">edit</i>Editar
					</Link>
					<a
						href="#modal1"
						className="btn btn-song waves-effect blue darken-2 modal-trigger"
					>
						<i className={`material-icons ${"right"}`}>delete</i>Eliminar
					</a>
				</div>
			)}

			<div id="modal1" className="modal">
				<div className="modal-content">
					<h4>¿Esta seguro que desea eliminar esta canción?</h4>
					<p>
						Esta acción no se puede deshacer y se eliminará para todos los
						usuarios.
					</p>
				</div>
				<div className="modal-footer">
					<div
						onClick={deleteSong}
						className="modal-close waves-effect waves-light-blue btn-flat"
					>
						Confirmar
					</div>
					<div className="modal-close waves-effect waves-light-blue btn-flat">
						Cancelar
					</div>
				</div>
			</div>
		</div>
	);
};

export default Song;
