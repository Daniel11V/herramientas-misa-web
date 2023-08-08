import React, { useState, useEffect } from "react";

import styled, { css } from "styled-components";
import {
	getChordIndex,
	getDataFromLyric,
	getModuleDiference,
	translateChord,
	transportChord,
} from "../../../utils";
import ChordSelector from "./ChordSelector";

const LyricWithChords = ({
	lyricWithChords = "",
	setLyricWithChords = () => {},
	tone,
	setTone = () => {},
	chordLang,
	showChords = true,
	isEditable = false,
}) => {
	const [lastLyricWithChords, setLastLyricWithChords] = useState(null);
	const [lastChordLang, setLastChordLang] = useState(null);

	const [currentChords, setCurrentChords] = useState({});
	const [currentTone, setCurrentTone] = useState(null);

	const [arrayLyric, setArrayLyric] = useState([]);
	const [selectedLetter, setSelectedLetter] = useState([null, null]);
	const [selectedChord, setSelectedChord] = useState({
		chord: "C",
		duration: "",
	});

	useEffect(() => {
		if (!!lyricWithChords && lyricWithChords !== lastLyricWithChords) {
			console.log("useEffect lastLyricWithChords", {
				lyricWithChords,
				lastLyricWithChords,
			});
			const { chords, chordLangFound, chordTone, onlyLyric, formattedLyric } =
				getDataFromLyric(lyricWithChords);

			setCurrentTone(chordTone);
			setLastChordLang(chordLang || chordLangFound);
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

			setLyricWithChords(formattedLyric);
			setLastLyricWithChords(formattedLyric);
		}
	}, [lyricWithChords, chordLang, lastLyricWithChords, setLyricWithChords]);

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

	const editSelectedChord = (newSelectedChord, hasChord) => {
		if (!!hasChord) {
			setCurrentChords((lastChords = {}) => ({
				...lastChords,
				[selectedLetter[0]]: {
					...lastChords[selectedLetter[0]],
					[selectedLetter[1]]: selectedChord,
				},
			}));
		}
		setSelectedChord(newSelectedChord);
	};

	const addChord = () => {
		setCurrentChords((lastChords = {}) => ({
			...lastChords,
			[selectedLetter[0]]: {
				...lastChords[selectedLetter[0]],
				[selectedLetter[1]]: selectedChord,
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
				if (hasChord(i, k)) {
					setSelectedChord({
						chord: translateChord(currentChords[i][k].chord, "en", chordLang),
						duration: currentChords[i][k]?.duration || "",
					});
				} else setSelectedChord({ chord: "C", duration: "" });

				setTimeout(() => {
					const tooltipBody = document.getElementById("tooltip-body");
					const coords = tooltipBody?.getBoundingClientRect();
					if (coords) {
						const { left: leftCoords, right: rightCoords } = coords;
						tooltipBody?.getBoundingClientRect();
						if (leftCoords < 20) {
							tooltipBody.style.marginLeft = 20 - leftCoords + "px";
						} else if (rightCoords > window.innerWidth - 20) {
							tooltipBody.style.marginRight =
								rightCoords - window.innerWidth - 20 + "px";
						}
					}
				}, 200);
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

	return (
		<div
			onClick={() => {
				console.log("ACA close");
				setSelectedLetter([null, null]);
			}}
		>
			{arrayLyric.map((sentence, i) => (
				<Sentence key={i}>
					{sentence.map((word, j) => (
						<Word key={j}>
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
													{!!currentChords[i][charIndex].duration && (
														<span
															className="chord-duration"
															onClick={(e) =>
																handleLetterClick(i, charIndex, e)
															}
														>
															{currentChords[i][charIndex].duration}
														</span>
													)}
													<span
														className="chord"
														onClick={(e) => handleLetterClick(i, charIndex, e)}
													>
														{translateChord(
															currentChords[i][charIndex].chord,
															lastChordLang,
															"en"
														)}
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
												<TooltipBody id="tooltip-body">
													<ChordSelector
														selectedChord={selectedChord}
														setSelectedChord={(v) =>
															editSelectedChord(v, hasChord(i, charIndex))
														}
														chordLang={chordLang || lastChordLang}
														modalId="chord"
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
															<TooltipBtn onClick={addChord}>
																<i className="material-icons">add</i>
															</TooltipBtn>
														)}
														<TooltipBtn
															onClick={(e) =>
																handleArrowBtns(e, i, charIndex, 1)
															}
														>
															<i className="material-icons">chevron_right</i>
														</TooltipBtn>
													</TooltipFooter>
												</TooltipBody>
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

const Tooltip = styled.div`
	/* Position the tooltip */
	position: absolute;
	width: 1px;
	top: -86px;
	/* left: 20px; */
	z-index: 5;
	display: flex;
	justify-content: center;

	&::before {
		content: "";
		display: block;
		width: 0;
		height: 0;
		position: absolute;

		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid black;
		left: -8px;
		bottom: -8px;
	}

	&::after {
		content: "";
		display: block;
		width: 2px;
		height: 17px;
		position: absolute;

		background-color: blue;
		left: -1px;
		bottom: -27px;
	}
`;
const TooltipBody = styled.div`
	/* min-width: 145px; */
	background-color: black;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;
	transition: all 0.3s;
`;

const TooltipFooter = styled.div`
	display: flex;
	justify-content: space-between;
`;

const TooltipBtn = styled.div`
	height: 25px;
	padding: 0 5px;
	cursor: pointer;
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

	.chord-duration {
		color: #1869ff;
		position: absolute;
		top: -17px;
		left: -10px;
		cursor: default;
		font-weight: bold;
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

			.chord,
			.chord-duration {
				cursor: pointer;
			}
		`}
`;

export default LyricWithChords;
