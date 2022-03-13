import React, { useState, useEffect } from "react";

import styled, { css } from "styled-components";
import ChordSelector from "./ChordSelector";

const LyricWithChords = ({ lyric = "", chords = {}, setChords = null }) => {
	const [arrayLyric, setArrayLyric] = useState([]);
	const [isEditable, setIsEditable] = useState(false);
	const [selectedLetter, setSelectedLetter] = useState([null, null]);
	const [selectedChord, setSelectedChord] = useState("DO");

	useEffect(() => {
		setArrayLyric(lyric.split("\n").map((p) => (p ? p.split("") : [""])));
	}, [lyric]);

	useEffect(() => {
		if (setChords !== null) setIsEditable(true);
		else setIsEditable(false);
	}, [setChords]);

	const addChord = (chord) => {
		setChords((lastChords = {}) => ({
			...lastChords,
			[selectedLetter[0]]: {
				...lastChords[selectedLetter[0]],
				[selectedLetter[1]]: chord,
			},
		}));

		setSelectedLetter([null, null]);
	};

	const removeChord = () => {
		setChords((lastChords) => {
			delete lastChords[selectedLetter[0]][selectedLetter[1]];
			if (!Object.keys(lastChords[selectedLetter[0]]).length)
				delete lastChords[selectedLetter[0]];

			return lastChords;
		});

		setSelectedLetter([null, null]);
	};

	const isLetterSelected = (i, k) =>
		selectedLetter[0] === i && selectedLetter[1] === k;

	const hasChord = (i, k) => !!chords?.[i] && (k >= 0 ? !!chords[i][k] : true);

	const handleLetterClick = (i, k, event) => {
		event.stopPropagation();

		if (isEditable) {
			if (isLetterSelected(i, k)) {
				setSelectedLetter([null, null]);
			} else {
				setSelectedLetter([i, k]);
				if (hasChord(i, k)) setSelectedChord(chords[i][k]);
				else setSelectedChord("DO");
			}
		}
	};

	const handleArrowBtns = (event, i, k, direction) => {
		event.stopPropagation();

		setSelectedLetter([i, k ? k + direction : k]);
	};

	return (
		<div
			className="lyric-chords-view"
			onClick={() => setSelectedLetter([null, null])}
		>
			{arrayLyric.map((row, i) => (
				<div
					key={i}
					style={{
						display: "block",
						marginBottom: 0,
						marginTop: hasChord(i) ? "15px" : "0px",
					}}
				>
					{row.map((char, k) => (
						<Letter key={k} isEditable={isEditable} isSpace={char === " "}>
							{hasChord(i, k) && !isLetterSelected(i, k) && (
								<>
									<span
										className="chord"
										onClick={(e) => handleLetterClick(i, k, e)}
									>
										{chords[i][k]}
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
