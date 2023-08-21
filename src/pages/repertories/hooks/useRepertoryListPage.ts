import { useState, useEffect } from "react";
import { setRepertoryListPageBackup } from "../../../classes/page/actions";
import {
	getRepertoryList,
	resetRepertoryActionStatus,
	setRepertoryListStatus,
} from "../../../classes/repertory/actions";
import { MAX_RETRYS } from "../../../configs";
import { FETCH_STATUS, SECURITY_STATUS } from "../../../utils/types";
import { arrayIsEmpty } from "../../../utils/generalUtils";
import { TRepertory } from "../../../classes/repertory/types";
import { TUserId } from "../../../classes/user/types";
import { useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";

export const useRepertoryListPage = () => {
	const dispatch = useDispatch();

	const userId = useAppSelector((state) => state.user.google.id);
	const {
		repertoryList,
		repertoryListStatus,
		repertoryListUserId,
		repertoryActionStatus,
		repertoryError,
	} = useAppSelector((state) => state.repertory);

	const { repertoryListPageBackup } = useAppSelector((state) => state.page);
	const { repertoryList: repertoryListBackup } = repertoryListPageBackup;

	type TStep =
		| "INITIAL"
		| "FETCH_REPERTORY_LIST_1"
		| "WITH_REPERTORY_LIST_1"
		| "FINISHED";
	const steps: Record<TStep, TStep> = {
		INITIAL: "INITIAL",
		FETCH_REPERTORY_LIST_1: "FETCH_REPERTORY_LIST_1",
		WITH_REPERTORY_LIST_1: "WITH_REPERTORY_LIST_1",
		FINISHED: "FINISHED",
	};
	type TStatus = {
		step: TStep;
		opts: {
			userId?: TUserId;
			onlyAddPrivates?: boolean;
			isFirst?: boolean;
			isSameBackup?: boolean;
			fromFetch?: boolean;
			// songTitleId?: TSongId;
			// edittedSong?: TSongForm;
		};
	};
	const [status, setCurrentRepertoryListStatus] = useState<TStatus>({
		step: steps.INITIAL,
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentRepertoryList, setCurrentRepertoryList] = useState<
		TRepertory[]
	>([]);

	const [finalRepertoryList, setFinalRepertoryList] = useState<TRepertory[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const setStatus = (statusStep: TStep, statusOpts = {}) => {
		setLoading(true);
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
				const { onlyAddPrivates, userId } = status.opts;
				if (onlyAddPrivates && userId) {
					dispatch(getRepertoryList({ userId, onlyAddPrivates }));
					setRetrys(0);
				}
			} else if (repertoryActionStatus === FETCH_STATUS.SUCCESS) {
				setStatus(steps.WITH_REPERTORY_LIST_1, { fromFetch: true });
				dispatch(resetRepertoryActionStatus());
			} else if (repertoryActionStatus === FETCH_STATUS.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setStatus(steps.FINISHED);
					dispatch(resetRepertoryActionStatus());
				} else {
					const { onlyAddPrivates, userId } = status.opts;
					if (onlyAddPrivates && userId) {
						setRetrys((lastRetrys) => lastRetrys + 1);
						dispatch(getRepertoryList({ onlyAddPrivates, userId }));
					}
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
		if (status.step === steps.FINISHED && !!loading) {
			setFinalRepertoryList(currentRepertoryList);
			if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
				dispatch(
					setRepertoryListPageBackup({ repertoryList: currentRepertoryList })
				);
			}
			setLoading(false);
		}
	}, [status, loading, currentRepertoryList, retrys, dispatch]);

	return { repertoryList: finalRepertoryList, loading, error };
};
