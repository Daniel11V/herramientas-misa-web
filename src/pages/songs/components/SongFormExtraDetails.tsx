import { TSong } from "../../../classes/song/types.d";
import LabelsInput from "../../components/LabelsInput";

type TSongFormExtraDetailsProps = {
	labels: TSong["labels"],
	setLabels: (lbs: TSong["labels"]) => void,
	tempo?: TSong["tempo"],
	setTempo: (v:TSong["tempo"]) => void,
	pulse?: TSong["pulse"],
	setPulse: (v:TSong["pulse"]) => void,
}

const SongFormExtraDetails = ({
	labels,
	setLabels,
	tempo,
	setTempo,
	pulse,
	setPulse,
}:TSongFormExtraDetailsProps) => {
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
				<LabelsInput labels={labels} updateLabels={setLabels} />
			</div>
		</>
	);
};

export default SongFormExtraDetails;
