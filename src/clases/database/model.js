import { privateRepertoryModel } from "../repertory/services/privateRepertoryList";
import { publicRepertoryModel } from "../repertory/services/publicRepertoryList";
import { privateSongLyricModel } from "../song/services/privateSongLyricList";
import { privateSongTitleModel } from "../song/services/privateSongTitleList";
import { publicSongLyricModel } from "../song/services/publicSongLyricList";
import { publicSongTitleModel } from "../song/services/publicSongTitleList";
import { userModel } from "../user/services/userList";

export const databaseModel = {
    userList: {
        "$userId": userModel,
        // ...
    },
    privateSongTitleList: {
        "$pushId": privateSongTitleModel,
        // ...
    },
    privateSongLyricList: {
        "$privateSongTitleId": privateSongLyricModel,
        // ...
    },
    publicSongTitleList: {
        "$pushId": publicSongTitleModel,
        // ...
    },
    publicSongLyricList: {
        "$publicSongTitleId": publicSongLyricModel,
        // ...
    },
    privateRepertoryList: {
        "$pushId": privateRepertoryModel,
        // ...
    },
    publicRepertoryList: {
        "$pushId": publicRepertoryModel,
        // ...
    },
}