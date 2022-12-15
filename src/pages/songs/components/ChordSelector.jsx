import { useState, useEffect } from "react";
import allChords from "../../../data/allChords";
import { translateChord } from "../../../utils";
import ModalSelector from "./ModalSelector";

const ChordSelector = ({
	selectedChord,
	setSelectedChord,
	chordLang,
	label,
	onlyChangeTone,
	modalId,
}) => {
	const [items, setItems] = useState({});

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
		setItems(newItems);
	}, [chordLang, onlyChangeTone]);

	const setSelectedChordWithTranslate = (chord) => {
		setSelectedChord(translateChord(chord, "en", chordLang));
	};

	return (
		<ModalSelector
			modalId={modalId}
			label={label}
			modalTitle={onlyChangeTone ? "Elegir Tono" : "Elegir Acorde"}
			selectedItem={selectedChord}
			setSelectedItem={setSelectedChordWithTranslate}
			hasCategories={!onlyChangeTone}
			items={items}
		/>
	);
};

export default ChordSelector;
