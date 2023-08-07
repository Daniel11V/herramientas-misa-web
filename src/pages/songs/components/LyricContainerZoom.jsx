import { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const LyricContainerZoom = ({initialZoomed, ...props}) => {
	const [hasZoom, setHasZoom] = useState(initialZoomed);

	return (
		<LyricContainerBox hasZoom={hasZoom}>
			{props.children}
			<LyricContainerButton
				onClick={() => setHasZoom(!hasZoom)}
			>
				{!!hasZoom ? "fullscreen_exit" : "fullscreen"}
			</LyricContainerButton>
		</LyricContainerBox>
	);
};
const LyricContainerBox = styled.div`
	position: relative;
	border: 2px solid blue;
	border-radius: 10px;
	padding: 10px;
	height: 250px;
	background-color: #fff;
	overflow-y: scroll;
	transition: all.3s;
	box-shadow: inset 0 -100px 50px -50px rgba(0, 0, 0, 0.2);
	::-webkit-scrollbar { display: none; }

	${(props) =>
		props.hasZoom &&
		css`
		position: absolute;
		border: none;
		border-radius: 0;
		padding-left: 35px;
		padding-top: 10px;
		height: 100vh;
		width: 100vw;
		box-shadow: none;
		top: 0;
		left: 0;
		z-index: 10000;
		`}
`;
const LyricContainerButton = styled.div.attrs({
	className: "material-icons",
})`
	border: 1px solid #0000ff4f;
    border-radius: 50%;
    cursor: pointer;
    -webkit-transition: all.3s;
    transition: all.3s;
    font-size: 1.6rem;
    position: sticky;
    height: 45px;
    width: 45px;
    bottom: 0px;
    background-color: #0000ff4f;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
`;

export default LyricContainerZoom;
