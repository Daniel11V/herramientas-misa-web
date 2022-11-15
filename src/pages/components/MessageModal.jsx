import M from "materialize-css";
import { useState, useEffect } from "react";

const MessageModal = ({ opts }) => {
	const [modalInstance, setModalInstance] = useState(null);

	useEffect(() => {
		const elem = document.querySelector(".message-modal");
		const instance = M.Modal.init(elem, {
			// endingTop: "15%",
		});
		setModalInstance(instance);
		return () => {
			instance.destroy();
		};
	}, []);

	useEffect(() => {
		if (!!opts?.title || !!opts?.message) {
			modalInstance?.open();
		} else {
			modalInstance?.close();
		}
	}, [opts, modalInstance]);

	const closeModal = (event) => {
		event.stopPropagation();
		modalInstance?.close();
	};

	return (
		<div className="modal message-modal">
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
		</div>
	);
};

export default MessageModal;
