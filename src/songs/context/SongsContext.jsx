import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

const SongsContext = React.createContext();

function songReducer(state, action) {
	switch (action.type) {
		case "SET_SONGS": {
			console.log("Reducer Set Songs");
			return {
				allSongs: action.payload.data,
				filteredSongs: action.payload.data,
			};
		}
		case "FILTER_BY_ID": {
			const selectedSong = state.allSongs.filte(
				(song) => song._id === action.payload
			);
			return { ...state, filteredSongs: selectedSong };
		}
		default: {
			throw new Error(`Unnhandled action type: ${action.type}`);
		}
	}
}

function SongsProvider({ children }) {
	const [state, dispatch] = React.useReducer(songReducer, {
		allSongs: [],
		filteredSongs: [],
	});

	const value = React.useMemo(() => [state, dispatch], [state]);

	return (
		<SongsContext.Provider value={value}>{children}</SongsContext.Provider>
	);
}

function useSongs() {
	const context = React.useContext(SongsContext);
	if (context === undefined) {
		throw new Error("useSongs must be used within a SongsProvider");
	}

	const [state, dispatch] = context;
	const songsQuery = useQuery("SONGS", async () => {
		const SERVER_PATH =
			process.env.REACT_APP_LOCAL_SERVER || process.env.REACT_APP_SERVER;
		console.log(SERVER_PATH);
		const res = await fetch(SERVER_PATH + "/api/songs");
		if (!res.ok) {
			throw new Error("Error fetching song list");
		}
		return res.json();
	});
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		if (
			!isMounted &&
			// Query cargado y exitoso
			!songsQuery.isLoading &&
			!songsQuery.status.localeCompare("success") &&
			// Data no actualizada
			!state.allSongs.length
		) {
			setIsMounted(true);
			console.log(songsQuery);
			dispatch({
				type: "SET_SONGS",
				payload: songsQuery,
			});
		}
		return () => setIsMounted(false);
	}, [songsQuery, state, dispatch, isMounted]);

	// const getSongs = () =>	{

	// 	dispatch({ type: "SET_SONGS", payload: query })}

	const filterById = (filterId) =>
		dispatch({ type: "FILTER_BY_ID", payload: filterId });

	return {
		...state,
		loadingSongs: songsQuery.isLoading,
		errorSongs: songsQuery.error,
		refetchSongs: songsQuery.refetch,
		filterById,
	};
}

export { SongsProvider, useSongs };
