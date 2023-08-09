import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { arrayIsEmpty } from "../../utils";
import { CollectionSearcher } from "./CollectionSearcher.jsx";
import {
	Collection,
	CollectionContent,
	CollectionItem,
	CollectionItemDescription,
	CollectionItemIcons,
	PrivacyIcon,
	LevelIcon,
	CollectionItemLyric,
} from "../../styles/styles";

const SongCollection = ({
	songList = [],
	loading = false,
	error = "",
	searcher = false,
	labelsStart = [],
	checking = false,
	pageName = "Cancionero",
}) => {
	const userId = useSelector((state) => state.user.google.id);
	const history = useHistory();

	const [songChoose, setSongChoose] = useState(null);
	const [lirycStartList, setLirycStartList] = useState([]);
	const [labels, setLabels] = useState(labelsStart);
	const [searchInput, setSearchInput] = useState("");
	const [filteredSongList, setFilteredSongList] = useState([]);

	const containerContentRef = useRef(null);

	useEffect(() => {
		if (!!songList.length) {
			let newFilteredSongList = [...songList];
			if (!!searchInput && !!searcher) {
				newFilteredSongList = newFilteredSongList.filter(song => song.title.toUpperCase().includes(searchInput.toUpperCase()))
			}
			setFilteredSongList(newFilteredSongList);
		}
	}, [songList, searcher, searchInput])

	useEffect(() => {
		if (!!containerContentRef.current && !!songList.length) {
			const lyricStartMaxWidth = containerContentRef?.current?.offsetWidth - 90;

			if (lyricStartMaxWidth) {
				const canvasContext = document.createElement("canvas").getContext("2d");
				canvasContext.font = "12px Arial";

				setLirycStartList(
					songList.reduce((prev, song) => {
						if (!song.lyricStart) return prev;

						let newLyricStart = song.lyricStart;
						while (
							canvasContext.measureText(newLyricStart).width >
							lyricStartMaxWidth
						) {
							newLyricStart = newLyricStart.split(" ").slice(0, -1).join(" ");
						}

						if (newLyricStart?.[newLyricStart?.length - 1] === ",")
							newLyricStart = newLyricStart?.slice(0, -1);

						return ({...prev, [song.id]: "| " + newLyricStart + "..."})
					}, {})
				);
			}
		}
	}, [containerContentRef, songList]);

	// useEffect(() => {
	// 	if (allSongDetails) {
	// 		// Filter
	// 		let startsTitle = [];
	// 		let includesTitle = [];
	// 		let includesLyric = [];
	// 		if (songChoose) {
	// 			startsTitle.push(allSongDetails.find((song) => song.id === songChoose));
	// 			// filterById(songChoose)
	// 		} else {
	// 			allSongDetails.forEach((song) => {
	// 				if (labels.every((elem) => song.labels.includes(elem))) {
	// 					if (
	// 						search === "" ||
	// 						song.title.toLowerCase().startsWith(search.toLowerCase())
	// 					) {
	// 						startsTitle.push(song);
	// 					} else if (
	// 						song.title.toLowerCase().includes(search.toLowerCase())
	// 					) {
	// 						includesTitle.push(song);
	// 					} else if (
	// 						song.lyric.toLowerCase().includes(search.toLowerCase())
	// 					) {
	// 						includesLyric.push(song);
	// 					}
	// 				}
	// 			});
	// 		}

	// 		setFilteredSongs([...startsTitle, ...includesTitle, ...includesLyric]);
	// 	}
	// }, [allSongDetails, search, labels, songChoose]);

	const handleClickSearchLyric = () => {

	}

	const handleClickSong = (id) => {
		history.push({
			pathname: `/song/${id}`,
			state: { from: pageName },
		});
	};

	const handleCheck = (e, songId) => {
		e.preventDefault();
		e.stopPropagation();

		if (songId === songChoose) {
			setSongChoose(null);
			document.getElementById(songId).checked = false;
		} else {
			setSongChoose(songId);
			document.getElementById(songId).checked = true;
		}
	};

	if (loading)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	if (!!error) return <div>Error - {error}</div>;

	return (
		<Collection>
			{searcher && <CollectionSearcher searchInput={searchInput} setSearchInput={setSearchInput} labels={labels} setLabels={setLabels} handleClickSearchLyric={handleClickSearchLyric} />}
			{/* {filteredSongs.map((song) => (
				<Link
					to={{ pathname: `/song/${song.id}`, state: { from: "Cancionero" } }}
					key={song.id}
					className={`collection-item ${checking ? "with-check" : ""}`}
				>
					<span className="song-item">
						{song.title}
						{song.author.name && ` - ${song.author.name}`}
					</span>
					{checking && (
						<label onClick={(e) => handleCheck(e, song.id)}>
							<input
								type="checkbox"
								id={song.id}
								className="filled-in checkbox-blue"
							/>
							<span />
						</label>
					)}
				</Link>
			))} */}
			<CollectionContent ref={containerContentRef}>
				{arrayIsEmpty(filteredSongList) && (
					<CollectionItem withCheck={false}>Sin canciones.</CollectionItem>
				)}
				{filteredSongList.map((song, songIndex) => (
					<CollectionItem
						key={song.id}
						onClick={() => handleClickSong(song.id)}
						withCheck={checking}
					>
						<CollectionItemDescription>
							{song.title}
							{song?.author?.name && ` - ${song.author.name}`}
							{userId && (
								<CollectionItemIcons>
									{!!song?.level?.voice && (
										<LevelIcon withCheck={checking}>
											<i className="material-icons">favorite_border</i>
											<span>
												{song?.level?.voice
													? song?.level?.voice?.toString()
													: ""}
											</span>
										</LevelIcon>
									)}
									{song?.creator?.id === userId && (
										<PrivacyIcon withCheck={checking}>
											<i className="material-icons">
												{!!song?.isPrivate === userId ? "lock" : "public"}
											</i>
										</PrivacyIcon>
									)}
								</CollectionItemIcons>
							)}
							{/* <div className="levelIcon">
									<i className="material-icons" style={{ color: "#5a5a5a" }}>
										favorite_border
									</i>
								</div> */}
							{checking && (
								<label onClick={(e) => handleCheck(e, song.id)}>
									<input
										type="checkbox"
										id={song.id}
										className="filled-in checkbox-blue"
									/>
									<span />
								</label>
							)}
						</CollectionItemDescription>
						{!!lirycStartList?.[song.id] && (
							<CollectionItemLyric>
								{lirycStartList?.[song.id]}
							</CollectionItemLyric>
						)}
					</CollectionItem>
				))}
			</CollectionContent>
			{/* {!filteredSongs && allSongDetails && (
				<div className="collection-item">
					<span className="song-item">Ninguna canción coincide...</span>
				</div>
			)} */}
		</Collection>
	);
};

export default SongCollection;
