import { useState } from "react";
import { useDispatch } from "react-redux";
import { publishSong } from "../../../clases/song/actions";
import M from "materialize-css";

export const usePublishSong = (song, user, setMessageModalOpts) => {
    const dispatch = useDispatch();
    const [isLoadingPublish, setIsLoading] = useState(false);
    const [errorPublish, setError] = useState(false);

    const publishCurrentSong = () => {
        dispatch(publishSong(song.id));
    }

    const handleClickPublish = () => {
        setMessageModalOpts({
            title: "Solicitud de publicación",
            message:
                "Se creará una solicitud para agregar tu canción dentro de nuestro cancionero publico! Y en unos días recibirá una respuesta al mail.",
            onClose: () => {
                setMessageModalOpts(null);
            },
            onCancel: () => { },
            onConfirm: () => {
                if (user.id === "111418653738749034139") {
                    publishCurrentSong();
                    return;
                }

                window.Email.send({
                    SecureToken: "6475cd94-e35b-4580-a64e-0bb45672fa5c",
                    To: "alexander1vinet@gmail.com",
                    From: "alexander1vinet@gmail.com",
                    Headers: {
                        "Content-Type": "application/json",
                    },
                    Subject: "Nueva cancion - Herramientas para Misa",
                    Body: `<html><h2>User:</h2><p>id: ${user.id}</p><p>name: ${user.name
                        }</p><p>email: ${user.email}</p><h2>Song: </h2><p>${JSON.stringify(
                            song,
                            null,
                            "\t"
                        )}</p><h2>Link: </h2><p>https://herramientas-misa.netlify.app/song/${song.id
                        }</p></html>`,
                }).then((message) => {
                    if (message === "OK") {
                        M.toast({ html: "Solicitud enviada. Gracias!" });
                    } else {
                        M.toast({ html: "Error: " + message });
                    }
                });
            },
        });
    };

    return { handleClickPublish, isLoadingPublish, errorPublish };
};