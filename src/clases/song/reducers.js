import produce from 'immer';
import { types } from "./types"

const defaultSong = {
    id: "0",
    title: "",
    lyric: "",
    chords: {},
    creator: {
        id: "",
        name: "",
    },
    author: {
        id: "",
        name: "",
    },
    rating: [],
    tempo: "",
    pulse: "",
    labels: [],
}

const initialState = {
    songActionStatus: "INITIAL",
    songError: null,

    songListStatus: "INITIAL",
    songListUserId: null,
    songList: [],

    songStatus: "INITIAL",
    songUserId: null,
    song: defaultSong,
}

const SongReducer = (state = initialState, { type, payload }) => {
    return produce(state, newState => {
        switch (type) {
            case types.RESET_SONG_ACTION_STATUS:
                newState.songActionStatus = "INITIAL";
                newState.songError = null;
                break;


            case types.SET_SONG_LIST_STATUS:
                newState.songListStatus = payload.songListStatus;
                break;

            case types.FETCH_SONG_LIST:
                newState.songActionStatus = "FETCHING";
                break;
            case types.FETCH_SONG_LIST_SUCCESS:
                newState.songActionStatus = "SUCCESS";
                newState.songList = payload.songList;
                newState.songListStatus = payload.userId ? "PRIVATE" : "PUBLIC";
                newState.songListUserId = payload.userId;
                break;
            case types.FETCH_SONG_LIST_FAILURE:
                newState.songActionStatus = "FAILURE";
                newState.songError = payload.error;
                newState.songListStatus = "FAILURE";
                newState.songListUserId = payload.userId;
                break;


            case types.SET_SONG_STATUS:
                newState.songStatus = payload.songStatus;
                break;

            case types.FETCH_SONG:
                newState.songActionStatus = "FETCHING";
                break;
            case types.FETCH_SONG_SUCCESS:
                newState.songActionStatus = "SUCCESS";
                newState.song = payload.song;
                newState.songStatus = payload.userId ? "PRIVATE" : "PUBLIC";
                newState.songUserId = payload.userId;
                break;
            case types.FETCH_SONG_FAILURE:
                newState.songActionStatus = "FAILURE";
                newState.songError = payload.error;
                newState.songStatus = "FAILURE";
                break;

            case types.CREATE_SONG:
                newState.songActionStatus = "FETCHING";
                break;
            case types.CREATE_SONG_SUCCESS:
                newState.songActionStatus = "SUCCESS";
                newState.songList.push(payload.songCreated);
                newState.songListStatus = "SHOULD_UPDATE";
                newState.song = payload.songCreated;
                break;
            case types.CREATE_SONG_FAILURE:
                newState.songActionStatus = "FAILURE";
                newState.songError = payload.error;
                break;

            case types.EDIT_SONG:
                newState.songActionStatus = "FETCHING";
                break;
            case types.EDIT_SONG_SUCCESS:
                newState.songActionStatus = "SUCCESS";
                const indexToEdit = state.songList.findIndex(song => song.id === payload.songEdited.id);
                if (indexToEdit >= 0) {
                    newState.songList[indexToEdit] = payload.songEdited;
                    newState.songListStatus = "SHOULD_UPDATE";
                }
                newState.song = payload.songEdited;
                break;
            case types.EDIT_SONG_FAILURE:
                newState.songActionStatus = "FAILURE";
                newState.songError = payload.error;
                break;

            case types.DELETE_SONG:
                newState.songActionStatus = "FETCHING";
                break;
            case types.DELETE_SONG_SUCCESS:
                newState.songActionStatus = "SUCCESS";
                delete newState.songList[payload.songDeletedId];
                newState.songListStatus = "SHOULD_UPDATE";
                newState.song = defaultSong;
                break;
            case types.DELETE_SONG_FAILURE:
                newState.songActionStatus = "FAILURE";
                newState.songError = payload.error;
                break;

            default:
                break;
        }
    });
}

export default SongReducer