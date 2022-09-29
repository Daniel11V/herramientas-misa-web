import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useDispatch, useSelector } from "react-redux";
import fullLabels from "../../data/fullLabels.js";
import "../../styles/Song.css";
import LyricWithChords from "./components/LyricWithChords";
import styled from "styled-components";
import ChordSelector from "./components/ChordSelector";
import allChords from "../../data/allChords";
import { getSong } from "../../store/actions/community";
import { setLoading } from "../../store/actions/user";
import { getChordsFromLyric } from "../../utils.js";

const Song = () => {
	const history = useHistory();
	const { id } = useParams();
	const dispatch = useDispatch();
	const { currentSong: song, loading } = useSelector(
		(state) => state.community
	);
	const user = useSelector((state) => state.user.google);

	const [tone, setTone] = useState(null);
	const [currentChords, setCurrentChords] = useState({});
	const [showChords, setShowChords] = useState(true);
	const [hasChords, sethasChords] = useState(false);
	const [chordLang, setChordLang] = useState("en");
	const [onlyLyric, setOnlyLyric] = useState("");

	useEffect(() => {
		const elems = document.querySelectorAll(".modal");
		M.Modal.init(elems);
	}, []);

	useEffect(() => {
		if (song.id === id) {
			let elem = document.getElementById("checkAuto");
			if (elem) elem.checked = true;

			const { chords, chordTone, chordLang, onlyLyric } = getChordsFromLyric(
				song.lyric
			);
			setCurrentChords(chords);
			setTone(chordTone);
			sethasChords(!!chordTone);
			setChordLang(chordLang);
			setOnlyLyric(onlyLyric);
		} else if (id && !song?.error) {
			dispatch(setLoading(true));
			dispatch(getSong(id));
		}
	}, [id, song, dispatch]);

	const deleteSong = async () => {
		// await axios.delete(`/api/songs/${id}`).catch((err) => console.error(err));
		M.toast({ html: "Song Deleted" });
		// refetchSongs();
		history.goBack();
	};

	const getTone = (chords = song.chords) => {
		const i = Object.keys(chords)[0];
		const k = Object.keys(chords[i])[0];
		return chords[i][k];
	};

	// const hasChords = (chords = song.chords) =>
	// 	chords && Object.keys(chords).length !== 0;

	const getChordIndex = (chord) => {
		// In allChords
		for (let i = 0; i < allChords[chordLang].length; i++)
			for (let k = 0; k < allChords[chordLang][i].chords.length; k++)
				if (!allChords[chordLang][i].chords[k].localeCompare(chord))
					return [i, k];
	};

	const getModuleDiference = (a, b) => {
		const difference = (a - b) * -1;
		if (difference < 0) return 12 + difference;
		return difference;
	};

	const getNewChord = (lastChord, toneDiference) => {
		const lastChordIndex = getChordIndex(lastChord);
		let newChordIndex = lastChordIndex[1] + toneDiference;
		if (newChordIndex > 11) newChordIndex = newChordIndex - 12;
		return allChords[chordLang][lastChordIndex[0]].chords[newChordIndex];
	};

	const setNewTone = (newTone) => {
		const originalTone = getTone(currentChords);
		if (newTone !== originalTone) {
			const originalToneIndex = getChordIndex(originalTone);
			const newToneIndex = getChordIndex(newTone);
			const toneDiference = getModuleDiference(
				originalToneIndex[1],
				newToneIndex[1]
			);

			let newChords = {};
			for (const line in currentChords)
				for (const letterIndex in currentChords[line])
					newChords[line] = {
						...newChords[line],
						[letterIndex]: getNewChord(
							currentChords[line][letterIndex],
							toneDiference
						),
					};

			setCurrentChords(newChords);
			setTone(newTone);
		}
	};

	if (loading)
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
			{song.labels?.length !== 0 && (
				<div
					style={{
						display: "flex",
						marginTop: "15px",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<i className="material-icons label-icon">local_offer</i>
					{song.labels?.map((label, i) => (
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
				{song.title} {song.author?.name && ` - ${song.author.name}`}
			</h3>
			{song.pulse && <SongInfo>Pulso: {song.pulse}</SongInfo>}
			{song.tempo && <SongInfo>Tempo recomendado: {song.tempo}</SongInfo>}
			<div
				className="switch"
				style={{ marginTop: "10px", display: hasChords ? "block" : "none" }}
			>
				<label onChange={() => setShowChords(!showChords)}>
					<input type="checkbox" id="checkAuto" />
					<span className="lever"></span>
					<span style={{ color: "black" }}>Mostrar acordes</span>
				</label>
			</div>
			{hasChords && (
				<div>
					{!!showChords && (
						<>
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
									chordLang={chordLang}
									color={"#000"}
								/>
							</div>
						</>
					)}
				</div>
			)}
			<br />
			<LyricWithChords
				lyric={onlyLyric}
				chords={showChords ? currentChords : {}}
			/>
			<br />
			{song.creator?.name && (
				<span style={{ fontStyle: "italic" }}>
					Transcripción hecha por {song.creator.name}
				</span>
			)}
			<div className="btns">
				<Link
					to={{ pathname: `/edit-song/${id}`, state: { from: "Canción" } }}
					className="btn btn-song waves-effect waves-light blue darken-2"
				>
					<i className="material-icons right">edit</i>Editar
				</Link>
				{(song.creator?.name === user.name ||
					user.googleId === "111418653738749034139") && (
					<a
						href="#modal1"
						className="btn btn-song waves-effect blue darken-2 modal-trigger"
					>
						<i className={`material-icons ${"right"}`}>delete</i>Eliminar
					</a>
				)}
			</div>

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
