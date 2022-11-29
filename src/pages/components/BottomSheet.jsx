import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { colors } from "../../styles/styleUtils";

const BottomSheet = ({ children, open, setOpen, fullscreen = false }) => {
	const [topValue, setTopValue] = useState(null);
	const [transitionDuration, setTransitionDuration] = useState("0.3s");
	const [openBottonSheet, setOpenBottonSheet] = useState(false);

	const updateTopValue = () => {
		const bottomSheetHeight =
			document.getElementById("bottom-sheet")?.clientHeight;
		const screenHeight = window.screen.height;
		if (!!bottomSheetHeight && !!screenHeight) {
			const newTopValue = 94 - bottomSheetHeight / (screenHeight / 100);

			if (newTopValue < 15) {
				const newSheetHeight = screenHeight - (screenHeight / 100) * 10;
				document.querySelector(
					"#bottom-sheet > div:nth-child(2)"
				).style.height = newSheetHeight + "px";
				setTopValue("15");
			} else {
				setTopValue((newTopValue + 12).toFixed(0));
			}
		} else {
			setTopValue(110);
		}
	};

	useEffect(() => {
		if (open) {
			setOpenBottonSheet(true);
			setTimeout(() => {
				setTransitionDuration("0s");
			}, 200);
		} else {
			setTransitionDuration("0.2s");
			setTimeout(() => {
				setOpenBottonSheet(false);
			}, 100);
			setTimeout(() => {
				setTransitionDuration("0.3s");
			}, 400);
		}
		return () => {
			setTransitionDuration("0.3s");
		};
	}, [open]);

	useEffect(() => {
		if (!fullscreen) updateTopValue();
	}, [children, fullscreen]);

	return (
		<>
			{open && <FullScreenBackground onClick={() => setOpen(false)} />}
			<BottomSheetStyled
				topValue={topValue}
				open={openBottonSheet}
				transitionDuration={transitionDuration}
				fullscreen={fullscreen}
				id="bottom-sheet"
			>
				<div onClick={() => setOpen(false)}>
					<div></div>
				</div>
				<div>{children}</div>
			</BottomSheetStyled>
		</>
	);
};

const FullScreenBackground = styled.div`
	position: fixed;
	z-index: 1000;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
`;

const BottomSheetStyled = styled.div`
	background-color: #fff;
	width: 100vw;
	min-height: 15vh;
	border-top-left-radius: 25px;
	border-top-right-radius: 25px;
	position: fixed;
	top: 110%;
	left: 0;
	transition: top ${(props) => props.transitionDuration} ease-in-out;
	box-shadow: 0px 3px 4px 6px rgb(0 0 0 / 23%);
	z-index: 1100;
	${(props) =>
		!!props.open &&
		css`
			top: ${!!props.fullscreen ? 15 : props.topValue}%;
		`}

	> div:first-child {
		width: 100vw;
		height: 30px;
		position: relative;
		cursor: pointer;

		> div {
			width: 200px;
			background-color: #858585;
			border: 3px solid #858585;
			border-radius: 5px;
			position: absolute;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
			top: 12px;
		}
	}

	> div:nth-child(2) {
		padding: 30px;
		padding-top: 0;
		padding-bottom: 150px;
		overflow-y: scroll;
		${(props) =>
			!!props.fullscreen &&
			css`
				height: 90vh;
			`}

		hr {
			height: 2px;
			border-radius: 2px;
			/* background-color: ${colors.primary}30; */
			background-color: #00000017;
			border: none;
			margin: 25px 0;
		}
	}
`;

export default BottomSheet;
