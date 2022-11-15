/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from "react-redux";
import fullLabels from "../../data/fullLabels.js";
import "../../styles/Song.css";
import LyricWithChords from "./components/LyricWithChords";
import styled from "styled-components";
import ChordSelector from "./components/ChordSelector";
import allChords from "../../data/allChords";
import { getChordsFromLyric } from "../../utils.js";
import { useSong } from "../../clases/song/useSong.js";
import { colors, noSelectableText } from "../../styles/styleUtils.js";
import MessageModal from "../components/MessageModal.jsx";

const Song = () => {
	const history = useHistory();
	const { id } = useParams();
	const [song, loading, error] = useSong(id);

	const user = useSelector((state) => state.user.google);

	const [tone, setTone] = useState(null);
	const [currentChords, setCurrentChords] = useState({});
	const [showChords, setShowChords] = useState(true);
	const [hasChords, sethasChords] = useState(false);
	const [chordLang, setChordLang] = useState("en");
	const [onlyLyric, setOnlyLyric] = useState("");

	const [messageModalOpts, setMessageModalOpts] = useState(null);

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
		}
	}, [song, id]);

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

	const handleFloatingBtn = (event) => {
		// event.stopPropagation();
		// actionBtn.close();
	};

	const handleEditBtn = (event) => {
		// event.stopPropagation();
		// actionBtn.close();
	};
	const handleDeleteBtn = (event) => {
		event.stopPropagation();
		setMessageModalOpts({
			title: "¿Esta seguro que desea eliminar esta canción?",
			message:
				"Esta acción no se puede deshacer y se eliminará para todos los usuarios.",
			onClose: () => {
				setMessageModalOpts(null);
			},
			onCancel: () => {},
			onConfirm: () => {},
		});
		// actionBtn.close();
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

	if (!!error) return <div>Error - {error}</div>;

	return (
		<SongPage>
			{!!song?.labels?.length && (
				<div
					style={{
						display: "flex",
						marginTop: "15px",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<LabelIcon className="material-icons">local_offer</LabelIcon>
					{song.labels?.map((label, i) => (
						<SongLabel key={i}>
							{fullLabels.find((type) => !!type.lbs[label]).lbs[label]}
						</SongLabel>
					))}
				</div>
			)}
			<SongTitle>
				{song.title} {song.author?.name && ` - ${song.author.name}`}
			</SongTitle>
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
						className="btn btn-song waves-effect blue darken-2 modal-trigger"
						onClick={handleDeleteBtn}
					>
						<i className={`material-icons ${"right"}`}>delete</i>Eliminar
					</a>
				)}
			</div>
			<MessageModal opts={messageModalOpts} />
			<div className="fixed-action-btn">
				<a
					className="btn-floating btn-large waves-effect waves-light blue"
					onClick={handleFloatingBtn}
				>
					<i className="large material-icons">mode_edit</i>
				</a>
			</div>
		</SongPage>
	);
};

const SongPage = styled.div`
	font-size: 1.1em;
	margin: 0 auto 40px auto;
	max-width: 700px;
	${noSelectableText}
`;
const SongTitle = styled.h3`
	@media (max-width: 600px) {
		font-size: 2.3rem;
	}
`;
const LabelIcon = styled.i`
	color: ${colors.primary};
	margin-right: 10px;
	margin-bottom: 3px;
`;
const SongLabel = styled.div`
	display: inline-block;
	height: 29px;
	font-size: 13px;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.6);
	line-height: 29px;
	padding: 0 12px;
	border-radius: 16px;
	background-color: #e4e4e4;
	margin-bottom: 3px;
	margin-right: 5px;
	cursor: default;
`;
const SongInfo = styled.div`
	vertical-align: center;
`;
const SongButton = styled.div`
	margin-top: 15px;
	margin-right: 10px;
`;

export default Song;
