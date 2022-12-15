/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from "react-redux";
import fullLabels from "../../data/fullLabels.js";
import LyricWithChords from "./components/LyricWithChords";
import styled from "styled-components";
import ChordSelector from "./components/ChordSelector";
import { useSongPage } from "./hooks/useSongPage.js";
import { colors, noSelectableText } from "../../styles/styleUtils.js";
import MessageModal from "../components/MessageModal.jsx";
import BottomSheet from "../components/BottomSheet.jsx";
import { useSongPageOptions } from "./hooks/useSongPageOptions.js";
import ModalSelector from "./components/ModalSelector.jsx";
import LoggedButton from "../../layout/components/LoggedButton.jsx";

const SongPage = () => {
	const history = useHistory();
	const { id } = useParams();
	const {
		song,
		isLoading,
		error,
		publishCurrentSong,
		tone,
		setTone,
		annotations,
		setAnnotations,
		voiceLevel,
		setVoiceLevel,
		voiceLevelOptions,
		areNewSongOptions,
		saveSongOptions,
	} = useSongPage(id);
	const {
		areNewOptions,
		pageOptions,
		setFontSize,
		toggleShowChords,
		setChordLang,
		chordLangOptions,
		saveOptions,
	} = useSongPageOptions();

	const user = useSelector((state) => state.user.google);
	const isCreator = user?.id === song?.creator?.id;

	// const [chordLang, setChordLang] = useState("en");

	const [messageModalOpts, setMessageModalOpts] = useState(null);
	const [openOptions, setOpenOptions] = useState(false);

	useEffect(() => {
		const elems = document.querySelectorAll(".modal");
		M.Modal.init(elems);
	}, []);

	useEffect(() => {
		if (!!openOptions) {
			const textarea = document.querySelector("textarea");
			M.textareaAutoResize(textarea);
		}
	}, [openOptions]);

	const handleFloatingBtn = (event) => {
		event.stopPropagation();
		setOpenOptions((lv) => !lv);
	};

	// const handlePrintBtn = (event) => {
	// event.stopPropagation();
	// 	const elementToPrint = document.getElementById("to-print");

	// 	let content = "<html><head>";
	// 	content += `<title>${pageTitle}</title>`;
	// 	const styles = document.querySelectorAll("style");
	// 	for (const style of styles) {
	// 		content += "<style>" + style.innerHTML + "</style>";
	// 	}
	// 	content +=
	// 		'</head><body onload="window.print(); setTimeout(window.close, 3000);">';
	// 	content += elementToPrint.innerHTML;
	// 	content += "</body>";
	// 	content += "</html>";

	// 	const win = window.openOptions(
	// 		"",
	// 		"",
	// 		"left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
	// 	);
	// 	win.document.write(content);
	// 	win.document.close();
	// };

	const handleEditBtn = (event) => {
		event.stopPropagation();
		history.push({ pathname: `/edit-song/${id}`, state: { from: "Canción" } });
	};
	const handlePublishBtn = (event) => {
		event.stopPropagation();
		setMessageModalOpts({
			title: "Solicitud de publicación",
			message:
				"Se creará una solicitud para agregar tu canción dentro de nuestro cancionero publico! Y en unos días recibirá una respuesta al mail.",
			onClose: () => {
				setMessageModalOpts(null);
			},
			onCancel: () => {},
			onConfirm: () => {
				if (user.id === "111418653738749034139") {
					publishCurrentSong();
					return;
				}

				window.Email.send({
					SecureToken: "6475cd94-e35b-4580-a64e-0bb45672fa5c",
					To: "alexander1vinet@gmail.com",
					From: "alexander1vinet@gmail.com",
					Headers: {
						"Content-Type": "application/json",
					},
					Subject: "Nueva cancion - Herramientas para Misa",
					Body: `<html><h2>User:</h2><p>id: ${user.id}</p><p>name: ${
						user.name
					}</p><p>email: ${user.email}</p><h2>Song: </h2><p>${JSON.stringify(
						song,
						null,
						"\t"
					)}</p><h2>Link: </h2><p>https://herramientas-misa.netlify.app/song/${
						song.id
					}</p></html>`,
				}).then((message) => {
					if (message === "OK") {
						M.toast({ html: "Solicitud enviada. Gracias!" });
					} else {
						M.toast({ html: "Error: " + message });
					}
				});
			},
		});
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
				// await axios.delete(`/api/songs/${id}`).catch((err) => console.error(err));
				M.toast({ html: "Cancion borrada." });
				// refetchSongs();
				history.goBack();
			},
		});
	};

	const handleChangeTone = (newTone) => {
		setTone(newTone, true);
		// setOpenOptions(false);
	};

	const handleSaveSongOptions = () => {
		setOpenOptions(false);
		saveSongOptions();
	};

	const handleSaveOptions = () => {
		setOpenOptions(false);
		saveOptions();
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
		<PageContainer fontSize={pageOptions.fontSize}>
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
					lyricWithChords={song.lyric}
					tone={tone}
					setTone={setTone}
					chordLang={pageOptions.chordLang}
					showChords={pageOptions.showChords}
					isEditable={false}
				/>
			</div>

			<SongActionButton>
				<a
					className="btn-floating btn-large waves-effect waves-light"
					onClick={handleFloatingBtn}
				>
					<i className="large material-icons">
						{openOptions ? "arrow_downward" : "tune"}
					</i>
				</a>
			</SongActionButton>
			<BottomSheet open={openOptions} setOpen={setOpenOptions} fullscreen>
				<div>
					<h5>Detalles</h5>
					{song.pulse && <SongInfo>Pulso: {song.pulse}</SongInfo>}
					{song.tempo && <SongInfo>Tempo recomendado: {song.tempo}</SongInfo>}
					{song.creator?.name && (
						<p>
							<i>Transcripción hecha por {song.creator.name}</i>
						</p>
					)}
					<hr />
					<h5>Ajustes de canción</h5>
					{!!tone && !!pageOptions.showChords && (
						<>
							<ChordSelector
								modalId="tone"
								label="Tono: "
								selectedChord={tone}
								setSelectedChord={handleChangeTone}
								chordLang={pageOptions.chordLang}
								onlyChangeTone
							/>
							<br />
						</>
					)}
					<div className="input-field">
						<textarea
							id="annotations"
							name="annotations"
							className="materialize-textarea"
							onChange={(e) => setAnnotations(e.target.value)}
							value={annotations}
						/>
						<label
							htmlFor="annotations"
							className={"lab" + (annotations ? " active" : "")}
						>
							Mis Notas
						</label>
					</div>
					<h6>
						<b>Mi Nivel de Progreso con la Canción{!isCreator ? "..." : ""}</b>
					</h6>
					{!!isCreator ? (
						<>
							<ModalSelector
								modalId="voiceLevel"
								label="Voz: "
								modalTitle="Elegir mi nivel de progreso"
								selectedItem={voiceLevel.toString() || "0"}
								setSelectedItem={setVoiceLevel}
								items={voiceLevelOptions}
								selectorWidth="450"
								textAlign="start"
							/>
							<br />
						</>
					) : (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleSaveSongOptions}
							style={{ marginTop: "5px" }}
						>
							<i className="material-icons right">favorite</i>Guardar canción en
							tu biblioteca para
							{!!areNewSongOptions ? " mantener ajustes" : " comenzar"}
						</SongButton>
					)}
					{!!areNewSongOptions && !!isCreator && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleSaveSongOptions}
						>
							<i className="material-icons right">save</i>Guardar
						</SongButton>
					)}

					<hr />
					<h5>Visualización</h5>
					<div
						className="switch"
						style={{
							marginTop: "10px",
							marginBottom: "10px",
							display: !!tone ? "block" : "none",
						}}
					>
						<label>
							<input
								type="checkbox"
								id="checkAuto"
								checked={pageOptions.showChords}
								onChange={toggleShowChords}
							/>
							<span className="lever"></span>
							<span style={{ color: "black" }}>Mostrar acordes</span>
						</label>
					</div>
					{!!tone && !!pageOptions.showChords && (
						<ModalSelector
							modalId="chordLang"
							label="Cifrado: "
							modalTitle="Elegir Cifrado"
							selectedItem={pageOptions.chordLang}
							setSelectedItem={setChordLang}
							items={chordLangOptions}
							selectorWidth="115"
						/>
					)}
					<RangeInput>
						Tamaño de letra: {pageOptions.fontSize}px
						<input
							type="range"
							id="fontSize"
							min="10"
							max="25"
							value={pageOptions.fontSize}
							onChange={setFontSize}
						/>
					</RangeInput>
					{!!areNewOptions && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleSaveOptions}
						>
							<i className="material-icons right">save</i>Guardar configuración
						</SongButton>
					)}

					{/* <SongButton
						className="btn waves-effect waves-light blue darken-2"
						onClick={handlePrintBtn}
					>
						<i className="material-icons right">print</i>Imprimir
					</SongButton> */}
					{!!user?.name && (
						<>
							<hr />
							<h5>Acciones</h5>
							{/* <br /> */}
							<SongButton
								className="btn waves-effect waves-light blue darken-2"
								onClick={handleEditBtn}
							>
								<i className="material-icons right">edit</i>Editar
							</SongButton>
						</>
					)}
					{isCreator && song?.isPrivate && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handlePublishBtn}
						>
							<i className="material-icons right">publish</i>Publicar
						</SongButton>
					)}
					{(isCreator || user.id === "111418653738749034139") && (
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
	font-size: ${(props) => props.fontSize}px;
	margin: 0 auto 40px auto;
	max-width: 700px;
	${noSelectableText}
`;
const SongTitle = styled.h4`
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

const RangeInput = styled.p.attrs({
	className: "range-field",
})`
	margin-top: 5px;
	margin-bottom: 5px;
	${noSelectableText}

	input[type="range"]::-webkit-slider-thumb {
		background: ${colors.primary};
	}
`;
const SongButton = styled(LoggedButton)`
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
