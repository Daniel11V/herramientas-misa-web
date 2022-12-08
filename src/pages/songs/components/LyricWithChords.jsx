import React, { useState, useEffect } from "react";

import styled, { css } from "styled-components";
import allChords from "../../../data/allChords";
import { getChordsFromLyric } from "../../../utils";
import ChordSelector from "./ChordSelector";

const LyricWithChords = ({
	lyricWithChords = "",
	tone,
	setTone,
	chordLang,
	setChordLang,
	showChords = true,
	isEditable = false,
}) => {
	// const hasChords = !!chordTone;

	const [currentChords, setCurrentChords] = useState({});
	const [currentTone, setCurrentTone] = useState(null);

	const [arrayLyric, setArrayLyric] = useState([]);
	// const [isEditable, setIsEditable] = useState(false);
	const [selectedLetter, setSelectedLetter] = useState([null, null]);
	const [selectedChord, setSelectedChord] = useState("DO");

	useEffect(() => {
		if (lyricWithChords) {
			// let elem = document.getElementById("checkAuto");
			// if (elem) elem.checked = true;

			const { chords, chordTone, chordLang, onlyLyric } =
				getChordsFromLyric(lyricWithChords);
			setTone(chordTone);
			setChordLang(chordLang);
			setCurrentChords(chords);
			setArrayLyric(onlyLyric.split("\n").map((p) => (p ? p.split("") : [""])));
			setSelectedChord(chordLang === "en" ? "C" : "DO");
		}
	}, [lyricWithChords, setTone, setChordLang]);

	// const getTone = (chords = song.chords) => {
	// 	const i = Object.keys(chords)[0];
	// 	const k = Object.keys(chords[i])[0];
	// 	return chords[i][k];
	// };

	useEffect(() => {
		const getChordIndex = (chord) => {
			// In allChords
			for (let i = 0; i < allChords[chordLang].length; i++)
				for (let k = 0; k < allChords[chordLang][i].chords.length; k++)
					if (!allChords[chordLang][i].chords[k].localeCompare(chord))
						return [i, k];
		};

		const getModuleDiference = (a, b) => {
			const difference = (a - b) * -1;
			if (difference < 0) return 12 + difference;
			return difference;
		};

		const getNewChord = (lastChord, toneDiference) => {
			const lastChordIndex = getChordIndex(lastChord);
			let newChordIndex = lastChordIndex[1] + toneDiference;
			if (newChordIndex > 11) newChordIndex = newChordIndex - 12;
			return allChords[chordLang][lastChordIndex[0]].chords[newChordIndex];
		};

		if (!currentTone && !!tone && !!chordLang) {
			setCurrentTone(tone);
		} else if (!!currentTone && !!tone) {
			if (tone !== currentTone) {
				const currentToneIndex = getChordIndex(currentTone);
				const toneIndex = getChordIndex(tone);
				const toneDiference = getModuleDiference(
					currentToneIndex[1],
					toneIndex[1]
				);

				setCurrentChords((lastCurrentChords) => {
					let newChords = {};
					for (const line in lastCurrentChords)
						for (const letterIndex in lastCurrentChords[line])
							newChords[line] = {
								...(newChords[line] || {}),
								[letterIndex]: getNewChord(
									lastCurrentChords[line][letterIndex],
									toneDiference
								),
							};

					return newChords;
				});
			}
		}
	}, [tone, currentTone, chordLang]);

	// useEffect(() => {
	// 	setHasChords(hasChords);
	// }, [hasChords, setHasChords]);

	// useEffect(() => {
	// 	setArrayLyric(onlyLyric.split("\n").map((p) => (p ? p.split("") : [""])));
	// 	setSelectedChord(chordLang === "en" ? "C" : "DO");
	// }, [onlyLyric, chordLang]);

	// useEffect(() => {
	// 	if (setCurrentChords !== null) setIsEditable(true);
	// 	else setIsEditable(false);
	// }, [setCurrentChords]);

	const addChord = (chord) => {
		setCurrentChords((lastChords = {}) => ({
			...lastChords,
			[selectedLetter[0]]: {
				...lastChords[selectedLetter[0]],
				[selectedLetter[1]]: chord,
			},
		}));

		setSelectedLetter([null, null]);
	};

	const removeChord = () => {
		setCurrentChords((lastChords) => {
			delete lastChords[selectedLetter[0]][selectedLetter[1]];
			if (!Object.keys(lastChords[selectedLetter[0]]).length)
				delete lastChords[selectedLetter[0]];

			return lastChords;
		});

		setSelectedLetter([null, null]);
	};

	const isLetterSelected = (i, k) =>
		selectedLetter[0] === i && selectedLetter[1] === k;

	const hasChord = (i, k) =>
		showChords &&
		!!currentChords?.[i] &&
		(k >= 0 ? !!currentChords[i][k] : true);

	const handleLetterClick = (i, k, event) => {
		event.stopPropagation();

		if (isEditable) {
			if (isLetterSelected(i, k)) {
				setSelectedLetter([null, null]);
			} else {
				setSelectedLetter([i, k]);
				if (hasChord(i, k)) setSelectedChord(currentChords[i][k]);
				else setSelectedChord(chordLang === "en" ? "C" : "DO");
			}
		}
	};

	const handleArrowBtns = (event, i, k, direction) => {
		event.stopPropagation();

		setSelectedLetter([i, k ? k + direction : k]);
	};

	return (
		<div onClick={() => setSelectedLetter([null, null])}>
			{arrayLyric.map((row, i) => (
				<div
					key={i}
					style={{
						display: "block",
						marginBottom: 0,
					}}
				>
					{row.map((char, k) => (
						<Letter
							key={k}
							isEditable={isEditable}
							isSpace={char === " "}
							hasChord={hasChord(i)}
						>
							{hasChord(i, k) && !isLetterSelected(i, k) && (
								<>
									<span
										className="chord"
										onClick={(e) => handleLetterClick(i, k, e)}
									>
										{currentChords[i][k]}
									</span>
									<span className="chord-space"></span>
								</>
							)}
							<span
								className="char"
								onClick={(e) => handleLetterClick(i, k, e)}
							>
								{char}
							</span>
							{isEditable && isLetterSelected(i, k) && (
								<Tooltip>
									<ChordSelector
										selectedChord={selectedChord}
										setSelectedChord={addChord}
										chordLang={chordLang}
									/>
									<TooltipFooter>
										<TooltipBtn onClick={(e) => handleArrowBtns(e, i, k, -1)}>
											<i className="material-icons">chevron_left</i>
										</TooltipBtn>
										{hasChord(i, k) ? (
											<TooltipBtn onClick={removeChord}>
												<i className="material-icons">remove</i>
											</TooltipBtn>
										) : (
											<TooltipBtn onClick={() => addChord(selectedChord)}>
												<i className="material-icons">add</i>
											</TooltipBtn>
										)}
										<TooltipBtn onClick={(e) => handleArrowBtns(e, i, k, 1)}>
											<i className="material-icons">chevron_right</i>
										</TooltipBtn>
									</TooltipFooter>
								</Tooltip>
							)}
						</Letter>
					))}
				</div>
			))}
		</div>
	);
};

const TooltipBtn = styled.div`
	height: 25px;
	padding: 0 5px;
	cursor: pointer;
`;

const TooltipFooter = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Tooltip = styled.div`
	width: 105px;
	background-color: black;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;

	/* Position the tooltip */
	position: absolute;
	top: -82px;
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

const Letter = styled.div`
	display: inline-block;
	position: relative;
	margin-left: ${(props) => (props.isSpace ? "6px" : 0)};
	margin-top: ${(props) => (props.hasChord ? "15px" : 0)};

	.char {
		padding-right: 1px;
		cursor: default;
	}

	.chord-space::after {
		content: "";
		display: inline-block;
		width: 3px;
	}

	.chord {
		color: #1869ff;
		position: absolute;
		top: -17px;
		left: 4px;
		cursor: default;
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

	${(props) =>
		props.isEditable &&
		css`
			.char {
				border-radius: 3px;
				border: 1px solid transparent;
				cursor: pointer;
			}

			&&:hover .char {
				border: 1px solid #1869ff;
			}

			.chord {
				cursor: pointer;
			}
		`}
`;

export default LyricWithChords;
