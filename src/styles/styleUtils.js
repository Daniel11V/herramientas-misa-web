import { css } from "styled-components";

export const colors = {
    primary: "#1976d2",
    secondary: "#1976d2",
}

export const noSelectableText = css`
    -webkit-user-select: none /* Chrome all / Safari all */,
    -moz-user-select: none /* Firefox all */,
    -ms-user-select: none /* IE 10+ */,
    user-select: none,
`;