import styled, { css } from "styled-components";
import { noSelectableText, colors } from "./styleUtils";

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

export const CollectionContent = styled.div`
	/* border: 1px solid red; */
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

export const CollectionItemIcons = styled.div`
	margin-top: 2px;
	display: flex;

	> div {
		position: relative;
		width: 27px;
	}

	i {
		position: absolute;
		left: 50%;
		font-size: 27px;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	span {
		position: absolute;
		color: ${colors.blue};
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
export const PrivacyIcon = styled.div`
	position: relative;

	> i {
		font-size: 22px;
		color: ${colors.gray};
	}
`;

export const LevelIcon = styled.div`
	margin-left: 10px;

	> i {
		color: ${colors.blue};
	}
`;