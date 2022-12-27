import React, { useState, useEffect } from "react";

import styled, { css } from "styled-components";
import {
	getChordIndex,
	getChordsFromLyric,
	getModuleDiference,
	translateChord,
	transportChord,
} from "../../../utils";
import ChordSelector from "./ChordSelector";

const LyricWithChords = ({
	lyricWithChords = "",
	tone,
	setTone,
	chordLang,
	showChords = true,
	isEditable = false,
}) => {
	const [lastLyricWithChords, setLastLyricWithChords] = useState(null);
	const [lastChordLang, setLastChordLang] = useState(null);

	const [currentChords, setCurrentChords] = useState({});
	const [currentTone, setCurrentTone] = useState(null);

	const [arrayLyric, setArrayLyric] = useState([]);
	// const [isEditable, setIsEditable] = useState(false);
	const [selectedLetter, setSelectedLetter] = useState([null, null]);
	const [selectedChord, setSelectedChord] = useState("C");

	useEffect(() => {
		if (!!lyricWithChords && lyricWithChords !== lastLyricWithChords) {
			const { chords, chordTone, onlyLyric } = getChordsFromLyric(
				lyricWithChords,
				chordLang,
				true
			);

			setCurrentTone(chordTone);
			setLastChordLang(chordLang);
			setCurrentChords(chords);
			setArrayLyric(
				onlyLyric
					.split("\n")
					.map((line) =>
						line
							? line.split(" ").map((word) => (word ? word.split("") : [" "]))
							: [[""]]
					)
			);

			setLastLyricWithChords(lyricWithChords);
		}
	}, [lyricWithChords, chordLang, lastLyricWithChords]);

	useEffect(() => {
		if (!!chordLang && chordLang !== lastChordLang) {
			setCurrentChords((lastCurrentChords) => {
				const newCurrentChords = {};
				for (const line in lastCurrentChords)
					for (const chordIndex in lastCurrentChords[line]) {
						newCurrentChords[line] = {
							...(newCurrentChords[line] || {}),
							[chordIndex]: {
								...lastCurrentChords[line][chordIndex],
								chord: translateChord(
									lastCurrentChords[line][chordIndex].chord,
									chordLang
								),
							},
						};
					}

				return newCurrentChords;
			});

			setLastChordLang(chordLang);
		}
	}, [chordLang, lastChordLang, setCurrentChords, setLastChordLang]);

	useEffect(() => {
		if (!!currentTone && !!tone && tone !== currentTone) {
			const currentToneIndex = getChordIndex(currentTone);
			const toneIndex = getChordIndex(tone);
			const toneDiference = getModuleDiference(
				currentToneIndex?.[1],
				toneIndex?.[1]
			);

			setCurrentChords((lastCurrentChords) => {
				const newChords = {};
				for (const line in lastCurrentChords)
					for (const chordIndex in lastCurrentChords[line]) {
						newChords[line] = {
							...(newChords[line] || {}),
							[chordIndex]: {
								...lastCurrentChords[line][chordIndex],
								chord: transportChord(
									lastCurrentChords[line][chordIndex].chord,
									toneDiference,
									chordLang
								),
							},
						};
					}

				return newChords;
			});
			setCurrentTone(tone);
		} else if (!tone && !!currentTone) {
			setTone(currentTone);
		}
	}, [tone, currentTone, chordLang, setTone]);

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
				[selectedLetter[1]]: {
					duration: lastChords[selectedLetter[0]][selectedLetter[1]].duration,
					chord: translateChord(chord, chordLang, "en"),
				},
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
		(k >= 0 ? !!currentChords[i][k]?.chord : true);

	const handleLetterClick = (i, k, event) => {
		event.stopPropagation();

		if (isEditable) {
			if (isLetterSelected(i, k)) {
				setSelectedLetter([null, null]);
			} else {
				setSelectedLetter([i, k]);
				if (hasChord(i, k))
					setSelectedChord(
						translateChord(currentChords[i][k].chord, "en", chordLang)
					);
				else setSelectedChord("C");
			}
		}
	};

	const handleArrowBtns = (event, i, k, direction) => {
		event.stopPropagation();

		setSelectedLetter([i, k ? k + direction : k]);
	};

	if (tone !== currentTone && !!tone && !!currentTone)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	const getRowCharIndex = (rowIndex, wordIndex, charIndex) => {
		let rowCharIndex = 0;
		for (
			let currentWordIndex = 0;
			currentWordIndex < wordIndex;
			currentWordIndex++
		) {
			rowCharIndex += arrayLyric[rowIndex][currentWordIndex]?.length + 1 || 0;
		}
		return rowCharIndex + charIndex;
	};

	const spaceIndex = (rowIndex, wordIndex) => {
		let rowSpaceIndex = 0;
		for (
			let currentWordIndex = 0;
			currentWordIndex < wordIndex + 1;
			currentWordIndex++
		) {
			rowSpaceIndex += arrayLyric[rowIndex][currentWordIndex]?.length + 1 || 0;
		}
		return rowSpaceIndex;
	};

	return (
		<div onClick={() => setSelectedLetter([null, null])}>
			{arrayLyric.map((sentence, i) => (
				<Sentence key={i}>
					{sentence.map((word, j) => (
						<Word>
							{[...word, " "].map((char, k) => {
								const charIndex = getRowCharIndex(i, j, k);
								return (
									<Letter
										key={charIndex}
										isEditable={isEditable}
										hasChord={hasChord(i)}
									>
										{hasChord(i, charIndex) &&
											!isLetterSelected(i, charIndex) && (
												<>
													<span
														className="chord"
														onClick={(e) => handleLetterClick(i, charIndex, e)}
													>
														{currentChords[i][charIndex].chord}
													</span>
													<span className="chord-space"></span>
												</>
											)}
										<span
											className="char"
											onClick={(e) => handleLetterClick(i, charIndex, e)}
										>
											{char}
										</span>
										{isEditable && isLetterSelected(i, charIndex) && (
											<Tooltip>
												<ChordSelector
													selectedChord={selectedChord}
													setSelectedChord={addChord}
													chordLang={chordLang}
												/>
												<TooltipFooter>
													<TooltipBtn
														onClick={(e) =>
															handleArrowBtns(e, i, charIndex, -1)
														}
													>
														<i className="material-icons">chevron_left</i>
													</TooltipBtn>
													{hasChord(i, charIndex) ? (
														<TooltipBtn onClick={removeChord}>
															<i className="material-icons">remove</i>
														</TooltipBtn>
													) : (
														<TooltipBtn onClick={() => addChord(selectedChord)}>
															<i className="material-icons">add</i>
														</TooltipBtn>
													)}
													<TooltipBtn
														onClick={(e) => handleArrowBtns(e, i, charIndex, 1)}
													>
														<i className="material-icons">chevron_right</i>
													</TooltipBtn>
												</TooltipFooter>
											</Tooltip>
										)}
									</Letter>
								);
							})}
							{/* <SpaceAfterWord isEditable={isEditable} hasChord={hasChord(i)}>
								{hasChord(i, spaceIndex(i, j)) &&
									!isLetterSelected(i, spaceIndex(i, j)) && (
										<>
											<span
												className="chord"
												onClick={(e) => handleLetterClick(i, spaceIndex(i, j), e)}
											>
												{currentChords[i][spaceIndex(i, j)].chord}
											</span>
											<span className="chord-space"></span>
										</>
									)}
							</SpaceAfterWord> */}
						</Word>
					))}
				</Sentence>
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

const Sentence = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 0;
`;

const Word = styled.div`
	margin-right: 3px;
	white-space: nowrap;
`;

const Letter = styled.div`
	display: inline-block;
	position: relative;
	margin-left: 1px;
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

const SpaceAfterWord = styled(Letter)``;

export default LyricWithChords;
