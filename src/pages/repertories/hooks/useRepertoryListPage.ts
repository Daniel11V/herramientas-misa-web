import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRepertoryListPageBackup } from "../../../classes/page/actions";
import {
	getRepertoryList,
	resetRepertoryActionStatus,
	setRepertoryListStatus,
} from "../../../classes/repertory/actions";
import { MAX_RETRYS } from "../../../configs";
import { TStoreState } from "../../../store";
import { FETCH_STATUS, SECURITY_STATUS } from "../../../utils/types";

export const useRepertoryListPage = () => {
	const dispatch = useDispatch();

	const userId = useSelector((state: TStoreState) => state.user.google.id);
	const {
		repertoryList,
		repertoryListStatus,
		repertoryListUserId,
		repertoryActionStatus,
		repertoryError,
	} = useSelector((state: TStoreState) => state.repertory);

	const { repertoryListPageBackup } = useSelector(
		(state: TStoreState) => state.page
	);
	const { repertoryList: repertoryListBackup } = repertoryListPageBackup;

	type IStep =
		| "INITIAL"
		| "FETCH_REPERTORY_LIST_1"
		| "WITH_REPERTORY_LIST_1"
		| "FINISHED";
	const steps: Record<IStep, IStep> = {
		INITIAL: "INITIAL",
		FETCH_REPERTORY_LIST_1: "FETCH_REPERTORY_LIST_1",
		WITH_REPERTORY_LIST_1: "WITH_REPERTORY_LIST_1",
		FINISHED: "FINISHED",
	};
	const [status, setCurrentRepertoryListStatus] = useState({
		step: steps.INITIAL,
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentRepertoryList, setCurrentRepertoryList] = useState([]);

	const [finalRepertoryList, setFinalRepertoryList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	const setStatus = (statusStep: IStep, statusOpts = {}) => {
		setIsLoading(true);
		// console.log("ACA REPERTORY_LIST_STATUS: ", statusStep, statusOpts);
		setCurrentRepertoryListStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (repertoryError) setError(repertoryError);
	}, [repertoryError]);

	useEffect(() => {
		if (repertoryListStatus === SECURITY_STATUS.SHOULD_UPDATE) {
			setStatus(steps.WITH_REPERTORY_LIST_1);
			dispatch(
				setRepertoryListStatus(
					repertoryListUserId ? SECURITY_STATUS.PRIVATE : SECURITY_STATUS.PUBLIC
				)
			);
		} else if (userId && repertoryListUserId !== userId) {
			setStatus(steps.FETCH_REPERTORY_LIST_1, { userId });
		} else if (!userId && repertoryListStatus === SECURITY_STATUS.PRIVATE) {
			setStatus(steps.FETCH_REPERTORY_LIST_1);
		} else if (status.step === steps.INITIAL) {
			if (!arrayIsEmpty(repertoryListBackup)) {
				setCurrentRepertoryList(repertoryListBackup);
				setStatus(steps.FINISHED, { isSameBackup: true });
			} else {
				setStatus(steps.FETCH_REPERTORY_LIST_1, { userId });
			}
		}
	}, [
		repertoryListStatus,
		repertoryListUserId,
		status.step,
		userId,
		repertoryListBackup,
		dispatch,
	]);

	useEffect(() => {
		if (status.step === steps.FETCH_REPERTORY_LIST_1) {
			if (repertoryActionStatus === FETCH_STATUS.INITIAL) {
				dispatch(getRepertoryList(status.opts));
				setRetrys(0);
			} else if (repertoryActionStatus === FETCH_STATUS.SUCCESS) {
				setStatus(steps.WITH_REPERTORY_LIST_1, { fromFetch: true });
				dispatch(resetRepertoryActionStatus());
			} else if (repertoryActionStatus === FETCH_STATUS.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setStatus(steps.FINISHED);
					dispatch(resetRepertoryActionStatus());
				} else {
					setRetrys((lastRetrys) => lastRetrys + 1);
					dispatch(getRepertoryList(status.opts));
				}
			}
		}
	}, [status, repertoryActionStatus, retrys, dispatch]);

	useEffect(() => {
		if (status.step === steps.WITH_REPERTORY_LIST_1) {
			setCurrentRepertoryList(repertoryList);
			setStatus(steps.FINISHED);
		}
	}, [status, repertoryList]);

	useEffect(() => {
		if (status.step === steps.FINISHED && !!isLoading) {
			setFinalRepertoryList(currentRepertoryList);
			if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
				dispatch(
					setRepertoryListPageBackup({ repertoryList: currentRepertoryList })
				);
			}
			setIsLoading(false);
		}
	}, [status, isLoading, currentRepertoryList, retrys, dispatch]);

	return [finalRepertoryList, isLoading, error];
};
