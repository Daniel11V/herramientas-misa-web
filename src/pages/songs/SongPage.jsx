/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from "react-redux";
import fullLabels from "../../data/fullLabels.js";
import LyricWithChords from "./components/LyricWithChords";
import styled from "styled-components";
import ChordSelector from "./components/ChordSelector";
import allChords from "../../data/allChords";
import { getChordsFromLyric } from "../../utils.js";
import { useSongPage } from "./hooks/useSongPage.js";
import { colors, noSelectableText } from "../../styles/styleUtils.js";
import MessageModal from "../components/MessageModal.jsx";
import BottomSheet from "../components/BottomSheet.jsx";

const SongPage = () => {
	const history = useHistory();
	const { id } = useParams();
	const [song, isLoading, error] = useSongPage(id);

	const user = useSelector((state) => state.user.google);

	const [tone, setTone] = useState(null);
	const [currentChords, setCurrentChords] = useState({});
	const [showChords, setShowChords] = useState(true);
	const [hasChords, sethasChords] = useState(false);
	const [chordLang, setChordLang] = useState("en");
	const [onlyLyric, setOnlyLyric] = useState("");

	const [messageModalOpts, setMessageModalOpts] = useState(null);
	const [open, setOpen] = useState(false);

	const pageTitle =
		song.title + " " + (song.author?.name ? " - " + song.author.name : "");

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
		event.stopPropagation();
		setOpen(true);
	};

	const handlePrintBtn = (event) => {
		event.stopPropagation();
		const elementToPrint = document.getElementById("to-print");

		let content = "<html><head>";
		content += `<title>${pageTitle}</title>`;
		const styles = document.querySelectorAll("style");
		for (const style of styles) {
			content += "<style>" + style.innerHTML + "</style>";
		}
		content +=
			'</head><body onload="window.print(); setTimeout(window.close, 3000);">';
		content += elementToPrint.innerHTML;
		content += "</body>";
		content += "</html>";

		const win = window.open(
			"",
			"",
			"left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
		);
		win.document.write(content);
		win.document.close();
	};

	const handleEditBtn = (event) => {
		event.stopPropagation();
		history.push({ pathname: `/edit-song/${id}`, state: { from: "Canción" } });
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
			onConfirm: () => {
				deleteSong();
			},
		});
	};

	if (!!isLoading)
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
		<PageContainer>
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
			<div id="to-print">
				<SongTitle>
					{song.title} {song.author?.name && ` - ${song.author.name}`}
				</SongTitle>
				<LyricWithChords
					lyric={onlyLyric}
					chords={showChords ? currentChords : {}}
				/>
			</div>

			<SongActionButton>
				<a
					className="btn-floating btn-large waves-effect waves-light"
					onClick={handleFloatingBtn}
				>
					<i className="large material-icons">tune</i>
				</a>
			</SongActionButton>
			<BottomSheet open={open} setOpen={setOpen} fullscreen>
				<div>
					<br />
					Detalles:
					{song.pulse && <SongInfo>Pulso: {song.pulse}</SongInfo>}
					{song.tempo && <SongInfo>Tempo recomendado: {song.tempo}</SongInfo>}
					{song.creator?.name && (
						<p>
							<i>Transcripción hecha por {song.creator.name}</i>
						</p>
					)}
					<hr />
					Opciones:
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
					<hr />
					Acciones:
					<br />
					<SongButton
						className="btn waves-effect waves-light blue darken-2"
						onClick={handlePrintBtn}
					>
						<i className="material-icons right">print</i>Imprimir
					</SongButton>
					{!!user?.name && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleEditBtn}
						>
							<i className="material-icons right">edit</i>Editar
						</SongButton>
					)}
					{(song.creator?.name === user.name ||
						user.googleId === "111418653738749034139") && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleDeleteBtn}
						>
							<i className={`material-icons ${"right"}`}>delete</i>Eliminar
						</SongButton>
					)}
				</div>
			</BottomSheet>
			<MessageModal opts={messageModalOpts} />
		</PageContainer>
	);
};

const PageContainer = styled.div`
	font-size: 1.1em;
	margin: 0 auto 40px auto;
	max-width: 700px;
	${noSelectableText}
`;
const SongTitle = styled.h3`
	@media (max-width: 600px) {
		font-size: 1.8rem;
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
const SongActionButton = styled.div.attrs({
	className: "fixed-action-btn",
})`
	> a {
		background-color: ${colors.primary} !important;
	}
`;

export default SongPage;
