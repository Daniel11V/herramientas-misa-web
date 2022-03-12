import React, { useState, useEffect } from "react";

import styled from "styled-components";
import M from "materialize-css";
import allChords from "../../data/allChords";

const SongFormChords = ({ arrayLyric, newChords, setNewChords }) => {
	const [selectedLetter, setSelectedLetter] = useState([null, null]);
	const [selectedChord, setSelectedChord] = useState("DO");
	const [chordModal, setChordModal] = useState(null);

	useEffect(() => {
		const elem = document.querySelector("#chord-selector");
		setChordModal(M.Modal.init(elem));
	}, []);

	const addChord = (chord) => {
		setNewChords((lastChords) => ({
			...lastChords,
			[selectedLetter[0]]: {
				...lastChords[selectedLetter[0]],
				[selectedLetter[1]]: chord,
			},
		}));

		setSelectedLetter([null, null]);

		chordModal.close();
	};

	const removeChord = (chord) => {
		setNewChords((lastChords) => {
			delete lastChords[selectedLetter[0]][selectedLetter[1]];
			if (!Object.keys(lastChords[selectedLetter[0]]).length)
				delete lastChords[selectedLetter[0]];

			return lastChords;
		});

		setSelectedLetter([null, null]);

		chordModal.close();
	};

	const isLetterSelected = (i, k) =>
		selectedLetter[0] === i && selectedLetter[1] === k;

	const hasChord = (i, k) =>
		!!newChords[i] && (k >= 0 ? !!newChords[i][k] : true);

	const handleLetterClick = (i, k) => {
		if (isLetterSelected(i, k)) {
			setSelectedLetter([null, null]);
		} else {
			setSelectedLetter([i, k]);
			if (hasChord(i, k)) setSelectedChord(newChords[i][k]);
			else setSelectedChord("DO");
		}
	};

	return (
		<div className="chords-editor">
			{arrayLyric.map((row, i) => (
				<p key={i} style={{ marginTop: hasChord(i) ? "15px" : "0px" }}>
					{row.map((char, k) => (
						<Letter key={k}>
							{hasChord(i, k) && !isLetterSelected(i, k) && (
								<span className="chord" onClick={() => handleLetterClick(i, k)}>
									{newChords[i][k]}
								</span>
							)}
							<span className="char" onClick={() => handleLetterClick(i, k)}>
								{char}
							</span>
							{isLetterSelected(i, k) && (
								<Tooltip>
									<SelectedChord onClick={() => chordModal.open()}>
										{selectedChord}
										<SelectedChordArrow className="material-icons">
											keyboard_arrow_down
										</SelectedChordArrow>
									</SelectedChord>
									<TooltipFooter>
										<TooltipBtn
											onClick={() => setSelectedLetter([i, k ? k - 1 : k])}
										>
											<i className="material-icons">chevron_left</i>
										</TooltipBtn>
										{hasChord(i, k) ? (
											<TooltipBtn onClick={() => removeChord()}>
												<i className="material-icons">remove</i>
											</TooltipBtn>
										) : (
											<TooltipBtn onClick={() => addChord(selectedChord)}>
												<i className="material-icons">add</i>
											</TooltipBtn>
										)}
										<TooltipBtn onClick={() => setSelectedLetter([i, k + 1])}>
											<i className="material-icons">chevron_right</i>
										</TooltipBtn>
									</TooltipFooter>
								</Tooltip>
							)}
						</Letter>
					))}
				</p>
			))}
			<div id="chord-selector" className="modal">
				<div
					className="modal-content"
					style={{
						color: "black",
						padding: 0,
						textAlign: "center",
					}}
				>
					<h5>Elegir Acorde</h5>
					{allChords.es.map((type, i) => (
						<div key={i}>
							<ChordText>
								<b>{type.name}</b>
							</ChordText>
							{type.chords.map((chord, k) => (
								<ChordBtn key={k} onClick={() => addChord(chord)}>
									{chord}
								</ChordBtn>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const SelectedChordArrow = styled.i`
	position: absolute;
	top: 14px;
	right: 10px;
	font-size: 17px;
`;

const SelectedChord = styled.span`
	position: relative;
	display: block;
	cursor: pointer;
	line-height: 45px;
	vertical-align: top;

	&&:after {
		content: "";
		display: block;
		width: 85px;
		height: 0px;
		position: absolute;

		border-bottom: 0.5px solid #ffffff;
		left: 10px;
		bottom: 6px;
	}
`;

const ChordText = styled.span`
	width: 100%;
	border-bottom: 1px solid #e4e4e4;
	padding: 10px;
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

const TooltipBtn = styled.span`
	height: 25px;
	padding: 0 5px;
	cursor: pointer;
`;

const TooltipFooter = styled.span`
	display: flex;
	justify-content: space-between;
`;

const Tooltip = styled.span`
	width: 105px;
	background-color: black;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;

	/* Position the tooltip */
	position: absolute;
	top: -88px;
	left: -53px;
	z-index: 5;

	&::before {
		content: "";
		display: block;
		width: 0;
		height: 0;
		position: absolute;

		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid black;
		left: 45px;
		bottom: -8px;
	}

	&::after {
		content: "";
		display: block;
		width: 2px;
		height: 17px;
		position: absolute;

		background-color: blue;
		left: 52px;
		bottom: -27px;
	}
`;

const Letter = styled.span`
	position: relative;

	.char {
		border-radius: 3px;
		padding-right: 1px;
		border: 1px solid transparent;
		cursor: pointer;
	}

	&&:hover .char {
		border: 1px solid #1869ff;
	}

	.chord {
		color: #1869ff;
		position: absolute;
		top: -16px;
		left: 2px;
		cursor: pointer;
		font-weight: bold;
	}

	.chord::after {
		content: "";
		display: block;
		width: 1px;
		height: 30px;
		position: absolute;

		background-color: blue;
		left: -3px;
		bottom: -13px;
	}
`;

export default SongFormChords;
