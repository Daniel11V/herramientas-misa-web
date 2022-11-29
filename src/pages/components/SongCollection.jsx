import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { arrayIsEmpty } from "../../utils";
import { CollectionSearcher } from "./CollectionSearcher.jsx";
import { Collection, CollectionItem } from "../../styles/styles";
import styled, { css } from "styled-components";

const SongCollection = ({
	songList = [],
	loading = false,
	error = "",
	searcher = false,
	labelsStart = [],
	checking = false,
}) => {
	const userId = useSelector((state) => state.user.google.id);
	const history = useHistory();

	const [songChoose, setSongChoose] = useState(null);

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

	const handleClickSong = (id) => {
		history.push({
			pathname: `/song/${id}`,
			state: { from: "Cancionero" },
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

	if (arrayIsEmpty(songList) || !!error) return <div>Error - {error}</div>;

	return (
		<Collection>
			{searcher && <CollectionSearcher labelsStart={labelsStart} />}
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
			{songList.map((song) => (
				<CollectionItem
					key={song.id}
					onClick={() => handleClickSong(song.id)}
					withCheck={checking}
				>
					{song.title}
					{song?.author?.name && ` - ${song.author.name}`}
					{userId && song?.creator?.id === userId && (
						<LevelIcon withCheck={checking}>
							<i className="material-icons">favorite</i>
							<span>{song?.level?.main}</span>
						</LevelIcon>
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
				</CollectionItem>
			))}
			{/* {!filteredSongs && allSongDetails && (
				<div className="collection-item">
					<span className="song-item">Ninguna canción coincide...</span>
				</div>
			)} */}
		</Collection>
	);
};

const LevelIcon = styled.div`
	position: relative;
	width: 27px;
	margin-top: 2px;

	> i {
		position: absolute;
		color: #006cd7;
		font-size: 27px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	> span {
		position: absolute;
		color: white;
		font-size: 10px;
		font-weight: bold;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}

	${(props) =>
		props.withCheck &&
		css`
			padding-top: 10px;
			padding-right: 10px;

			> span {
				flex: 1;
				padding-top: 10px;
			}

			> label {
				margin: 10px 0 0 10px;
				z-index: 20;
			}
		`}
`;

export default SongCollection;
