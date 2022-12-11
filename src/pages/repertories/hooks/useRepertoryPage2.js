import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRepertoryPageBackup } from "../../../clases/page/actions";
import { getRepertory, resetRepertoryActionStatus, setRepertoryStatus } from "../../../clases/repertory/actions";
import { MAX_RETRYS } from "../../../configs";

export const useRepertoryPage2 = (repertoryId) => {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.user.google.id);
    const { repertory, repertoryStatus, repertoryError, repertoryUserId, repertoryActionStatus } = useSelector((state) => state.repertory);
    const { repertoryPageBackup } = useSelector((state) => state.page);
    const { repertoryList: repertoryListBackup } = repertoryPageBackup;

    const [status, setCurrentRepertoryStatus] = useState({ step: "INITIAL", opts: {} });
    const [retrys, setRetrys] = useState(0);
    const [currentRepertory, setCurrentRepertory] = useState([]);

    const [finalRepertory, setFinalRepertory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (repertoryError) setError(repertoryError);
    }, [repertoryError])

    const setStatus = (statusStep, statusOpts = {}) => {
        setIsLoading(true);
        // console.log("ACA REPERTORY_STATUS: ", statusStep, statusOpts);
        setCurrentRepertoryStatus({ step: statusStep, opts: statusOpts });
    }

    useEffect(() => {
        if (repertoryStatus === "SHOULD_UPDATE") {
            setStatus("1_WITH_REPERTORY");
            dispatch(setRepertoryStatus(repertoryUserId ? "PRIVATE" : "PUBLIC"))

        } else if (userId && repertoryUserId !== userId) {
            setStatus("1_FETCH_REPERTORY", { userId, repertoryId });

        } else if (!userId && repertoryStatus === "PRIVATE") {
            setStatus("1_FETCH_REPERTORY", { repertoryId });

        } else if (status.step === "INITIAL") {
            if (!!repertoryListBackup[repertoryId]) {
                setCurrentRepertory(repertoryListBackup[repertoryId]);
                setStatus("FINISHED", { isSameBackup: true });
            } else {
                setStatus("1_FETCH_REPERTORY", { userId, repertoryId });
            }
        }
    }, [repertoryStatus, repertoryUserId, status.step, repertoryId, userId, repertoryListBackup, dispatch])

    useEffect(() => {
        if (status.step === "1_FETCH_REPERTORY") {
            if (repertoryActionStatus === "INITIAL") {
                dispatch(getRepertory(status.opts));
            } else if (repertoryActionStatus === "SUCCESS") {
                setStatus("1_WITH_REPERTORY", { fromFetch: true });
                dispatch(resetRepertoryActionStatus());
            } else if (repertoryActionStatus === "FAILURE") {
                if (retrys === MAX_RETRYS) {
                    setStatus("FINISHED");
                    dispatch(resetRepertoryActionStatus());
                } else {
                    setRetrys(lastRetrys => lastRetrys + 1);
                    dispatch(getRepertory(status.opts));
                }
            }
        }
    }, [status, repertoryActionStatus, retrys, dispatch]);

    useEffect(() => {
        if (status.step === "1_WITH_REPERTORY") {
            setCurrentRepertory(repertory);
            setStatus("FINISHED");
        }
    }, [status, repertory]);

    useEffect(() => {
        if (status.step === "FINISHED" && !!isLoading) {
            setFinalRepertory(currentRepertory);
            if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
                dispatch(setRepertoryPageBackup(currentRepertory))
            }
            setIsLoading(false);
        }
    }, [status, isLoading, currentRepertory, retrys, dispatch])

    return [finalRepertory, isLoading, error];
};