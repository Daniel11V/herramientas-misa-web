import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../../axios";
import M from "materialize-css";
import { useUser } from "../../layout/context/UserContext";
import { useSongs } from "../context/SongsContext";
import SongFormDescription from "../components/SongFormDescription";
import SongFormLyric from "../components/SongFormLyric";
import SongFormExtraDetails from "../components/SongFormExtraDetails";
import LyricWithChords from "../components/LyricWithChords";

const SongForm = () => {
	const { id } = useParams();
	const { allSongs, refetchSongs } = useSongs();
	const [formStep, setFormStep] = useState(1);

	const [user] = useUser();
	const [creator, setCreator] = useState(null);
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [lyric, setLyric] = useState("");
	const [chords, setChords] = useState({});
	const [tempo, setTempo] = useState("");
	const [pulse, setPulse] = useState("");
	const [labels, setLabels] = useState([]);

	const history = useHistory();

	useEffect(() => {
		if (id && allSongs.length !== 0) {
			const song = allSongs.find((song) => song._id === id);

			if (song) {
				setCreator(song.creator);
				setTitle(song.title);
				setAuthor(song.author);
				setLyric(song.lyric);
				setChords(song.chords);
				setTempo(song.tempo);
				setPulse(song.pulse);
				setLabels(song.labels);

				// Autoresize
				// let inputs = document.querySelectorAll(".lab");
				// for (let i = 0; i < inputs.length; i++) {
				// 	inputs[i].classList.add("active");
				// }
			}
		}
	}, [allSongs, id]);

	const saveSong = async () => {
		const creatorSend = !creator ? user.name : creator;

		const songToSend = {
			creator: creatorSend,
			title,
			author,
			lyric,
			chords: chords,
			tempo,
			pulse,
			labels,
			rating: [],
		};

		if (id) {
			await axios
				.put(`/api/songs/${id}`, { ...songToSend, _id: id })
				.catch((err) => console.error(err));

			M.toast({ html: "Canción Actualizada" });
		} else {
			await axios
				.post("/api/songs", songToSend)
				.catch((err) => console.error(err));
			// res ? console.log(res.data) : console.log("No response");
			M.toast({ html: "Canción Guardada" });
		}
	};

	const next = async (e) => {
		e.preventDefault();

		const LAST_STEP = 4;

		// Validations

		// Safe & Prepare Date
		if (formStep === LAST_STEP) {
			await saveSong();
			refetchSongs();
			history.goBack();
		} else {
			// Next Step
			setFormStep((lastStep) => lastStep + 1);
		}
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
							<SongFormLyric lyric={lyric} setLyric={setLyric} />
						)}
						{formStep === 3 && (
							<LyricWithChords
								lyric={lyric}
								chords={chords}
								setChords={setChords}
							/>
						)}
						{formStep === 4 && (
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
									{formStep === 4 ? "Guardar" : "Siguiente"}
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
