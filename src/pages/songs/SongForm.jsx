import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
// import axios from "../../axios";
import M from "materialize-css";
import { useSelector, useDispatch } from "react-redux";
import SongFormDescription from "./components/SongFormDescription";
import SongFormLyric from "./components/SongFormLyric";
import SongFormExtraDetails from "./components/SongFormExtraDetails";
import LyricWithChords from "./components/LyricWithChords";
import { getSong, setLoading, editSong } from "../../store/actions/community";
import { getChordsFromLyric, getLyricWithChords } from "../../utils";

const SongForm = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { currentSong: song } = useSelector((state) => state.community);
	const user = useSelector((state) => state.user.google);

	const [formStep, setFormStep] = useState(1);
	const LAST_STEP = 3;

	const [creator, setCreator] = useState(null);
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [lyric, setLyric] = useState("");
	const [onlyLiric, setOnlyLyric] = useState("");
	const [chords, setChords] = useState({});
	const [chordLang, setChordLang] = useState({});
	const [tempo, setTempo] = useState("");
	const [pulse, setPulse] = useState("");
	const [labels, setLabels] = useState([]);

	const [editOnlyChords, setEditOnlyChords] = useState(false);

	const history = useHistory();

	useEffect(() => {
		if (id && song.id === id) {
			setCreator(song.creator);
			setTitle(song.title);
			setAuthor(song.author);
			setTempo(song.tempo);
			setPulse(song.pulse);
			setLabels(song.labels);
			setLyric(song.lyric);

			// Autoresize
			// let inputs = document.querySelectorAll(".lab");
			// for (let i = 0; i < inputs.length; i++) {
			// 	inputs[i].classList.add("active");
			// }
		} else if (id) {
			dispatch(setLoading(true));
			dispatch(getSong(id));
		}
	}, [id, song, dispatch]);

	const saveSong = async () => {
		const creatorSend = !creator ? user.name : creator;

		const songEdited = {
			...song,
			creator: creatorSend,
			title,
			author,
			lyric,
			tempo,
			pulse,
			labels,
		};

		if (id) {
			// await axios
			// 	.put(`/api/songs/${id}`, { ...songToSend, _id: id })
			// 	.catch((err) => console.error(err));
			dispatch(editSong(songEdited));
			M.toast({ html: "Canción Actualizada" });
		} else {
			// await axios
			// 	.post("/api/songs", songToSend)
			// 	.catch((err) => console.error(err));
			// res ? console.log(res.data) : console.log("No response");
			M.toast({ html: "Canción Guardada" });
		}
	};

	const next = async (e) => {
		e.preventDefault();

		// Validations

		// Safe & Prepare Date
		if (formStep === LAST_STEP) {
			await saveSong();
			// refetchSongs();
			history.goBack();
		} else if (formStep === 2) {
			if (editOnlyChords === true)
				setLyric(getLyricWithChords(onlyLiric, chords));

			setFormStep(3);
		} else {
			// Next Step
			setFormStep((lastStep) => lastStep + 1);
		}
	};

	const toogleEditOnlyChords = () => {
		if (editOnlyChords === true) {
			setLyric(getLyricWithChords(onlyLiric, chords));
		} else {
			const {
				chords: chordsNew,
				chordLang: chordLangNew,
				onlyLyric: onlyLyricNew,
			} = getChordsFromLyric(lyric);
			setChords(chordsNew);
			setChordLang(chordLangNew);
			setOnlyLyric(onlyLyricNew);
		}

		setEditOnlyChords(!editOnlyChords);
	};

	return (
		<div className="row">
			<div className="card" style={{ marginTop: "20px" }}>
				<div className="card-content">
					<form onSubmit={next}>
						<h4 style={{ marginBottom: "40px", marginTop: 0 }}>
							{id ? "Editar Canción" : "Añadir Canción"}
						</h4>
						{formStep === 1 && (
							<SongFormDescription
								author={author}
								setAuthor={setAuthor}
								title={title}
								setTitle={setTitle}
							/>
						)}
						{formStep === 2 && (
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
										setChords={setChords}
										chordLang={chordLang}
									/>
								) : (
									<SongFormLyric lyric={lyric} setLyric={setLyric} />
								)}
							</>
						)}
						{formStep === 3 && (
							<SongFormExtraDetails
								tempo={tempo}
								setTempo={setTempo}
								pulse={pulse}
								setPulse={setPulse}
								labels={labels}
								setLabels={setLabels}
							/>
						)}
						<div className="row">
							<div className="input-field">
								<button
									type="submit"
									className="btn light-blue darken-4 col s12"
								>
									{formStep === LAST_STEP ? "Guardar" : "Siguiente"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SongForm;
