import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRepertoryPageBackup } from "../../../classes/page/actions";
import {
	getRepertory,
	resetRepertoryActionStatus,
	setRepertoryStatus,
} from "../../../classes/repertory/actions";
import { MAX_RETRYS } from "../../../configs";
import { IStoreState } from "../../../store";
import { fetchStatus, securityStatus } from "../../../utils/types";

export const useRepertoryPage = (repertoryId) => {
	const dispatch = useDispatch();

	const userId = useSelector((state: IStoreState) => state.user.google.id);
	const {
		repertory,
		repertoryStatus,
		repertoryError,
		repertoryUserId,
		repertoryActionStatus,
	} = useSelector((state: IStoreState) => state.repertory);
	const { repertoryPageBackup } = useSelector(
		(state: IStoreState) => state.page
	);
	const { repertoryList: repertoryListBackup } = repertoryPageBackup;

	type IStep =
		| "INITIAL"
		| "FETCH_REPERTORY_1"
		| "WITH_REPERTORY_1"
		| "FINISHED";
	const steps: Record<IStep, IStep> = {
		INITIAL: "INITIAL",
		FETCH_REPERTORY_1: "FETCH_REPERTORY_1",
		WITH_REPERTORY_1: "WITH_REPERTORY_1",
		FINISHED: "FINISHED",
	};
	const [status, setCurrentRepertoryStatus] = useState({
		step: steps.INITIAL,
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentRepertory, setCurrentRepertory] = useState([]);

	const [finalRepertory, setFinalRepertory] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (repertoryError) setError(repertoryError);
	}, [repertoryError]);

	const setStatus = (statusStep: IStep, statusOpts = {}) => {
		setIsLoading(true);
		// console.log("ACA REPERTORY_STATUS: ", statusStep, statusOpts);
		setCurrentRepertoryStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (repertoryStatus === securityStatus.SHOULD_UPDATE) {
			setStatus(steps.WITH_REPERTORY_1);
			dispatch(
				setRepertoryStatus(
					repertoryUserId ? securityStatus.PRIVATE : securityStatus.PUBLIC
				)
			);
		} else if (userId && repertoryUserId !== userId) {
			setStatus(steps.FETCH_REPERTORY_1, { userId, repertoryId });
		} else if (!userId && repertoryStatus === securityStatus.PRIVATE) {
			setStatus(steps.FETCH_REPERTORY_1, { repertoryId });
		} else if (status.step === steps.INITIAL) {
			if (!!repertoryListBackup[repertoryId]) {
				setCurrentRepertory(repertoryListBackup[repertoryId]);
				setStatus(steps.FINISHED, { isSameBackup: true });
			} else {
				setStatus(steps.FETCH_REPERTORY_1, { userId, repertoryId });
			}
		}
	}, [
		repertoryStatus,
		repertoryUserId,
		status.step,
		repertoryId,
		userId,
		repertoryListBackup,
		dispatch,
	]);

	useEffect(() => {
		if (status.step === steps.FETCH_REPERTORY_1) {
			if (repertoryActionStatus === fetchStatus.INITIAL) {
				dispatch(getRepertory(status.opts));
			} else if (repertoryActionStatus === fetchStatus.SUCCESS) {
				setStatus(steps.WITH_REPERTORY_1, { fromFetch: true });
				dispatch(resetRepertoryActionStatus());
			} else if (repertoryActionStatus === fetchStatus.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setStatus(steps.FINISHED);
					dispatch(resetRepertoryActionStatus());
				} else {
					setRetrys((lastRetrys) => lastRetrys + 1);
					dispatch(getRepertory(status.opts));
				}
			}
		}
	}, [status, repertoryActionStatus, retrys, dispatch]);

	useEffect(() => {
		if (status.step === steps.WITH_REPERTORY_1) {
			setCurrentRepertory(repertory);
			setStatus(steps.FINISHED);
		}
	}, [status, repertory]);

	useEffect(() => {
		if (status.step === steps.FINISHED && !!isLoading) {
			setFinalRepertory(currentRepertory);
			if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
				dispatch(setRepertoryPageBackup(currentRepertory));
			}
			setIsLoading(false);
		}
	}, [status, isLoading, currentRepertory, retrys, dispatch]);

	return [finalRepertory, isLoading, error];
};
