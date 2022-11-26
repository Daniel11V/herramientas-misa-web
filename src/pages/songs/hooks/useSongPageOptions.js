import M from "materialize-css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSongPageOptions } from "../../../clases/user/actions";
import { objsAreEqual } from "../../../utils";

export const useSongPageOptions = () => {
    const dispatch = useDispatch();
    const { songPageOptions } = useSelector((state) => state.user.config);

    const [areNewOptions, setAreNewOptions] = useState(false)
    const [pageOptions, setPageOptions] = useState(songPageOptions)

    const setPageOptionsField = (field, newVal) => {
        setPageOptions(lv => {
            if (lv[field] !== newVal) {

                const newPageOptions = {
                    ...lv,
                    [field]: newVal,
                }

                setAreNewOptions(!objsAreEqual(songPageOptions, newPageOptions))

                return newPageOptions
            } else {
                return lv;
            }
        })
    }

    const setFontSize = (event) => {
        const newVal = event.target.value;
        setPageOptionsField('fontSize', newVal);
    }

    const toggleShowChords = () => {
        setPageOptionsField('showChords', !pageOptions.showChords);
    }

    const saveOptions = () => {
        dispatch(setSongPageOptions(pageOptions))
        setAreNewOptions(false);
        M.toast({ html: "Configuración Actualizada." });
    }

    return { areNewOptions, pageOptions, setFontSize, toggleShowChords, saveOptions };
};