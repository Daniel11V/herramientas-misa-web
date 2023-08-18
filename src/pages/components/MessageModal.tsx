import M from "materialize-css";
import { useState, useEffect } from "react";
import styled from "styled-components";

const MessageModal = ({ opts }) => {
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
		if (!!opts?.title || !!opts?.message) {
			modalInstance?.open();
		} else {
			modalInstance?.close();
		}
	}, [opts, modalInstance]);

	const closeModal = (event: React.MouseEvent): void => {
		event.stopPropagation();
		modalInstance?.close();
	};

	return (
		<MessageModalStyled>
			<div className="modal-content">
				{opts?.title && <h4>{opts.title}</h4>}
				{opts?.message && <p>{opts.message}</p>}
			</div>
			<div className="modal-footer">
				{opts?.onCancel && (
					<div
						onClick={(e) => {
							closeModal(e);
							opts.onCancel();
						}}
						className="modal-close waves-effect waves-light-blue btn-flat"
					>
						Cancelar
					</div>
				)}
				{opts?.onConfirm && (
					<div
						onClick={(e) => {
							closeModal(e);
							opts.onConfirm();
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
