import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRepertoryListPageBackup } from "../../../clases/page/actions";
import {
	getRepertoryList,
	resetRepertoryActionStatus,
	setRepertoryListStatus,
} from "../../../clases/repertory/actions";
import { MAX_RETRYS } from "../../../configs";
import { arrayIsEmpty } from "../../../utils/lyricsAndChordsUtils";

export const useRepertoryListPage = () => {
	const dispatch = useDispatch();

	const userId = useSelector((state) => state.user.google.id);
	const {
		repertoryList,
		repertoryListStatus,
		repertoryListUserId,
		repertoryActionStatus,
		repertoryError,
	} = useSelector((state) => state.repertory);

	const { repertoryListPageBackup } = useSelector((state) => state.page);
	const { repertoryList: repertoryListBackup } = repertoryListPageBackup;

	const [status, setCurrentRepertoryListStatus] = useState({
		step: "INITIAL",
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentRepertoryList, setCurrentRepertoryList] = useState([]);

	const [finalRepertoryList, setFinalRepertoryList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	const setStatus = (statusStep, statusOpts = {}) => {
		setIsLoading(true);
		// console.log("ACA REPERTORY_LIST_STATUS: ", statusStep, statusOpts);
		setCurrentRepertoryListStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (repertoryError) setError(repertoryError);
	}, [repertoryError]);

	useEffect(() => {
		if (repertoryListStatus === "SHOULD_UPDATE") {
			setStatus("1_WITH_REPERTORY_LIST");
			dispatch(
				setRepertoryListStatus(repertoryListUserId ? "PRIVATE" : "PUBLIC")
			);
		} else if (userId && repertoryListUserId !== userId) {
			setStatus("1_FETCH_REPERTORY_LIST", { userId });
		} else if (!userId && repertoryListStatus === "PRIVATE") {
			setStatus("1_FETCH_REPERTORY_LIST");
		} else if (status.step === "INITIAL") {
			if (!arrayIsEmpty(repertoryListBackup)) {
				setCurrentRepertoryList(repertoryListBackup);
				setStatus("FINISHED", { isSameBackup: true });
			} else {
				setStatus("1_FETCH_REPERTORY_LIST", { userId });
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
		if (status.step === "1_FETCH_REPERTORY_LIST") {
			if (repertoryActionStatus === "INITIAL") {
				dispatch(getRepertoryList(status.opts));
				setRetrys(0);
			} else if (repertoryActionStatus === "SUCCESS") {
				setStatus("1_WITH_REPERTORY_LIST", { fromFetch: true });
				dispatch(resetRepertoryActionStatus());
			} else if (repertoryActionStatus === "FAILURE") {
				if (retrys === MAX_RETRYS) {
					setStatus("FINISHED");
					dispatch(resetRepertoryActionStatus());
				} else {
					setRetrys((lastRetrys) => lastRetrys + 1);
					dispatch(getRepertoryList(status.opts));
				}
			}
		}
	}, [status, repertoryActionStatus, retrys, dispatch]);

	useEffect(() => {
		if (status.step === "1_WITH_REPERTORY_LIST") {
			setCurrentRepertoryList(repertoryList);
			setStatus("FINISHED");
		}
	}, [status, repertoryList]);

	useEffect(() => {
		if (status.step === "FINISHED" && !!isLoading) {
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
