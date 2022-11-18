import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const BottomSheet = ({ children, open, setOpen }) => {
	const [renderSheet, setRenderSheet] = useState(false);
	const [openRenderSheet, setOpenRenderSheet] = useState(false);
	const [topValue, setTopValue] = useState(null);
	const [isFirstUpdate, setIsFirstUpdate] = useState(true);

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
				// document.getElementById("bottom-sheet").style.overflowY = "scroll";
				setTopValue("15");
			} else {
				setTopValue((newTopValue + 12).toFixed(0));
			}
			console.log("ACA CAMBIO", newTopValue);
		} else {
			setTopValue(110);
		}
	};

	useEffect(() => {
		if (open) {
			setRenderSheet(true);
			setTimeout(() => {
				setOpenRenderSheet(true);
			}, 200);
		} else {
			setTopValue(null);
			setOpenRenderSheet(false);
			setTimeout(() => {
				setRenderSheet(false);
				setIsFirstUpdate(true);
			}, 1000);
		}
	}, [open]);

	useEffect(() => {
		if (openRenderSheet) {
			updateTopValue();
			setTimeout(() => {
				setIsFirstUpdate(false);
			}, 200);
		}
	}, [children, openRenderSheet]);

	return (
		<>
			{open && <FullScreenBackground onClick={() => setOpen(false)} />}
			{renderSheet && (
				<BottomSheetStyled
					topValue={topValue}
					open={openRenderSheet}
					hasTransition={isFirstUpdate || !open}
					id="bottom-sheet"
				>
					<div onClick={() => setOpen(false)}>
						<div></div>
					</div>
					<div>{children}</div>
				</BottomSheetStyled>
			)}
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
	transition: top ${(props) => (props.hasTransition ? "0.2s" : "0s")}
		ease-in-out;
	box-shadow: 0px 3px 4px 6px rgb(0 0 0 / 23%);
	z-index: 1100;
	${(props) =>
		!!props.open &&
		props.topValue > 0 &&
		css`
			top: ${props.topValue}%;
		`}

	> div:first-child {
		width: 100vw;
		height: 30px;
		position: relative;

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
	}
`;

export default BottomSheet;
