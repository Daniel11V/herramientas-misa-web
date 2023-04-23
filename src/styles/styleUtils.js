import { css } from "styled-components";

export const colors = {
    primary: "#1976d2",
    secondary: "#1976d280",
    gray: "#9e9e9e",
    blue: "#006cd7",
}

export const noSelectableText = css`
    /* -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; */

    /* background-color: transparent !important; */
	-webkit-touch-callout: none !important; /* iOS Safari */
	-webkit-user-select: none !important; /* Safari */
	-khtml-user-select: none !important; /* Konqueror HTML */
	-moz-user-select: none !important; /* Old versions of Firefox */
	-ms-user-select: none !important; /* Internet Explorer/Edge */
	user-select: none !important; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
	-webkit-tap-highlight-color: transparent !important;
`;