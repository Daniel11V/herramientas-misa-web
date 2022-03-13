import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import axios from "../../axios";
import { useUser } from "../../layout/context/UserContext";
import fullLabels from "../../data/fullLabels.js";
import { useSongs } from "../context/SongsContext";
import "../../styles/Song.css";
import LyricWithChords from "../components/LyricWithChords";
import styled from "styled-components";
import ChordSelector from "../components/ChordSelector";
import allChords from "../../data/allChords";

const Song = () => {
	const history = useHistory();
	const { id } = useParams();
	const { allSongs, refetchSongs, loadingSongs } = useSongs();
	const [user] = useUser();
	const emptySong = {
		_id: id,
		title: "",
		lyric: "",
		chords: {},
		creator: "",
		author: "",
		rating: [],
		tempo: "",
		pulse: "",
		labels: [],
	};
	const [song, setSong] = useState(emptySong);
	const [tone, setTone] = useState(null);
	const [currentChords, setCurrentChords] = useState({});
	const [showChords, setShowChords] = useState(true);

	useEffect(() => {
		const elems = document.querySelectorAll(".modal");
		M.Modal.init(elems);

		// let elem = document.querySelectorAll(".checkbox");
		// elem.prop.checked = true;
	}, []);

	useEffect(() => {
		if (allSongs && song.title === "") {
			const currentSong = allSongs.find((song) => song._id === id);
			if (currentSong) {
				setSong(currentSong);

				// If has chords, set tone
				const chords = currentSong.chords;
				if (chords && Object.keys(chords).length !== 0) {
					const i = Object.keys(chords)[0];
					const k = Object.keys(chords[i])[0];
					setTone(chords[i][k]);

					setCurrentChords(chords);
				}
			}
		}
	}, [id, song, allSongs]);

	const deleteSong = async () => {
		await axios.delete(`/api/songs/${id}`).catch((err) => console.error(err));
		M.toast({ html: "Song Deleted" });
		refetchSongs();
		history.goBack();
	};

	const getTone = (chords = song.chords) => {
		const i = Object.keys(chords)[0];
		const k = Object.keys(chords[i])[0];
		return chords[i][k];
	};

	const hasChords = (chords = song.chords) =>
		chords && Object.keys(chords).length !== 0;

	const getChordIndex = (chord) => {
		for (let i = 0; i < allChords.es.length; i++)
			for (let k = 0; k < allChords.es[i].chords.length; k++)
				if (allChords.es[i].chords[k] === chord) return [i, k];
	};

	const getModuleDiference = (a, b) => {
		const difference = (a - b) * -1;
		if (difference < 0) return 12 + difference;
		return difference;
	};

	const getNewChord = (lastChord, toneDiference) => {
		const lastChordIndex = getChordIndex(lastChord);
		let newChordIndex = lastChordIndex[1] + toneDiference[1];
		if (newChordIndex > 11) newChordIndex = newChordIndex - 12;
		return allChords.es[toneDiference[0]].chords[newChordIndex];
	};

	const setNewTone = (newTone) => {
		const originalTone = getTone(currentChords);
		if (newTone !== originalTone) {
			const originalToneIndex = getChordIndex(originalTone);
			const newToneIndex = getChordIndex(newTone);
			const toneDiference = [
				newToneIndex[0],
				getModuleDiference(originalToneIndex[1], newToneIndex[1]),
			];

			let newChords = {};
			for (const line in currentChords)
				for (const letter in currentChords[line])
					newChords[line] = {
						...newChords[line],
						[letter]: getNewChord(currentChords[line][letter], toneDiference),
					};

			setCurrentChords(newChords);
			setTone(newTone);
		}
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
										fullLabels.findIndex((type) => type.lbs[label]?.length > 0)
									]?.lbs[label]
								}
							</span>
						</div>
					))}
				</div>
			)}
			<h3 className="header-song">
				{song.title} {song.author && ` - ${song.author}`}
			</h3>
			{song.pulse && <SongInfo>Pulso: {song.pulse}</SongInfo>}
			{song.tempo && <SongInfo>Tempo recomendado: {song.tempo}</SongInfo>}
			{hasChords() && (
				<div>
					<div className="row switch">
						<label onChange={() => setShowChords(!showChords)}>
							<input type="checkbox" id="checkAuto" />
							<span className="lever"></span>
							<span>Mostrar acordes</span>
						</label>
					</div>
					<div
						style={{
							display: "inline-block",
							paddingTop: "12px",
							paddingRight: "5px",
						}}
					>
						Tono:
					</div>
					<div
						style={{
							display: "inline-block",
							width: "100px",
							textAlign: "center",
						}}
					>
						<ChordSelector
							selectedChord={tone}
							setSelectedChord={setNewTone}
							color={"#000"}
						/>
					</div>
				</div>
			)}
			<br />
			<LyricWithChords lyric={song.lyric} chords={currentChords} />
			<br />
			{song.creator && (
				<span style={{ fontStyle: "italic" }}>
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

const SongInfo = styled.div`
	vertical-align: center;
`;

export default Song;
