import { useState, useEffect } from "react";
import { setRepertoryPageBackup } from "../../../classes/page/actions";
import {
	getRepertory,
	resetRepertoryActionStatus,
	setRepertoryStatus,
} from "../../../classes/repertory/actions";
import { MAX_RETRYS } from "../../../configs";
import { FETCH_STATUS, SECURITY_STATUS } from "../../../utils/types";
import {
	TRepertory,
	TRepertoryId,
	TSongSections,
} from "../../../classes/repertory/types";
import { TUserId } from "../../../classes/user/types";
import { useAppDispatch, useAppSelector } from "../../../store";

export const useRepertoryPage = (repertoryId?: TRepertoryId) => {
	const dispatch = useAppDispatch();

	const userId = useAppSelector((state) => state.user.google.id);
	const {
		repertory,
		repertoryStatus,
		repertoryError,
		repertoryUserId,
		repertoryActionStatus,
	} = useAppSelector((state) => state.repertory);
	const { repertoryPageBackup } = useAppSelector((state) => state.page);
	const { repertoryList: repertoryListBackup } = repertoryPageBackup;

	type TStep =
		| "INITIAL"
		| "FETCH_REPERTORY_1"
		| "WITH_REPERTORY_1"
		| "FINISHED";
	const steps: Record<TStep, TStep> = {
		INITIAL: "INITIAL",
		FETCH_REPERTORY_1: "FETCH_REPERTORY_1",
		WITH_REPERTORY_1: "WITH_REPERTORY_1",
		FINISHED: "FINISHED",
	};
	type TStatus = {
		step: TStep;
		opts: {
			userId?: TUserId;
			onlyAddPrivates?: boolean;
			isSameBackup?: boolean;
			fromFetch?: boolean;
		};
	};
	const [status, setCurrentRepertoryStatus] = useState<TStatus>({
		step: steps.INITIAL,
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentRepertory, setCurrentRepertory] = useState<TRepertory | null>(
		null
	);
	const [finalRepertory, setFinalRepertory] = useState<TRepertory | null>(null);
	const [songSections, setSongSections] = useState<TSongSections>([]);
	const [loading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (repertoryError) setError(repertoryError);
	}, [repertoryError]);

	const setStatus = (statusStep: TStep, statusOpts = {}) => {
		setIsLoading(true);
		// console.log("ACA REPERTORY_STATUS: ", statusStep, statusOpts);
		setCurrentRepertoryStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (repertoryStatus === SECURITY_STATUS.SHOULD_UPDATE) {
			setStatus(steps.WITH_REPERTORY_1);
			dispatch(
				setRepertoryStatus(
					repertoryUserId ? SECURITY_STATUS.PRIVATE : SECURITY_STATUS.PUBLIC
				)
			);
		} else if (userId && repertoryUserId !== userId) {
			setStatus(steps.FETCH_REPERTORY_1, { userId, repertoryId });
		} else if (!userId && repertoryStatus === SECURITY_STATUS.PRIVATE) {
			setStatus(steps.FETCH_REPERTORY_1, { repertoryId });
		} else if (status.step === steps.INITIAL) {
			if (repertoryId && !!repertoryListBackup[repertoryId]) {
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
			if (repertoryActionStatus === FETCH_STATUS.INITIAL) {
				const { onlyAddPrivates, userId } = status.opts;
				if (onlyAddPrivates && userId && repertoryId) {
					dispatch(getRepertory({ userId, repertoryId }));
				}
			} else if (repertoryActionStatus === FETCH_STATUS.SUCCESS) {
				setStatus(steps.WITH_REPERTORY_1, { fromFetch: true });
				dispatch(resetRepertoryActionStatus());
			} else if (repertoryActionStatus === FETCH_STATUS.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setStatus(steps.FINISHED);
					dispatch(resetRepertoryActionStatus());
				} else {
					const { onlyAddPrivates, userId } = status.opts;
					if (onlyAddPrivates && userId && repertoryId) {
						setRetrys((lastRetrys) => lastRetrys + 1);
						dispatch(getRepertory({ userId, repertoryId }));
					}
				}
			}
		}
	}, [status, repertoryId, repertoryActionStatus, retrys, dispatch]);

	useEffect(() => {
		if (status.step === steps.WITH_REPERTORY_1) {
			setCurrentRepertory(repertory);
			setStatus(steps.FINISHED);
		}
	}, [status, repertory]);

	useEffect(() => {
		if (status.step === steps.FINISHED && !!loading) {
			setSongSections();
			setFinalRepertory(currentRepertory);
			if (
				!status.opts.isSameBackup &&
				retrys !== MAX_RETRYS &&
				currentRepertory
			) {
				dispatch(
					setRepertoryPageBackup({
						repertoryList: {
							...repertoryListBackup,
							[currentRepertory.id]: currentRepertory,
						},
					})
				);
			}
			setIsLoading(false);
		}
	}, [
		status,
		loading,
		currentRepertory,
		repertoryListBackup,
		retrys,
		dispatch,
	]);

	return { repertory: finalRepertory, loading, error, songSections };
};
