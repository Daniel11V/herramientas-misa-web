import M from "materialize-css";
import { useState, useEffect } from "react";
import styled from "styled-components";

const MessageModal: React.FC<{
	title?: string;
	message?: string;
	onCancel?: () => void;
	onConfirm?: () => void;
}> = ({ title, message, onCancel, onConfirm }) => {
	const [modalInstance, setModalInstance] = useState<M.Modal | null>(null);

	useEffect(() => {
		const elem = document.querySelector(".message-modal");
		let modal: M.Modal;
		if (elem instanceof HTMLDivElement) {
			const modal = M.Modal.init(elem, {
				// endingTop: "15%",
			});
			setModalInstance(modal);
		}
		return () => {
			modal?.destroy();
		};
	}, []);

	useEffect(() => {
		if (!!title || message) {
			modalInstance?.open();
		} else {
			modalInstance?.close();
		}
	}, [title, message, modalInstance]);

	const closeModal = (event: React.MouseEvent): void => {
		event.stopPropagation();
		modalInstance?.close();
	};

	return (
		<MessageModalStyled>
			<div className="modal-content">
				{title && <h4>{title}</h4>}
				{message && <p>{message}</p>}
			</div>
			<div className="modal-footer">
				{onCancel && (
					<div
						onClick={(e) => {
							closeModal(e);
							onCancel();
						}}
						className="modal-close waves-effect waves-light-blue btn-flat"
					>
						Cancelar
					</div>
				)}
				{onConfirm && (
					<div
						onClick={(e) => {
							closeModal(e);
							onConfirm();
						}}
						className="modal-close waves-effect waves-light-blue btn-flat"
					>
						Confirmar
					</div>
				)}
			</div>
		</MessageModalStyled>
	);
};

const MessageModalStyled = styled.div.attrs({
	className: "modal message-modal",
})`
	z-index: 1150 !important;

	+ .modal-overlay {
		z-index: 1140 !important;
	}
`;

export default MessageModal;
