import M from "materialize-css";
import { useState, useEffect } from "react";
import styled from "styled-components";
import allChords from "../../../data/allChords";

const ChordSelector = ({ selectedChord, setSelectedChord, chordLang }) => {
	const [chordModal, setChordModal] = useState(null);

	useEffect(() => {
		const elem = document.querySelector(".chord-modal");
		const instance = M.Modal.init(elem, {
			endingTop: "15%",
		});
		setChordModal(instance);
		return () => {
			instance.destroy();
		};
	}, []);

	const handleSelectorClick = (event) => {
		event.stopPropagation();
		chordModal?.open();
	};

	const handleChordClick = (chord) => {
		setSelectedChord(chord);
		chordModal.close();
	};

	return (
		<>
			<SelectedChord onClick={handleSelectorClick}>
				{selectedChord}
				<SelectedChordArrow className="material-icons">
					keyboard_arrow_down
				</SelectedChordArrow>
			</SelectedChord>
			<div
				className="modal chord-modal"
				style={{ color: "black", padding: 0, textAlign: "center" }}
			>
				<div
					className="modal-content"
					style={{ padding: 0, paddingTop: "24px" }}
				>
					<h5>Elegir Acorde</h5>
					{allChords[chordLang].map((type, i) => (
						<div key={i}>
							<ChordText>
								<b>{type.name}</b>
							</ChordText>
							{type.chords.map((chord, k) =>
								chord === selectedChord ? (
									<ChordBtnSelected key={k}>{chord}</ChordBtnSelected>
								) : (
									<ChordBtn key={k} onClick={() => handleChordClick(chord)}>
										{chord}
									</ChordBtn>
								)
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

const ChordText = styled.span`
	width: 100%;
	border-bottom: 1px solid #e4e4e4;
	padding: 15px;
	padding-top: 20px;
	display: block;
`;

const ChordBtn = styled(ChordText)`
	padding-top: 10px;
	cursor: pointer;

	&&:hover {
		background-color: #e4e4e4;
	}
`;

const ChordBtnSelected = styled(ChordText)`
	padding-top: 10px;
	background-color: #e4e4e4;
`;

const SelectedChordArrow = styled.i`
	position: absolute;
	top: 8px;
	right: 10px;
	font-size: 17px;
	color: #000;
`;

const SelectedChord = styled.div`
	position: relative;
	display: inline-block;
	/* border: 1px solid gray; */
	cursor: pointer;
	padding: 5px 0 12px 0;
	width: 100%;
	color: #000;
	/* line-height: 45px;
	vertical-align: top; */

	&&:after {
		content: "";
		display: block;
		width: 85px;
		height: 0px;
		position: absolute;

		border-bottom: 0.5px solid #000;
		left: 10px;
		bottom: 6px;
	}
`;

export default ChordSelector;
