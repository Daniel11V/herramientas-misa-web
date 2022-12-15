import styled, { css } from "styled-components";
import { noSelectableText } from "./styleUtils";

export const Header = styled.div`
	display: flex;
	align-items: center;
	margin: 20px 0 20px 0;
    ${noSelectableText}

	h1, h2, h3, h4, h5, h6 {
        flex: 1;
	    margin: 0;
    }

    h4 {
        /* @media (max-width: 800px) {
		    font-size: 2.6rem;
        } */

        @media (max-width: 600px) {
            font-size: 2rem;
        }
    }
`;

export const Collection = styled.div.attrs({
	className: "collection",
})`
	overflow: inherit !important;
	border-radius: 5px;
	${noSelectableText}
`;

export const CollectionItem = styled.div.attrs(props => ({
	className: "collection-item " + (props.className || ""),
}))`
	color: #555 !important;
	font-size: 14px;
	display: flex !important;
	justify-content: space-between;
    cursor: pointer;

    &:hover {
		background-color: #ddd;
	}

	&:first-child {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	
	&:last-child {
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	${(props) =>
		props.withCheck && css`
			height: 42px !important;
			padding: 0 0 0 20px !important;
		`
	}
`;

export const LevelIcon = styled.div`
	position: relative;
	width: 27px;
	margin-top: 2px;

	> i {
		position: absolute;
		color: #006cd7;
		font-size: 27px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	> span {
		position: absolute;
		color: white;
		font-size: 10px;
		font-weight: bold;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}

	${(props) =>
		props.withCheck &&
		css`
			padding-top: 10px;
			padding-right: 10px;

			> span {
				flex: 1;
				padding-top: 10px;
			}

			> label {
				margin: 10px 0 0 10px;
				z-index: 20;
			}
		`}
`;