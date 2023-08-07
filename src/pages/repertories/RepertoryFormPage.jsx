import React from "react";
import { useParams } from "react-router-dom";
// import axios from "../../axios";
import RepertoryFormDescription from "./components/RepertoryFormDescription";
import SongFormLyric from "./components/SongFormLyric";
import SongFormExtraDetails from "./components/SongFormExtraDetails";
import LyricWithChords from "./components/LyricWithChords";
import { useRepertoryFormPage } from "./hooks/useRepertoryFormPage";

const RepertoryFormPage = () => {
	const { id } = useParams();
	// const [repertoryForm, loading, error, formStep, nextStep] = useRepertoryFormPage(id);
	const {
		repertoryForm,
		isLoading,
		error,
		formStep,
		nextStep,
		isNextDisabled,
		setField,
		toogleEditOnlyChords,
		onlyLiric,
		chords,
		chordLang,
		editOnlyChords,
	} = useRepertoryFormPage(id);

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
							{id ? "Editar Canción" : "Crear Repertorio"}
						</h4>
						{formStep === "DESCRIPTION" && (
							<RepertoryFormDescription
								title={repertoryForm.title}
								setTitle={(v) => setField("title", v)}
								placeTitle={repertoryForm.placeTitle}
								setPlaceTitle={(v) => setField("placeTitle", v)}
								placeUbication={repertoryForm.placeUbication}
								setPlaceUbication={(v) => setField("placeUbication", v)}
								annotations={repertoryForm.annotations}
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
										lyric={repertoryForm.lyric}
										setLyric={(v) => setField("lyric", v)}
									/>
								)}
							</>
						)}
						{formStep === "EXTRA_DETAILS" && (
							<SongFormExtraDetails
								tempo={repertoryForm.tempo}
								setTempo={(v) => setField("tempo", v)}
								pulse={repertoryForm.pulse}
								setPulse={(v) => setField("pulse", v)}
								labels={repertoryForm.labels}
								setLabels={(v) => setField("labels", v)}
							/>
						)}
						<div className="row">
							<div className="input-field">
								<button
									onClick={nextStep}
									className="btn light-blue darken-4 col s12"
									disabled={isNextDisabled()}
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

export default RepertoryFormPage;
