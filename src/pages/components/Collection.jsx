import React from "react";
import styled, { css } from "styled-components";

const Collection = ({ children, withCheck }) => {
	return (
		<CollectionList>
			{children.map((child) => (
				<CollectionItem withCheck={withCheck}>{child}</CollectionItem>
			))}
		</CollectionList>
	);
};
const CollectionList = styled.div.attrs({
	className: "collection",
})`
	overflow: inherit !important;
	border-radius: 5px;
`;

const CollectionItem = styled.div.attrs({
	className: "collection-item",
})`
	color: #555 !important;
	font-size: 14px;
	display: flex !important;
	justify-content: space-between;
	padding-right: 14px !important;

	:first-child {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	:last-child {
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	${(props) =>
		props.withCheck &&
		css`
			display: flex !important;
			justify-content: space-between;
			height: 42px !important;
			padding: 0 0 0 20px !important;

			> span {
				flex: 1;
				padding-top: 10px;
			}

			> .levelIcon {
				padding-top: 10px;
				padding-right: 10px;
			}

			> label {
				margin: 10px 0 0 10px;
				z-index: 20;
			}
		`}
`;

export default Collection;
