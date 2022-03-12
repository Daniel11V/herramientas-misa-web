import React, { useEffect } from "react";
import M from "materialize-css";
import fullLabels from "../../data/fullLabels";

const LabelsInput = ({ labels = [], updateLabels }) => {
	useEffect(() => {
		var elems = document.querySelectorAll("select");
		M.FormSelect.init(elems);
	}, []);

	useEffect(() => {
		for (const label of labels) {
			let opts = document.querySelectorAll("option.label");
			for (let i = 0; i < opts.length; i++) {
				if (opts[i].value === label) {
					opts[i].selected = true;
				}
			}
		}
	}, [labels]);

	const changeLabel = () => {
		const selectLabels = document.querySelectorAll("select.label");
		let newArray = [];

		for (const type of selectLabels) {
			for (const label of type.options) {
				if (label.selected) {
					newArray.push(label.value);
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
		console.log("change", newArray);
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
