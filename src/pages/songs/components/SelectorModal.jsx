import M from "materialize-css";
import { useState, useEffect } from "react";
import styled from "styled-components";

const SelectorModal = ({
	selectedItem,
	setSelectedItem,
	items = [
		{ value: "1", label: "A" },
		{ value: "2", label: "B" },
	],
	title = "",
}) => {
	const [modalRef, setModalRef] = useState(null);

	useEffect(() => {
		const elem = document.querySelector(".selector-modal");
		const instance = M.Modal.init(elem, {
			endingTop: "15%",
		});
		setModalRef(instance);
		return () => {
			instance.destroy();
		};
	}, []);

	const handleSelectorClick = (event) => {
		event.stopPropagation();
		modalRef?.open();
	};

	const handleItemClick = (item) => {
		setSelectedItem(item);
		modalRef.close();
	};

	return (
		<>
			<SelectedItem onClick={(e) => handleSelectorClick(e)}>
				{selectedItem.label}
				<SelectedItemArrow className="material-icons">
					keyboard_arrow_down
				</SelectedItemArrow>
			</SelectedItem>
			<div
				className="modal selector-modal"
				style={{ color: "black", padding: 0, textAlign: "center" }}
			>
				<div className="modal-content">
					{title && <h5>{title}</h5>}
					{items.map((item) => (
						<ItemBtn
							key={item.value}
							isSelected={item.value === selectedItem.value}
							onClick={() => handleItemClick(item)}
						>
							{item.label}
						</ItemBtn>
					))}
					{/* With Categories */}
					{/* {items.map((type, i) => (
						<div key={i}>
							<ItemText>
								<b>{type.name}</b>
							</ItemText>
							{type.chords.map((item, k) => (
								<ItemBtn key={k} onClick={() => handleItemClick(item)}>
									{item}
								</ItemBtn>
							))}
						</div>
					))} */}
				</div>
			</div>
		</>
	);
};

const ItemText = styled.span`
	width: 100%;
	border-bottom: 1px solid #e4e4e4;
	padding: 10px;
	padding-top: 20px;
	display: block;
`;

const ItemBtn = styled(ItemText)`
	padding-top: 10px;
	cursor: ${(props) => (props.isSelected ? "initial" : "pointer")};
	background-color: ${(props) => (props.isSelected ? "#e4e4e4" : null)};

	&&:hover {
		background-color: #e4e4e4;
	}
`;

const SelectedItemArrow = styled.i`
	position: absolute;
	top: 8px;
	right: 8px;
	font-size: 17px;
	color: #9e9e9e;
`;

const SelectedItem = styled.div`
	position: relative;
	display: inline-block;
	cursor: pointer;
	padding: 5px 0 14px 0;
	width: 100%;
	color: #000;

	&&:after {
		content: "";
		display: block;
		width: 100%;
		height: 0px;
		position: absolute;

		border-bottom: 1px solid #9e9e9e;
		/* left: 10px; */
		bottom: 6px;
	}
`;

export default SelectorModal;
