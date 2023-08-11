import M from "materialize-css";
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { objIsEmpty } from "../../../utils";

const ModalSelector = ({
	selectedItem,
	setSelectedItem,
	items,
	label,
	modalTitle,
	hasCategories,
	modalId,
	selectorWidth = "85px",
	textAlign = "center",
	initialSelectedItemLabel,
}) => {
	const [modalInstance, setModalInstance] = useState(null);
	const [selectedItemLabel, setSelectedItemLabel] = useState(
		initialSelectedItemLabel || ""
	);
	const [modalInstanceId] = useState(
		modalId + "-modal-" + new Date().getTime().toString()
	);

	useEffect(() => {
		if (!objIsEmpty(items)) {
			let selectedItemFound;
			for (const categoryName in items) {
				selectedItemFound = items[categoryName].find(
					(item) => item.value === selectedItem
				);
				if (selectedItemFound) break;
			}
			console.log("ACA ", { selectedItemFound });
			setSelectedItemLabel(selectedItemFound?.label);
		}
	}, [items, selectedItem, setSelectedItemLabel]);

	useEffect(() => {
		const elem = document.querySelector("." + modalInstanceId);
		const instance = M.Modal.init(elem, {
			endingTop: "15%",
		});
		setModalInstance(instance);
		return () => {
			instance.destroy();
		};
	}, [modalInstanceId]);

	const handleSelectorClick = (event) => {
		event.stopPropagation();
		modalInstance?.open();
	};

	const handleItemClick = (event, itemValue) => {
		event.stopPropagation();
		setSelectedItem(itemValue);
		modalInstance.close();
	};

	return (
		<>
			{!!label && <Label>{label}</Label>}
			<Selector selectorWidth={selectorWidth} textAlign={textAlign}>
				<SelectedItem onClick={handleSelectorClick}>
					<SelectedItemLabel>{selectedItemLabel}</SelectedItemLabel>
					<SelectedItemArrow className="material-icons">
						keyboard_arrow_down
					</SelectedItemArrow>
				</SelectedItem>
				<StyledModal modalInstanceId={modalInstanceId}>
					<StyledModalContent>
						{!!modalTitle && <StyledModalTitle>{modalTitle}</StyledModalTitle>}
						{Object.keys(items || {})?.map((categoryName) => (
							<div key={categoryName}>
								<ItemText>{hasCategories && <b>{categoryName}</b>}</ItemText>
								{items[categoryName].map((item) => (
									<ItemBtn
										key={item.value}
										selected={item.value === selectedItem}
										onClick={(e) => handleItemClick(e, item.value)}
									>
										{item.label}
									</ItemBtn>
								))}
							</div>
						))}
					</StyledModalContent>
				</StyledModal>
			</Selector>
		</>
	);
};

const Label = styled.span`
	margin-right: 10px;
`;

const Selector = styled.div`
	display: inline-block;
	text-align: ${(props) => props.textAlign};
	margin-bottom: 5px;
	margin-top: 5px;
	${(props) =>
		props.selectorWidth === "flex"
			? css`
					width: 100%;
			  `
			: css`
					width: ${(props) => props.selectorWidth};
			  `}
`;

const StyledModal = styled.div.attrs((props) => ({
	className: "modal " + props.modalInstanceId,
}))`
	color: black;
	padding: 0;
	text-align: center;
`;

const StyledModalContent = styled.div.attrs({
	className: "modal-content",
})`
	padding: 0 !important;
`;

const StyledModalTitle = styled.h5`
	padding-top: 10px !important;
`;

const ItemText = styled.div`
	width: 100%;
	border-bottom: 1px solid #e4e4e4;
	padding: 10px;
	/* padding-top: 20px; */
	display: block;
`;

const ItemBtn = styled(ItemText)`
	padding-top: 10px;
	cursor: pointer;
	${(props) =>
		!!props.selected &&
		css`
			background-color: #e4e4e4;
		`}

	&&:hover {
		background-color: #e4e4e4;
	}
`;

const SelectedItemLabel = styled.span`
	display: inline-flex;
`;

const SelectedItemArrow = styled.i`
	position: absolute;
	bottom: 15px;
	right: 4px;
	font-size: 17px;
	color: #000;
`;

const SelectedItem = styled.div.attrs({
	className: "selected-item",
})`
	position: relative;
	display: inline-block;
	/* border: 1px solid gray; */
	cursor: pointer;
	padding: 5px 15px 12px 5px;
	width: 100%;
	color: #000;
	/* line-height: 45px;
	vertical-align: top; */

	&&:after {
		content: "";
		display: block;
		width: 100%;
		height: 0px;
		position: absolute;

		border-bottom: 0.5px solid #000;
		right: 0;
		bottom: 6px;
	}
`;

export default ModalSelector;
