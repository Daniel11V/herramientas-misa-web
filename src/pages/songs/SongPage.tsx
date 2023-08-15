/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from "react-redux";
import fullLabels from "../../data/fullLabels.ts";
import LyricWithChords from "./components/LyricWithChords.tsx";
import styled from "styled-components";
import ChordSelector from "./components/ChordSelector.tsx";
import { useSongPage } from "./hooks/useSongPage.ts";
import { colors, noSelectableText } from "../../styles/styleUtils.ts";
import MessageModal from "../components/MessageModal.tsx";
import BottomSheet from "../components/BottomSheet.tsx";
import { useSongPageOptions } from "./hooks/useSongPageOptions.ts";
import ModalSelector from "./components/ModalSelector.tsx";
import LoggedButton from "../../layout/components/LoggedButton.tsx";
import LyricContainerZoom from "./components/LyricContainerZoom.tsx";
import { usePublishSong } from "./hooks/usePublishSong.ts";
import LabelsInput from "../components/LabelsInput.tsx";
import { translateChord } from "../../utils/lyricsAndChordsUtils.ts";
import { generalLevelOptions } from "../../classes/song/types";
import { IStoreState } from "../../store.ts";

export const SongPage: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const {
		song,
		isLoadingPage,
		errorPage,
		tone,
		setTone,
		annotations,
		setAnnotations,
		setAnnotationsBackup,
		level,
		setLevel,
		handleClickSaveSong,

		toogleEditBtn,
		songEdited,
		editingSong,
		songForm,
		editForm,
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

	const user = useSelector((state: IStoreState) => state.user.google);
	const isCreator = user?.id === song?.creator?.id;
	const [messageModalOpts, setMessageModalOpts] = useState(null);
	const [openOptions, setOpenOptions] = useState(false);
	const [editOnlyChords, setEditOnlyChords] = useState(false);
	// const { handleClickPrint, isLoadingPrint, PagePrint } = usePrint();
	const { handleClickPublish, isLoadingPublish, errorPublish } = usePublishSong(
		song,
		user,
		setMessageModalOpts
	);

	useEffect(() => {
		const elems = document.querySelectorAll(".modal");
		M.Modal.init(elems);

		return () => {
			document
				.getElementById("authorName")
				?.removeEventListener("input", (e) => {
					editForm("author", e?.target?.value);
				});
		};
	}, [editForm]);

	useEffect(() => {
		if (editingSong) {
			let textarea = document.querySelector("textarea");
			M.textareaAutoResize(textarea);
			document.getElementById("authorName")?.addEventListener("input", (e) => {
				editForm("author", e?.target?.value);
			});
		}
	}, [editingSong, editForm]);

	const handleDeleteBtn = () => {
		setMessageModalOpts({
			title: "¿Esta seguro que desea eliminar esta canción?",
			message:
				"Esta acción no se puede deshacer y se eliminará para todos los usuarios.",
			onClose: () => {
				setMessageModalOpts(null);
			},
			onCancel: () => {},
			onConfirm: () => {
				// await axios.delete(`/api/songs/${id}`).catch((err) => console.Page(err));
				M.toast({ html: "Cancion borrada." });
				// refetchSongs();
				navigate(-1);
			},
		});
	};

	const handleChangeTone = (newTone) => {
		setTone(translateChord(newTone, "en", pageOptions.chordLang));
	};

	const handleSaveOptions = () => {
		setOpenOptions(false);
		saveOptions();
	};

	if (!!isLoadingPage)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	if (!!errorPage) return <div>Error - {errorPage}</div>;

	const songVisualization = () => (
		<>
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
							{fullLabels?.find((type) => !!type?.lbs?.[label])?.lbs[label]}
						</SongLabel>
					))}
				</div>
			)}
			<SongTitle>
				{song.title} {song.author?.name && ` - ${song.author.name}`}
			</SongTitle>
			{!!pageOptions.showChords && (
				<>
					{!!tone && (
						<div>
							<ChordSelector
								modalId="tone"
								label="Tono: "
								selectedChord={translateChord(
									tone,
									pageOptions.chordLang,
									"en"
								)}
								setSelectedChord={handleChangeTone}
								chordLang={pageOptions.chordLang}
								onlyChangeTone
							/>
						</div>
					)}
					<SongInfoBox>
						{song.pulse && <div>Pulso: {song.pulse}</div>}
						<SongInfoSpacer />
						{song.tempo && <div>Tempo recomendado: {song.tempo}</div>}
					</SongInfoBox>
				</>
			)}
			{(isCreator || annotations) && (
				<AnnotationField>
					<textarea
						id="annotations"
						name="annotations"
						className="materialize-textarea"
						onChange={(e) => setAnnotations(e.target.value)}
						style={{ marginTop: 0, marginBottom: 0 }}
						value={annotations}
						placeholder="Mis Notas"
						readOnly={!isCreator}
						onBlur={setAnnotationsBackup}
					/>
					{/* <label
					htmlFor="annotations"
					class={"lab" + (annotations ? " active" : "")}
				>
					Mis Notas
				</label> */}
				</AnnotationField>
			)}
			<LyricContainerZoom>
				<LyricWithChords
					lyricWithChords={song.lyric}
					setLyricWithChords={(v) => editForm("lyric", v)}
					userTone={tone}
					setUserTone={setTone}
					chordLang={pageOptions.chordLang}
					showChords={pageOptions.showChords}
					isEditable={false}
				/>
			</LyricContainerZoom>
			{song.creator?.name && (
				<p>
					<i>
						Transcripción hecha por {song.creator.name} (
						{song?.isPrivate ? "Privada" : "Publica"})
					</i>
				</p>
			)}
			{!!isCreator && (
				<>
					<h6>
						<b>Mi Nivel de Progreso con la Canción{!isCreator ? "..." : ""}</b>
					</h6>
					<ModalSelector
						modalId="generalLevel"
						// label="Voz: "
						modalTitle="Elegir mi nivel de progreso"
						selectedItem={level?.general?.toString() || "0"}
						setSelectedItem={(v) => setLevel("general", v)}
						items={generalLevelOptions}
						textAlign="start"
						selectorWidth="flex"
					/>
				</>
			)}
		</>
	);

	const songFormVisualization = () => (
		<>
			<SongTitle>
				<div className="input-field">
					<input
						id="title"
						name="title"
						onChange={(e) => editForm("title", e.target.value)}
						type="text"
						value={songForm?.title || ""}
						// placeholder="Titulo*"
					/>
					<label
						htmlFor="title"
						className={"lab" + (songForm?.title ? " active" : "")}
					>
						Titulo*
					</label>
				</div>
			</SongTitle>
			<div className="input-field">
				<input
					id="authorName"
					name="authorName"
					type="text"
					defaultValue={songForm?.author?.name || ""}
					className="autocomplete"
					// placeholder="Autor"
				/>
				<label
					htmlFor="authorName"
					className={"lab" + (songForm?.author?.name ? " active" : "")}
				>
					Autor
				</label>
			</div>
			<div className="input-field">
				<input
					id="tempo"
					name="tempo"
					onChange={(e) => editForm("tempo", e.target.value)}
					type="text"
					value={songForm?.tempo || ""}
					// placeholder="Tempo"
				/>
				<label
					htmlFor="tempo"
					className={"lab" + (songForm?.tempo ? " active" : "")}
				>
					Tempo
				</label>
			</div>
			<div className="input-field">
				<input
					id="pulse"
					name="pulse"
					onChange={(e) => editForm("pulse", e.target.value)}
					type="text"
					value={songForm?.pulse || ""}
					// placeholder="Pulso"
				/>
				<label
					htmlFor="pulse"
					className={"lab" + (songForm?.pulse ? " active" : "")}
				>
					Pulso
				</label>
			</div>
			<div className="input-field">
				<textarea
					id="annotations"
					name="annotations"
					className="materialize-textarea"
					onChange={(e) => editForm("annotations", e.target.value)}
					style={{ marginTop: 0 }}
					value={songForm?.annotations}
					// placeholder="Mis Notas"
				/>
				<label
					htmlFor="annotations"
					className={"lab" + (songForm?.annotations ? " active" : "")}
				>
					Mis Notas
				</label>
			</div>
			<LabelsInput
				labels={songForm.labels}
				updateLabels={(lb) => editForm("labels", lb)}
			/>
			<div
				className="switch"
				style={{
					marginBottom: "30px",
				}}
			>
				<label onChange={() => setEditOnlyChords(!editOnlyChords)}>
					<input type="checkbox" id="checkAuto" />
					<span className="lever"></span>
					<span style={{ color: "black" }}>Editar solo acordes</span>
				</label>
			</div>
			<LyricWithChords
				lyricWithChords={songForm.lyric}
				setLyricWithChords={(v) => editForm("lyric", v)}
				userTone={songForm?.tone}
				setUserTone={(v) => editForm("tone", v)}
				userChordLang={pageOptions.chordLang}
				isEditable
				onlyInputText={!editOnlyChords}
			/>
			<div></div>
		</>
	);

	return (
		<PageContainer fontSize={pageOptions.fontSize} id="to-print">
			{!editingSong ? songVisualization() : songFormVisualization()}
			<div
				className="switch"
				style={{
					marginBottom: "30px",
				}}
			>
				<label onChange={toogleEditBtn}>
					<input type="checkbox" id="checkEdit" />
					<span className="lever"></span>
					<span style={{ color: "black" }}>
						{editingSong ? "Desactivar edición" : "Activar edición"}
					</span>
				</label>
			</div>

			{!editingSong && (
				<>
					{(!!songEdited || !isCreator) && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleClickSaveSong}
							style={{ marginBottom: "15px" }}
						>
							{!isCreator && <i className="material-icons right">favorite</i>}
							Guardar
							{!isCreator ? " canción" : " cambios"}
						</SongButton>
					)}
					{!isCreator && (
						<p>
							<i>(Te premite conservar los cambios y anotar tu progreso)</i>
						</p>
					)}
					{isCreator && song?.isPrivate && (
						<SongButton
							className="btn waves-effect waves-light blue darken-2"
							onClick={handleClickPublish}
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
					{/* <SongButton
						className="btn waves-effect waves-light blue darken-2"
						onClick={handleClickPrint}
					>
						<i className="material-icons right">print</i>Imprimir
					</SongButton> */}
					<BottomSheet open={openOptions} setOpen={setOpenOptions} fullscreen>
						<div>
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
									selectorWidth="115px"
								/>
							)}
							<FontSizeSection>
								Tamaño de letra:
								<FontSizeInput>
									<FontSizeButtonLeft
										onClick={() =>
											setFontSize(Number(pageOptions.fontSize) - 1)
										}
									>
										keyboard_arrow_left
									</FontSizeButtonLeft>
									{pageOptions.fontSize}px
									<FontSizeButtonRight
										onClick={() =>
											setFontSize(Number(pageOptions.fontSize) + 1)
										}
									>
										keyboard_arrow_right
									</FontSizeButtonRight>
								</FontSizeInput>
								{/* <input
								type="range"
								id="fontSize"
								min="10"
								max="25"
								value={pageOptions.fontSize}
								onChange={e => setFontSize(e.target.value)}
							/> */}
							</FontSizeSection>
							{!!areNewOptions && (
								<SongButton
									className="btn waves-effect waves-light blue darken-2"
									onClick={handleSaveOptions}
								>
									<i className="material-icons right">save</i>Guardar
									configuración
								</SongButton>
							)}
						</div>
					</BottomSheet>
					<MessageModal opts={messageModalOpts} />
				</>
			)}
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
const SongInfoBox = styled.div`
	display: flex;
	align-items: center;
`;
const SongInfoSpacer = styled.div`
	flex: 1;
`;
const AnnotationField = styled.div.attrs({
	className: "input-field",
})`
	margin-top: 0;
	margin-bottom: 0.5rem;
`;

// const RangeInput = styled.p.attrs({
// 	className: "range-field",
// })`
// 	margin-top: 5px;
// 	margin-bottom: 5px;
// 	${noSelectableText}

// 	input[type="range"]::-webkit-slider-thumb {
// 		background: ${colors.primary};
// 	}
// `;
const FontSizeSection = styled.div`
	margin-top: 5px;
	margin-bottom: 5px;
	display: flex;
	${noSelectableText}
`;
const FontSizeInput = styled.div`
	margin: 0 1.5rem;
	padding: 0 2rem;
	position: relative;
`;
const FontSizeButton = styled.div.attrs({
	className: "material-icons",
})`
	cursor: pointer;
	position: absolute;
	font-size: inherit;
	bottom: 3px;
`;
const FontSizeButtonLeft = styled(FontSizeButton)`
	left: 0;
`;
const FontSizeButtonRight = styled(FontSizeButton)`
	right: 0;
`;
const SongButton = styled(LoggedButton)`
	margin-top: 15px;
	margin-right: 10px;
`;
