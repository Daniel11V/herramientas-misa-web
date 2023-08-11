export const userModel = {
    id: "string", // Required
    name: "string",
    email: "string",
    photoUrl: "string",
    config: {
        songPageOptions: {
            fontSize: "string", // Required
            showChords: "bool", // Required
            chordLang: ["es", "en"], // Required
        } // Required
    }, // Required
};