import { useEffect } from "react";
import M from "materialize-css";
import fullLabels from "../../data/fullLabels";

const LabelsInput = ({ labels = [], updateLabels }) => {
	useEffect(() => {
		const elems = document.querySelectorAll("select");
		if (elems instanceof NodeList && elems[0] instanceof HTMLSelectElement) {
			M.FormSelect.init(elems);
		}
	}, []);

	useEffect(() => {
		for (const label of labels) {
			const opts = document.querySelectorAll("option.label");
			for (let i = 0; i < opts?.length; i++) {
				const actualOpt = opts[i];
				if (actualOpt instanceof HTMLOptionElement) {
					if (actualOpt.value === label) {
						actualOpt.selected = true;
					}
				}
			}
		}
	}, [labels]);

	const changeLabel = () => {
		const selectLabels = document.querySelectorAll("select.label");
		let newArray = [];

		for (const type of selectLabels) {
			if (type instanceof HTMLSelectElement) {
				for (const label of type.options) {
					if (label.selected) {
						newArray.push(label.value);
					}
				}
			}
		}

		// const selectLabels = document.querySelectorAll('select.label');
		// const labels = getSelectedValues(selectLabels);

		// const selectTopics = document.querySelectorAll('select.topic');
		// const topics = getSelectedValues(selectTopics);

		// for (const type of types) {
		//     for(const label of type.options) {
		//         if(label.selected){
		//             if (newArray[type]) {
		//                 newArray[type].lbs.push(label);
		//             } else {
		//                 const typeName = document.querySelectorAll('label')[type].value;
		//                 newArray.push({type: typeName, lbs: [label]});
		//             }
		//         }
		//     }
		// }

		updateLabels(newArray);
	};

	return (
		<div>
			{fullLabels.map((type, i) => (
				<div key={i} className="input-field" style={{ paddingBottom: "10px" }}>
					<select className="label" multiple onChange={changeLabel}>
						<option value="" disabled>
							{type.ask}
						</option>
						{Object.keys(type.lbs).map((label, k) => (
							<option key={k} className="label" value={label}>
								{type.lbs[label]}
							</option>
						))}
					</select>
					<label>{type.name}</label>
				</div>
			))}
		</div>
	);
};

export default LabelsInput;
