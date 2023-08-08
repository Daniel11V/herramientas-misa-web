import { useState, useEffect } from "react";
import allChords from "../../../data/allChords";
import { translateChord } from "../../../utils";
import ModalSelector from "./ModalSelector";
import styled from "styled-components";

const ChordSelector = ({
	selectedChord,
	setSelectedChord,
	chordLang,
	label,
	onlyChangeTone,
	modalId,
}) => {
	const [chordList, setChordList] = useState({});

	useEffect(() => {
		const newItems = {};
		if (onlyChangeTone) {
			newItems.Mayores = [];
			allChords[chordLang][0].chords.forEach((chord, i) => {
				newItems.Mayores.push({
					value: allChords["en"][0].chords[i],
					label: chord,
				});
			});
		} else {
			allChords[chordLang].forEach((chordCategory, i) => {
				newItems[chordCategory.name] = [];
				chordCategory.chords.forEach((chord, k) => {
					newItems[chordCategory.name].push({
						value: allChords["en"][i].chords[k],
						label: chord,
					});
				});
			});
		}
		setChordList(newItems);
	}, [chordLang, onlyChangeTone]);

	const setSelectedModalChord = (chord) => {
		console.log("change chord");

		setSelectedChord({
			chord: translateChord(chord, "en", chordLang),
			duration: selectedChord?.duration,
		});
	};

	const setSelectedModalDuration = (duration) => {
		console.log("change duration");
		setSelectedChord({ chord: selectedChord.chord, duration });
	};

	return (
		<SelectorBox>
			<DurationField>
				<input
					id="duration"
					name="duration"
					onChange={(e) => setSelectedModalDuration(e.target.value)}
					onClick={(e) => {
						e.stopPropagation();
					}}
					type="text"
					value={selectedChord?.duration || ""}
					placeholder="2"
				/>
			</DurationField>
			<SeparatorStick />
			<ModalSelector
				modalId={modalId}
				label={label}
				modalTitle={onlyChangeTone ? "Elegir Tono" : "Elegir Acorde"}
				selectedItem={selectedChord.chord}
				setSelectedItem={setSelectedModalChord}
				hasCategories={!onlyChangeTone}
				items={chordList}
				selectorWidth="flex"
			/>
		</SelectorBox>
	);
};

const SelectorBox = styled.div`
	background-color: #fff;
	display: flex;
	align-items: center;
	padding: 0 5px;
	border: 2px solid #000;
	border-width: 0px 2px 3px;
	height: 45px;

	.selected-item {
		padding: 5px 15px 12px 0px !important;
	}

	/* div:nth-child(3) {
		margin-bottom: 1px !important;
	} */
`;

const DurationField = styled.div.attrs({
	className: "input-field",
})`
	margin: 0;
	width: 45px;
	padding-right: 5px;

	input {
		margin: 0 !important;
		border-bottom: 1px solid #000 !important;
		height: 21px !important;
		text-align: center;
		padding-bottom: 6px !important;
	}
`;
const SeparatorStick = styled.div`
	height: 24px;
	width: 1px;
	border-right: 1px solid blue;
	margin-bottom: 5px;
	margin-right: 5px;
`;

export default ChordSelector;
