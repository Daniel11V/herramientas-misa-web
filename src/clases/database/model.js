import { privateRepertoryModel } from "../repertory/services/privateRepertoryList";
import { publicRepertoryModel } from "../repertory/services/publicRepertoryList";
import { privateSongDetailsModel } from "../song/services/privateSongDetailsList";
import { privateSongTitleModel } from "../song/services/privateSongTitleList";
import { publicSongDetailsModel } from "../song/services/publicSongDetailsList";
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
    privateSongDetailsList: {
        "$privateSongTitleId": privateSongDetailsModel,
        // ...
    },
    publicSongTitleList: {
        "$pushId": publicSongTitleModel,
        // ...
    },
    publicSongDetailsList: {
        "$publicSongTitleId": publicSongDetailsModel,
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