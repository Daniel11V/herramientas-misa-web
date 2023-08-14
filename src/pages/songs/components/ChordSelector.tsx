// import { useState, useEffect } from "react";
import { allChordsOptions } from "../../../data/allChords";
import ModalSelector from "./ModalSelector";
import styled from "styled-components";
import { Chord, ChordLang } from "../types";

interface Props {
	selectedChord: Chord;
	setSelectedChord: (chord: Chord) => void;
	chordLang: ChordLang;
	label: string;
	onlyChangeTone: boolean;
	modalId: string;
}

const ChordSelector: React.FC<Props> = ({
	selectedChord,
	setSelectedChord,
	chordLang,
	label,
	onlyChangeTone,
	modalId,
}) => {
	// const [chordList, setChordList] = useState({});

	// useEffect(() => {
	// const newItems = {};
	// if (onlyChangeTone) {
	// 	newItems.Mayores = [];
	// 	allChords[chordLang][0].chords.forEach((chord, i) => {
	// 		newItems.Mayores.push({
	// 			value: allChords["en"][0].chords[i],
	// 			label: chord,
	// 		});
	// 	});
	// } else {
	// 	allChords[chordLang].forEach((chordCategory, i) => {
	// 		newItems[chordCategory.name] = [];
	// 		chordCategory.chords.forEach((chord, k) => {
	// 			newItems[chordCategory.name].push({
	// 				value: allChords["en"][i].chords[k],
	// 				label: chord,
	// 			});
	// 		});
	// 	});
	// }

	// setChordList(
	// 	allChords[chordLang].reduce(
	// 		(all, chordType) => ({
	// 			...all,
	// 			[chordType.name]: chordType.chords.map((chord) => ({
	// 				label: chord,
	// 				value: chord,
	// 			})),
	// 		}),
	// 		{}
	// 	)
	// );
	// }, [chordLang, onlyChangeTone]);

	const setSelectedModalChord = (chord: string) => {
		setSelectedChord({
			chord,
			duration: selectedChord?.duration || "",
		});
	};

	const setSelectedModalDuration = (duration: string) => {
		setSelectedChord({ chord: selectedChord.chord, duration });
	};

	const listItems = onlyChangeTone
		? {
				mayores:
					allChordsOptions[chordLang][chordLang === "es" ? "Mayores" : "Mayor"],
		  }
		: allChordsOptions[chordLang];

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
				items={listItems}
				selectorWidth="flex"
				initialSelectedItemLabel={selectedChord.chord}
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
