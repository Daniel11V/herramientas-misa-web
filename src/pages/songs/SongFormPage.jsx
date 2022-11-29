import React from "react";
import { useParams } from "react-router-dom";
// import axios from "../../axios";
import SongFormDescription from "./components/SongFormDescription";
import SongFormLyric from "./components/SongFormLyric";
import SongFormExtraDetails from "./components/SongFormExtraDetails";
import LyricWithChords from "./components/LyricWithChords";
import { useSongFormPage } from "./hooks/useSongFormPage";

const SongFormPage = () => {
	const { id } = useParams();
	// const [songForm, loading, error, formStep, nextStep] = useSongFormPage(id);
	const {
		songForm,
		isLoading,
		error,
		formStep,
		nextStep,
		setField,
		authorItems,
		authorForm,
		setAuthorField,
		toogleEditOnlyChords,
		onlyLiric,
		chords,
		chordLang,
		editOnlyChords,
	} = useSongFormPage(id);

	// const [creator, setCreator] = useState(null);
	// const [title, setTitle] = useState("");
	// const [author, setAuthor] = useState(""); // name, id
	// const [lyric, setLyric] = useState("");
	// const [onlyLiric, setOnlyLyric] = useState("");
	// const [chords, setChords] = useState({});
	// const [chordLang, setChordLang] = useState({});
	// const [tempo, setTempo] = useState("");
	// const [pulse, setPulse] = useState("");
	// const [labels, setLabels] = useState([]);

	// const [editOnlyChords, setEditOnlyChords] = useState(false);

	// useEffect(() => {
	// 	if (id && song.id === id) {
	// 		setCreator(song.creator);
	// 		setTitle(song.title);
	// 		setAuthor(song.author.name);
	// 		setTempo(song.tempo);
	// 		setPulse(song.pulse);
	// 		setLabels(song.labels);
	// 		setLyric(song.lyric);

	// 		// Autoresize
	// 		// let inputs = document.querySelectorAll(".lab");
	// 		// for (let i = 0; i < inputs.length; i++) {
	// 		// 	inputs[i].classList.add("active");
	// 		// }
	// 	} else if (id) {
	// 		dispatch(getSong(id));
	// 	}
	// }, [id, song, dispatch]);

	// const saveSong = async () => {
	// 	const creatorSend = !creator ? user.name : creator;

	// 	const songEdited = {
	// 		...song,
	// 		creator: creatorSend,
	// 		title,
	// 		author,
	// 		lyric,
	// 		tempo,
	// 		pulse,
	// 		labels,
	// 	};

	// 	if (id) {
	// 		// await axios
	// 		// 	.put(`/api/songs/${id}`, { ...songToSend, _id: id })
	// 		// 	.catch((err) => console.error(err));
	// 		dispatch(editSong(songEdited));
	// 		M.toast({ html: "Canción Actualizada" });
	// 	} else {
	// 		// await axios
	// 		// 	.post("/api/songs", songToSend)
	// 		// 	.catch((err) => console.error(err));
	// 		// res ? console.log(res.data) : console.log("No response");
	// 		dispatch(editSong(songEdited));
	// 		M.toast({ html: "Canción Guardada" });
	// 	}
	// };

	// const next = async (e) => {
	// 	e.preventDefault();

	// 	// Validations

	// 	// Safe & Prepare Date
	// 	if (formStep === LAST_STEP) {
	// 		await saveSong();
	// 		// refetchSongs();
	// 		history.goBack();
	// 	} else if (formStep === 2) {
	// 		if (editOnlyChords === true)
	// 			setLyric(getLyricWithChords(onlyLiric, chords));

	// 		setFormStep(3);
	// 	} else {
	// 		// Next Step
	// 		setFormStep((lastStep) => lastStep + 1);
	// 	}
	// };

	// const toogleEditOnlyChords = () => {
	// 	if (editOnlyChords === true) {
	// 		setLyric(getLyricWithChords(onlyLiric, chords));
	// 	} else {
	// 		const {
	// 			chords: chordsNew,
	// 			chordLang: chordLangNew,
	// 			onlyLyric: onlyLyricNew,
	// 		} = getChordsFromLyric(songForm.lyric);
	// 		setChords(chordsNew);
	// 		setChordLang(chordLangNew);
	// 		setOnlyLyric(onlyLyricNew);
	// 	}

	// 	setEditOnlyChords(!editOnlyChords);
	// };

	if (isLoading)
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
		<div className="row">
			<div className="card" style={{ marginTop: "20px" }}>
				<div className="card-content">
					<form>
						<h4 style={{ marginBottom: "40px", marginTop: 0 }}>
							{id ? "Editar Canción" : "Añadir Canción"}
						</h4>
						{formStep === "DESCRIPTION" && (
							<SongFormDescription
								author={songForm.author}
								setAuthor={(v) => setField("author", v)}
								authorForm={authorForm}
								setAuthorField={setAuthorField}
								authorItems={authorItems}
								title={songForm.title}
								setTitle={(v) => setField("title", v)}
								annotations={songForm.annotations}
								setAnnotations={(v) => setField("annotations", v)}
							/>
						)}
						{formStep === "LYRIC_CHORDS" && (
							<>
								<div
									className="switch"
									style={{
										marginBottom: "40px",
									}}
								>
									<label onChange={toogleEditOnlyChords}>
										<input type="checkbox" id="checkAuto" />
										<span className="lever"></span>
										<span style={{ color: "black" }}>Editar solo acordes</span>
									</label>
								</div>
								{editOnlyChords ? (
									<LyricWithChords
										lyric={onlyLiric}
										chords={chords}
										setChords={(v) => setField("chords", v)}
										chordLang={chordLang}
									/>
								) : (
									<SongFormLyric
										lyric={songForm.lyric}
										setLyric={(v) => setField("lyric", v)}
									/>
								)}
							</>
						)}
						{formStep === "EXTRA_DETAILS" && (
							<SongFormExtraDetails
								tempo={songForm.tempo}
								setTempo={(v) => setField("tempo", v)}
								pulse={songForm.pulse}
								setPulse={(v) => setField("pulse", v)}
								labels={songForm.labels}
								setLabels={(v) => setField("labels", v)}
							/>
						)}
						<div className="row">
							<div className="input-field">
								<button
									onClick={nextStep}
									className="btn light-blue darken-4 col s12"
								>
									{formStep === "EXTRA_DETAILS" ? "Guardar" : "Siguiente"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SongFormPage;
