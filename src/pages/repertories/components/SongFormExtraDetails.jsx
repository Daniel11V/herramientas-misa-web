import LabelsInput from "../../components/LabelsInput";

const SongFormExtraDetails = ({
	labels,
	setLabels,
	tempo,
	setTempo,
	pulse,
	setPulse,
}) => {
	return (
		<>
			<div className="row">
				<div className="input-field">
					<input
						id="tempo"
						name="tempo"
						onChange={(e) => setTempo(e.target.value)}
						type="text"
						value={tempo || ""}
					/>
					<label htmlFor="tempo" className={"lab" + (tempo ? " active" : "")}>
						Tempo
					</label>
				</div>
			</div>
			<div className="row">
				<div className="input-field">
					<input
						id="pulse"
						name="pulse"
						onChange={(e) => setPulse(e.target.value)}
						type="text"
						value={pulse || ""}
					/>
					<label htmlFor="pulse" className={"lab" + (pulse ? " active" : "")}>
						Pulso
					</label>
				</div>
			</div>
			{/* <div className="row switch">
				<label onChange={() => setManualLabel(!manualLabel)}>
					<input type="checkbox" id="checkAuto" />
					<span className="lever"></span>
					<span>Colocar etiquetas (recomendado)</span>
				</label>
			</div> */}
			<div className="row">
				<LabelsInput labels={labels} updateLabels={(lb) => setLabels(lb)} />
			</div>
		</>
	);
};

export default SongFormExtraDetails;
